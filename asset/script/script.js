// ==========================================
// LOADING SCREEN
// ==========================================
window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loadingScreen');
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
    }, 2000);
});

// ==========================================
// CUSTOM CURSOR
// ==========================================
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    
    setTimeout(() => {
        cursorFollower.style.left = e.clientX + 'px';
        cursorFollower.style.top = e.clientY + 'px';
    }, 100);
});

// Cursor hover effects
document.querySelectorAll('a, button, .music-card, .stat-item').forEach(element => {
    element.addEventListener('mouseenter', () => {
        cursor.style.transform = 'scale(1.5)';
        cursorFollower.style.transform = 'scale(1.5)';
    });
    
    element.addEventListener('mouseleave', () => {
        cursor.style.transform = 'scale(1)';
        cursorFollower.style.transform = 'scale(1)';
    });
});

// ==========================================
// NAVBAR SCROLL EFFECT
// ==========================================
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// ==========================================
// MOBILE MENU TOGGLE
// ==========================================
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenuBtn.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-container')) {
        mobileMenuBtn.classList.remove('active');
        navLinks.classList.remove('active');
    }
});

// ==========================================
// SMOOTH SCROLLING FOR NAVIGATION LINKS
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ==========================================
// BACK TO TOP BUTTON
// ==========================================
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ==========================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ==========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.music-card, .stat-item, .hero-content, .hero-visual').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(element);
});

// ==========================================
// PARALLAX EFFECT FOR BACKGROUND ORBS
// ==========================================
window.addEventListener('mousemove', (e) => {
    const orbs = document.querySelectorAll('.orb');
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    orbs.forEach((orb, index) => {
        const speed = (index + 1) * 0.05;
        const x = (mouseX - 0.5) * 50 * speed;
        const y = (mouseY - 0.5) * 50 * speed;
        orb.style.transform = `translate(${x}px, ${y}px)`;
    });
});

// ==========================================
// TYPING EFFECT FOR HERO TITLE
// ==========================================
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Optional: Uncomment to enable typing effect
// const highlightText = document.querySelector('.highlight');
// if (highlightText) {
//     const originalText = highlightText.textContent;
//     setTimeout(() => {
//         typeWriter(highlightText, originalText, 100);
//     }, 500);
// }

// ==========================================
// MUSIC PLAYER MOCKUP INTERACTION
// ==========================================
const albumCover = document.querySelector('.album-cover');
const playButton = document.querySelector('.play-button');
const equalizerBars = document.querySelectorAll('.equalizer .bar');

if (albumCover) {
    let isPlaying = false;
    
    albumCover.addEventListener('click', () => {
        isPlaying = !isPlaying;
        
        if (isPlaying) {
            playButton.innerHTML = '⏸';
            equalizerBars.forEach(bar => {
                bar.style.animationPlayState = 'running';
            });
        } else {
            playButton.innerHTML = '▶';
            equalizerBars.forEach(bar => {
                bar.style.animationPlayState = 'paused';
            });
        }
    });
}

// ==========================================
// STATS COUNTER ANIMATION
// ==========================================
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Observe stat numbers for counter animation
const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumber = entry.target.querySelector('.stat-number');
            const targetNumber = statNumber.textContent;
            
            if (targetNumber !== '∞' && !isNaN(targetNumber)) {
                animateCounter(statNumber, parseInt(targetNumber));
            }
            
            statObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-item').forEach(item => {
    statObserver.observe(item);
});

