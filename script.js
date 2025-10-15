// Smooth scrolling navigation
document.addEventListener('DOMContentLoaded', function() {
    // Update current year in footer
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    // Navigation active state management
    const navLinkEls = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section[id]');

    function updateActiveNavLink() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinkEls.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    }

    // Update active nav link on scroll
    window.addEventListener('scroll', updateActiveNavLink);
    updateActiveNavLink(); // Initial call

    // Smooth scroll for in-page navigation links; let full page links navigate
    navLinkEls.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href') || '';
            // Only intercept if this is an on-page anchor (starts with '#') or points to current page with hash
            const isHashOnly = href.startsWith('#');
            const isSamePageHash = href.includes('#') && (href.startsWith(window.location.pathname) || href.startsWith('index.html'));

            if (!(isHashOnly || isSamePageHash)) {
                // Allow normal navigation to resume.html, contact.html, etc.
                return;
            }

            e.preventDefault();
            const targetId = href.substring(href.indexOf('#') + 1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed header
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
            }
        });
    });

    // Header scroll effect - Netflix theme
    const header = document.querySelector('header');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.style.background = 'rgba(20, 20, 20, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.5)';
        } else {
            header.style.background = 'rgba(20, 20, 20, 0.95)';
            header.style.boxShadow = 'none';
        }

        lastScrollTop = scrollTop;
    });

    // Mobile menu toggle (enhanced for Netflix style)
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinksEl = document.querySelector('.nav-links');
    
    if (mobileToggle && navLinksEl) {
        // Basic functionality - will be enhanced by Netflix script
        mobileToggle.addEventListener('click', function() {
            navLinksEl.classList.toggle('mobile-open');
            this.classList.toggle('active');
            document.body.classList.toggle('nav-open');
        });

        // Close mobile menu when clicking on a nav link
        navLinksEl.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    navLinksEl.classList.remove('mobile-open');
                    mobileToggle.classList.remove('active');
                    document.body.classList.remove('nav-open');
                }
            });
        });

        // Close mobile menu when resizing to desktop
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                navLinksEl.classList.remove('mobile-open');
                mobileToggle.classList.remove('active');
                document.body.classList.remove('nav-open');
            }
        });
    }

    // Form handling
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            // Basic form validation
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name || !email || !subject || !message) {
                e.preventDefault();
                alert('Please fill in all fields.');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                e.preventDefault();
                alert('Please enter a valid email address.');
                return;
            }

            // If validation passes, the form will submit naturally (mailto)
            // You could also prevent default and handle with JavaScript for better UX
        });
    }

    // Intersection Observer for animations
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
    const animateElements = document.querySelectorAll('.timeline-item, .project-card, .skill-category');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Typing effect for hero title (optional enhancement)
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.innerHTML;
        heroTitle.innerHTML = '';
        let i = 0;
        
        function typeWriter() {
            if (i < text.length) {
                heroTitle.innerHTML += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        }
        
        // Start typing effect after a short delay
        setTimeout(typeWriter, 500);
    }

    // Scroll to top functionality (Netflix styled)
    let scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '↑';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #E50914;
        color: white;
        border: none;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        font-size: 20px;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(229, 9, 20, 0.3);
    `;

    document.body.appendChild(scrollToTopBtn);

    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.visibility = 'visible';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.visibility = 'hidden';
        }
    });

    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Add hover effect to scroll-to-top button
    scrollToTopBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
        this.style.background = '#b20710';
    });

    scrollToTopBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
        this.style.background = '#E50914';
    });

    // Console greeting
    console.log('%c👋 Hello there! Welcome to my portfolio website.', 'color: #2563eb; font-size: 16px; font-weight: bold;');
    console.log('%cIf you\'re looking at this, you might be interested in my work. Feel free to reach out!', 'color: #64748b; font-size: 14px;');
});

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Navigate sections with arrow keys
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        const sections = Array.from(document.querySelectorAll('section[id]'));
        const currentSection = sections.find(section => {
            const rect = section.getBoundingClientRect();
            return rect.top <= 100 && rect.bottom > 100;
        });

        if (currentSection) {
            const currentIndex = sections.indexOf(currentSection);
            let targetIndex;

            if (e.key === 'ArrowDown' && currentIndex < sections.length - 1) {
                targetIndex = currentIndex + 1;
            } else if (e.key === 'ArrowUp' && currentIndex > 0) {
                targetIndex = currentIndex - 1;
            }

            if (targetIndex !== undefined) {
                e.preventDefault();
                const targetSection = sections[targetIndex];
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    }
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
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

// Apply debouncing to scroll-heavy functions
const debouncedScrollHandler = debounce(function() {
    // Any expensive scroll operations can go here
}, 16); // ~60fps

window.addEventListener('scroll', debouncedScrollHandler);
// Netflix-style header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Duplicate scroll-to-top button removed - handled by Netflix enhancements

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections for animation
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // Enhanced smooth swipe functionality for certifications
    const certificationsRow = document.querySelector('.certifications-row');
    if (certificationsRow) {
        let isScrolling = false;
        let startX = 0;
        let scrollLeft = 0;
        let velocity = 0;
        let lastTime = 0;
        let lastScrollLeft = 0;

        // Touch events for mobile swipe
        certificationsRow.addEventListener('touchstart', (e) => {
            isScrolling = true;
            startX = e.touches[0].pageX - certificationsRow.offsetLeft;
            scrollLeft = certificationsRow.scrollLeft;
            lastTime = Date.now();
            lastScrollLeft = scrollLeft;
            certificationsRow.style.scrollBehavior = 'auto';
        });

        certificationsRow.addEventListener('touchmove', (e) => {
            if (!isScrolling) return;
            e.preventDefault();
            const x = e.touches[0].pageX - certificationsRow.offsetLeft;
            const walk = (x - startX) * 2; // Scroll speed multiplier
            certificationsRow.scrollLeft = scrollLeft - walk;
            
            // Calculate velocity for momentum scrolling
            const currentTime = Date.now();
            const timeDiff = currentTime - lastTime;
            if (timeDiff > 0) {
                velocity = (certificationsRow.scrollLeft - lastScrollLeft) / timeDiff;
                lastTime = currentTime;
                lastScrollLeft = certificationsRow.scrollLeft;
            }
        });

        certificationsRow.addEventListener('touchend', () => {
            isScrolling = false;
            certificationsRow.style.scrollBehavior = 'smooth';
            
            // Apply momentum scrolling
            if (Math.abs(velocity) > 0.1) {
                const momentum = velocity * 200; // Momentum multiplier
                certificationsRow.scrollLeft += momentum;
            }
        });

        // Mouse drag support for desktop
        let isMouseDown = false;
        let mouseStartX = 0;
        let mouseScrollLeft = 0;

        certificationsRow.addEventListener('mousedown', (e) => {
            isMouseDown = true;
            certificationsRow.style.cursor = 'grabbing';
            mouseStartX = e.pageX - certificationsRow.offsetLeft;
            mouseScrollLeft = certificationsRow.scrollLeft;
            certificationsRow.style.scrollBehavior = 'auto';
        });

        certificationsRow.addEventListener('mouseleave', () => {
            isMouseDown = false;
            certificationsRow.style.cursor = 'grab';
            certificationsRow.style.scrollBehavior = 'smooth';
        });

        certificationsRow.addEventListener('mouseup', () => {
            isMouseDown = false;
            certificationsRow.style.cursor = 'grab';
            certificationsRow.style.scrollBehavior = 'smooth';
        });

        certificationsRow.addEventListener('mousemove', (e) => {
            if (!isMouseDown) return;
            e.preventDefault();
            const x = e.pageX - certificationsRow.offsetLeft;
            const walk = (x - mouseStartX) * 2;
            certificationsRow.scrollLeft = mouseScrollLeft - walk;
        });

        // Smooth scroll to center on card hover (desktop)
        const certificationCards = document.querySelectorAll('.certification-card');
        certificationCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                if (!isMouseDown && !isScrolling) {
                    const cardRect = card.getBoundingClientRect();
                    const containerRect = certificationsRow.getBoundingClientRect();
                    const cardCenter = cardRect.left + cardRect.width / 2;
                    const containerCenter = containerRect.left + containerRect.width / 2;
                    const scrollAmount = cardCenter - containerCenter;
                    
                    certificationsRow.scrollBy({
                        left: scrollAmount,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Add smooth scroll indicators
        const container = document.querySelector('.certifications-row-container');
        if (container) {
            // Add fade effects on scroll
            certificationsRow.addEventListener('scroll', () => {
                const scrollLeft = certificationsRow.scrollLeft;
                const maxScroll = certificationsRow.scrollWidth - certificationsRow.clientWidth;
                
                // Add fade effect to edges
                if (scrollLeft > 0) {
                    container.style.setProperty('--fade-left', '1');
                } else {
                    container.style.setProperty('--fade-left', '0');
                }
                
                if (scrollLeft < maxScroll - 1) {
                    container.style.setProperty('--fade-right', '1');
                } else {
                    container.style.setProperty('--fade-right', '0');
                }
            });
        }
    }

    // Project Modal Functionality
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't open modal if clicking on links
            if (e.target.closest('.project-link')) {
                return;
            }
            
            const projectTitle = this.querySelector('h3').textContent;
            const projectDescription = this.querySelector('p').textContent;
            const projectTech = Array.from(this.querySelectorAll('.project-tech span')).map(span => span.textContent);
            const projectLinks = Array.from(this.querySelectorAll('.project-link')).map(link => ({
                text: link.textContent.trim(),
                href: link.href
            }));
            
            openProjectModal(projectTitle, projectDescription, projectTech, projectLinks);
        });
    });

    function openProjectModal(title, description, tech, links) {
        // Create modal overlay
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal-overlay';
        modalOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        // Create modal content
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        modalContent.style.cssText = `
            background: var(--netflix-gray);
            border-radius: 12px;
            padding: 2rem;
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            position: relative;
            transform: scale(0.8);
            transition: transform 0.3s ease;
        `;

        // Create close button
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '×';
        closeBtn.className = 'modal-close';
        closeBtn.style.cssText = `
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: var(--netflix-red);
            color: white;
            border: none;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 1.2rem;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        // Create modal HTML
        modalContent.innerHTML = `
            <h2 style="color: var(--netflix-white); margin-bottom: 1rem; font-size: 1.8rem;">${title}</h2>
            <p style="color: var(--netflix-light-gray); margin-bottom: 1.5rem; line-height: 1.6;">${description}</p>
            <div style="margin-bottom: 1.5rem;">
                <h3 style="color: var(--netflix-red); margin-bottom: 0.5rem; font-size: 1.1rem;">Technologies Used:</h3>
                <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                    ${tech.map(t => `<span style="background: var(--netflix-red); color: white; padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.8rem;">${t}</span>`).join('')}
                </div>
            </div>
            <div>
                <h3 style="color: var(--netflix-red); margin-bottom: 0.5rem; font-size: 1.1rem;">Links:</h3>
                <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                    ${links.map(link => `<a href="${link.href}" target="_blank" rel="noopener" style="background: transparent; color: var(--netflix-red); padding: 0.5rem 1rem; border: 1px solid var(--netflix-red); border-radius: 6px; text-decoration: none; font-size: 0.9rem; transition: all 0.3s ease;">${link.text}</a>`).join('')}
                </div>
            </div>
        `;

        modalContent.appendChild(closeBtn);
        modalOverlay.appendChild(modalContent);
        document.body.appendChild(modalOverlay);

        // Animate modal in
        setTimeout(() => {
            modalOverlay.style.opacity = '1';
            modalContent.style.transform = 'scale(1)';
        }, 10);

        // Close modal functionality
        function closeModal() {
            modalOverlay.style.opacity = '0';
            modalContent.style.transform = 'scale(0.8)';
            setTimeout(() => {
                document.body.removeChild(modalOverlay);
            }, 300);
        }

        closeBtn.addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeModal();
            }
        });
    }
});
