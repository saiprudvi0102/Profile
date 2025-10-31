// Enhanced Interactive Features and Animations

(function() {
    'use strict';

    // ============================================
    // SCROLL ANIMATION OBSERVER
    // ============================================
    
    const initScrollAnimations = () => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Observe all animatable elements
        document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .scale-in').forEach(el => {
            observer.observe(el);
        });
    };

    // ============================================
    // NUMBER COUNTER ANIMATION
    // ============================================
    
    const animateCounter = (element, target, duration = 2000, suffix = '') => {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                // Format numbers
                if (target >= 1000) {
                    element.textContent = Math.floor(current / 1000) + 'K+' + suffix;
                } else if (target < 1) {
                    element.textContent = (current * 100).toFixed(0) + '%' + suffix;
                } else {
                    element.textContent = Math.floor(current) + suffix;
                }
                requestAnimationFrame(updateCounter);
            } else {
                // Format final number
                if (target >= 1000) {
                    element.textContent = Math.floor(target / 1000) + 'K+' + suffix;
                } else if (target < 1) {
                    element.textContent = (target * 100).toFixed(0) + '%' + suffix;
                } else {
                    element.textContent = target + suffix;
                }
            }
        };

        // Only animate if element is in viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !element.dataset.animated) {
                    element.dataset.animated = 'true';
                    updateCounter();
                }
            });
        }, { threshold: 0.5 });

        observer.observe(element);
    };

    // ============================================
    // PROGRESS BAR ANIMATION
    // ============================================
    
    const animateProgressBar = (element, percentage) => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !element.dataset.animated) {
                    element.dataset.animated = 'true';
                    setTimeout(() => {
                        element.style.width = percentage + '%';
                    }, 300);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(element.closest('.progress-bar-container'));
    };

    // ============================================
    // PROGRESS RING ANIMATION
    // ============================================
    
    const animateProgressRing = (element, percentage) => {
        const circle = element.querySelector('.progress-ring-progress');
        if (!circle) return;

        const circumference = 2 * Math.PI * 45; // radius = 45
        const offset = circumference - (percentage / 100) * circumference;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !element.dataset.animated) {
                    element.dataset.animated = 'true';
                    circle.style.strokeDashoffset = offset;
                    const label = element.querySelector('.progress-label');
                    if (label) {
                        animateCounter(label, percentage, 1500, '%');
                    }
                }
            });
        }, { threshold: 0.5 });

        observer.observe(element);
    };

    // ============================================
    // PARTICLE BACKGROUND GENERATOR
    // ============================================
    
    const createParticles = (container, count = 50) => {
        // Check for reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 15 + 's';
            particle.style.animationDuration = (15 + Math.random() * 10) + 's';
            container.appendChild(particle);
        }
    };

    // ============================================
    // CODE SNIPPET TYPEWRITER
    // ============================================
    
    const initCodeShowcase = () => {
        const codeShowcases = document.querySelectorAll('.code-showcase');
        codeShowcases.forEach(showcase => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !showcase.dataset.animated) {
                        showcase.dataset.animated = 'true';
                        const lines = showcase.querySelectorAll('.code-line');
                        lines.forEach((line, index) => {
                            setTimeout(() => {
                                line.style.animation = `typeIn 0.5s forwards`;
                            }, index * 500);
                        });
                    }
                });
            }, { threshold: 0.3 });
            observer.observe(showcase);
        });
    };

    // ============================================
    // RIPPLE EFFECT
    // ============================================
    
    const initRippleEffect = () => {
        document.querySelectorAll('.ripple-effect').forEach(element => {
            element.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;

                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.classList.add('ripple');

                this.appendChild(ripple);

                setTimeout(() => ripple.remove(), 600);
            });
        });
    };

    // ============================================
    // MOBILE BOTTOM NAVIGATION
    // ============================================
    
    const initMobileBottomNav = () => {
        if (window.innerWidth <= 768) {
            const bottomNav = document.createElement('nav');
            bottomNav.className = 'mobile-bottom-nav';
            bottomNav.innerHTML = `
                <a href="index.html" class="mobile-bottom-nav-item ${window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/') ? 'active' : ''}">
                    <i class="fas fa-home"></i>
                    <span>Home</span>
                </a>
                <a href="profile.html" class="mobile-bottom-nav-item ${window.location.pathname.includes('profile.html') ? 'active' : ''}">
                    <i class="fas fa-user"></i>
                    <span>Profile</span>
                </a>
                <a href="experience.html" class="mobile-bottom-nav-item ${window.location.pathname.includes('experience.html') ? 'active' : ''}">
                    <i class="fas fa-briefcase"></i>
                    <span>Experience</span>
                </a>
                <a href="projects.html" class="mobile-bottom-nav-item ${window.location.pathname.includes('projects.html') ? 'active' : ''}">
                    <i class="fas fa-rocket"></i>
                    <span>Projects</span>
                </a>
                <a href="skills.html" class="mobile-bottom-nav-item ${window.location.pathname.includes('skills.html') ? 'active' : ''}">
                    <i class="fas fa-code"></i>
                    <span>Skills</span>
                </a>
            `;
            document.body.appendChild(bottomNav);
        }
    };

    // ============================================
    // SWIPE GESTURES (Mobile)
    // ============================================
    
    const initSwipeGestures = () => {
        if (window.innerWidth <= 768) {
            const swipeableCards = document.querySelectorAll('.swipeable');
            swipeableCards.forEach(card => {
                let touchStartX = 0;
                let touchEndX = 0;

                card.addEventListener('touchstart', (e) => {
                    touchStartX = e.changedTouches[0].screenX;
                });

                card.addEventListener('touchend', (e) => {
                    touchEndX = e.changedTouches[0].screenX;
                    handleSwipe(card);
                });

                const handleSwipe = (element) => {
                    const swipeThreshold = 50;
                    const diff = touchStartX - touchEndX;

                    if (Math.abs(diff) > swipeThreshold) {
                        if (diff > 0) {
                            // Swipe left
                            element.style.transform = 'translateX(-100%)';
                            setTimeout(() => {
                                element.style.transform = 'translateX(0)';
                            }, 300);
                        } else {
                            // Swipe right
                            element.style.transform = 'translateX(100%)';
                            setTimeout(() => {
                                element.style.transform = 'translateX(0)';
                            }, 300);
                        }
                    }
                };
            });
        }
    };

    // ============================================
    // PAGE LOADER
    // ============================================
    
    const initPageLoader = () => {
        window.addEventListener('load', () => {
            const loader = document.querySelector('.page-loader');
            if (loader) {
                setTimeout(() => {
                    loader.classList.add('hidden');
                    setTimeout(() => loader.remove(), 500);
                }, 500);
            }
        });
    };

    // ============================================
    // INITIALIZE COUNTERS
    // ============================================
    
    const initCounters = () => {
        // Stats counters
        const stat120K = document.querySelector('[data-counter="120000"]');
        if (stat120K) animateCounter(stat120K, 120000, 2000, '+');

        const stat91 = document.querySelector('[data-counter="91"]');
        if (stat91) animateCounter(stat91, 91, 2000, '%');

        const stat62 = document.querySelector('[data-counter="62"]');
        if (stat62) animateCounter(stat62, 62, 2000, '%');

        const stat45 = document.querySelector('[data-counter="45"]');
        if (stat45) animateCounter(stat45, 45, 2000, '%');

        const stat38 = document.querySelector('[data-counter="38"]');
        if (stat38) animateCounter(stat38, 38, 2000, '%');

        const stat30 = document.querySelector('[data-counter="30"]');
        if (stat30) animateCounter(stat30, 30, 2000, '%');

        const stat25 = document.querySelector('[data-counter="25"]');
        if (stat25) animateCounter(stat25, 25, 2000, '%');

        const stat4 = document.querySelector('[data-counter="4"]');
        if (stat4) animateCounter(stat4, 4, 1500, '+');

        const stat40 = document.querySelector('[data-counter="40"]');
        if (stat40) animateCounter(stat40, 40, 2000, '+');
    };

    // ============================================
    // INITIALIZE PROGRESS BARS
    // ============================================
    
    const initProgressBars = () => {
        document.querySelectorAll('.progress-bar').forEach(bar => {
            const percentage = bar.dataset.progress || bar.getAttribute('data-progress');
            if (percentage) {
                animateProgressBar(bar, percentage);
            }
        });
    };

    // ============================================
    // INITIALIZE PROGRESS RINGS
    // ============================================
    
    const initProgressRings = () => {
        document.querySelectorAll('.progress-ring').forEach(ring => {
            const percentage = ring.dataset.progress || ring.getAttribute('data-progress');
            if (percentage) {
                animateProgressRing(ring, percentage);
            }
        });
    };

    // ============================================
    // ACCESSIBILITY: SKIP TO CONTENT
    // ============================================
    
    const initSkipToContent = () => {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'skip-to-content';
        skipLink.textContent = 'Skip to main content';
        document.body.insertBefore(skipLink, document.body.firstChild);
    };

    // ============================================
    // MAIN INITIALIZATION
    // ============================================
    
    document.addEventListener('DOMContentLoaded', () => {
        // Initialize all features
        initScrollAnimations();
        initCounters();
        initProgressBars();
        initProgressRings();
        initCodeShowcase();
        initRippleEffect();
        initMobileBottomNav();
        initSwipeGestures();
        initPageLoader();
        initSkipToContent();

        // Initialize particles for hero section
        const heroParticles = document.querySelector('.particles-container');
        if (heroParticles) {
            createParticles(heroParticles, 50);
        }

        // Add main content ID for skip link
        const mainContent = document.querySelector('main') || document.querySelector('#about') || document.body;
        if (mainContent && !mainContent.id) {
            mainContent.id = 'main-content';
        }
    });

    // Expose functions for external use
    window.enhancedInteractions = {
        animateCounter,
        animateProgressBar,
        animateProgressRing,
        createParticles
    };

})();