// ==========================================
// FEATURE CARDS TILT EFFECT
// ==========================================
document.querySelectorAll('.music-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-15px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// ==========================================
// DYNAMIC YEAR IN FOOTER
// ==========================================
const currentYear = new Date().getFullYear();
const footerYear = document.querySelector('.footer-bottom p');
if (footerYear) {
    footerYear.innerHTML = footerYear.innerHTML.replace('2024', currentYear);
}

// ==========================================
// PARTICLES RANDOM POSITIONING
// ==========================================
document.querySelectorAll('.particle').forEach(particle => {
    const randomX = Math.random() * 100;
    particle.style.left = randomX + '%';
});

// ==========================================
// PREVENT CONTEXT MENU ON CUSTOM CURSOR AREA (OPTIONAL)
// ==========================================
// Uncomment if you want to disable right-click
// document.addEventListener('contextmenu', (e) => {
//     e.preventDefault();
// });

// ==========================================
// PERFORMANCE OPTIMIZATION: THROTTLE SCROLL
// ==========================================
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply throttle to scroll-heavy functions
window.addEventListener('scroll', throttle(() => {
    // Additional scroll-based animations can go here
}, 100));

// ==========================================
// EASTER EGG: KONAMI CODE
// ==========================================
let konamiCode = [];
const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === konamiPattern.join(',')) {
        // Easter egg activated!
        document.body.style.animation = 'rainbow 2s infinite';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 5000);
    }
});

// ==========================================
// ADD RAINBOW ANIMATION TO CSS DYNAMICALLY
// ==========================================
const style = document.createElement('style');
style.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(style);

// ==========================================
// LOGO ROTATION ON CLICK
// ==========================================
const logoIcon = document.querySelector('.logo-icon');
if (logoIcon) {
    logoIcon.addEventListener('click', () => {
        logoIcon.style.animation = 'none';
        setTimeout(() => {
            logoIcon.style.animation = 'logoRotate 0.5s ease-in-out';
        }, 10);
    });
}

// ==========================================
// CONSOLE MESSAGE
// ==========================================
console.log('%c🚀 NDSI Pvt Ltd - PDF Study Assistant', 'font-size: 20px; color: #00A0F8; font-weight: bold;');
console.log('%cBuilt with ❤️ by Harinandh S Nair & Sivanandh Shibu', 'font-size: 14px; color: #3050F8;');
console.log('%cPowered by Gemini AI', 'font-size: 12px; color: #5028F8;');

// ==========================================
// INITIALIZATION COMPLETE
// ==========================================
console.log('%c✅ All systems initialized!', 'font-size: 12px; color: #00ff00;');


//======================================================================================================================================================================================
// ==========================================
// APP DOWNLOAD FUNCTIONALITY
// ==========================================

// Configuration with YOUR Firebase details
const APP_CONFIG = {
    // Firebase configuration
    firebaseConfig: {
        apiKey: "AIzaSyDW6PzfZp6vzsM0hSASVxep15NKeoWGK_g",
        databaseURL: "https://anydoubt-cva-default-rtdb.asia-southeast1.firebasedatabase.app",
        projectId: "anydoubt-cva",
        storageBucket: "anydoubt-cva.firebasestorage.app"
    },
    
    // Firebase Database URL for latest version info
    firebaseDbUrl: 'https://anydoubt-cva-default-rtdb.asia-southeast1.firebasedatabase.app/app_updates/latest.json',
    
    // GitHub APK URL - Direct link to APK in your repository
    // Format: https://raw.githubusercontent.com/USERNAME/REPO-NAME/main/your-app.apk
    // OR if using GitHub Pages: https://USERNAME.github.io/REPO-NAME/your-app.apk
    apkUrl: 'https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/anydoubt-latest.apk',  //====================================================================================================
    
    // Web app URL (fallback for desktop users)
    webAppUrl: 'main/main.html'
};

// Detect device type
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function isAndroid() {
    return /Android/i.test(navigator.userAgent);
}

