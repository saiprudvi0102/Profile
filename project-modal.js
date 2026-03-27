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
    'Embroidery Design Mobile App': {
        title: 'Embroidery Design Mobile App',
        description: 'Android app for a business owner to manage, showcase, and sell embroidery designs with cloud-backed operations.',
        fullDetails: 'Designed and developed a mobile application for an independent client using Java and Kotlin in Android Studio. The app was built to help a business owner manage product catalogs, showcase embroidery designs, upload images, and track orders through a cloud-backed backend.',
        achievements: [
            'Delivered the full engagement from requirements gathering through production deployment',
            'Integrated REST APIs for catalog management, image upload, and order tracking',
            'Built native Android workflows in Java and Kotlin using Android Studio',
            'Created a business-facing mobile storefront for showcasing and selling designs',
            'Handled UI/UX design, testing, and release support end to end'
        ],
        technologies: ['Android Studio', 'Java', 'Kotlin', 'REST APIs', 'Cloud Infrastructure', 'UI/UX'],
        image: 'assets/embroidery-design-app.svg',
        links: {
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
        title: 'Dormigo SuperApp – Simplifying Campus Life',
        description: 'A student-focused super app that brings housing, rides, and career discovery into one secure campus platform.',
        fullDetails: 'Dormigo is a student-focused SuperApp designed to make campus life easier, safer, and more connected. It combines verified housing, peer ride-sharing, and jobs and internships in a single platform tailored to the college experience. Secure sign-in, student-oriented trust features, and cross-platform delivery across iOS, Android, and web help students connect, collaborate, and thrive throughout campus life.',
        achievements: [
            'Unified housing, rides, and jobs into one student-focused platform',
            'Built verified marketplace flows for safer campus transactions',
            'Delivered cross-platform access across iOS, Android, and web',
            'Enabled secure authentication with email and social sign-in',
            'Planned AI-powered resume matching and application automation features'
        ],
        technologies: ['Flutter', 'Firebase', 'Google Cloud', 'Dart', 'iOS', 'Android', 'Web'],
        image: 'assets/dormigo-campus-ai.svg',
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
    },
    'ApplyandConnect': {
        title: 'ApplyandConnect',
        description: 'An AI-powered job search platform that combines Gemini-based resume tailoring, recruiter outreach, job understanding, and extension-assisted application workflows.',
        fullDetails: 'ApplyandConnect is an AI-powered job search operating system that brings together job discovery, LLM-based resume tailoring, recruiter outreach, Gmail pipeline sync, and browser-assisted application workflows in one platform. The core AI layer uses centralized server-side Gemini actions for job-description parsing, ATS-focused resume optimization, cover-letter generation, recruiter email drafting, contact discovery, and job-email classification. To improve reliability, the resume pipeline limits LLM rewriting to high-value dynamic sections while deterministically preserving static content. The platform also includes shipped extension AI flows for profile tailoring, application-package generation, cover-letter support, autofill, and application sync, while broader agentic orchestration for job shortlisting, outreach preparation, and LinkedIn workflows is actively being expanded.',
        achievements: [
            'Built centralized Gemini-powered AI actions for JD parsing, resume tailoring, cover letters, recruiter email drafting, contact discovery, and job-email classification',
            'Implemented a safer resume-tailoring pipeline that rewrites only dynamic sections while deterministically preserving static resume content',
            'Shipped extension-based AI workflows for direct profile tailoring, application-package generation, autofill support, cover-letter generation, and application sync',
            'Added AI model routing and token and cost tracking across Gemini model tiers for scalable usage controls and analytics readiness',
            'Working on agentic orchestration for job shortlisting, outreach preparation, and LinkedIn workflows with a broader multi-agent roadmap',
            'Supporting active company adoption with 10+ users on the platform and expansion planned based on workflow performance and hiring outcomes'
        ],
        technologies: ['Gemini', 'LLMs', 'AI Agents', 'Extension AI', 'Gmail Sync', 'Model Routing'],
        image: 'assets/applyandconnect-ai.svg',
        links: {
            website: 'https://applyandconnect.com'
        }
    },
    'Multi-Agent Trip Planner': {
        title: 'Multi-Agent Trip Planner',
        description: 'A custom, lightweight multi-agent framework orchestrating parallel and sequential AI agents for trip planning from scratch.',
        fullDetails: 'A custom, lightweight, fully-functional multi-agent framework built from scratch in Python. The system orchestrates multiple AI agents capable of executing tasks in both parallel and sequential patterns to solve a complex goal: planning an optimal, affordable day trip.',
        achievements: [
            'Built a Custom Orchestrator entirely from scratch without heavyweight frameworks',
            'Implemented Parallel Task Execution for faster processing and agent concurrency',
            'Designed Sequential Task Execution handling strict dependency graphs',
            'Integrated Google Search Grounding to reliably provide real-time agent context without hallucinations'
        ],
        technologies: ['Python', 'Agents', 'Google GenAI SDK', 'Concurrent processing'],
        image: 'img_multi_agent_trip_ai.png',
        links: {
            github: 'https://github.com/saiprudvi0102/Multi-agents'
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
