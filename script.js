// Page loading animation with Netflix-style fade in
window.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('loaded');
  
  // Initialize Netflix-style carousels
  initializeCarousels();
  
  // Initialize header scroll effects
  initializeHeaderEffects();
  
  // Initialize project detail manager
  new ProjectDetailManager();
  
  // Initialize Netflix hover previews
  new NetflixHoverManager();
  
  // Initialize certification viewers
  initializeCertificationViewers();
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
      
      // Update button states
      if (prevBtn) prevBtn.disabled = currentIndex === 0;
      if (nextBtn) nextBtn.disabled = currentIndex >= maxIndex;
    }
    
    function nextSlide() {
      if (currentIndex < maxIndex) {
        currentIndex++;
        updateCarousel();
      }
    }
    
    function prevSlide() {
      if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
      }
    }
    
    // Add button event listeners
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    
    // Touch/swipe support for mobile
    let startX = 0;
    let isDragging = false;
    
    track.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
    });
    
    track.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      e.preventDefault();
    });
    
    track.addEventListener('touchend', (e) => {
      if (!isDragging) return;
      
      const endX = e.changedTouches[0].clientX;
      const diffX = startX - endX;
      
      if (Math.abs(diffX) > 50) { // Minimum swipe distance
        if (diffX > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
      
      isDragging = false;
    });
    
    // Initialize carousel
    updateCarousel();
    
    // Update on window resize
    window.addEventListener('resize', () => {
      const newMaxIndex = Math.max(0, cards.length - Math.floor(container.offsetWidth / cardWidth));
      if (currentIndex > newMaxIndex) {
        currentIndex = newMaxIndex;
      }
      updateCarousel();
    });
  });
}

// Netflix-style header scroll effects
function initializeHeaderEffects() {
  const header = document.querySelector('.site-header');
  let lastScrollY = window.scrollY;
  
  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Hide header on scroll down, show on scroll up
    if (currentScrollY > lastScrollY && currentScrollY > 200) {
      header.style.transform = 'translateY(-100%)';
    } else {
      header.style.transform = 'translateY(0)';
    }
    
    lastScrollY = currentScrollY;
  });
}

// Performance optimization - lazy load images that aren't already lazy
document.addEventListener('DOMContentLoaded', () => {
  const images = document.querySelectorAll('img:not([loading])');
  images.forEach(img => {
    if (!img.hasAttribute('loading')) {
      img.setAttribute('loading', 'lazy');
    }
  });
});