function isIOS() {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

// Get latest APK URL from Firebase Realtime Database
async function getLatestApkUrl() {
    try {
        console.log('Fetching latest APK info from Firebase...');
        const response = await fetch(APP_CONFIG.firebaseDbUrl);
        
        if (!response.ok) {
            throw new Error('Failed to fetch from Firebase');
        }
        
        const data = await response.json();
        console.log('Firebase data:', data);
        
        if (data && data.download_url) {
            console.log('Using Firebase APK URL:', data.download_url);
            return data.download_url;
        } else {
            console.log('No download_url in Firebase, using fallback');
            return APP_CONFIG.apkUrl;
        }
    } catch (error) {
        console.error('Error fetching from Firebase:', error);
        console.log('Using fallback APK URL');
        return APP_CONFIG.apkUrl;
    }
}

// Download APK for Android
async function downloadApk() {
    try {
        showNotification('🚀 Preparing download...', 'info');
        
        // Get the latest APK URL from Firebase
        const apkUrl = await getLatestApkUrl();
        
        console.log('Downloading APK from:', apkUrl);
        
        // Create temporary link and trigger download
        const link = document.createElement('a');
        link.href = apkUrl;
        link.download = 'anydoubt-latest.apk';
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showNotification('✅ Download started! Check your downloads folder.', 'success');
        
        // Show installation instructions after 2 seconds
        setTimeout(() => {
            showInstallModal();
        }, 2000);
        
    } catch (error) {
        console.error('Download error:', error);
        showNotification('❌ Download failed. Please try again or contact support.', 'error');
    }
}

// Show notification toast
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existing = document.querySelector('.download-notification');
    if (existing) existing.remove();
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `download-notification ${type}`;
    
    // Choose icon based on type
    let icon = 'fa-info-circle';
    if (type === 'success') icon = 'fa-check-circle';
    if (type === 'error') icon = 'fa-exclamation-circle';
    
    notification.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        padding: '1rem 1.5rem',
        background: type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#FF0000',
        color: 'white',
        borderRadius: '10px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        zIndex: '10000',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        fontSize: '1rem',
        fontWeight: '600',
        animation: 'slideInRight 0.3s ease',
        maxWidth: '400px'
    });
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Show installation instructions modal
function showInstallModal() {
    // Remove existing modal if any
    const existing = document.querySelector('.install-modal');
    if (existing) existing.remove();
    
    const modal = document.createElement('div');
    modal.className = 'install-modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <button class="modal-close" onclick="this.closest('.install-modal').remove()">
                <i class="fas fa-times"></i>
            </button>
            <div class="modal-header">
                <i class="fas fa-mobile-alt"></i>
                <h3>Installation Guide</h3>
            </div>
            <div class="modal-body">
                <div class="install-step">
                    <div class="step-number">1</div>
                    <div class="step-content">
                        <h4>Enable Unknown Sources</h4>
                        <p>Go to <strong>Settings → Security</strong> and enable "<strong>Install from Unknown Sources</strong>" or "<strong>Install Unknown Apps</strong>"</p>
                    </div>
                </div>
                <div class="install-step">
                    <div class="step-number">2</div>
                    <div class="step-content">
                        <h4>Locate the APK</h4>
                        <p>Open your <strong>Downloads</strong> folder and find "<strong>anydoubt-latest.apk</strong>"</p>
                    </div>
                </div>
                <div class="install-step">
                    <div class="step-number">3</div>
                    <div class="step-content">
                        <h4>Install the App</h4>
                        <p>Tap the APK file and follow the installation prompts. Click <strong>Install</strong> when prompted.</p>
                    </div>
                </div>
                <div class="install-step">
                    <div class="step-number">4</div>
                    <div class="step-content">
                        <h4>Launch anyDoubt</h4>
                        <p>Open <strong>anyDoubt</strong> from your app drawer and start learning! 🎉</p>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-modal-close" onclick="this.closest('.install-modal').remove()">
                    Got it! <i class="fas fa-check"></i>
                </button>
            </div>
        </div>
    `;
    
    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        @keyframes modalFadeIn {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
        }
        
        .install-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10001;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1rem;
        }
        
        .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(10px);
        }
        
        .modal-content {
            position: relative;
            background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
            border: 2px solid rgba(255, 0, 0, 0.3);
            border-radius: 20px;
            max-width: 600px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            animation: modalFadeIn 0.3s ease;
            box-shadow: 0 20px 60px rgba(255, 0, 0, 0.3);
        }
        
        .modal-close {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 0, 0, 0.3);
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            color: white;
            font-size: 1.2rem;
            transition: all 0.3s ease;
        }
        
        .modal-close:hover {
            background: #FF0000;
            transform: rotate(90deg);
        }
        
        .modal-header {
            text-align: center;
            padding: 2rem 2rem 1rem;
            border-bottom: 1px solid rgba(255, 0, 0, 0.2);
        }
        
        .modal-header i {
            font-size: 3rem;
            color: #FF0000;
            margin-bottom: 1rem;
        }
        
        .modal-header h3 {
            font-size: 1.8rem;
            font-weight: 700;
            color: white;
            margin: 0;
        }
        
        .modal-body {
            padding: 2rem;
        }
        
        .install-step {
            display: flex;
            gap: 1.5rem;
            margin-bottom: 2rem;
            align-items: flex-start;
        }
        
        .install-step:last-child {
            margin-bottom: 0;
        }
        
        .step-number {
            width: 40px;
            height: 40px;
            background: linear-gradient(45deg, #FF0000, #DC143C);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 1.2rem;
            flex-shrink: 0;
            box-shadow: 0 5px 15px rgba(255, 0, 0, 0.3);
        }
        
        .step-content h4 {
            color: white;
            font-size: 1.2rem;
            font-weight: 600;
            margin: 0 0 0.5rem 0;
        }
        
        .step-content p {
            color: #cccccc;
            line-height: 1.6;
            margin: 0;
        }
        
        .step-content strong {
            color: #FF0000;
            font-weight: 600;
        }
        
        .modal-footer {
            padding: 1.5rem 2rem;
            border-top: 1px solid rgba(255, 0, 0, 0.2);
            text-align: center;
        }
        
        .btn-modal-close {
            background: linear-gradient(45deg, #FF0000, #DC143C);
            color: white;
            border: none;
            padding: 1rem 2rem;
            border-radius: 50px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            transition: all 0.3s ease;
        }
        
        .btn-modal-close:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(255, 0, 0, 0.4);
        }
        
        @media (max-width: 768px) {
            .modal-content {
                margin: 1rem;
                max-height: 85vh;
            }
            
            .install-step {
                flex-direction: column;
                gap: 0.75rem;
            }
            
            .step-number {
                width: 35px;
                height: 35px;
                font-size: 1rem;
            }
            
            .download-notification {
                right: 10px !important;
                left: 10px !important;
                max-width: calc(100% - 20px) !important;
            }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(modal);
    
    // Close modal when clicking overlay
    modal.querySelector('.modal-overlay').addEventListener('click', () => {
        modal.remove();
    });
}

// Handle "Launch App" button clicks
function handleLaunchApp(event) {
    event.preventDefault();
    
    console.log('Launch App clicked - Device:', navigator.userAgent);
    
    if (isAndroid()) {
        // Android device - download APK
        console.log('Android detected - initiating APK download');
        downloadApk();
    } else if (isIOS()) {
        // iOS device - show message (no APK for iOS)
        console.log('iOS detected - redirecting to web app');
        showNotification('📱 iOS app coming soon! Redirecting to web version...', 'info');
        setTimeout(() => {
            window.location.href = APP_CONFIG.webAppUrl;
        }, 2000);
    } else {
        // Desktop - redirect to web app
        console.log('Desktop detected - redirecting to web app');
        window.location.href = APP_CONFIG.webAppUrl;
    }
}

// Attach event listeners to all "Launch App" buttons
document.addEventListener('DOMContentLoaded', () => {
    // Find all launch app buttons/links
    const launchButtons = document.querySelectorAll('a[href="main/main.html"], .cta-button, .btn-primary');
    
    launchButtons.forEach(button => {
        const href = button.getAttribute('href');
        if (href === 'main/main.html' || button.textContent.includes('Launch') || button.textContent.includes('Get Started')) {
            button.addEventListener('click', handleLaunchApp);
            console.log('Attached download handler to:', button.textContent.trim());
        }
    });
    
    console.log('%c📱 anyDoubt App Download Handler Ready!', 'color: #FF0000; font-weight: bold; font-size: 14px;');
    console.log('%cFirebase Project: anydoubt-cva', 'color: #10b981; font-size: 12px;');
    console.log('%cDatabase: ' + APP_CONFIG.firebaseDbUrl, 'color: #10b981; font-size: 12px;');
});
