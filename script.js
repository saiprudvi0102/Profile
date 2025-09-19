// Page loading animation with Netflix-style fade in
window.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('loaded');
  
  // Initialize Netflix-style carousels
  initializeCarousels();
  
  // Initialize header scroll effects
  initializeHeaderEffects();
  
    // Initialize project detail manager (singleton)
    window.__projectDetailManager = new ProjectDetailManager();
  
    // Initialize Netflix hover previews
    new NetflixHoverManager();
    
    // Initialize accessibility features
    initializeAccessibility();
  
    // Certification viewers removed (simplified section)
});

// Netflix-style carousel functionality
function initializeCarousels() {
  const carousels = document.querySelectorAll('[data-track]');
  
  carousels.forEach(track => {
    const carouselName = track.dataset.track;
    const container = track.parentElement;
    const cards = track.querySelectorAll('.netflix-card');
    const prevBtn = document.querySelector(`[data-carousel="${carouselName}"][data-direction="prev"]`);
    const nextBtn = document.querySelector(`[data-carousel="${carouselName}"][data-direction="next"]`);
    
    let currentIndex = 0;
    const cardWidth = 320 + 16; // card width + gap
    const maxIndex = Math.max(0, cards.length - Math.floor(container.offsetWidth / cardWidth));
    
        function updateCarousel() {
            const translateX = -currentIndex * cardWidth;
            track.style.transform = `translateX(${translateX}px)`;
            // Disable/enable buttons
            if (prevBtn) prevBtn.disabled = currentIndex === 0;
            if (nextBtn) nextBtn.disabled = currentIndex >= maxIndex;
        }

        updateCarousel();

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentIndex = Math.max(0, currentIndex - 1);
                updateCarousel();
            });
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentIndex = Math.min(maxIndex, currentIndex + 1);
                updateCarousel();
            });
        }
    
        window.addEventListener('resize', () => {
            const newMax = Math.max(0, cards.length - Math.floor(container.offsetWidth / cardWidth));
            if (currentIndex > newMax) currentIndex = newMax;
            updateCarousel();
        });
    });
}
// Legacy modal close handlers removed; now encapsulated in ProjectDetailManager class
// Contact form
window.contactSubmit = function(e){ e.preventDefault(); const data = Object.fromEntries(new FormData(e.target).entries()); const body = encodeURIComponent(`${data.message}\n\nFrom: ${data.name} <${data.email}>`); window.location.href=`mailto:saiprudvi0102@gmail.com?subject=Portfolio Contact&body=${body}`; const status=document.getElementById('formStatus'); if(status) status.textContent='Opening mail client...'; };
// Resume PDF download with fallback (handles spaces in filename)
const resumeLink=document.getElementById('resumePdfLink');
if(resumeLink){
    const pdfPath = 'saiprudvi ela_Resume.pdf';
    const encodedPdfPath = encodeURI(pdfPath);
    resumeLink.href = encodedPdfPath; // set encoded path
    resumeLink.addEventListener('click', function(){
        console.log('Resume download attempted');
    });
    // (Optional) could add a HEAD request check here if needed
}

// Provide stub for header effects if original implementation was removed
function initializeHeaderEffects(){
    // Basic sticky header / scroll fade placeholder (safe no-op if styles absent)
    const header = document.querySelector('header');
    if(!header) return;
    window.addEventListener('scroll', () => {
        if(window.scrollY > 20) header.classList.add('scrolled'); else header.classList.remove('scrolled');
    });
}
// Netflix-style Hover Preview Manager
class NetflixHoverManager {
    constructor() {
        this.activePreview = null;
        this.hoverTimeout = null;
        this.init();
    }

    init() {
        this.createPreviewContainer();
        this.bindHoverEvents();
    }

    createPreviewContainer() {
        const container = document.createElement('div');
        container.className = 'netflix-preview-container';
        container.innerHTML = `
            <div class="netflix-preview-card">
                <div class="preview-image-container">
                    <img class="preview-image" src="" alt="">
                    <div class="preview-overlay">
                        <button class="preview-play-btn" type="button" aria-label="Preview">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M8 5v14l11-7z"/>
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="preview-content">
                    <h3 class="preview-title"></h3>
                    <p class="preview-description"></p>
                    <div class="preview-tags"></div>
                    <div class="preview-metrics"></div>
                </div>
            </div>`;
        document.body.appendChild(container);
        this.previewContainer = container;
        this.previewCard = container.querySelector('.netflix-preview-card');
    }

    bindHoverEvents() {
        document.addEventListener('mouseenter', (e) => {
            const card = e.target.closest('.netflix-card[data-project]');
            if (card) {
                this.showPreview(card);
            }
        }, true);

        document.addEventListener('mouseleave', (e) => {
            const card = e.target.closest('.netflix-card[data-project]');
            if (card) {
                this.hidePreview();
            }
        }, true);

        // Hide preview when clicking anywhere
        document.addEventListener('click', () => {
            this.hidePreview();
        });
    }

    showPreview(card) {
        if (this.hoverTimeout) {
            clearTimeout(this.hoverTimeout);
        }

        this.hoverTimeout = setTimeout(() => {
            const projectId = card.dataset.project;
            const projectData = this.getProjectData(projectId);
            
            if (projectData) {
                this.updatePreviewContent(projectData);
                this.positionPreview(card);
                this.previewContainer.classList.add('active');
                this.activePreview = card;
            }
        }, 500); // 500ms delay like Netflix
    }

    hidePreview() {
        if (this.hoverTimeout) {
            clearTimeout(this.hoverTimeout);
        }
        
        this.previewContainer.classList.remove('active');
        this.activePreview = null;
    }

    positionPreview(card) {
        const cardRect = card.getBoundingClientRect();
        const preview = this.previewCard;
        
        // Calculate position
        let left = cardRect.left + (cardRect.width / 2) - 200; // Center horizontally, 400px total width
        let top = cardRect.bottom + 10;
        
        // Adjust for screen boundaries
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        if (left < 20) left = 20;
        if (left + 400 > viewportWidth - 20) left = viewportWidth - 420;
        
        if (top + 300 > viewportHeight - 20) {
            top = cardRect.top - 310; // Show above the card
        }
        
        preview.style.left = `${left}px`;
        preview.style.top = `${top}px`;
    }

