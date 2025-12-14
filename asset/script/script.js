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

//=========================================================================================================================================
// Add this to your script.js file

// Function to download the app
function downloadApp() {
    // Path to your APK file
    const apkPath = 'anydoubt.apk';
    
    // Create a temporary anchor element
    const link = document.createElement('a');
    link.href = apkPath;
    link.download = 'anyDoubt.apk';
    
    // Trigger the download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Optional: Show a download notification
    showDownloadNotification();
}

// Function to show download notification
function showDownloadNotification() {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'download-notification';
    notification.innerHTML = `
        <i class="fas fa-download"></i>
        <span>Downloading anyDoubt.apk...</span>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Hide and remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Get all download buttons
    const launchAppButtons = document.querySelectorAll('a[href="anydoubt.apk"], a[href*="Launch App"]');
    const getStartedButtons = document.querySelectorAll('a[href="main/main.html"]');
    
    // Add click event to Launch App buttons
    launchAppButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            downloadApp();
        });
    });
    
    // Optionally: Make Get Started also download the app
    // Remove this section if you want Get Started to navigate to main.html instead
    getStartedButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            downloadApp();
        });
    });
});

// CSS for download notification - Add this to your styles.css
const notificationStyles = `
.download-notification {
    position: fixed;
    bottom: -100px;
    right: 2rem;
    background: linear-gradient(45deg, #ff0000, #ff6600);
    color: white;
    padding: 1rem 2rem;
    border-radius: 50px;
    display: flex;
    align-items: center;
    gap: 1rem;
    box-shadow: 0 10px 30px rgba(255, 0, 0, 0.4);
    z-index: 10001;
    transition: all 0.3s ease;
    font-weight: 600;
}

.download-notification.show {
    bottom: 2rem;
}

.download-notification i {
    font-size: 1.5rem;
    animation: downloadBounce 1s ease-in-out infinite;
}

@keyframes downloadBounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
}
`;

// Inject notification styles
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

// ==========================================
// INITIALIZATION COMPLETE
// ==========================================
console.log('%c✅ All systems initialized!', 'font-size: 12px; color: #00ff00;');
