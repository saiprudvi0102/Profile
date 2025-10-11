// Netflix-Style Enhancements - Fixed Version
class NetflixEnhancementsFixed {
    constructor() {
        this.initCarousel();
        this.initAdvancedScrollAnimations();
        this.fixMobileNavigation();
        this.fixScrollToTop();
    }

    initCarousel() {
        // Convert project grid to horizontal carousel
        const projectsSection = document.querySelector('#projects');
<<<<<<< HEAD
        if (!projectsSection) {
            console.log('Projects section not found');
            return;
        }

        const projectsGrid = projectsSection.querySelector('.projects-grid');
        if (!projectsGrid) {
            console.log('Projects grid not found');
            return;
        }

        // Only create carousel if not already created
        if (projectsGrid.classList.contains('netflix-carousel')) {
            console.log('Carousel already initialized');
            return;
        }

        console.log('Initializing Netflix carousel...');
=======
        if (!projectsSection) return;

        const projectsGrid = projectsSection.querySelector('.projects-grid');
        if (!projectsGrid) return;

        // Only create carousel if not already created
        if (projectsGrid.classList.contains('netflix-carousel')) return;
>>>>>>> 549ce88 (:wq)

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
<<<<<<< HEAD
    let scrollAmount = 0;
    const cardWidth = 340; // Fixed width + estimated gap
    let containerWidth = carouselContainer.clientWidth;
        
        const updateCarousel = () => {
            projectsGrid.style.transform = `translateX(-${scrollAmount}px)`;
            const maxScroll = Math.max(0, projectsGrid.scrollWidth - containerWidth);
            this.updateArrowStates(scrollAmount, maxScroll);
            console.log(`Carousel updated: scrollAmount=${scrollAmount}, maxScroll=${maxScroll}`);
        };
        
        prevArrow.addEventListener('click', (e) => {
            e.preventDefault();
            scrollAmount = Math.max(0, scrollAmount - cardWidth);
            updateCarousel();
            console.log('Previous arrow clicked');
        });
        
        nextArrow.addEventListener('click', (e) => {
            e.preventDefault();
            const maxScroll = Math.max(0, projectsGrid.scrollWidth - containerWidth);
            scrollAmount = Math.min(maxScroll, scrollAmount + cardWidth);
            updateCarousel();
            console.log('Next arrow clicked');
=======
        let scrollAmount = 0;
        const cardWidth = window.innerWidth <= 768 ? 280 : window.innerWidth <= 1024 ? 300 : 350;
        
        const updateCarousel = () => {
            projectsGrid.style.transform = `translateX(-${scrollAmount}px)`;
            this.updateArrowStates(scrollAmount, projectsGrid.scrollWidth - projectsGrid.clientWidth);
        };
        
        prevArrow.addEventListener('click', () => {
            scrollAmount = Math.max(0, scrollAmount - cardWidth * 2);
            updateCarousel();
        });
        
        nextArrow.addEventListener('click', () => {
            const maxScroll = projectsGrid.scrollWidth - projectsGrid.clientWidth;
            scrollAmount = Math.min(maxScroll, scrollAmount + cardWidth * 2);
            updateCarousel();
>>>>>>> 549ce88 (:wq)
        });
        
        // Mouse wheel horizontal scroll
        projectsGrid.addEventListener('wheel', (e) => {
<<<<<<< HEAD
            // Only apply when horizontal intent is clear or shift-scroll
            const horizontalIntent = Math.abs(e.deltaX) >= Math.abs(e.deltaY) || e.shiftKey;
            if (!horizontalIntent) return;

            e.preventDefault();
            const maxScroll = Math.max(0, projectsGrid.scrollWidth - containerWidth);
            const delta = e.deltaX !== 0 ? e.deltaX : e.deltaY;
            scrollAmount = Math.max(0, Math.min(maxScroll, scrollAmount + delta));
            updateCarousel();
        }, { passive: false });

        // Recalculate sizes on resize
        window.addEventListener('resize', () => {
            const prevWidth = containerWidth;
            containerWidth = carouselContainer.clientWidth;
            // Clamp scroll when container changes
            const maxScroll = Math.max(0, projectsGrid.scrollWidth - containerWidth);
            scrollAmount = Math.min(scrollAmount, maxScroll);
            if (prevWidth !== containerWidth) {
                updateCarousel();
            }
        });
        
        // Touch/Swipe support
        this.initSwipeSupport(projectsGrid, cardWidth, {
            getScrollAmount: () => scrollAmount,
            setScrollAmount: (amount) => {
                scrollAmount = amount;
                updateCarousel();
            },
            getMaxScroll: () => Math.max(0, projectsGrid.scrollWidth - containerWidth)
        });
=======
            // Only hijack scroll if it's more horizontal than vertical
            if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
            
            e.preventDefault();
            const maxScroll = projectsGrid.scrollWidth - projectsGrid.clientWidth;
            scrollAmount = Math.max(0, Math.min(maxScroll, scrollAmount + e.deltaY));
            updateCarousel();
        }, { passive: false });
        
        // Touch/Swipe support
        this.initSwipeSupport(projectsGrid, cardWidth, () => updateCarousel());
>>>>>>> 549ce88 (:wq)
        
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
                updateCarousel();
            }, 5000);
        };
        
        // Pause auto-scroll on hover
        carouselContainer.addEventListener('mouseenter', () => {
            clearInterval(autoScrollTimer);
        });
        
        carouselContainer.addEventListener('mouseleave', () => {
            startAutoScroll();
        });
        
        // Start auto-scroll after a delay
        setTimeout(startAutoScroll, 3000);
        
        // Initial update
        updateCarousel();
    }
    