    updatePreviewContent(project) {
        const preview = this.previewCard;
        
        preview.querySelector('.preview-image').src = project.image;
        preview.querySelector('.preview-title').textContent = project.title;
        preview.querySelector('.preview-description').textContent = project.description;
        
        // Update tags
        const tagsContainer = preview.querySelector('.preview-tags');
        const technologies = project.technologies.slice(0, 3); // Show first 3 technologies
        tagsContainer.innerHTML = technologies.map(tech => 
            `<span class="preview-tag">${tech.name}</span>`
        ).join('');
        
        // Update metrics
        const metricsContainer = preview.querySelector('.preview-metrics');
        const topMetrics = project.metrics.slice(0, 2); // Show first 2 metrics
        metricsContainer.innerHTML = topMetrics.map(metric =>
            `<div class="preview-metric">
                <span class="metric-icon">${metric.icon}</span>
                <span class="metric-text">${metric.label}: ${metric.value}</span>
            </div>`
        ).join('');
    }

    getProjectData(projectId) {
        // Avoid creating infinite recursion; rely on global singleton pattern
        return window.__projectDetailManager ? window.__projectDetailManager.getProjectData(projectId) : null;
    }
}

// Project Detail System
class ProjectDetailManager {
    constructor() {
        this.init();
        this.lastFocusedElement = null;
        this.projectOrder = this.computeProjectOrder();
        this.currentProjectId = null;
        this.swipeData = null;
        window.addEventListener('hashchange', () => this.handleHashChange());
        window.addEventListener('load', () => {
            const hashId = location.hash.replace('#project-','');
            if(hashId && this.getProjectData(hashId)) {
                const card = document.querySelector(`.netflix-card[data-project="${hashId}"]`);
                this.showProjectDetail(hashId, card);
            }
        });
        // Live region for announcements
        const live = document.createElement('div');
        live.className = 'sr-only';
        live.setAttribute('role','status');
        live.setAttribute('aria-live','polite');
        document.body.appendChild(live);
        this.liveRegion = live;
    }

    init() {
        this.bindEvents();
        this.createDetailModal();
    }

    bindEvents() {
        // Handle project card clicks
        document.addEventListener('click', (e) => {
            const playBtn = e.target.closest('.play-btn');
            if (playBtn) {
                e.preventDefault();
                const card = playBtn.closest('.netflix-card');
                const projectId = card ? card.dataset.project : null;
                if (projectId && card) {
                    this.showProjectDetail(projectId, card);
                }
            }

            // Handle poster/card clicks (anywhere on card except buttons)
            const netflixCard = e.target.closest('.netflix-card');
            if (netflixCard && !e.target.closest('.play-btn') && !e.target.closest('.project-modal')) {
                e.preventDefault();
                const projectId = netflixCard.dataset.project;
                if (projectId) {
                    this.showProjectDetail(projectId, netflixCard);
                }
            }

            // Handle certification card clicks
            const certCard = e.target.closest('.cert-item');
            if (certCard && !e.target.closest('.project-modal')) {
                e.preventDefault();
                this.showCertificationDetail(certCard);
            }

            // Handle modal close
            if (e.target.classList.contains('project-modal-overlay') || 
                e.target.classList.contains('close-project-modal') ||
                e.target.closest('.close-project-modal')) {
                this.closeModal();
            }
        });

        // Handle keyboard navigation
        document.addEventListener('keydown', (e) => {
            // Close modal with Escape key
            if (e.key === 'Escape' && this.modal && this.modal.classList.contains('active')) {
                e.preventDefault();
                this.closeModal();
            }
            
            // Open modal with Enter key when focused on a card
            if (e.key === 'Enter' && document.activeElement) {
                const focusedCard = document.activeElement.closest('.netflix-card');
                const focusedCert = document.activeElement.closest('.cert-item');
                
                if (focusedCard) {
                    e.preventDefault();
                    const projectId = focusedCard.dataset.project;
                    if (projectId) {
                        this.showProjectDetail(projectId, focusedCard);
                    }
                } else if (focusedCert) {
                    e.preventDefault();
                    this.showCertificationDetail(focusedCert);
                }
            }
        });
    }

    createDetailModal() {
        // Local overlay positioned near clicked card
        const modal = document.createElement('div');
        modal.className = 'project-modal local';
        modal.setAttribute('aria-hidden','true');
        modal.setAttribute('role','dialog');
        modal.setAttribute('aria-modal','true');
        modal.setAttribute('aria-label','Project details');
        modal.innerHTML = `
            <div class="project-modal-overlay local-overlay">
                <div class="project-modal-shell">
                    <div class="project-modal-content">
                        <div class="project-nav-bar" style="position:absolute; top:12px; left:12px; display:flex; gap:.5rem; z-index:5;">
                            <button class="project-nav-btn prev" aria-label="Previous project" title="Previous (←)">◀</button>
                            <button class="project-nav-btn next" aria-label="Next project" title="Next (→)">▶</button>
                            <span class="project-progress" aria-live="off" style="padding:.35rem .6rem; font-size:.7rem; letter-spacing:.06em; background:rgba(255,255,255,.08); border:1px solid rgba(255,255,255,.15); border-radius:999px;">1 / 1</span>
                            <button class="project-copy-link" aria-label="Copy shareable link" title="Copy link" style="font-size:.75rem; padding:.35rem .6rem; border-radius:6px; border:1px solid rgba(255,255,255,.15); background:rgba(255,255,255,.08);">🔗</button>
                        </div>
                        <button class="close-project-modal" aria-label="Close">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                            </svg>
                        </button>
                        <div class="project-modal-body"></div>
                    </div>
                </div>
            </div>`;
        
        // Append to projects section instead of body
        const projectsSection = document.getElementById('projects');
        if (projectsSection) {
            projectsSection.appendChild(modal);
        } else {
            document.body.appendChild(modal); // fallback
        }
        
        this.modal = modal;
        this.bindNavigation();
        this.bindCopyAndHelp();
    }

    createCertificationModal() {
        // Modal for certifications section
        const modal = document.createElement('div');
        modal.className = 'project-modal local';
        modal.setAttribute('aria-hidden','true');
        modal.setAttribute('role','dialog');
        modal.setAttribute('aria-modal','true');
        modal.setAttribute('aria-label','Certification details');
        modal.innerHTML = `
            <div class="project-modal-overlay local-overlay">
                <div class="project-modal-shell">
                    <div class="project-modal-content">
                        <button class="close-project-modal" aria-label="Close">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                            </svg>
                        </button>
                        <div class="project-modal-body"></div>
                    </div>
                </div>
            </div>`;
        
        // Append to certifications section
        const certificationsSection = document.getElementById('certifications');
        if (certificationsSection) {
            certificationsSection.appendChild(modal);
        } else {
            document.body.appendChild(modal); // fallback
        }
        
        this.modal = modal;
        this.bindNavigation();
        this.bindCopyAndHelp();
    }

