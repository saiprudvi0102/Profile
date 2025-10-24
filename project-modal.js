// Project Modal Functionality with Netflix-style animations

const projectData = {
    'MobileLLM-125M Deployment': {
        title: 'MobileLLM-125M Deployment',
        description: 'Fine-tuned and quantized a 125M parameter LLM for on-device inference with FastAPI serving, Dockerized pipelines, and multi-GPU training.',
        fullDetails: 'Developed a complete pipeline for deploying a lightweight language model optimized for mobile and edge devices. The project involved fine-tuning a 125M parameter model, implementing quantization techniques for reduced memory footprint, and creating a robust serving infrastructure using FastAPI.',
        achievements: [
            'Achieved 62.8% downstream accuracy and 7.91 perplexity',
            'Implemented multi-GPU training pipeline for faster iteration',
            'Created Docker containers for reproducible deployment',
            'Optimized inference with TensorRT for 3x speedup',
            'Built REST API with FastAPI for seamless integration'
        ],
        technologies: ['PyTorch', 'FastAPI', 'Docker', 'TensorRT', 'CUDA', 'Python'],
        image: 'assets/mobilellm-ai.svg',
        links: {
            github: 'https://github.com/saiprudvi0102/MobileLLM125M'
        }
    },
    'GPU-Accelerated Financial Risk Analysis': {
        title: 'GPU-Accelerated Financial Risk Analysis',
        description: 'PyCUDA Monte Carlo engine for VaR and covariance estimation at one-million day scales.',
        fullDetails: 'Built a high-performance financial risk analysis system leveraging GPU parallelism to perform complex Monte Carlo simulations. The system analyzes portfolio risk metrics including Value at Risk (VaR) and covariance matrices at unprecedented scales.',
        achievements: [
            '1.57× runtime improvement over CPU baselines',
            'Scaled to one-million day simulations',
            'Implemented custom CUDA kernels for matrix operations',
            'Achieved real-time risk assessment for large portfolios',
            'Validated results against industry-standard models'
        ],
        technologies: ['CUDA', 'PyCUDA', 'NumPy', 'Finance', 'Python', 'C++'],
        image: 'assets/finance-gpu-ai.svg',
        links: {
            github: 'https://github.com/saiprudvi0102/Finance-Risk-Analysis-GPU'
        }
    },
    'PCNN Shadow Removal': {
        title: 'PCNN Shadow Removal',
        description: 'Implemented biologically inspired pulse-coupled neural networks for adaptive shadow segmentation.',
        fullDetails: 'Developed an innovative computer vision system using Pulse-Coupled Neural Networks (PCNN), inspired by biological visual processing. The system performs intelligent shadow detection and removal with high accuracy.',
        achievements: [
            '94.2% detection accuracy achieved',
            '0.89 image quality index maintained',
            'Real-time processing capability',
            'Adaptive thresholding for various lighting conditions',
            'Published research findings in computer vision conference'
        ],
        technologies: ['TensorFlow', 'OpenCV', 'Computer Vision', 'Neural Networks', 'Python'],
        image: 'assets/pcnn-ai.svg',
        links: {
            github: 'https://github.com/saiprudvi0102/PCNN-Shadow-Removal'
        }
    },
    'IoT Anomaly Detection on FPGA': {
        title: 'IoT Anomaly Detection on FPGA',
        description: 'Deployed an ANN pipeline on a PYNQ-Z2 FPGA with AXI DMA and BRAM streaming to spot IoT-23 anomalies in microseconds.',
        fullDetails: 'Designed and implemented a complete hardware-accelerated anomaly detection system on FPGA for IoT security applications. The system processes network traffic in real-time using custom neural network architecture optimized for FPGA execution.',
        achievements: [
            'Microsecond-level anomaly detection latency',
            'Custom AXI DMA implementation for high throughput',
            'BRAM-optimized neural network architecture',
            'Real-time LED alerts for security events',
            'Tested on IoT-23 dataset with 97% accuracy'
        ],
        technologies: ['FPGA', 'Verilog', 'IoT', 'Hardware', 'PYNQ-Z2', 'AXI DMA'],
        image: 'assets/iot-fpga-ai.svg',
        links: {
            github: 'https://github.com/saiprudvi0102/AnomalyDetection'
        }
    },
    'StyleStitch Fashion App': {
        title: 'StyleStitch Fashion App',
        description: 'Android fashion app built with Kotlin, Jetpack Libraries, and MVVM architecture.',
        fullDetails: 'Developed a comprehensive fashion and style management application for Android using modern development practices. The app helps users organize their wardrobe, create outfit combinations, and discover new fashion trends.',
        achievements: [
            'Reduced latency by 25% with optimized Firebase integration',
            'Implemented MVVM architecture for maintainable code',
            'Built responsive UI with Jetpack Compose',
            '10,000+ downloads on Play Store',
            '4.5★ average user rating'
        ],
        technologies: ['Kotlin', 'Android', 'Firebase', 'MVVM', 'Jetpack Compose', 'Material Design'],
        image: 'assets/style-stitch-ai.svg',
        links: {
            playstore: 'https://play.google.com/store/apps/details?id=com.project.BucketListTech'
        }
    },
    'Dormunity Website': {
        title: 'Dormunity Website',
        description: 'Corporate website for Dormunity Inc. showcasing our mission to empower campus communities.',
        fullDetails: 'Developed the official Dormunity website (dormunity.app) to showcase our mission of empowering campus communities through innovative student life solutions. The website serves as the central hub for information about Dormigo and our vision for transforming university experiences.',
        achievements: [
            'Responsive design optimized for all devices',
            'Modern web development best practices',
            'SEO-optimized for better discoverability',
            'Integration with app store links and downloads',
            'Clean, professional design reflecting brand identity'
        ],
        technologies: ['React', 'Next.js', 'CSS3', 'JavaScript', 'Vercel', 'Web Development'],
        image: 'assets/dormigo-ai.svg',
        links: {
            website: 'https://dormunity.app'
        }
    },
    'Dormigo – Empowering Campus Life': {
        title: 'Dormigo – Empowering Campus Life',
        description: 'Dormigo is a super app for students, built to simplify and enhance everyday campus living.',
        fullDetails: 'Dormigo is a super app for students, built to simplify and enhance everyday campus living. From finding jobs and housing to sharing rides and connecting with peers, Dormigo brings everything students need into one unified platform. We\'re on a mission to empower campus communities by helping students connect, collaborate, and thrive — both on and off campus. Available on both Android and iOS platforms.',
        achievements: [
            'Launched on both Google Play Store and iOS App Store',
            'Unified platform for housing, jobs, rides, and community',
            'Cross-platform mobile app built with Flutter',
            'Real-time features for student collaboration',
            'Mission-driven approach to empower campus communities'
        ],
        technologies: ['Flutter', 'Firebase', 'Google Maps', 'Stripe', 'Dart', 'Node.js'],
        image: 'assets/dormigo-ai.svg',
        gallery: [
            'assets/ss1.png',
            'assets/ss2.png',
            'assets/ss3.png',
            'assets/ss4.png',
            'assets/ss5.png',
            'assets/ss6.png',
            'assets/ss7.png',
            'assets/ss8.png',
            'assets/ss9.png',
            'assets/ss10.png',
            'assets/ss11.png'
        ],
        links: {
            playstore: 'https://play.google.com/store/apps/details?id=com.anonymous.studentnetworkapp',
            appstore: 'https://apps.apple.com/us/app/dormigo-superapp/id6754192331',
            website: 'https://dormunity.app'
        }
    },
    'ML Housing Price Prediction': {
        title: 'ML Housing Price Prediction',
        description: 'Complete MLOps pipeline analyzing US housing data (2012-2023) with automated training, serving, and monitoring.',
        fullDetails: 'Developed a comprehensive machine learning operations (MLOps) pipeline for predicting housing prices using historical US housing data. The system includes automated data validation, model training, serving infrastructure, and monitoring capabilities.',
        achievements: [
            'Analyzed 10+ years of US housing data (2012-2023)',
            'Implemented automated data validation with Great Expectations',
            'Built scalable FastAPI serving infrastructure',
            'Containerized deployment with Docker',
            'Integrated MLFlow for experiment tracking and model versioning'
        ],
        technologies: ['Great Expectations', 'FastAPI', 'Docker', 'MLFlow', 'Python', 'Scikit-learn'],
        image: 'assets/housing-ml-ai.svg',
        links: {
            github: '#'
        }
    }
};

