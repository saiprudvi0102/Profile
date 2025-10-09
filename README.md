saiprudvi ela
+1 (321) 367-4952 | ellasaiprudhvi123@gmail.com | LinkedIn | GitHub | Portfolio
OBJECTIVE
Innovative Mobile App Developer with 5+ years of experience designing and deploying cross-platform and native
Android applications. Skilled in Flutter, Kotlin, Java, Firebase, and AWS, with expertise in scalable cloud architecture,
CI/CD pipelines, and AI/ML integration. Passionate about building human-centered, data-driven digital products that
enhance customer experience, drive user engagement, and deliver measurable business impact.
EDUCATION
Florida Institute of Technology Master's, Computer Engineering
Aug 2023 - May 2025
PROFESSIONAL EXPERIENCE
DormUnity Inc Melbourne, FL, USA
App Developer Jun 2025 - Present
• Built and deployed cross-platform mobile app using Flutter, enabling students to connect through ridesharing,
property listings, and campus social features.
• Developed modular, reusable widgets with responsive layouts, smooth animations, and state management using
Provider/Bloc for scalable architecture.
• Integrated RESTful APIs and Firebase services (Auth, Firestore, Cloud Storage, Push Notifications) for secure,
real-time data flow and user engagement.
• Optimized app performance by reducing load times, improving caching, and implementing offline-first
capabilities.
• Configured CI/CD pipelines (GitHub Actions + Firebase App Distribution) to streamline testing, deployment,
and app updates across iOS and Android.
• Collaborated with product and design teams to deliver premium, user-friendly UI/UX aligned with brand identity.
StyleStitch Hyderabad, TG, India
Co-Founder & App Developer Jun 2024 - Apr 2025
• Co-founded and led the development of StyleStitch, a fashion-tech Android app delivering personalized outfit
recommendations and a curated shopping experience.
• Defined product vision, feature roadmap, and user experience strategy, aligning design decisions with business
and customer needs.
• Designed modern Material Design UI/UX flows, wireframes, and interactive prototypes to ensure intuitive
navigation and premium user engagement.
• Collaborated with engineers to implement native Android features, RESTful APIs, and Firebase services (Auth,
Firestore, Cloud Storage) for seamless functionality.
• Managed end-to-end product lifecycle from ideation to launch on Google Play Store, incorporating analytics and
user feedback for continuous improvements.
Sigma software solutions Software Engineer Pune, MH, India
Feb 2022 - Aug 2023
• Developed and deployed Android applications using Java, Kotlin, XML, and Android Studio, following MVVM
architecture to ensure clean code and maintainability.
• Integrated Firebase services (Authentication, Realtime Database, Cloud Messaging) to implement real-time data
sync and secure user management.
• Utilized AWS (EC2, Lambda, S3) for backend deployment, improving scalability, performance, and app uptime
to 99.9%.
• Optimized app performance by refactoring code and implementing background processing, leading to a 25%
reduction in load time and 30% boost in user engagement.
Oregono Technologies Bangalore, KA, India
Android Developer Apr 2021 - Jul 2021
• Developed Android applications with a focus on clean UI design and responsive layouts.
• Implemented core app functionalities such as user authentication, real-time data handling, and notifications using
Firebase.
• Integrated AWS services to support backend tasks, enhance app performance, and enable scalable cloud
interactions.
• Strengthened skills in mobile app architecture (MVVM), third-party API integration, and agile development
through practical, hands-on training.
Mobile Application Developer May 2020 - Dec 2020
• Designed and developed a fully functional shopping application during onsite training.
• Implemented key features including user authentication, product catalog, and shopping cart with real-time
database support.
• Gained practical experience in Android Studio, UI/UX design, and mobile app architecture using Firebase
Authentication and Realtime Database.
• Strengthened skills in mobile app development, debugging, and cloud integration through hands-on,
project-based learning during the COVID-19 period.
TSNPDCL (132/33 kV) Ragunathpally, TG, India
Substation Intern Nov 2018 - Jun 2019
• Assisted in testing, validating, and commissioning PLC and SCADA systems for power monitoring and control.
• Developed and debugged embedded test scripts using C/C++ for IEDs, sensors, and other field devices.
• Performed real-time system diagnostics, monitored data logs, and analyzed faults for operational reliability.
• Collaborated with engineers to enhance automation workflows, improve system response times, and ensure
compliance with electrical safety standards.
SKILLS
Mobile Development: Flutter, Dart, Java, Kotlin, Android Studio, Jetpack Components, XML UI Design, Room
Database,, MVVM Architecture, Provider/Bloc, Responsive UI/UX, App Performance Optimization
Cloud & Backend: Firebase (Auth, Firestore, Realtime DB, Cloud Messaging, Cloud Storage), AWS (Amplify,
Lambda, API Gateway, Cognito, S3, DynamoDB, SNS, CloudWatch),, Google Cloud (Firestore, Functions, App
Distribution)
AI/ML & Data Science: TensorFlow Lite, Python, Data Analysis, Recommendation Systems,, LLM Workflows,
Generative AI Integration, Data Visualization
Tools & Collaboration: Git, GitHub Actions, Gradle, Postman, JIRA, Agile/Scrum, CI/CD, Crash Reporting,,
Unit/UI Testing (JUnit, Espresso)
Design & Prototyping: Figma, Material Design Guidelines, Wireframing, Prototyping, Inclusive UX,,
User-Centered Design, Usability Testing
CERTIFICATIONS
• AWS Certified Developer – Associate
• Introduction to Large Language Models
• Supervised Machine Learning: Regression
• Introduction to Generative AI

