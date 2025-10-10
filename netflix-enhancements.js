// Netflix-Style Project Carousel & Mobile Enhancements
class NetflixCarousel {
    constructor() {
        this.initCarousel();
        this.initMobileGestures();
        this.initAdvancedScrollAnimations();
    }

    initCarousel() {
        // Convert project grid to horizontal carousel
        const projectsSection = document.querySelector('#projects');
        if (!projectsSection) return;

        const projectsGrid = projectsSection.querySelector('.projects-grid');
        if (!projectsGrid) return;

        // Add carousel wrapper
        projectsGrid.classList.add('netflix-carousel');
        
        // Add navigation arrows
        const carouselContainer = document.createElement('div');
        carouselContainer.className = 'carousel-container';
        
        const prevArrow = document.createElement('button');
        prevArrow.className = 'carousel-arrow carousel-arrow-prev';
        prevArrow.innerHTML = '❮';
        prevArrow.setAttribute('aria-label', 'Previous projects');
        
        const nextArrow = document.createElement('button');
        nextArrow.className = 'carousel-arrow carousel-arrow-next';
        nextArrow.innerHTML = '❯';
        nextArrow.setAttribute('aria-label', 'Next projects');
        
        // Wrap the grid
        projectsGrid.parentNode.insertBefore(carouselContainer, projectsGrid);
        carouselContainer.appendChild(prevArrow);
        carouselContainer.appendChild(projectsGrid);
        carouselContainer.appendChild(nextArrow);
        
        // Add scroll functionality
        let scrollAmount = 0;
        const cardWidth = 350; // Approximate card width + gap
        
        prevArrow.addEventListener('click', () => {
            scrollAmount = Math.max(0, scrollAmount - cardWidth * 2);
            projectsGrid.style.transform = `translateX(-${scrollAmount}px)`;
            this.updateArrowStates(scrollAmount, projectsGrid.scrollWidth - projectsGrid.clientWidth);
        });
        
        nextArrow.addEventListener('click', () => {
            const maxScroll = projectsGrid.scrollWidth - projectsGrid.clientWidth;
            scrollAmount = Math.min(maxScroll, scrollAmount + cardWidth * 2);
            projectsGrid.style.transform = `translateX(-${scrollAmount}px)`;
            this.updateArrowStates(scrollAmount, maxScroll);
        });
        
        // Mouse wheel horizontal scroll
        projectsGrid.addEventListener('wheel', (e) => {
            if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return; // Already horizontal
            
            e.preventDefault();
            const maxScroll = projectsGrid.scrollWidth - projectsGrid.clientWidth;
            scrollAmount = Math.max(0, Math.min(maxScroll, scrollAmount + e.deltaY));
            projectsGrid.style.transform = `translateX(-${scrollAmount}px)`;
            this.updateArrowStates(scrollAmount, maxScroll);
        }, { passive: false });
        
        // Auto-scroll (optional)
        let autoScrollTimer;
        const startAutoScroll = () => {
            autoScrollTimer = setInterval(() => {
                const maxScroll = projectsGrid.scrollWidth - projectsGrid.clientWidth;
                if (scrollAmount >= maxScroll) {
                    scrollAmount = 0;
                } else {
                    scrollAmount += cardWidth;
                }
                projectsGrid.style.transform = `translateX(-${scrollAmount}px)`;
                this.updateArrowStates(scrollAmount, maxScroll);
            }, 5000);
        };
        
        // Pause auto-scroll on hover
        carouselContainer.addEventListener('mouseenter', () => {
            clearInterval(autoScrollTimer);
        });
        
        carouselContainer.addEventListener('mouseleave', () => {
            startAutoScroll();
        });
        
        // Start auto-scroll
        setTimeout(startAutoScroll, 3000);
    }
    
    updateArrowStates(current, max) {
        const prevArrow = document.querySelector('.carousel-arrow-prev');
        const nextArrow = document.querySelector('.carousel-arrow-next');
        
        if (prevArrow) prevArrow.style.opacity = current <= 0 ? '0.3' : '1';
        if (nextArrow) nextArrow.style.opacity = current >= max ? '0.3' : '1';
    }