<<<<<<< HEAD
    initSwipeSupport(projectsGrid, cardWidth, callbacks) {
        let startX, startY, currentX, currentY;
        let isSwipe = false;
=======
    initSwipeSupport(projectsGrid, cardWidth, updateCallback) {
        let startX, startY, currentX, currentY;
        let isSwipe = false;
        let initialTransform = 0;
>>>>>>> 549ce88 (:wq)
        
        projectsGrid.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isSwipe = false;
            
<<<<<<< HEAD
            projectsGrid.style.transition = 'none';
            console.log('Touch start:', startX);
=======
            // Get current transform value
            const transform = projectsGrid.style.transform;
            const match = transform.match(/translateX\((-?\d+)px\)/);
            initialTransform = match ? parseInt(match[1]) : 0;
            
            projectsGrid.style.transition = 'none';
>>>>>>> 549ce88 (:wq)
        }, { passive: true });
        
        projectsGrid.addEventListener('touchmove', (e) => {
            if (!startX || !startY) return;
            
            currentX = e.touches[0].clientX;
            currentY = e.touches[0].clientY;
            
            const diffX = startX - currentX;
            const diffY = startY - currentY;
            
            // Determine if it's a horizontal swipe
<<<<<<< HEAD
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 15) {
=======
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 10) {
>>>>>>> 549ce88 (:wq)
                isSwipe = true;
                e.preventDefault();
                
                // Apply swipe effect with damping
<<<<<<< HEAD
                const currentScroll = callbacks.getScrollAmount();
                const newScroll = Math.max(0, currentScroll + diffX * 0.8);
                projectsGrid.style.transform = `translateX(-${newScroll}px)`;
                console.log('Swiping:', diffX, 'New scroll:', newScroll);
=======
                const newTransform = initialTransform - diffX * 0.8;
                projectsGrid.style.transform = `translateX(${newTransform}px)`;
>>>>>>> 549ce88 (:wq)
            }
        }, { passive: false });
        
        projectsGrid.addEventListener('touchend', (e) => {
            if (!isSwipe) {
                projectsGrid.style.transition = '';
                return;
            }
            
            const diffX = startX - currentX;
            
            projectsGrid.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            
            // Determine final scroll position
<<<<<<< HEAD
            if (Math.abs(diffX) > 100) {
                let currentScrollAmount = callbacks.getScrollAmount();
                const maxScroll = callbacks.getMaxScroll();
=======
            if (Math.abs(diffX) > 50) {
                let currentScrollAmount = -initialTransform;
                const maxScroll = projectsGrid.scrollWidth - projectsGrid.clientWidth;
>>>>>>> 549ce88 (:wq)
                
                if (diffX > 0) {
                    // Swipe left (next)
                    currentScrollAmount = Math.min(maxScroll, currentScrollAmount + cardWidth);
                } else {
                    // Swipe right (previous)  
                    currentScrollAmount = Math.max(0, currentScrollAmount - cardWidth);
                }
                
<<<<<<< HEAD
                callbacks.setScrollAmount(currentScrollAmount);
                console.log('Swipe completed:', diffX > 0 ? 'next' : 'previous', currentScrollAmount);
            } else {
                // Snap back to original position
                const currentScroll = callbacks.getScrollAmount();
                projectsGrid.style.transform = `translateX(-${currentScroll}px)`;
                console.log('Swipe cancelled, snapping back to:', currentScroll);
=======
                projectsGrid.style.transform = `translateX(-${currentScrollAmount}px)`;
                this.updateArrowStates(currentScrollAmount, maxScroll);
            } else {
                // Snap back to original position
                projectsGrid.style.transform = `translateX(${initialTransform}px)`;
>>>>>>> 549ce88 (:wq)
            }
            
            // Reset
            startX = startY = currentX = currentY = null;
            isSwipe = false;
            
            setTimeout(() => {
                projectsGrid.style.transition = '';
            }, 300);
        }, { passive: true });
    }
    
    updateArrowStates(current, max) {
        const prevArrow = document.querySelector('.carousel-arrow-prev');
        const nextArrow = document.querySelector('.carousel-arrow-next');
        
        if (prevArrow) prevArrow.style.opacity = current <= 0 ? '0.3' : '1';
        if (nextArrow) nextArrow.style.opacity = current >= max ? '0.3' : '1';
    }

    initAdvancedScrollAnimations() {
        // Parallax backgrounds
        const hero = document.querySelector('.hero');
        if (hero) {
            let ticking = false;
            window.addEventListener('scroll', () => {
                if (!ticking) {
                    requestAnimationFrame(() => {
                        const scrolled = window.pageYOffset;
                        const parallax = scrolled * 0.5;
                        hero.style.transform = `translateY(${parallax}px)`;
                        ticking = false;
                    });
                    ticking = true;
                }
            });
        }
        
        // Section reveal animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('revealed')) {
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
        
        // Scroll progress indicator
        this.initScrollProgress();
    }
    
    initScrollProgress() {
        // Check if progress bar already exists
        if (document.querySelector('.scroll-progress')) return;
        
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.innerHTML = '<div class="scroll-progress-fill"></div>';
        document.body.appendChild(progressBar);
        
        const progressFill = progressBar.querySelector('.scroll-progress-fill');
        
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
                    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                    const scrolled = (winScroll / height) * 100;
                    progressFill.style.width = scrolled + '%';
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
    
    fixMobileNavigation() {
        // Use existing mobile toggle button
        const mobileToggle = document.querySelector('.mobile-toggle');
        const navLinks = document.querySelector('.nav-links');

        if (!mobileToggle || !navLinks) {
            console.log('Mobile navigation elements not found');
            return;
        }

        console.log('Setting up mobile navigation...');

        mobileToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const isOpen = navLinks.classList.contains('mobile-open');
            navLinks.classList.toggle('mobile-open', !isOpen);
            mobileToggle.classList.toggle('active', !isOpen);
            document.body.classList.toggle('nav-open', !isOpen);
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileToggle.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('mobile-open');
                mobileToggle.classList.remove('active');
                document.body.classList.remove('nav-open');
            }
        });
        
        // Close menu on link click (mobile)
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    navLinks.classList.remove('mobile-open');
                    mobileToggle.classList.remove('active');
                    document.body.classList.remove('nav-open');
                }
            });
        });
    }
    
    fixScrollToTop() {
        // Remove any existing duplicate scroll-to-top buttons
        const existingBtns = document.querySelectorAll('.scroll-to-top, .scroll-top');
        if (existingBtns.length > 1) {
            // Keep only the first one and remove duplicates
            for (let i = 1; i < existingBtns.length; i++) {
                existingBtns[i].remove();
            }
        }
        
        // Ensure the remaining button has consistent styling
        const scrollBtn = document.querySelector('.scroll-to-top, .scroll-top');
        if (scrollBtn) {
            scrollBtn.style.backgroundColor = '#E50914';
            scrollBtn.style.borderColor = '#E50914';
            scrollBtn.style.color = 'white';
        }
    }
}

// Touch feedback for mobile
document.addEventListener('touchstart', (e) => {
    const target = e.target.closest('.project-card, .certification-card, .btn, a, button');
    if (target && !target.classList.contains('carousel-arrow')) {
        target.classList.add('touch-active');
        setTimeout(() => target.classList.remove('touch-active'), 150);
    }
}, { passive: true });

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing Netflix enhancements...');
    setTimeout(() => {
        new NetflixEnhancementsFixed();
    }, 800); // Small delay to ensure other scripts have loaded
});

// Fallback initialization if DOMContentLoaded missed
window.addEventListener('load', () => {
    setTimeout(() => {
        if (!document.querySelector('.netflix-carousel')) {
            console.log('Fallback initialization...');
            new NetflixEnhancementsFixed();
        }
    }, 1500);
});
