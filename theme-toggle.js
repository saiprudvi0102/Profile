/**
 * Theme Toggle Functionality
 * Manages Light/Dark mode transitions and persistence
 */

document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    
    // Check for saved theme in localStorage
    const savedTheme = localStorage.getItem('portfolio-theme');
    
    // Check for system preference if no saved theme
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Initial theme setup
    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
        updateToggleIcon(savedTheme);
    } else {
        const initialTheme = systemPrefersDark ? 'dark' : 'light';
        htmlElement.setAttribute('data-theme', initialTheme);
        updateToggleIcon(initialTheme);
    }
    
    // Toggle theme on button click
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('portfolio-theme', newTheme);
            updateToggleIcon(newTheme);
            
            // Add a temporary animation class to body for transition effect
            document.body.classList.add('theme-transitioning');
            setTimeout(() => {
                document.body.classList.remove('theme-transitioning');
            }, 500);
        });
    }
    
    function updateToggleIcon(theme) {
        if (!themeToggle) return;
        const icon = themeToggle.querySelector('i');
        if (icon) {
            if (theme === 'dark') {
                icon.className = 'fas fa-sun';
            } else {
                icon.className = 'fas fa-moon';
            }
        }
    }
});