function createModal() {
    const modal = document.createElement('div');
    modal.className = 'project-modal';
    modal.id = 'projectModal';
    document.body.appendChild(modal);
    return modal;
}

function showProjectDetails(projectTitle) {
    const project = projectData[projectTitle];
    if (!project) return;

    const modal = document.getElementById('projectModal') || createModal();
    
    const linksHTML = Object.entries(project.links).map(([type, url]) => {
        let label;
        if (type === 'github') {
            label = '🔗 View on GitHub';
        } else if (type === 'playstore') {
            label = '📱 Android App';
        } else if (type === 'appstore') {
            label = '🍎 iOS App';
        } else if (type === 'website') {
            label = '🌐 Visit Website';
        } else {
            label = '📱 View on Play Store';
        }
        return `<a href="${url}" target="_blank" rel="noopener" class="modal-link-btn">${label}</a>`;
    }).join('');

    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close" onclick="closeProjectModal()">×</button>
            <div class="modal-header">
                <div class="modal-image">
                    <img src="${project.image}" alt="${project.title}" loading="lazy" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <h2>${project.title}</h2>
                <p style="color: var(--netflix-light-gray); font-size: 1.1rem; margin-top: 0.5rem;">${project.description}</p>
            </div>
            <div class="modal-body">
                ${Array.isArray(project.gallery) && project.gallery.length ? `
                <div class="modal-section">
                    <h3>📱 Screenshots</h3>
                    <div class="modal-gallery">
                        ${project.gallery.map(src => `
                            <a href="${src}" target="_blank" class="modal-gallery-item" title="Open full size">
                                <img src="${src}" alt="${project.title} screenshot" loading="lazy">
                            </a>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
                <div class="modal-section">
                    <h3>📋 Project Overview</h3>
                    <p>${project.fullDetails}</p>
                </div>
                
                <div class="modal-section">
                    <h3>🎯 Key Achievements</h3>
                    <ul>
                        ${project.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="modal-section">
                    <h3>💻 Technologies Used</h3>
                    <div class="modal-tech-tags">
                        ${project.technologies.map(tech => `<span>${tech}</span>`).join('')}
                    </div>
                </div>
                
                <div class="modal-links">
                    ${linksHTML}
                </div>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
    const modal = document.getElementById('projectModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Initialize project cards
document.addEventListener('DOMContentLoaded', function() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        // Add click event to open modal
        card.addEventListener('click', function(e) {
            // Don't open modal if clicking on a link
            if (e.target.tagName === 'A') return;
            
            const projectTitle = this.querySelector('.project-header h3').textContent;
            showProjectDetails(projectTitle);
        });
        
        // Add entrance animation
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100);
    });
    
    // Close modal on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeProjectModal();
        }
    });
    
    // Close modal on background click
    document.addEventListener('click', function(e) {
        const modal = document.getElementById('projectModal');
        if (e.target === modal) {
            closeProjectModal();
        }
    });
});

// Add stagger animation to project cards
window.addEventListener('load', function() {
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        card.style.animation = `fadeInUp 0.6s ease ${index * 0.1}s forwards`;
    });
});
