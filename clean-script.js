document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const navToggle = document.querySelector('[data-nav-toggle]');
    const primaryNav = document.querySelector('[data-primary-nav]');
    const header = document.querySelector('.site-header');
    let lastScrollY = window.scrollY;

    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

    if (typeof typewriter === 'function') {
        typewriter('[data-typewriter]', {
            delay: 32,
            loop: true,
            strings: [
                'Designing elegant interfaces.',
                'Transforming ideas into products.',
                'Crafting digital experiences.'
            ]
        });
    }

    function openNav() {
        body.classList.add('nav-open');
        primaryNav?.setAttribute('data-state', 'open');
        const items = primaryNav?.querySelectorAll(':scope > *');
        items?.forEach((item, index) => {
            item.style.setProperty('--delay', `${index * 80}ms`);
            item.setAttribute('data-visible', 'true');
        });
    }

    function closeNav() {
        body.classList.remove('nav-open');
        primaryNav?.setAttribute('data-state', 'closed');
        const items = primaryNav?.querySelectorAll(':scope > *');
        items?.forEach(item => item.removeAttribute('data-visible'));
    }

    navToggle?.addEventListener('click', () => {
        const isOpen = body.classList.contains('nav-open');
        isOpen ? closeNav() : openNav();
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth >= 960 && body.classList.contains('nav-open')) {
            closeNav();
        }
    });

    function handleScroll() {
        const currentScrollY = window.scrollY;
        const scrollDelta = currentScrollY - lastScrollY;
        const threshold = clamp(currentScrollY / 12, 0, 12);

        header?.setAttribute('data-scrolled', String(currentScrollY > 12));
        header?.style.setProperty('--offset', `${clamp(threshold, 0, 12)}px`);

        if (scrollDelta > 6 && currentScrollY > 160) {
            header?.setAttribute('data-hidden', 'true');
        } else {
            header?.removeAttribute('data-hidden');
        }

        lastScrollY = currentScrollY;
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    const observerOptions = {
        threshold: [0, 0.2, 0.6]
    };

    const observeReveal = entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.setAttribute('data-visible', 'true');
            } else if (entry.boundingClientRect.top > 0) {
                entry.target.removeAttribute('data-visible');
            }
        });
    };

    const observer = new IntersectionObserver(observeReveal, observerOptions);

    document.querySelectorAll('[data-reveal]').forEach(element => {
        observer.observe(element);
    });
});