    showProjectDetail(projectId, cardElement) {
        const project = this.getProjectData(projectId);
        if (!project) return;

        this.lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        this.currentCardElement = cardElement; // Store reference for close animation

        const modalBody = this.modal.querySelector('.project-modal-body');
        // Crossfade if already open
        if(this.modal.classList.contains('active')){
            const oldContent = modalBody.firstElementChild;
            const fadeOut = oldContent;
            if(fadeOut){
                fadeOut.style.transition='opacity 180ms ease';
                fadeOut.style.opacity='0';
                setTimeout(()=>{ if(fadeOut && fadeOut.parentNode) fadeOut.remove(); },190);
            }
            const tempWrapper = document.createElement('div');
            tempWrapper.innerHTML = this.generateProjectDetailHTML(project);
            const newNode = tempWrapper.firstElementChild;
            newNode.style.opacity='0';
            modalBody.appendChild(newNode);
            requestAnimationFrame(()=>{ newNode.style.transition='opacity 260ms ease'; newNode.style.opacity='1'; });
        } else {
            modalBody.innerHTML = this.generateProjectDetailHTML(project);
        }
        
        // Position modal near clicked card
        this.positionModalNearCard(cardElement);
    this.currentProjectId = projectId;
    location.hash = `project-${projectId}`;
    this.preloadAdjacent(projectId);
    this.updateNavButtonStates();
    this.attachScrollParallax();
    this.announce(`Opened project ${project.title}`);
    this.updateProgress();
    this.bindCopyAndHelp();
    this.initLazySections();
        
        this.modal.classList.add('active');
        this.modal.setAttribute('aria-hidden','false');

        // Focus first interactive element inside modal for accessibility
        const focusable = this.getFocusableElements();
        if(focusable.length){ focusable[0].focus({preventScroll:true}); }
        this.enableFocusTrap();
    }

    showCertificationDetail(cardElement) {
        if (!cardElement) return;
        
        // Extract certification data from the card
        const certName = cardElement.querySelector('.cert-name')?.textContent || 'Certification';
        const certOrg = cardElement.querySelector('.cert-org')?.textContent || '';
        const certBadge = cardElement.querySelector('.cert-badge img')?.src || '';
        const certTags = Array.from(cardElement.querySelectorAll('.cert-tags span')).map(span => span.textContent);
        
        // If modal doesn't exist, create it in the certifications section
        if (!this.modal) {
            this.createCertificationModal();
        }
        
        this.lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        this.currentCardElement = cardElement;
        
        const modalBody = this.modal.querySelector('.project-modal-body');
        modalBody.innerHTML = this.generateCertificationDetailHTML({
            name: certName,
            organization: certOrg,
            badge: certBadge,
            tags: certTags
        });
        
        // Position modal in certifications section
        this.positionModalInCertifications(cardElement);
        
        this.modal.classList.add('active');
        this.modal.setAttribute('aria-hidden','false');
        document.body.style.overflow = 'hidden';
        
        // Focus management
        const focusable = this.getFocusableElements();
        if(focusable.length){ focusable[0].focus({preventScroll:true}); }
        this.enableFocusTrap();
        
        this.announce(`Opened certification ${certName}`);
    }

    positionModalNearCard(cardElement) {
        if (!cardElement) return;
        
        const cardRect = cardElement.getBoundingClientRect();
        const modalContent = this.modal.querySelector('.project-modal-content');
        const overlay = this.modal.querySelector('.project-modal-overlay');
        
        if (!modalContent) return;
        
        // Store originating card for focus return
        this.originatingCard = cardElement;
        
        // True full-screen positioning - fixed to viewport
        const modalWidth = window.innerWidth;
        const modalHeight = window.innerHeight;
        
        // Start modal at card position (absolute coordinates)
        modalContent.style.position = 'fixed';
        modalContent.style.left = `${cardRect.left}px`;
        modalContent.style.top = `${cardRect.top}px`;
        modalContent.style.width = `${cardRect.width}px`;
        modalContent.style.height = `${cardRect.height}px`;
        modalContent.style.transform = 'scale(1)';
        modalContent.style.opacity = '0';
        modalContent.style.zIndex = '9999';
        overlay.style.background = 'rgba(0,0,0,0)';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.right = '0';
        overlay.style.bottom = '0';
        overlay.style.zIndex = '9998';
        
        // Force reflow
        void modalContent.offsetWidth;
        
        // Animate to full-screen position
        const animationDuration = 600;
        modalContent.style.transition = `all ${animationDuration}ms cubic-bezier(.22,.61,.36,1)`;
        overlay.style.transition = `background ${animationDuration}ms ease`;
        
        requestAnimationFrame(() => {
            modalContent.style.left = '0px';
            modalContent.style.top = '0px';
            modalContent.style.width = `${modalWidth}px`;
            modalContent.style.height = `${modalHeight}px`;
            modalContent.style.maxHeight = `${modalHeight}px`;
            modalContent.style.opacity = '1';
            overlay.style.background = 'rgba(0,0,0,0.9)';
        });
        
        // Clean up transitions
        setTimeout(() => {
            modalContent.style.transition = '';
            overlay.style.transition = '';
        }, animationDuration + 50);
    }