---
Portfolio Site Additions (2025)

1. Full-Screen Project Popup Modal
	- Clicking any project card now opens an animated, edge‑to‑edge overlay (true viewport fixed) with keyboard navigation (←/→), focus trap, ESC to close, and share‑link copy.
	- Supports deep linking via URLs like `#project-mobilellm` (paste into a new tab to open directly).
	- Accessible: role="dialog", aria-modal, focus restoration, live region announcements.

2. Light / Dark Theme System
	- Theme toggle persists preference (localStorage, attribute `data-theme`).
	- Light mode introduces soft elevated cards, subtle borders, neutral grays, improved contrast, gradient headings.
	- All cards, sections, metrics, certification tiles, and modal content use CSS custom properties for consistent theming.

3. Performance & UX Enhancements
	- Hover preview manager (Netflix-style delayed preview) decoupled from modal logic.
	- Lazy reveal animations inside modal (IntersectionObserver) for long content sections.
	- Image preloading for adjacent projects to smooth navigation.

4. Implementation Notes
	- Legacy inline/static modal markup removed from `index.html`; modal DOM is injected dynamically by `ProjectDetailManager` in `script.js`.
	- Old global `.project-modal` rules deprecated in favor of `.project-modal.local` full-screen system; legacy selectors neutralized to avoid cascade conflicts.
	- CSS custom properties drive geometry animation (start card bounds → fullscreen) via `--start-left/top/width/height`.

5. Extending
	- To add a new project: add a `.netflix-card[data-project="id"]` in HTML and define its metadata in `getProjectData()` inside `script.js`.
	- Shareable URL automatically becomes `#project-id`.

For questions or improvements: open an issue or contact via LinkedIn.

2025 Enhancements (Extended)
6. Reduced Motion Accessibility
	- Respects user OS setting `prefers-reduced-motion: reduce`; disables expansion / shrink keyframes and uses instant or simple fade transitions.
	- JS guard (`prefersReducedMotion`) prevents adding animation classes; close flow falls back to lightweight fade.

7. Lightweight Analytics Hooks
	- `analyticsTrack(event, data)` stub added in `script.js` (logs to console or pushes to `dataLayer` if present).
	- Fires `project_modal_open` and `project_modal_close` with metadata (projectId, title) for easy future instrumentation.

8. Dedicated Work Page (`work.html`)
	- Consolidated project listing & carousels with the same full-screen modal behavior (no duplicate static modal markup).
	- Ensures consistent theming + accessibility (card focus, Enter activation, deep linking with hashes).

9. Consistent Close Animations
	- If no originating geometry or reduced motion preferred, modal uses a fast opacity fade instead of shrink animation.

10. Theming Parity
	- Work page includes the persistent theme toggle script; localStorage setting shared across all pages.

---

Quick QA for Projects and Certifications (2025)

- Open any page with project cards and click a card:
	- Expect fullscreen modal with title, details, and navigation (Prev/Next) visible.
	- Press Esc to close; focus returns to the card. Hash clears from URL.
	- Copy link (🔗) then paste in a new tab: URL should include `#project-<id>` and auto-open to that project.

- Open Certifications page and click a certification tile:
	- Expect the same fullscreen modal without Prev/Next controls.
	- URL should update to `#cert-<id>`; reload and it should auto-open.
	- Press Esc to close; hash should clear.

- Keyboard and accessibility:
	- Tab to a card/tile and press Enter to open; Shift+Tab to navigate back after close.
	- Arrow keys (←/→) navigate projects when project modal is open.

- QR share:
	- In a project modal, click QR; overlay appears; close it and ensure modal remains.

If anything differs, check `main.js` console for warnings and ensure all pages load `main.js` (not `script.js`).