// Mobile menu toggle
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
if (navToggle) {
  navToggle.addEventListener('click', () => { nav.classList.toggle('open'); navToggle.classList.toggle('open'); });
  document.addEventListener('click', e => { if (!nav.contains(e.target) && e.target !== navToggle) nav.classList.remove('open'); });
}
// Year
const yearEl = document.getElementById('year'); if (yearEl) yearEl.textContent = new Date().getFullYear();
// Typing effect
document.querySelectorAll('.typing').forEach(el => { const full = el.dataset.text || el.textContent.trim(); el.textContent=''; let i=0; const speed=70; const type=()=>{ if(i<full.length){ el.innerHTML=full.slice(0,i+1); i++; requestAnimationFrame(()=>setTimeout(type,speed)); } else { el.classList.remove('typing'); } }; setTimeout(type,400); });
// Reveal on scroll
const observer = new IntersectionObserver(entries => { entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('visible'); observer.unobserve(e.target);} }); }, { threshold:0.15 });
document.querySelectorAll('.project-card, .reveal, .tl-item').forEach(el=>observer.observe(el));
// Keyboard toggle for project-card expansion
document.querySelectorAll('.project-card').forEach(card=>{
  card.setAttribute('tabindex', card.getAttribute('tabindex') || '0');
  card.addEventListener('keydown', e=>{
    if(e.key==='Enter' || e.key===' '){
      e.preventDefault();
      openProjectModal(card);
    }
    if(e.key==='Escape' && card.classList.contains('expanded')){ card.classList.remove('expanded'); }
  });
  card.addEventListener('click', e=>{
    // Avoid triggering when clicking links inside
    if(!card.closest('.project-modal')) openProjectModal(card);
  });
});
// Modal logic
const modalOverlay=document.getElementById('modalOverlay');
const modal=document.getElementById('projectModal');
const closeBtn=document.getElementById('modalClose');
function openProjectModal(card){
  if(!modal) return;
  const img=card.querySelector('img');
  const title=card.querySelector('h3');
  const desc=card.querySelector('p');
  const tags=[...card.querySelectorAll('.tags span')].map(s=>s.textContent.trim());
  const extra=card.querySelector('.card-extra');
  document.getElementById('modalImage').src=img ? img.src : '';
  document.getElementById('modalTitle').textContent=title?title.textContent:'';
  document.getElementById('modalDesc').textContent=desc?desc.textContent:'';
  const tagRoot=document.getElementById('modalTags'); tagRoot.innerHTML='';
  tags.forEach(t=>{ const span=document.createElement('span'); span.textContent=t; tagRoot.appendChild(span); });
  const extraRoot=document.getElementById('modalExtra'); extraRoot.innerHTML='';
  if(extra){
    const clone=extra.cloneNode(true); clone.classList.remove('card-extra'); extraRoot.appendChild(clone); }
  modalOverlay.classList.add('active');
  modal.classList.add('active');
  document.body.classList.add('no-scroll');
  modal.setAttribute('aria-hidden','false');
  modalOverlay.setAttribute('aria-hidden','false');
  closeBtn.focus();
}
function closeProjectModal(){
  modalOverlay.classList.remove('active');
  modal.classList.remove('active');
  document.body.classList.remove('no-scroll');
  modal.setAttribute('aria-hidden','true');
  modalOverlay.setAttribute('aria-hidden','true');
}
if(closeBtn){ closeBtn.addEventListener('click',closeProjectModal); }
if(modalOverlay){ modalOverlay.addEventListener('click',closeProjectModal); }
document.addEventListener('keydown',e=>{ if(e.key==='Escape' && modal.classList.contains('active')) closeProjectModal(); });
// Contact form
window.contactSubmit = function(e){ e.preventDefault(); const data = Object.fromEntries(new FormData(e.target).entries()); const body = encodeURIComponent(`${data.message}\n\nFrom: ${data.name} <${data.email}>`); window.location.href=`mailto:saiprudvi0102@gmail.com?subject=Portfolio Contact&body=${body}`; const status=document.getElementById('formStatus'); if(status) status.textContent='Opening mail client...'; };
// Resume PDF download with fallback (handles spaces in filename)
const resumeLink=document.getElementById('resumePdfLink');
if(resumeLink){
  const pdfPath = 'saiprudvi ela_Resume.pdf';
  const encodedPdfPath = encodeURI(pdfPath);
  // ensure href uses encoded path for web
  resumeLink.href = encodedPdfPath;
  // For GitHub Pages, we'll check if file exists and provide better feedback
  resumeLink.addEventListener('click', function(e) {
    // Track download attempt
    console.log('Resume download attempted');
    // Optional: Add analytics tracking here
  });
  
  // Simple existence check - if fails, provide alternative
  fetch(encodedPdfPath,{method:'HEAD'})
    .then(r=>{ 
      if(!r.ok){ 
        resumeLink.textContent='View Resume Online'; 
        resumeLink.href = 'resume.html';
        resumeLink.removeAttribute('download');
        resumeLink.title = 'PDF not available - view online version';
      } 
    })
    .catch(()=>{ 
      resumeLink.textContent='View Resume Online'; 
      resumeLink.href = 'resume.html';
      resumeLink.removeAttribute('download');
      resumeLink.title = 'View resume in web format';
    });
}
// Smooth anchor fallback
document.querySelectorAll('a[href^="#"]').forEach(a=>{ a.addEventListener('click',e=>{ const id=a.getAttribute('href').slice(1); const t=document.getElementById(id); if(t){ e.preventDefault(); t.scrollIntoView({behavior:'smooth'});} }); });

// Scroll to top button functionality
const scrollToTopBtn = document.getElementById('scrollToTop');
if (scrollToTopBtn) {
  // Show/hide scroll to top button based on scroll position
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      scrollToTopBtn.classList.add('visible');
    } else {
      scrollToTopBtn.classList.remove('visible');
    }
  });

  // Scroll to top when clicked
  scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// Screenshot Modal functionality