    positionModalInCertifications(cardElement) {
        if (!cardElement) return;
        
        const cardRect = cardElement.getBoundingClientRect();
        const modalContent = this.modal.querySelector('.project-modal-content');
        const overlay = this.modal.querySelector('.project-modal-overlay');
        const certificationsSection = document.getElementById('certifications');
        
        if (!certificationsSection || !modalContent) return;
        
        // Get certifications section position for relative positioning
        const sectionRect = certificationsSection.getBoundingClientRect();
        
        // Calculate card position relative to certifications section
        const relativeCardLeft = cardRect.left - sectionRect.left;
        const relativeCardTop = cardRect.top - sectionRect.top;
        
        // Check if mobile device
        const isMobile = window.innerWidth <= 768;
        
        // Full-screen modal covering entire viewport width but positioned within certifications section
        const modalWidth = window.innerWidth;
        let modalHeight, finalTop;
        
        if (isMobile) {
            modalHeight = Math.max(sectionRect.height - 5, window.innerHeight * 0.8);
            finalTop = 2;
        } else {
            modalHeight = sectionRect.height - 10;
            finalTop = 5;
        }
        
        const finalLeft = -sectionRect.left; // Offset to reach left edge of viewport
        
        // Start modal at card position
        modalContent.style.position = 'absolute';
        modalContent.style.left = `${relativeCardLeft}px`;
        modalContent.style.top = `${relativeCardTop}px`;
        modalContent.style.width = `${cardRect.width}px`;
        modalContent.style.height = `${cardRect.height}px`;
        modalContent.style.transform = 'scale(1)';
        modalContent.style.opacity = '0';
        modalContent.style.zIndex = '1201';
        overlay.style.background = 'rgba(0,0,0,0)';
        
        // Force reflow
        void modalContent.offsetWidth;
        
        // Animate to full-screen position
        const animationDuration = isMobile ? 500 : 600;
        modalContent.style.transition = `all ${animationDuration}ms cubic-bezier(.22,.61,.36,1)`;
        overlay.style.transition = `background ${animationDuration}ms ease`;
        
        requestAnimationFrame(() => {
            modalContent.style.left = `${finalLeft}px`;
            modalContent.style.top = `${finalTop}px`;
            modalContent.style.width = `${modalWidth}px`;
            modalContent.style.height = `${modalHeight}px`;
            modalContent.style.maxHeight = `${modalHeight}px`;
            modalContent.style.opacity = '1';
            overlay.style.background = 'rgba(0,0,0,.85)';
        });
        
        // Clean up transitions
        setTimeout(() => {
            modalContent.style.transition = '';
            overlay.style.transition = '';
        }, animationDuration + 50);
    }

