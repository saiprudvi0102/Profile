// Enhanced Mobile Navigation
class MobileNavigation {
    constructor() {
        this.createHamburgerMenu();
        this.enhanceMobileNavigation();
    }
    
    createHamburgerMenu() {
        const nav = document.querySelector('nav');
        if (!nav) return;
        
        // Create hamburger button
        const hamburger = document.createElement('button');
        hamburger.className = 'mobile-hamburger';
        hamburger.innerHTML = `
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
        `;
        hamburger.setAttribute('aria-label', 'Toggle navigation menu');
        
        // Insert hamburger button
        const navLinks = nav.querySelector('.nav-links');
        nav.insertBefore(hamburger, navLinks);
        
        // Add mobile menu overlay
        const overlay = document.createElement('div');
        overlay.className = 'mobile-nav-overlay';
        document.body.appendChild(overlay);
        
        // Toggle functionality
        let isOpen = false;
        
        const toggleMenu = () => {
            isOpen = !isOpen;
            hamburger.classList.toggle('active', isOpen);
            navLinks.classList.toggle('mobile-open', isOpen);
            overlay.classList.toggle('active', isOpen);
            document.body.classList.toggle('nav-open', isOpen);
        };
        
        hamburger.addEventListener('click', toggleMenu);
        overlay.addEventListener('click', toggleMenu);
        
        // Close menu on link click
        navLinks.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                toggleMenu();
            }
        });
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isOpen) {
                toggleMenu();
            }
        });
    }
    
    enhanceMobileNavigation() {
        // Add smooth scroll for navigation links
        const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// Initialize mobile navigation
document.addEventListener('DOMContentLoaded', () => {
    new MobileNavigation();
});
