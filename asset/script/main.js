// PDF.js worker setup
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

// Global variables
let files = [];
let extractedText = '';
let summary = '';
let isSpeaking = false;
let chatMessages = [];
let apiKey = '';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Check if API key exists in localStorage
    const savedApiKey = localStorage.getItem('gemini_api_key');
    if (savedApiKey) {
        apiKey = savedApiKey;
        showMainContent();
    }

    // Event listeners
    document.getElementById('fileInput').addEventListener('change', handleFileUpload);
    document.getElementById('questionInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') askQuestion();
    });
});

// Save API Key
function saveApiKey() {
    const input = document.getElementById('apiKeyInput');
    const key = input.value.trim();
    
    if (!key) {
        alert('Please enter an API key!');
        return;
    }
    
    apiKey = key;
    localStorage.setItem('gemini_api_key', key);
    
    // Show success message
    const successMsg = document.createElement('div');
    successMsg.className = 'success-message';
    successMsg.textContent = '✅ API Key saved successfully!';
    document.getElementById('apiKeySection').appendChild(successMsg);
    
    setTimeout(() => {
        showMainContent();
    }, 1000);
}

function showMainContent() {
    document.getElementById('apiKeySection').style.display = 'none';
    document.getElementById('mainContent').style.display = 'block';
}

// Extract text from PDF
async function extractTextFromPDF(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const typedarray = new Uint8Array(e.target.result);
                const pdf = await pdfjsLib.getDocument(typedarray).promise;
                let fullText = '';
                
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const textContent = await page.getTextContent();
                    const pageText = textContent.items.map(item => item.str).join(' ');
                    fullText += pageText + '\n\n';
                }
                
                resolve(fullText);
            } catch (error) {
                reject(error);
            }
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
}

// Call Gemini API
async function callGeminiAPI(prompt) {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'API request failed');
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error('Gemini API error:', error);
        throw new Error('Failed to connect to Gemini API. Please check your API key.');
    }
}

// Handle file upload
async function handleFileUpload(event) {
    const uploadedFiles = Array.from(event.target.files);
    files = [...files, ...uploadedFiles];
    updateFileList();
    
    showLoader('notesBox');
    
    try {
        let allText = '';
        
        for (const file of uploadedFiles) {
            const text = await extractTextFromPDF(file);
            allText += `\n\n=== ${file.name} ===\n\n${text}`;
        }
        
        extractedText += allText;
        
        // Generate summary with Gemini
        const summaryPrompt = `Create detailed lecture notes from the following text. Format them with clear headings, bullet points, and key concepts. Make it easy to study:\n\n${allText.substring(0, 30000)}`;
        
        const summaryResult = await callGeminiAPI(summaryPrompt);
        
        summary += '\n\n' + summaryResult;
        displayNotes();
        
        // Enable chat
        document.getElementById('questionInput').disabled = false;
        document.getElementById('askBtn').disabled = false;
        
    } catch (error) {
        alert(error.message);
        document.getElementById('notesBox').innerHTML = '<div class="empty">Error processing PDF. Please check your API key!</div>';
    }
}

// Ask question
async function askQuestion() {
    const questionInput = document.getElementById('questionInput');
    const question = questionInput.value.trim();
    
    if (!question || !extractedText) return;
    
    chatMessages.push({ role: 'user', content: question });
    questionInput.value = '';
    updateChat();
    
    showChatLoader();
    
    try {
        const prompt = `Based on this document content:\n\n${extractedText.substring(0, 25000)}\n\nQuestion: ${question}\n\nProvide a clear, accurate answer as a helpful tutor.`;
        
        const answer = await callGeminiAPI(prompt);
        
        chatMessages.push({ role: 'assistant', content: answer });
        updateChat();
    } catch (error) {
        alert(error.message);
        chatMessages.pop();
        updateChat();
    }
}

// Text-to-speech
function toggleReadAloud() {
    if (!summary) return;
    
    const btn = document.getElementById('readAloudBtn');
    
    if (isSpeaking) {
        window.speechSynthesis.cancel();
        isSpeaking = false;
        btn.textContent = '🔊 Read Aloud';
        btn.className = 'btn btn-small btn-success';
    } else {
        const utterance = new SpeechSynthesisUtterance(summary);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;
        
        utterance.onend = () => {
            isSpeaking = false;
            btn.textContent = '🔊 Read Aloud';
            btn.className = 'btn btn-small btn-success';
        };
        
        window.speechSynthesis.speak(utterance);
        isSpeaking = true;
        btn.textContent = '⏹️ Stop';
        btn.className = 'btn btn-small btn-danger';
    }
}

// UI Update functions
function updateFileList() {
    const fileListDiv = document.getElementById('fileList');
    
    if (files.length === 0) {
        fileListDiv.innerHTML = '';
        return;
    }
    
    let html = '';
    files.forEach((file, idx) => {
        html += `
            <div class="file-item">
                <span>${file.name}</span>
                <button onclick="removeFile(${idx})">×</button>
            </div>
        `;
    });
    
    html += '<button class="clear-btn" onclick="clearAll()">Clear All</button>';
    fileListDiv.innerHTML = html;
}

function removeFile(index) {
    files.splice(index, 1);
    updateFileList();
}

function clearAll() {
    files = [];
    extractedText = '';
    summary = '';
    chatMessages = [];
    window.speechSynthesis.cancel();
    isSpeaking = false;
    
    updateFileList();
    document.getElementById('notesBox').innerHTML = '<div class="empty">Upload a PDF to generate lecture notes</div>';
    document.getElementById('chatBox').innerHTML = '<div class="empty">Ask any questions about your PDFs</div>';
    document.getElementById('readAloudBtn').style.display = 'none';
    document.getElementById('questionInput').disabled = true;
    document.getElementById('askBtn').disabled = true;
}

function displayNotes() {
    const notesBox = document.getElementById('notesBox');
    notesBox.className = 'content-box';
    notesBox.innerHTML = `<div class="notes-content">${summary}</div>`;
    document.getElementById('readAloudBtn').style.display = 'block';
}

function updateChat() {
    const chatBox = document.getElementById('chatBox');
    
    if (chatMessages.length === 0) {
        chatBox.className = 'content-box empty';
        chatBox.innerHTML = 'Ask any questions about your PDFs';
        return;
    }
    
    chatBox.className = 'content-box';
    let html = '<div class="chat-messages">';
    
    chatMessages.forEach(msg => {
        html += `
            <div class="message ${msg.role}">
                <div class="message-label">${msg.role === 'user' ? 'You' : 'Assistant'}</div>
                <div class="message-content">${msg.content}</div>
            </div>
        `;
    });
    
    html += '</div>';
    chatBox.innerHTML = html;
    chatBox.scrollTop = chatBox.scrollHeight;
}

function showLoader(elementId) {
    const element = document.getElementById(elementId);
    element.className = 'content-box';
    element.innerHTML = '<div class="loader"><div class="spinner"></div></div>';
}

function showChatLoader() {
    const chatBox = document.getElementById('chatBox');
    const currentContent = chatBox.innerHTML;
    chatBox.innerHTML = currentContent + '<div class="loader" style="margin-top: 10px;"><div class="spinner"></div></div>';
    chatBox.scrollTop = chatBox.scrollHeight;
}