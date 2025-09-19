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

            // Certification cards no longer open modals (simplified section)

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
        // Mount inside the projects section so overlay only covers project cards
        const projectsSection = document.querySelector('#projects') || document.body;
        const modal = document.createElement('div');
        modal.className = 'project-modal local';
        modal.setAttribute('aria-hidden','true');
        modal.setAttribute('role','dialog');
        modal.setAttribute('aria-modal','true');
        modal.setAttribute('aria-label','Project details');
        modal.innerHTML = `
            <div class="project-modal-overlay local-overlay">
                <div class="project-modal-content">
                    <button class="close-project-modal" aria-label="Close">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                        </svg>
                    </button>
                    <div class="project-modal-body"></div>
                </div>
            </div>`;
        projectsSection.appendChild(modal);
        this.modal = modal;
        this.container = projectsSection;
    }

    showProjectDetail(projectId, cardElement) {
        const project = this.getProjectData(projectId);
        if (!project) return;

        this.lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;

        const modalBody = this.modal.querySelector('.project-modal-body');
        modalBody.innerHTML = this.generateProjectDetailHTML(project);
        
        // Position modal relative to the clicked card
        this.positionModalRelativeToCard(cardElement);
        
        this.modal.classList.add('active');
        this.modal.setAttribute('aria-hidden','false');

        // Focus first interactive element inside modal for accessibility
        const focusable = this.getFocusableElements();
        if(focusable.length){ focusable[0].focus({preventScroll:true}); }
        this.enableFocusTrap();
    }

    positionModalRelativeToCard(cardElement) {
        if (!cardElement) return;
        const containerRect = this.container.getBoundingClientRect();
        const cardRect = cardElement.getBoundingClientRect();
        const modalContent = this.modal.querySelector('.project-modal-content');

        modalContent.classList.add('positioned');
        modalContent.style.position = 'absolute';
        modalContent.style.transform = 'none';
        modalContent.style.animation = 'none';

        const availableWidth = containerRect.width;
        const maxWidth = Math.min(availableWidth - 40, 900);
        const modalWidth = maxWidth;
        const modalHeight = 600; // fixed max height inside section

        // Coordinates relative to container
        let left = (cardRect.left - containerRect.left) + (cardRect.width/2) - (modalWidth/2);
        let top = (cardRect.bottom - containerRect.top) + 16;

        // Bounds within container
        if (left < 0) left = 0;
        if (left + modalWidth > availableWidth) left = availableWidth - modalWidth;

        const containerHeight = this.container.offsetHeight;
        if (top + modalHeight > containerHeight) {
            // If overflow, position above card
            top = (cardRect.top - containerRect.top) - modalHeight - 16;
            if (top < 0) top = Math.max(0, (containerHeight - modalHeight)/2);
        }

        // Apply
        modalContent.style.width = modalWidth + 'px';
        modalContent.style.left = left + 'px';
        modalContent.style.top = top + 'px';
        modalContent.style.maxHeight = modalHeight + 'px';
        modalContent.style.margin = '0';

        // Animate from card center
        const initialX = (cardRect.left - containerRect.left) + (cardRect.width/2) - (modalWidth/2);
        const initialY = (cardRect.top - containerRect.top) + (cardRect.height/2) - (modalHeight/2);
        const animationName = `modalLocalFromCard_${Date.now()}`;
        const keyframes = `@keyframes ${animationName} {0%{opacity:0;transform:scale(.4) translate(${initialX-left}px,${initialY-top}px);}100%{opacity:1;transform:scale(1) translate(0,0);}}`;
        const styleEl = document.createElement('style');
        styleEl.textContent = keyframes;
        document.head.appendChild(styleEl);
        modalContent.style.animation = `${animationName} .38s cubic-bezier(0.165,0.84,0.44,1) forwards`;
        setTimeout(()=>{ styleEl.remove(); },600);
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

            // Restore focus
            if(this.lastFocusedElement && typeof this.lastFocusedElement.focus === 'function') {
                this.lastFocusedElement.focus({preventScroll:true});
            }
            this.disableFocusTrap();
            this.modal.setAttribute('aria-hidden','true');
        }
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

// Removed certification modal functionality & data (simplified static grid now used)