document.addEventListener('DOMContentLoaded', function() {
  const screenshotItems = document.querySelectorAll('.screenshot-item');
  const screenshotOverlay = document.getElementById('screenshotOverlay');
  const screenshotModal = document.getElementById('screenshotModal');
  const screenshotImage = document.getElementById('screenshotImage');
  const screenshotCaption = document.getElementById('screenshotCaption');
  const screenshotClose = document.getElementById('screenshotClose');

  function openScreenshotModal(item) {
    if (!screenshotOverlay) return;
    
    const img = item.querySelector('img');
    const label = item.querySelector('.screenshot-label');
    
    if (img) {
      screenshotImage.src = img.src;
      screenshotImage.alt = img.alt;
      screenshotCaption.textContent = label ? label.textContent : img.alt;
      
      screenshotOverlay.classList.add('active');
      screenshotModal.classList.add('active');
      document.body.classList.add('no-scroll');
    }
  }

  function closeScreenshotModal() {
    if (screenshotOverlay) {
      screenshotOverlay.classList.remove('active');
      screenshotModal.classList.remove('active');
      document.body.classList.remove('no-scroll');
    }
  }

  // Add click listeners to screenshot items
  screenshotItems.forEach(item => {
    item.addEventListener('click', () => openScreenshotModal(item));
    
    // Add keyboard support
    item.setAttribute('tabindex', '0');
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openScreenshotModal(item);
      }
    });
  });

  // Close modal listeners
  if (screenshotClose) {
    screenshotClose.addEventListener('click', closeScreenshotModal);
  }
  
  if (screenshotOverlay) {
    screenshotOverlay.addEventListener('click', (e) => {
      if (e.target === screenshotOverlay) {
        closeScreenshotModal();
      }
    });
  }

  // Escape key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && screenshotOverlay && screenshotOverlay.classList.contains('active')) {
      closeScreenshotModal();
    }
  });
});

