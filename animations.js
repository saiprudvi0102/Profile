// animations.js

document.addEventListener('DOMContentLoaded', () => {

    /**
     * 1. Text Blur Animation
     * Fades in, slides up, and reduces blur for each letter.
     */
    const blurHeaders = document.querySelectorAll('.section-header h2');
    
    // Wrap each character in a span
    blurHeaders.forEach(header => {
        const text = header.textContent;
        header.textContent = '';
        
        [...text].forEach((char, index) => {
            const span = document.createElement('span');
            // Preserve spaces
            if (char === ' ') {
                span.innerHTML = '&nbsp;';
            } else {
                span.textContent = char;
            }
            span.className = 'char-blur-hidden';
            span.style.setProperty('--char-index', index);
            header.appendChild(span);
        });
    });

    const blurObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const chars = entry.target.querySelectorAll('span');
                chars.forEach(char => {
                    char.classList.replace('char-blur-hidden', 'char-blur-in');
                });
                blurObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    blurHeaders.forEach(header => blurObserver.observe(header));


    /**
     * 2. Typing Animation
     * Reveals each character with a 50ms delay.
     */
    const typingBalloons = document.querySelectorAll('.typing-text');
    const typingObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const p = entry.target;
                const fullText = p.getAttribute('data-text');
                if (!fullText) return; // already typing or typed
                
                p.removeAttribute('data-text');
                p.textContent = '';
                
                let i = 0;
                const timer = setInterval(() => {
                    if (i < fullText.length) {
                        p.textContent += fullText.charAt(i);
                        i++;
                    } else {
                        clearInterval(timer);
                    }
                }, 50);
                
                typingObserver.unobserve(p);
            }
        });
    }, { threshold: 0.1 });

    typingBalloons.forEach(p => {
        // Store original text
        p.setAttribute('data-text', p.textContent.trim());
        p.textContent = ''; // clear initially
        typingObserver.observe(p);
    });

    /**
     * 2.5 HTML-aware Typing Animation
     * Reveals characters but instantly appending HTML tags.
     */
    const htmlTypers = document.querySelectorAll('.typing-text-html');
    const htmlTypeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const fullHTML = el.getAttribute('data-html');
                if (!fullHTML) return;
                
                el.removeAttribute('data-html');
                el.innerHTML = '';
                
                let i = 0;
                let isTag = false;
                let textBuffer = '';

                const timer = setInterval(() => {
                    if (i < fullHTML.length) {
                        const char = fullHTML.charAt(i);
                        textBuffer += char;
                        
                        if (char === '<') isTag = true;
                        if (char === '>') isTag = false;

                        // If we are iterating over a tag, we don't render intermediate states
                        // Wait until the tag is fully assembled or we iterate a normal character
                        if (!isTag) {
                            el.innerHTML = textBuffer;
                        }
                        i++;
                    } else {
                        clearInterval(timer);
                    }
                }, 50);
                
                htmlTypeObserver.unobserve(el);
            }
        });
    }, { threshold: 0.1 });

    htmlTypers.forEach(el => htmlTypeObserver.observe(el));


    /**
     * 3. Hover Reveal Blob Cursor Effect
     */
    const revealContainers = document.querySelectorAll('.hover-reveal-container');
    
    revealContainers.forEach(container => {
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let currentX = mouseX;
        let currentY = mouseY;
        let isHovering = false;

        container.addEventListener('mousemove', (e) => {
            const rect = container.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
            isHovering = true;
        });

        container.addEventListener('mouseleave', () => {
            isHovering = false;
        });

        // Animation loop for slight lag / smooth interpolation
        const loop = () => {
            if (isHovering) {
                // Lerp towards target
                currentX += (mouseX - currentX) * 0.1;
                currentY += (mouseY - currentY) * 0.1;

                container.style.setProperty('--x', `${currentX}px`);
                container.style.setProperty('--y', `${currentY}px`);
                container.style.setProperty('--blob-size', '150px'); // Expand blob
            } else {
                container.style.setProperty('--blob-size', '0px'); // Hide blob
            }
            requestAnimationFrame(loop);
        };
        loop();
    });
});
