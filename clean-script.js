document.addEventListener('DOMContentLoaded', function() {
    // Theme toggle functionality
    const themeToggle = document.getElementById('themeToggle');
    const root = document.documentElement;
    
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme') || 'light';
    root.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    function updateThemeIcon(theme) {
        if (themeToggle) {
            if (theme === 'dark') {
                root.style.setProperty('--sun-display', 'none');
                root.style.setProperty('--moon-display', 'block');
            } else {
                root.style.setProperty('--sun-display', 'block');
                root.style.setProperty('--moon-display', 'none');
            }
        }
    }
    
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = root.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            root.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }
    
    // Mobile menu toggle
    const mobileToggle = document.getElementById('mobileToggle');
    const nav = document.querySelector('.nav');
    
    if (mobileToggle && nav) {
        mobileToggle.addEventListener('click', function() {
            nav.classList.toggle('mobile-active');
            mobileToggle.classList.toggle('active');
        });
    }
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
            
            // Close mobile menu if open
            if (nav && nav.classList.contains('mobile-active')) {
                nav.classList.remove('mobile-active');
                mobileToggle.classList.remove('active');
            }
        });
    });
    
    // Header scroll effect
    const header = document.querySelector('.header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        const currentTheme = root.getAttribute('data-theme');
        
        if (currentScroll > 100) {
            if (currentTheme === 'dark') {
                header.style.background = 'rgba(17, 24, 39, 0.98)';
                header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.98)';
                header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            }
        } else {
            header.style.background = '';
            header.style.boxShadow = '';
        }
        
        lastScroll = currentScroll;
    });
    
    // Add fade-in animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('loaded');
            }
        });
    }, observerOptions);
    
    // Observe all sections for animation
    document.querySelectorAll('.section, .project-card, .skill-category, .stat').forEach(element => {
        element.classList.add('loading');
        observer.observe(element);
    });
    
    // Set current year in footer
    const currentYear = new Date().getFullYear();
    const yearElements = document.querySelectorAll('[data-year]');
    yearElements.forEach(element => {
        element.textContent = currentYear;
    });
    
    // Add loading class to body initially
    document.body.classList.add('loaded');
});