// Premium header scroll effect across all pages
(function(){
  const onScroll = () => {
    if (typeof document !== 'undefined') {
      document.body.classList.toggle('scrolled', window.scrollY > 8);
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

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
                        <button class="preview-play-btn">
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
            </div>
        `;
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
        // This will use the same data source as ProjectDetailManager
        const manager = new ProjectDetailManager();
        return manager.getProjectData(projectId);
    }
}

// Project Detail System
class ProjectDetailManager {
    constructor() {
        this.init();
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

            // Handle certification card clicks
            const certViewBtn = e.target.closest('.cert-view-btn');
            if (certViewBtn) {
                e.preventDefault();
                const card = certViewBtn.closest('.netflix-card');
                const certId = card ? card.dataset.certification : null;
                if (certId && card) {
                    this.showCertificationDetail(certId, card);
                }
            }

            // Handle modal close
            if (e.target.classList.contains('project-modal-overlay') || 
                e.target.classList.contains('close-project-modal') ||
                e.target.closest('.close-project-modal')) {
                this.closeModal();
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal && this.modal.classList.contains('active')) {
                this.closeModal();
            }
        });
    }

    createDetailModal() {
        const modal = document.createElement('div');
        modal.className = 'project-modal';
        modal.innerHTML = `
            <div class="project-modal-overlay">
                <div class="project-modal-content">
                    <button class="close-project-modal" aria-label="Close">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                        </svg>
                    </button>
                    <div class="project-modal-body">
                        <!-- Content will be inserted here -->
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        this.modal = modal;
    }

    showProjectDetail(projectId, cardElement) {
        const project = this.getProjectData(projectId);
        if (!project) return;

        const modalBody = this.modal.querySelector('.project-modal-body');
        modalBody.innerHTML = this.generateProjectDetailHTML(project);
        
        // Position modal relative to the clicked card
        this.positionModalRelativeToCard(cardElement);
        
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    positionModalRelativeToCard(cardElement) {
        if (!cardElement) return;
        
        const cardRect = cardElement.getBoundingClientRect();
        const modalContent = this.modal.querySelector('.project-modal-content');
        
        // Add positioned class for custom positioning
        modalContent.classList.add('positioned');
        
        // Reset any previous positioning
        modalContent.style.position = 'fixed';
        modalContent.style.transform = 'none';
        modalContent.style.animation = 'none';
        
        // Calculate optimal position
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const modalWidth = Math.min(viewportWidth * 0.9, 900); // Max 900px or 90% viewport
        const modalHeight = Math.min(viewportHeight * 0.9, 700); // Max 700px or 90% viewport
        
        // Try to position near the card but ensure it's fully visible
        let left = cardRect.left + (cardRect.width / 2) - (modalWidth / 2);
        let top = cardRect.bottom + 20;
        
        // Adjust horizontal position if needed
        if (left < 20) left = 20;
        if (left + modalWidth > viewportWidth - 20) left = viewportWidth - modalWidth - 20;
        
        // Adjust vertical position if needed
        if (top + modalHeight > viewportHeight - 20) {
            top = cardRect.top - modalHeight - 20;
            // If still doesn't fit, center vertically
            if (top < 20) {
                top = (viewportHeight - modalHeight) / 2;
            }
        }
        
        // Apply positioning
        modalContent.style.left = `${left}px`;
        modalContent.style.top = `${top}px`;
        modalContent.style.width = `${modalWidth}px`;
        modalContent.style.maxHeight = `${modalHeight}px`;
        modalContent.style.margin = '0';
        
        // Add custom animation from the card position
        const initialLeft = cardRect.left + (cardRect.width / 2) - (modalWidth / 2);
        const initialTop = cardRect.top + (cardRect.height / 2) - (modalHeight / 2);
        
        modalContent.style.transformOrigin = 'center center';
        modalContent.style.animation = `modalSlideFromCard 0.4s cubic-bezier(0.165, 0.84, 0.44, 1) forwards`;
        
        // Create dynamic keyframes for this specific animation
        const animationName = `modalSlideFromCard_${Date.now()}`;
        const keyframes = `
            @keyframes ${animationName} {
                0% {
                    opacity: 0;
                    transform: scale(0.3) translate(${initialLeft - left}px, ${initialTop - top}px);
                }
                100% {
                    opacity: 1;
                    transform: scale(1) translate(0, 0);
                }
            }
        `;
        
        // Inject the keyframes
        const style = document.createElement('style');
        style.textContent = keyframes;
        document.head.appendChild(style);
        modalContent.style.animation = `${animationName} 0.4s cubic-bezier(0.165, 0.84, 0.44, 1) forwards`;
        
        // Clean up the style after animation
        setTimeout(() => {
            if (style.parentNode) {
                style.parentNode.removeChild(style);
            }
        }, 500);
    }

    showCertificationDetail(certId, cardElement) {
        const certification = this.getCertificationData(certId);
        if (!certification) return;

        const modalBody = this.modal.querySelector('.project-modal-body');
        modalBody.innerHTML = this.generateCertificationDetailHTML(certification);
        
        // Position modal relative to the clicked card
        this.positionModalRelativeToCard(cardElement);
        
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        if (this.modal) {
            this.modal.classList.remove('active');
            document.body.style.overflow = '';
            
            // Reset modal positioning
            const modalContent = this.modal.querySelector('.project-modal-content');
            if (modalContent) {
                modalContent.classList.remove('positioned');
                modalContent.style.position = '';
                modalContent.style.left = '';
                modalContent.style.top = '';
                modalContent.style.width = '';
                modalContent.style.maxHeight = '';
                modalContent.style.margin = '';
                modalContent.style.animation = '';
                modalContent.style.transform = '';
                modalContent.style.transformOrigin = '';
            }
        }
    }

    getCertificationData(certId) {
        const certifications = {
            'aws-developer': {
                title: 'AWS Certified Developer – Associate',
                provider: 'Amazon Web Services',
                logo: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg',
                description: 'Validates technical expertise in developing and maintaining AWS cloud applications.',
                background: 'linear-gradient(135deg, #232F3E, #0b1220)',
                skills: ['Lambda', 'S3', 'API Gateway', 'DynamoDB', 'CloudFormation', 'Elastic Beanstalk'],
                competencies: [
                    'Developing and debugging cloud applications',
                    'Using AWS SDKs and CLI',
                    'Writing code for serverless applications',
                    'Understanding of core AWS services'
                ],
                validationDetails: {
                    examCode: 'DVA-C02',
                    duration: '130 minutes',
                    format: 'Multiple choice and multiple response',
                    passingScore: '720/1000'
                }
            },
            'gcp-ai': {
                title: 'Introduction to Generative AI',
                provider: 'Google Cloud',
                logo: 'https://upload.wikimedia.org/wikipedia/commons/5/51/Google_Cloud_logo.svg',
                description: 'Foundational course covering generative AI concepts and applications.',
                background: 'linear-gradient(135deg, #1a73e8, #1557b0)',
                skills: ['Generative AI', 'Diffusion Models', 'Use Cases', 'AI Ethics'],
                competencies: [
                    'Understanding generative AI fundamentals',
                    'Knowledge of diffusion models',
                    'Practical AI applications',
                    'Ethical AI considerations'
                ],
                validationDetails: {
                    courseType: 'Self-paced learning',
                    duration: '45 minutes',
                    format: 'Interactive modules',
                    completion: 'Badge earned'
                }
            }
        };

        return certifications[certId];
    }

    generateCertificationDetailHTML(certification) {
        return `
            <div class="certification-detail">
                <div class="cert-hero" style="background: ${certification.background}">
                    <div class="cert-hero-content">
                        <img class="cert-hero-logo" src="${certification.logo}" alt="${certification.provider}" />
                        <div class="cert-hero-text">
                            <h1 class="cert-title">${certification.title}</h1>
                            <p class="cert-provider">${certification.provider}</p>
                            <p class="cert-description">${certification.description}</p>
                        </div>
                    </div>
                </div>

                <div class="cert-content">
                    <div class="cert-section">
                        <h3>🎯 Key Skills & Technologies</h3>
                        <div class="cert-skills-grid">
                            ${certification.skills.map(skill => 
                                `<div class="cert-skill-tag">${skill}</div>`
                            ).join('')}
                        </div>
                    </div>

                    <div class="cert-section">
                        <h3>📋 Core Competencies</h3>
                        <ul class="cert-competencies">
                            ${certification.competencies.map(comp => 
                                `<li class="cert-competency">${comp}</li>`
                            ).join('')}
                        </ul>
                    </div>

                    <div class="cert-section">
                        <h3>✅ Validation Details</h3>
                        <div class="cert-validation-grid">
                            ${Object.entries(certification.validationDetails).map(([key, value]) => 
                                `<div class="cert-validation-item">
                                    <span class="validation-label">${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</span>
                                    <span class="validation-value">${value}</span>
                                </div>`
                            ).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
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

function openProjectDetail(projectId) {
    closeCertificationModal();
    // Trigger project detail modal
    const projectDetailManager = new ProjectDetailManager();
    projectDetailManager.showProjectDetail(projectId);
}

// Certification detail functionality
function initializeCertificationViewers() {
    const certViewBtns = document.querySelectorAll('.cert-view-btn');
    
    certViewBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const certCard = btn.closest('[data-certification]');
            const certId = certCard.dataset.certification;
            showCertificationDetail(certId);
        });
    });
}

function showCertificationDetail(certId) {
    const certData = getCertificationData(certId);
    if (!certData) return;
    
    // Create modal HTML
    const modalHTML = `
        <div class="project-modal active" id="certModal">
            <div class="modal-overlay" onclick="closeCertificationModal()"></div>
            <div class="modal-content">
                <button class="modal-close" onclick="closeCertificationModal()" aria-label="Close">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                </button>
                
                <div class="modal-header">
                    <div class="cert-header-content" style="${certData.gradient}">
                        <img src="${certData.logo}" alt="${certData.organization}" class="cert-modal-logo" />
                        <div class="cert-header-text">
                            <h1 class="modal-title">${certData.title}</h1>
                            <p class="modal-subtitle">${certData.organization}</p>
                            <div class="cert-badge">
                                <span class="cert-status">✓ Certified</span>
                                <span class="cert-date">${certData.date}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="modal-body">
                    <div class="cert-description">
                        <h3>About This Certification</h3>
                        <p>${certData.description}</p>
                    </div>
                    
                    <div class="cert-skills-section">
                        <h3>Skills & Technologies</h3>
                        <div class="skills-grid">
                            ${certData.skills.map(skill => `
                                <div class="skill-badge">
                                    <span class="skill-icon">${skill.icon}</span>
                                    <span class="skill-name">${skill.name}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    ${certData.projects ? `
                        <div class="cert-projects">
                            <h3>Related Projects</h3>
                            <div class="project-links">
                                ${certData.projects.map(project => `
                                    <a href="#" class="project-link" onclick="openProjectDetail('${project.id}')">
                                        <span class="project-icon">${project.icon}</span>
                                        <span class="project-name">${project.name}</span>
                                    </a>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                    
                    ${certData.credentialUrl ? `
                        <div class="cert-actions">
                            <a href="${certData.credentialUrl}" target="_blank" class="credential-btn">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
                                </svg>
                                View Credential
                            </a>
                        </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.body.style.overflow = 'hidden';
}

function closeCertificationModal() {
    const modal = document.getElementById('certModal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
    }
}

function getCertificationData(certId) {
    const certifications = {
        'aws-developer': {
            title: 'AWS Certified Developer – Associate',
            organization: 'Amazon Web Services',
            date: '2024',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg',
            gradient: 'background: linear-gradient(135deg, #232F3E, #0b1220); color: white;',
            description: 'Validates technical expertise in developing and maintaining applications on the AWS platform. Demonstrates proficiency in core AWS services, architecture best practices, and security implementation.',
            skills: [
                { name: 'AWS Lambda', icon: '⚡' },
                { name: 'Amazon S3', icon: '🗄️' },
                { name: 'API Gateway', icon: '🌐' },
                { name: 'DynamoDB', icon: '📊' },
                { name: 'CloudFormation', icon: '🏗️' },
                { name: 'IAM', icon: '🔐' }
            ],
            projects: [
                { id: 'mobilellm', name: 'MobileLLM Deployment', icon: '🚀' }
            ],
            credentialUrl: null
        },
        'gcp-ai': {
            title: 'Introduction to Generative AI',
            organization: 'Google Cloud',
            date: '2024',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/5/51/Google_Cloud_logo.svg',
            gradient: 'background: linear-gradient(135deg, #1a73e8, #1557b0); color: white;',
            description: 'Comprehensive introduction to Generative AI concepts, applications, and Google Cloud AI/ML services. Covers fundamental principles of large language models, responsible AI, and practical implementation strategies.',
            skills: [
                { name: 'Generative AI', icon: '🤖' },
                { name: 'Large Language Models', icon: '🧠' },
                { name: 'Vertex AI', icon: '☁️' },
                { name: 'PaLM API', icon: '🔗' },
                { name: 'Responsible AI', icon: '⚖️' },
                { name: 'AI Ethics', icon: '🎯' }
            ],
            projects: [
                { id: 'mobilellm', name: 'MobileLLM Project', icon: '🤖' }
            ],
            credentialUrl: null
        },
        'deeplearning-llm': {
            title: 'Introduction to Large Language Models',
            organization: 'DeepLearning.AI',
            date: '2024',
            logo: 'https://d3c33hcgiwev3.cloudfront.net/imageAssetProxy.v1/fH_-tQ1HEeWlNg6f0QnStw_a2e6b43e93e14c98864b3bbcdd6bcff1_deeplearning.ai-logo-white.png',
            gradient: 'background: linear-gradient(135deg, #0b1220, #111827); color: white;',
            description: 'In-depth exploration of Large Language Models, covering architecture, training methodologies, fine-tuning techniques, and practical applications. Focus on understanding transformer architectures and prompt engineering.',
            skills: [
                { name: 'Transformer Architecture', icon: '🏗️' },
                { name: 'Prompt Engineering', icon: '✏️' },
                { name: 'Fine-tuning', icon: '🔧' },
                { name: 'Embeddings', icon: '🧮' },
                { name: 'Model Evaluation', icon: '📈' },
                { name: 'LLM Applications', icon: '🎯' }
            ],
            projects: [
                { id: 'mobilellm', name: 'MobileLLM125M', icon: '🚀' }
            ],
            credentialUrl: null
        },
        'coursera-ml': {
            title: 'Supervised Machine Learning: Regression',
            organization: 'Coursera | Andrew Ng',
            date: '2023',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Coursera_logo.svg',
            gradient: 'background: linear-gradient(135deg, #2a73cc, #1c56a5); color: white;',
            description: 'Comprehensive course on supervised machine learning with focus on regression algorithms. Covers linear regression, logistic regression, regularization techniques, and practical implementation using Python and scikit-learn.',
            skills: [
                { name: 'Linear Regression', icon: '📈' },
                { name: 'Logistic Regression', icon: '📊' },
                { name: 'Regularization', icon: '🎛️' },
                { name: 'Feature Engineering', icon: '🔧' },
                { name: 'Model Evaluation', icon: '✅' },
                { name: 'Python/Scikit-learn', icon: '🐍' }
            ],
            projects: [
                { id: 'financial-risk', name: 'Financial Risk Analysis', icon: '📈' }
            ],
            credentialUrl: null
        }
    };
    
    return certifications[certId];
}

