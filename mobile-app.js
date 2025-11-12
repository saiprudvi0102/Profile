// Mobile App Enhancements JavaScript

// Initialize mobile app features
document.addEventListener('DOMContentLoaded', function() {
    initMobileApp();
});

function initMobileApp() {
    // Add bottom navigation
    addBottomNavigation();
    
    // Add pull to refresh
    addPullToRefresh();
    
    // Add app-like transitions
    addPageTransitions();
    
    // Add touch gestures
    addTouchGestures();
    
    // Prevent zoom on double tap
    preventDoubleTapZoom();
    
    // Add haptic feedback
    addHapticFeedback();
    
    // Handle safe areas
    handleSafeAreas();
    
    // Add service worker registration
    registerServiceWorker();
}

// Bottom Navigation
function addBottomNavigation() {
    const currentPage = getCurrentPage();
    const navHTML = `
        <nav class="mobile-bottom-nav">
            <a href="index.html" class="mobile-nav-item ${currentPage === 'index' ? 'active' : ''}">
                <i class="fas fa-home"></i>
                <span>Home</span>
            </a>
            <a href="profile.html" class="mobile-nav-item ${currentPage === 'profile' ? 'active' : ''}">
                <i class="fas fa-user"></i>
                <span>Profile</span>
            </a>
            <a href="experience.html" class="mobile-nav-item ${currentPage === 'experience' ? 'active' : ''}">
                <i class="fas fa-briefcase"></i>
                <span>Experience</span>
            </a>
            <a href="projects.html" class="mobile-nav-item ${currentPage === 'projects' ? 'active' : ''}">
                <i class="fas fa-rocket"></i>
                <span>Projects</span>
            </a>
            <a href="resume.html" class="mobile-nav-item ${currentPage === 'resume' ? 'active' : ''}">
                <i class="fas fa-file-alt"></i>
                <span>Resume</span>
            </a>
        </nav>
    `;
    
    document.body.insertAdjacentHTML('beforeend', navHTML);
    
    // Add active state on click
    document.querySelectorAll('.mobile-nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            // Add haptic feedback
            if (navigator.vibrate) {
                navigator.vibrate(10);
            }
        });
    });
}

function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop() || 'index.html';
    
    if (page.includes('index') || page === '') return 'index';
    if (page.includes('profile')) return 'profile';
    if (page.includes('experience')) return 'experience';
    if (page.includes('projects')) return 'projects';
    if (page.includes('resume')) return 'resume';
    if (page.includes('skills')) return 'skills';
    if (page.includes('certifications')) return 'certifications';
    if (page.includes('contact')) return 'contact';
    
    return 'index';
}

// Pull to Refresh
let pullToRefresh = {
    startY: 0,
    currentY: 0,
    threshold: 80,
    isPulling: false
};

function addPullToRefresh() {
    if (window.innerWidth > 768) return; // Only on mobile
    
    const pullIndicator = document.createElement('div');
    pullIndicator.className = 'pull-to-refresh';
    pullIndicator.innerHTML = '<i class="fas fa-sync-alt fa-spin"></i> <span>Refreshing...</span>';
    document.body.appendChild(pullIndicator);
    
    let touchStartY = 0;
    let touchCurrentY = 0;
    let isPulling = false;
    
    document.addEventListener('touchstart', function(e) {
        if (window.scrollY === 0) {
            touchStartY = e.touches[0].clientY;
        }
    });
    
    document.addEventListener('touchmove', function(e) {
        if (window.scrollY === 0 && touchStartY > 0) {
            touchCurrentY = e.touches[0].clientY;
            const pullDistance = touchCurrentY - touchStartY;
            
            if (pullDistance > 0 && pullDistance < 100) {
                isPulling = true;
                pullIndicator.style.top = `${Math.min(pullDistance - 60, 0)}px`;
            }
        }
    });
    
    document.addEventListener('touchend', function() {
        if (isPulling && touchCurrentY - touchStartY > pullToRefresh.threshold) {
            pullIndicator.classList.add('active');
            // Simulate refresh
            setTimeout(() => {
                window.location.reload();
            }, 500);
        } else {
            pullIndicator.style.top = '-60px';
        }
        touchStartY = 0;
        touchCurrentY = 0;
        isPulling = false;
    });
}

// Page Transitions
function addPageTransitions() {
    document.body.classList.add('page-transition');
    
    // Add transition on link clicks
    document.querySelectorAll('a[href^="http"]:not([href*="mailto"]):not([href*="tel"])').forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.hostname === window.location.hostname || !this.hostname) {
                document.body.style.opacity = '0.8';
                setTimeout(() => {
                    document.body.style.opacity = '1';
                }, 100);
            }
        });
    });
}

// Touch Gestures
function addTouchGestures() {
    let touchStartX = 0;
    let touchStartY = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    });
    
    document.addEventListener('touchend', function(e) {
        if (!touchStartX || !touchStartY) return;
        
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        
        const diffX = touchStartX - touchEndX;
        const diffY = touchStartY - touchEndY;
        
        // Swipe left/right detection (can be used for navigation)
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            if (diffX > 0) {
                // Swipe left
                console.log('Swipe left');
            } else {
                // Swipe right
                console.log('Swipe right');
            }
        }
        
        touchStartX = 0;
        touchStartY = 0;
    });
}

// Prevent Double Tap Zoom
function preventDoubleTapZoom() {
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(e) {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
            e.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
}

// Haptic Feedback
function addHapticFeedback() {
    document.querySelectorAll('button, a, .card, .project-card').forEach(element => {
        element.addEventListener('touchstart', function() {
            if (navigator.vibrate) {
                navigator.vibrate(10);
            }
            this.classList.add('haptic-feedback');
        });
        
        element.addEventListener('touchend', function() {
            setTimeout(() => {
                this.classList.remove('haptic-feedback');
            }, 100);
        });
    });
}

// Handle Safe Areas (for notched devices)
function handleSafeAreas() {
    // Add status bar
    const statusBar = document.createElement('div');
    statusBar.className = 'status-bar';
    document.body.insertBefore(statusBar, document.body.firstChild);
}

// Service Worker Registration
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/sw.js')
                .then(function(registration) {
                    console.log('ServiceWorker registration successful');
                })
                .catch(function(err) {
                    console.log('ServiceWorker registration failed');
                });
        });
    }
}

// Show Toast Notification
function showToast(message, duration = 3000) {
    const toast = document.createElement('div');
    toast.className = 'app-toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'toastSlideUp 0.3s ease reverse';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, duration);
}

// Add to window for global access
window.showToast = showToast;

// Handle online/offline status
window.addEventListener('online', function() {
    showToast('Back online', 2000);
});

window.addEventListener('offline', function() {
    showToast('You are offline', 2000);
});

// Prevent context menu on long press (optional)
if (window.innerWidth <= 768) {
    document.addEventListener('contextmenu', function(e) {
        // Allow on inputs and textareas
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }
        // e.preventDefault(); // Uncomment to disable context menu
    });
}