    generateCertificationDetailHTML(cert) {
        return `
        <div class="project-detail-page cert-detail-page">
            <div class="detail-header" style="text-align: center; padding: 2rem 1rem;">
                <div class="cert-badge-large" style="width: 120px; height: 120px; margin: 0 auto 1.5rem; background: rgba(255,255,255,.1); border-radius: 24px; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(8px);">
                    ${cert.badge ? `<img src="${cert.badge}" alt="${cert.name}" style="width: 80px; height: 80px; object-fit: contain;">` : '🏆'}
                </div>
                <h1 style="margin: 0 0 0.5rem; font-size: 2rem; font-weight: 700; color: var(--text-primary);">${cert.name}</h1>
                <p style="margin: 0 0 1rem; font-size: 1.1rem; color: var(--text-secondary); font-weight: 500;">${cert.organization}</p>
                <div class="cert-tags-large" style="display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: center;">
                    ${cert.tags.map(tag => `<span style="padding: 0.5rem 1rem; background: rgba(255,255,255,.15); border-radius: 999px; font-size: 0.9rem; font-weight: 500; color: var(--text-primary);">${tag}</span>`).join('')}
                </div>
            </div>
            
            <div class="detail-content" style="padding: 0 2rem 2rem;">
                <div class="detail-section">
                    <h2 style="margin: 0 0 1rem; font-size: 1.5rem; color: var(--text-primary);">About This Certification</h2>
                    <p style="color: var(--text-secondary); line-height: 1.6; margin-bottom: 1.5rem;">
                        This professional certification demonstrates expertise and proficiency in ${cert.name.toLowerCase()}. 
                        The certification covers essential skills and knowledge areas including ${cert.tags.slice(0, 3).join(', ')}.
                    </p>
                    
                    <div class="skills-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 1.5rem;">
                        ${cert.tags.map(skill => `
                            <div style="padding: 1rem; background: rgba(255,255,255,.05); border-radius: 12px; border: 1px solid rgba(255,255,255,.1);">
                                <h3 style="margin: 0 0 0.5rem; font-size: 1rem; color: var(--text-primary);">${skill}</h3>
                                <p style="margin: 0; font-size: 0.9rem; color: var(--text-secondary);">Proficient in ${skill.toLowerCase()} concepts and applications</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>`;
    }

    closeModal() {
        if (this.modal) {
            this.modal.classList.remove('active');
            document.body.style.overflow = '';
            
            // Animate close (shrink back to card position)
            const content = this.modal.querySelector('.project-modal-content');
            const overlay = this.modal.querySelector('.project-modal-overlay');
            
            // Use the stored originating card for animation and focus return
            const targetCard = this.originatingCard || this.currentCardElement;
            
            if(content && targetCard){
                const cardRect = targetCard.getBoundingClientRect();
                
                content.style.transition = 'all 400ms cubic-bezier(.4,.14,.3,1)';
                content.style.left = `${cardRect.left}px`;
                content.style.top = `${cardRect.top}px`;
                content.style.width = `${cardRect.width}px`;
                content.style.height = `${cardRect.height}px`;
                content.style.opacity = '0';
                content.style.transform = 'scale(0.9)';
            } else if(content) {
                content.style.transition = 'transform 350ms cubic-bezier(.4,.14,.3,1), opacity 300ms ease';
                content.style.transform = 'scale(.85)';
                content.style.opacity = '0';
            }
            
            if(overlay){
                overlay.style.transition = 'background 400ms ease';
                overlay.style.background = 'rgba(0,0,0,0)';
            }
            
            setTimeout(()=>{
                if(content){
                    content.style.transition='';
                    content.style.transform='';
                    content.style.opacity='';
                    content.style.position='';
                    content.style.left='';
                    content.style.top='';
                    content.style.width='';
                    content.style.height='';
                    content.style.maxHeight='';
                    content.style.zIndex='';
                }
            },450);

            // Return focus to originating card
            if(this.originatingCard && typeof this.originatingCard.focus === 'function') {
                this.originatingCard.focus({preventScroll:true});
            } else if(this.lastFocusedElement && typeof this.lastFocusedElement.focus === 'function') {
                this.lastFocusedElement.focus({preventScroll:true});
            }
            
            this.disableFocusTrap();
            this.modal.setAttribute('aria-hidden','true');
            if(location.hash === `#project-${this.currentProjectId}`){
                history.replaceState('', document.title, location.pathname + location.search);
            }
            this.currentProjectId = null;
            this.originatingCard = null; // Clear reference
        }
    }

    computeProjectOrder(){
        return Array.from(document.querySelectorAll('.netflix-card[data-project]')).map(c=>c.dataset.project);
    }
    bindNavigation(){
        const prev = this.modal.querySelector('.project-nav-btn.prev');
        const next = this.modal.querySelector('.project-nav-btn.next');
        if(prev) prev.addEventListener('click', ()=> this.navigate(-1));
        if(next) next.addEventListener('click', ()=> this.navigate(1));
        document.addEventListener('keydown', (e)=>{
            if(!this.modal.classList.contains('active')) return;
            if(e.key==='ArrowLeft'){ e.preventDefault(); this.navigate(-1); }
            if(e.key==='ArrowRight'){ e.preventDefault(); this.navigate(1); }
        });
        const overlay = this.modal.querySelector('.project-modal-overlay');
        if(overlay){
            overlay.addEventListener('touchstart', (e)=>{ if(e.touches.length===1){ this.swipeData = {x:e.touches[0].clientX, t:Date.now()}; } }, {passive:true});
            overlay.addEventListener('touchend', (e)=>{ if(!this.swipeData) return; const dx = e.changedTouches[0].clientX - this.swipeData.x; const dt = Date.now()-this.swipeData.t; if(Math.abs(dx)>60 && dt<500){ this.navigate(dx<0?1:-1); } this.swipeData=null; });
        }
    }
    navigate(direction){
        if(!this.currentProjectId) return; const order = this.projectOrder; const idx = order.indexOf(this.currentProjectId); if(idx===-1) return; const nextIdx = idx + direction; if(nextIdx<0 || nextIdx>=order.length) return; const nextId = order[nextIdx]; const card = document.querySelector(`.netflix-card[data-project="${nextId}"]`); this.showProjectDetail(nextId, card); }
    updateNavButtonStates(){ const prev = this.modal.querySelector('.project-nav-btn.prev'); const next = this.modal.querySelector('.project-nav-btn.next'); if(!prev||!next) return; const idx = this.projectOrder.indexOf(this.currentProjectId); prev.disabled = idx<=0; next.disabled = idx>=this.projectOrder.length-1; }
    updateProgress(){ const prog = this.modal.querySelector('.project-progress'); if(!prog || !this.currentProjectId) return; const idx = this.projectOrder.indexOf(this.currentProjectId); prog.textContent = `${idx+1} / ${this.projectOrder.length}`; }
    preloadAdjacent(id){ const idx = this.projectOrder.indexOf(id); [-1,1].forEach(d=>{ const t = this.projectOrder[idx+d]; if(t){ const data=this.getProjectData(t); if(data && data.image){ const img=new Image(); img.src=data.image; } } }); }
    handleHashChange(){ const wanted = location.hash.replace('#project-',''); if(!wanted){ if(this.modal.classList.contains('active')) this.closeModal(); return; } if(wanted===this.currentProjectId) return; if(!this.getProjectData(wanted)) return; const card=document.querySelector(`.netflix-card[data-project="${wanted}"]`); this.showProjectDetail(wanted, card); }
    attachScrollParallax(){ const body = this.modal.querySelector('.project-modal-body'); const content = this.modal.querySelector('.project-modal-content'); if(!body||!content) return; const handler=()=>{ const y=body.scrollTop; content.classList.toggle('scrolling', y>0); content.style.setProperty('--scroll', y); }; body.removeEventListener('scroll', this._parallaxHandler||(()=>{})); this._parallaxHandler=handler; body.addEventListener('scroll', handler, {passive:true}); }
    bindCopyAndHelp(){
        const copyBtn = this.modal.querySelector('.project-copy-link');
        if(copyBtn){
            copyBtn.addEventListener('click', ()=>{
                const url = location.origin + location.pathname + `#project-${this.currentProjectId}`;
                navigator.clipboard.writeText(url).then(()=>{ copyBtn.textContent='✅'; setTimeout(()=>{ copyBtn.textContent='🔗'; },1200); this.announce('Link copied'); });
            });
        }
    }
    announce(msg){ if(this.liveRegion){ this.liveRegion.textContent=''; requestAnimationFrame(()=>{ this.liveRegion.textContent=msg; }); } }
    initLazySections(){
        const container = this.modal.querySelector('.project-modal-body');
        if(!container || !('IntersectionObserver' in window)) return;
        const selectors = '.project-section, .project-metrics, .project-tech, .project-features, .project-architecture';
        const sections = container.querySelectorAll(selectors);
        sections.forEach(sec => { sec.style.opacity='0'; sec.style.transform='translateY(28px)'; sec.style.transition='opacity .65s ease, transform .65s cubic-bezier(.22,.61,.36,1)'; });
        const io = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if(entry.isIntersecting){
                    entry.target.style.opacity='1';
                    entry.target.style.transform='translateY(0)';
                    io.unobserve(entry.target);
                }
            });
        }, { root: container, threshold: 0.18 });
        sections.forEach(sec => io.observe(sec));
        this._lazyIO = io;
    }

    getFocusableElements(){
        return Array.from(this.modal.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'))
            .filter(el => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'));
    }

    handleKeyDown = (e) => {
        if(e.key === 'Tab'){
            const focusable = this.getFocusableElements();
            if(!focusable.length) return;
            const first = focusable[0];
            const last = focusable[focusable.length -1];
            if(e.shiftKey){
                if(document.activeElement === first){
                    e.preventDefault();
                    last.focus();
                }
            } else {
                if(document.activeElement === last){
                    e.preventDefault();
                    first.focus();
                }
            }
        }
    }

    enableFocusTrap(){
        document.addEventListener('keydown', this.handleKeyDown, true);
    }
    disableFocusTrap(){
        document.removeEventListener('keydown', this.handleKeyDown, true);
    }


    getProjectData(projectId) {
        const projects = {
            'mobilellm': {
                title: '🤖 MobileLLM-125M Fine-Tuning & Deployment',
                subtitle: 'Advanced Language Model Production System',
                image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80',
                description: 'Production-ready deployment of Facebook\'s MobileLLM-125M with comprehensive fine-tuning pipeline, quantized inference, and scalable API architecture.',
                longDescription: 'This project implements a complete MLOps pipeline for Facebook\'s MobileLLM-125M, featuring zero-shot reasoning capabilities on the HellaSwag dataset. The system combines parameter-efficient fine-tuning with production-grade deployment using FastAPI streaming, Docker orchestration, and automatic model scaling.',
                metrics: [
                    { label: 'Validation Accuracy', value: '62.8%', icon: '🎯' },
                    { label: 'Perplexity Score', value: '7.91', icon: '📊' },
                    { label: 'Inference Speed', value: '<100ms', icon: '⚡' },
                    { label: 'Model Size', value: '125M params', icon: '🧠' }
                ],
                technologies: [
                    { name: 'MobileLLM', category: 'Model' },
                    { name: 'PyTorch', category: 'Framework' },
                    { name: 'FastAPI', category: 'API' },
                    { name: 'Docker', category: 'Deployment' },
                    { name: 'CUDA', category: 'Acceleration' },
                    { name: 'HellaSwag', category: 'Dataset' }
                ],
                features: [
                    'Multi-GPU fine-tuning pipeline',
                    'Quantized inference optimization',
                    'Streaming SSE responses',
                    'Docker containerization',
                    'Automatic model scaling',
                    'Zero-shot reasoning capabilities'
                ],
                architecture: {
                    title: 'System Architecture',
                    description: 'Microservices architecture with FastAPI backend, Redis caching, and horizontal scaling.',
                    components: [
                        'FastAPI streaming endpoints',
                        'Multi-GPU training orchestration',
                        'Model quantization pipeline',
                        'Docker container orchestration',
                        'Automatic scaling logic'
                    ]
                },
                github: 'https://github.com/saiprudvi0102/MobileLLM125M',
                demo: null
            },
            'financial-risk': {
                title: '📈 GPU-Accelerated Financial Risk Analysis',
                subtitle: 'CUDA-Powered Monte Carlo Simulation & Portfolio Risk Assessment',
                image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
                description: 'Advanced financial risk assessment system leveraging NVIDIA CUDA for parallel Monte Carlo simulations, demonstrating significant performance improvements in covariance matrix calculations and Value at Risk (VaR) computation.',
                longDescription: 'This project explores GPU computing applications in financial analytics, focusing on accelerating covariance matrix computations for large financial datasets. The implementation compares traditional CPU-based methods with CUDA-powered GPU implementations, demonstrating how GPU acceleration becomes increasingly beneficial as dataset size grows. The system calculates Value at Risk (VaR) and provides comprehensive benchmarking across multiple dataset sizes.',
                metrics: [
                    { label: 'GPU Performance Gain', value: '1.57× @ 1M days', icon: '🚀' },
                    { label: 'Covariance Matrix Speed', value: '0.43s vs 0.75s CPU', icon: '⚡' },
                    { label: 'Dataset Scale', value: '1M+ trading days', icon: '📊' },
                    { label: 'Memory Optimization', value: 'CUDA Toolkit 11.0+', icon: '💾' }
                ],
                technologies: [
                    { name: 'NVIDIA CUDA', category: 'GPU Computing' },
                    { name: 'PyCUDA', category: 'Python CUDA Bindings' },
                    { name: 'NumPy', category: 'Numerical Computing' },
                    { name: 'Matplotlib', category: 'Data Visualization' },
                    { name: 'Python', category: 'Core Language' },
                    { name: 'Jupyter Notebooks', category: 'Development Environment' }
                ],
                features: [
                    'Monte Carlo simulation engine with GPU acceleration',
                    'Comparative CPU vs GPU performance benchmarking',
                    'Value at Risk (VaR) calculation for portfolio assessment',
                    'Covariance matrix computation optimization',
                    'Scalability testing across multiple dataset sizes',
                    'Financial risk metrics visualization and analysis',
                    'Synthetic financial data generation for testing',
                    'Memory-efficient CUDA kernel implementations'
                ],
                architecture: {
                    title: 'GPU-Accelerated Financial Computing Architecture',
                    description: 'CUDA-optimized parallel processing pipeline with comparative analysis framework for financial risk calculations.',
                    components: [
                        'CUDA kernel implementations for parallel matrix operations',
                        'PyCUDA Python bindings for GPU memory management',
                        'Monte Carlo simulation framework with GPU acceleration',
                        'Comparative benchmarking system (CPU vs GPU)',
                        'Financial dataset generation and preprocessing pipeline',
                        'Performance visualization and analysis tools'
                    ]
                },
                github: 'https://github.com/saiprudvi0102/Finance-Risk-Analysis-GPU',
                demo: null
            },
            'pcnn-shadow': {
                title: '🖼️ PCNN Shadow Removal Research',
                subtitle: 'Biologically-Inspired Neural Network for Advanced Image Processing',
                image: 'https://images.unsplash.com/photo-1574169208507-84376144848b?auto=format&fit=crop&w=1200&q=80',
                description: 'Advanced computer vision research utilizing Pulse Coupled Neural Networks (PCNNs) for intelligent shadow detection and removal, achieving state-of-the-art performance with biologically-inspired algorithms.',
                longDescription: 'This research project implements a novel approach to image shadow removal using Pulse Coupled Neural Networks (PCNNs), inspired by the visual cortex of small mammals. The system leverages dynamic connection strengths and adaptive thresholding to effectively detect and remove shadows while preserving image details and integrity. The modified PCNN algorithm demonstrates significant improvements over traditional shadow removal techniques through advanced segmentation and processing capabilities.',
                metrics: [
                    { label: 'Shadow Detection Accuracy', value: '94.2%', icon: '🎯' },
                    { label: 'Image Quality Index', value: '0.89', icon: '🖼️' },
                    { label: 'Processing Speed', value: '1.2 seconds', icon: '⚡' },
                    { label: 'Performance vs GMM', value: '+11.6% accuracy', icon: '�' }
                ],
                technologies: [
                    { name: 'TensorFlow', category: 'Neural Network Framework' },
                    { name: 'OpenCV', category: 'Computer Vision' },
                    { name: 'NumPy', category: 'Numerical Computing' },
                    { name: 'PCNN', category: 'Neural Network Architecture' },
                    { name: 'Python', category: 'Core Language' },
                    { name: 'Matplotlib', category: 'Visualization' }
                ],
                features: [
                    'Biologically-inspired Pulse Coupled Neural Network implementation',
                    'Dynamic connection strength adaptation for improved accuracy',
                    'Adaptive thresholding for varying shadow intensities',
                    'Preservation of original image details in non-shadow regions',
                    'Comparative analysis with traditional shadow removal techniques',
                    'GPU acceleration for efficient processing',
                    'Advanced segmentation algorithms for shadow detection',
                    'Research-grade evaluation metrics and benchmarking'
                ],
                architecture: {
                    title: 'PCNN Research Architecture',
                    description: 'Biologically-inspired neural network with feeding and linking inputs, dynamic thresholding, and adaptive connection strengths for image segmentation.',
                    components: [
                        'PCNN neuron implementation with feeding and linking fields',
                        'Dynamic connection strength adaptation mechanism',
                        'Adaptive threshold decay for varying shadow intensities',
                        'Shadow segmentation and detection algorithms',
                        'Image reconstruction and enhancement pipeline',
                        'Comparative evaluation framework with traditional methods'
                    ]
                },
                github: 'https://github.com/saiprudvi0102/PCNN-Shadow-Removal',
                demo: null
            },
            'iot-fpga': {
                title: '⚡ Enhanced IoT Anomaly Detection Using FPGA',
                subtitle: 'Hardware-Accelerated Real-Time Security System',
                image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
                description: 'Real-time anomaly detection system for IoT networks using FPGA hardware acceleration on PYNQ Z2 board, achieving microsecond detection speeds for network security applications.',
                longDescription: 'This project implements a cutting-edge real-time anomaly detection system for IoT networks using FPGA hardware acceleration. The system utilizes a PYNQ Z2 FPGA board to detect potentially malicious network traffic patterns within microseconds, demonstrating the significant benefits of hardware acceleration for time-critical security applications. The implementation processes the IoT-23 dataset with over 325 million records, featuring a two-stage process of GPU-based neural network training and FPGA-accelerated inference.',
                metrics: [
                    { label: 'Detection Speed', value: 'Microseconds', icon: '⚡' },
                    { label: 'Dataset Scale', value: '325M+ records', icon: '📊' },
                    { label: 'Feature Classes', value: '18 features', icon: '🔧' },
                    { label: 'Hardware Platform', value: 'PYNQ Z2 FPGA', icon: '💾' }
                ],
                technologies: [
                    { name: 'PYNQ Z2', category: 'FPGA Hardware' },
                    { name: 'Vivado Design Suite', category: 'FPGA Development' },
                    { name: 'VHDL', category: 'Hardware Description' },
                    { name: 'Python/PYNQ', category: 'Control Interface' },
                    { name: 'IoT-23 Dataset', category: 'Security Dataset' },
                    { name: 'AXI Interface', category: 'Data Pipeline' }
                ],
                features: [
                    'Real-time IoT network traffic anomaly detection',
                    'Hardware-accelerated neural network inference on FPGA',
                    'GPU-based neural network training pipeline',
                    'Python/PYNQ interface for data processing and FPGA control',
                    'Visual indicator system (LED) for immediate anomaly alerts',
                    'Microsecond detection speeds with hardware acceleration',
                    'IoT-23 dataset processing with 18 feature classification',
                    'AXI-based interface for high-speed data transfer'
                ],
                architecture: {
                    title: 'FPGA Hardware-Software Co-Design Architecture',
                    description: 'Two-stage system with GPU training and FPGA inference, featuring AXI interfaces and optimized data flow for real-time processing.',
                    components: [
                        'GPU-based neural network model development using IoT-23 dataset',
                        'FPGA-accelerated inference engine with hardware-optimized implementation',
                        'Input/output ports for clock, reset, data, and anomaly detection flags',
                        'AXI-based interface for high-speed data transfer',
                        'Python script integration for SD card data reading',
                        'Visual indicator system with LED alerts for anomaly detection'
                    ]
                },
                github: 'https://github.com/saiprudvi0102/AnomalyDetection',
                demo: null
            },
            'genai-clinical': {
                title: '🏥 GenAI Clinical Assistant',
                subtitle: 'LangChain-Powered Medical AI',
                image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=1200&q=80',
                description: 'Advanced clinical decision support system using LangChain orchestration with GPT-4 for medical documentation and patient care.',
                longDescription: 'Comprehensive medical AI assistant leveraging LangChain for complex reasoning workflows, medical documentation automation, and clinical decision support. The system processes thousands of medical records with high accuracy.',
                metrics: [
                    { label: 'Processing Volume', value: '10K+ records', icon: '📋' },
                    { label: 'Accuracy Rate', value: '94.5%', icon: '🎯' },
                    { label: 'Response Time', value: '<3 sec', icon: '⚡' },
                    { label: 'Medical Compliance', value: '99.8%', icon: '✅' }
                ],
                technologies: [
                    { name: 'LangChain', category: 'AI Orchestration' },
                    { name: 'OpenAI GPT-4', category: 'Language Model' },
                    { name: 'FastAPI', category: 'API Framework' },
                    { name: 'PostgreSQL', category: 'Database' },
                    { name: 'Docker', category: 'Deployment' },
                    { name: 'HIPAA', category: 'Compliance' }
                ],
                features: [
                    'Medical documentation automation',
                    'Clinical decision support',
                    'HIPAA-compliant processing',
                    'Multi-modal medical data',
                    'Real-time patient insights',
                    'Medical coding assistance'
                ],
                architecture: {
                    title: 'AI Pipeline Architecture',
                    description: 'LangChain orchestration with secure medical data processing and compliance.',
                    components: [
                        'LangChain workflow engine',
                        'GPT-4 integration layer',
                        'Medical data processing',
                        'HIPAA compliance layer',
                        'Clinical validation system'
                    ]
                },
                github: null,
                demo: null
            },
            'telecom-microservices': {
                title: '📡 Telecom Microservices Platform',
                subtitle: 'Enterprise-Scale Java Architecture',
                image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
                description: 'Large-scale microservices architecture for telecom operations handling millions of daily transactions with high availability.',
                longDescription: 'Enterprise telecom platform built with Spring Boot microservices, handling massive transaction volumes with Oracle/PostgreSQL integration, async processing, and comprehensive monitoring.',
                metrics: [
                    { label: 'Daily Transactions', value: '120K+', icon: '📊' },
                    { label: 'Microservices', value: '40+', icon: '🔧' },
                    { label: 'Incident Response', value: '38% faster', icon: '🚨' },
                    { label: 'Uptime', value: '99.9%', icon: '✅' }
                ],
                technologies: [
                    { name: 'Spring Boot', category: 'Framework' },
                    { name: 'Java', category: 'Core Language' },
                    { name: 'Oracle DB', category: 'Database' },
                    { name: 'PostgreSQL', category: 'Database' },
                    { name: 'JMS', category: 'Messaging' },
                    { name: 'AWS', category: 'Cloud Platform' }
                ],
                features: [
                    'Spring Boot microservices',
                    'Async message processing',
                    'Database optimization',
                    'AWS S3 lifecycle management',
                    'System health monitoring',
                    'Automated alert workflows'
                ],
                architecture: {
                    title: 'Microservices Architecture',
                    description: 'Distributed system with service mesh, API gateway, and comprehensive monitoring.',
                    components: [
                        'Spring Boot microservices',
                        'API Gateway routing',
                        'Database connection pooling',
                        'JMS message queues',
                        'AWS cloud integration'
                    ]
                },
                github: null,
                demo: null
            },
            'dormunity': {
                title: '🏫 DormUnity Super App',
                subtitle: 'Flutter Campus Life Platform',
                image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80',
                description: 'Comprehensive Flutter-based campus super app integrating ridesharing, accommodation, and social networking for student life.',
                longDescription: 'Revolutionary campus life platform built with Flutter, featuring three core modules: ridesharing, accommodation management, and social networking. Uses Provider/BLoC for state management and Firebase for real-time synchronization.',
                metrics: [
                    { label: 'Active Users', value: '2.5K+', icon: '👥' },
                    { label: 'Ride Requests', value: '15K+', icon: '🚗' },
                    { label: 'App Rating', value: '4.7/5', icon: '⭐' },
                    { label: 'Performance Score', value: '95', icon: '📱' }
                ],
                technologies: [
                    { name: 'Flutter', category: 'Mobile Framework' },
                    { name: 'Firebase', category: 'Backend' },
                    { name: 'Provider/BLoC', category: 'State Management' },
                    { name: 'Google Maps', category: 'Location Services' },
                    { name: 'Push Notifications', category: 'Communication' },
                    { name: 'Real-time Chat', category: 'Messaging' }
                ],
                features: [
                    'Ridesharing coordination',
                    'Accommodation finder',
                    'Social networking',
                    'Real-time chat system',
                    'Push notifications',
                    'Location-based services'
                ],
                architecture: {
                    title: 'Mobile App Architecture',
                    description: 'Modular Flutter architecture with Firebase backend and real-time synchronization.',
                    components: [
                        'Flutter modular architecture',
                        'Provider/BLoC state management',
                        'Firebase real-time database',
                        'Google Maps integration',
                        'Push notification system'
                    ]
                },
                github: 'https://github.com/saiprudvi0102/Profile',
                demo: 'https://play.google.com/store/apps/details?id=com.anonymous.studentnetworkapp'
            },
            'stylestitch': {
                title: '👗 StyleStitch Fashion Platform',
                subtitle: 'AI-Powered Fashion Recommendation',
                image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
                description: 'Flutter-based fashion e-commerce platform with AI-powered style recommendations and social shopping features.',
                longDescription: 'Modern fashion platform combining e-commerce with social networking, featuring AI-powered style recommendations, virtual try-on capabilities, and community-driven fashion discovery.',
                metrics: [
                    { label: 'Recommendation Accuracy', value: '87%', icon: '🎯' },
                    { label: 'User Engagement', value: '45 min avg', icon: '📱' },
                    { label: 'Conversion Rate', value: '12.3%', icon: '💰' },
                    { label: 'Fashion Items', value: '50K+', icon: '👗' }
                ],
                technologies: [
                    { name: 'Flutter', category: 'Mobile Framework' },
                    { name: 'Machine Learning', category: 'AI Recommendations' },
                    { name: 'Firebase', category: 'Backend' },
                    { name: 'Computer Vision', category: 'Image Processing' },
                    { name: 'Payment Integration', category: 'Commerce' },
                    { name: 'Social Features', category: 'Community' }
                ],
                features: [
                    'AI style recommendations',
                    'Virtual try-on technology',
                    'Social fashion feed',
                    'Secure payment processing',
                    'Inventory management',
                    'User-generated content'
                ],
                architecture: {
                    title: 'Fashion Platform Architecture',
                    description: 'AI-driven recommendation engine with social features and e-commerce integration.',
                    components: [
                        'Flutter mobile application',
                        'AI recommendation engine',
                        'Firebase cloud functions',
                        'Payment gateway integration',
                        'Social media features'
                    ]
                },
                github: 'https://github.com/saiprudvi0102/Profile',
                demo: null
            }
        };

        return projects[projectId];
    }

    generateProjectDetailHTML(project) {
        return `
            <div class="project-detail">
                <div class="project-hero">
                    <img src="${project.image}" alt="${project.title}" class="project-hero-image">
                    <div class="project-hero-overlay">
                        <div class="project-hero-content">
                            <h1 class="project-title">${project.title}</h1>
                            <p class="project-subtitle">${project.subtitle}</p>
                            <div class="project-actions">
                                ${project.github ? `<a href="${project.github}" target="_blank" class="btn btn-primary">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                                    </svg>
                                    View Code
                                </a>` : ''}
                                ${project.demo ? `<a href="${project.demo}" target="_blank" class="btn btn-secondary">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M8 5v14l11-7z"/>
                                    </svg>
                                    Live Demo
                                </a>` : ''}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="project-content">
                    <div class="project-section">
                        <h3>Project Overview</h3>
                        <p class="project-description">${project.longDescription}</p>
                    </div>

                    <div class="project-metrics">
                        <h3>Key Metrics & Performance</h3>
                        <div class="metrics-grid">
                            ${project.metrics.map(metric => `
                                <div class="metric-card">
                                    <div class="metric-icon">${metric.icon}</div>
                                    <div class="metric-content">
                                        <div class="metric-value">${metric.value}</div>
                                        <div class="metric-label">${metric.label}</div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="project-tech">
                        <h3>Technologies & Tools</h3>
                        <div class="tech-grid">
                            ${project.technologies.map(tech => `
                                <div class="tech-item">
                                    <span class="tech-name">${tech.name}</span>
                                    <span class="tech-category">${tech.category}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="project-features">
                        <h3>Key Features</h3>
                        <div class="features-list">
                            ${project.features.map(feature => `
                                <div class="feature-item">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="feature-icon">
                                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                                    </svg>
                                    ${feature}
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="project-architecture">
                        <h3>${project.architecture.title}</h3>
                        <p class="architecture-description">${project.architecture.description}</p>
                        <div class="architecture-components">
                            ${project.architecture.components.map(component => `
                                <div class="component-item">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                    ${component}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

// Initialize accessibility features for cards
function initializeAccessibility() {
    // Make all Netflix cards focusable
    const netflixCards = document.querySelectorAll('.netflix-card');
    netflixCards.forEach(card => {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `Open project ${card.querySelector('.netflix-card-title')?.textContent || 'details'}`);
    });
    
    // Make certification cards focusable
    const certCards = document.querySelectorAll('.cert-item');
    certCards.forEach(card => {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `Open certification ${card.querySelector('h3')?.textContent || 'details'}`);
    });
}
// Removed certification modal functionality & data (simplified static grid now used)