    initMobileGestures() {
        let startX, startY, currentX, currentY;
        let isSwipe = false;
        
        const projectsGrid = document.querySelector('.projects-grid');
        if (!projectsGrid) return;
        
        // Touch start
        projectsGrid.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isSwipe = false;
            projectsGrid.style.transition = 'none';
        }, { passive: true });
        
        // Touch move
        projectsGrid.addEventListener('touchmove', (e) => {
            if (!startX || !startY) return;
            
            currentX = e.touches[0].clientX;
            currentY = e.touches[0].clientY;
            
            const diffX = startX - currentX;
            const diffY = startY - currentY;
            
            // Determine if it's a horizontal swipe
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 10) {
                isSwipe = true;
                e.preventDefault();
                
                // Apply swipe effect
                const currentTransform = projectsGrid.style.transform;
                const currentTranslate = currentTransform.match(/-?\d+/);
                const baseTranslate = currentTranslate ? parseInt(currentTranslate[0]) : 0;
                
                projectsGrid.style.transform = `translateX(${baseTranslate - diffX * 0.5}px)`;
            }
        }, { passive: false });
        
        // Touch end
        projectsGrid.addEventListener('touchend', (e) => {
            if (!isSwipe) return;
            
            const diffX = startX - currentX;
            const cardWidth = 350;
            
            projectsGrid.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            
            // Determine scroll direction
            if (Math.abs(diffX) > 50) {
                const currentTransform = projectsGrid.style.transform;
                const currentTranslate = currentTransform.match(/-?\d+/);
                let baseTranslate = currentTranslate ? parseInt(currentTranslate[0]) : 0;
                
                if (diffX > 0) {
                    // Swipe left (next)
                    const maxScroll = -(projectsGrid.scrollWidth - projectsGrid.clientWidth);
                    baseTranslate = Math.max(maxScroll, baseTranslate - cardWidth);
                } else {
                    // Swipe right (previous)
                    baseTranslate = Math.min(0, baseTranslate + cardWidth);
                }
                
                projectsGrid.style.transform = `translateX(${baseTranslate}px)`;
            }
            
            // Reset
            startX = startY = currentX = currentY = null;
            isSwipe = false;
        }, { passive: true });
    }

    initAdvancedScrollAnimations() {
        // Parallax backgrounds
        const hero = document.querySelector('.hero');
        if (hero) {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const parallax = scrolled * 0.5;
                hero.style.transform = `translateY(${parallax}px)`;
            });
        }
        
        // Section reveal animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };
        
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    
                    // Stagger child animations
                    const children = entry.target.querySelectorAll('.project-card, .certification-card, .experience-item, .contact-item');
                    children.forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('animate-in');
                        }, index * 100);
                    });
                }
            });
        }, observerOptions);
        
        // Observe all sections
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            section.classList.add('section-hidden');
            revealObserver.observe(section);
        });
        
        // Smooth scroll snap
        this.initSmoothScrollSnap();
        
        // Scroll progress indicator
        this.initScrollProgress();
    }
    
    initSmoothScrollSnap() {
        const sections = document.querySelectorAll('section[id]');
        let currentSection = 0;
        let isScrolling = false;
        
        window.addEventListener('wheel', (e) => {
            if (isScrolling) return;
            
            const direction = e.deltaY > 0 ? 1 : -1;
            const nextSection = currentSection + direction;
            
            if (nextSection >= 0 && nextSection < sections.length) {
                isScrolling = true;
                currentSection = nextSection;
                
                sections[currentSection].scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                setTimeout(() => {
                    isScrolling = false;
                }, 800);
            }
        }, { passive: true });
    }
    
    initScrollProgress() {
        // Create progress bar
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.innerHTML = '<div class="scroll-progress-fill"></div>';
        document.body.appendChild(progressBar);
        
        const progressFill = progressBar.querySelector('.scroll-progress-fill');
        
        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            progressFill.style.width = scrolled + '%';
        });
    }
}

// Loading and skeleton screen
class NetflixLoading {
    constructor() {
        this.showLoadingScreen();
        this.initSkeletonScreens();
    }
    
    showLoadingScreen() {
        const loader = document.createElement('div');
        loader.className = 'netflix-loader';
        loader.innerHTML = `
            <div class="netflix-logo">
                <div class="loading-text">Saiprudvi Ela</div>
                <div class="loading-spinner"></div>
            </div>
        `;
        document.body.appendChild(loader);
        
        // Remove loader when page is loaded
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.classList.add('fade-out');
                setTimeout(() => loader.remove(), 500);
            }, 1000);
        });
    }
    
    initSkeletonScreens() {
        // Add skeleton screens for project cards while loading
        const projectsGrid = document.querySelector('.projects-grid');
        if (projectsGrid) {
            const skeletons = Array.from({length: 6}, () => {
                const skeleton = document.createElement('div');
                skeleton.className = 'project-card skeleton';
                skeleton.innerHTML = `
                    <div class="skeleton-header"></div>
                    <div class="skeleton-content">
                        <div class="skeleton-line"></div>
                        <div class="skeleton-line short"></div>
                    </div>
                `;
                return skeleton;
            });
            
            // Show skeletons initially
            skeletons.forEach(skeleton => projectsGrid.appendChild(skeleton));
            
            // Remove skeletons after content loads
            setTimeout(() => {
                skeletons.forEach(skeleton => skeleton.remove());
            }, 1500);
        }
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new NetflixLoading();
    
    // Wait a bit for content to load
    setTimeout(() => {
        new NetflixCarousel();
    }, 1000);
});

// Add touch feedback for mobile
document.addEventListener('touchstart', (e) => {
    const target = e.target.closest('.project-card, .certification-card, .btn, a');
    if (target) {
        target.classList.add('touch-active');
        setTimeout(() => target.classList.remove('touch-active'), 150);
    }
}, { passive: true });
