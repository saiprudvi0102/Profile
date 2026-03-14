---
title: "AI-Powered Resume Tailor & Job Scorer"
description: "A SaaS backend and automation suite that dynamically tailors resumes to job descriptions using Google Gemini models, scores job fit, and generates ultra-fast ATS-friendly PDFs."
---

# 🚀 Project Overview
**Name**: AI-Powered Resume Tailor & Job Scorer (or "SaaS Resume AI Tailor")
**Role**: full-stack / backend / AI engineer
**Type**: SaaS application & C2C automation

**Summary**: A two-model AI automation engine built to deeply analyze job descriptions, intelligently extract skills, dynamically tailor user resumes based on the extracted requirements, and render high-fidelity ATS-friendly A4 PDFs using headless Chromium. It also features a built-in candidate-job fit scorer and personalized cover letter generator.

# 🛠️ Tech Stack & Tools
- **Backend & APIs**: Python, FastAPI, Uvicorn
- **AI / LLMs**: Google Cloud Vertex AI (Gemini-2.5-Flash for complex analysis, Gemini-2.0-Flash for high-throughput fast generation)
- **PDF Rendering & Automation**: Playwright (Async Python), Headless Chromium, Markdown-to-HTML (`markdown` library)
- **C2C Automation Logic (Frontend/Integration)**: TypeScript, JavaScript
- **Cloud Infrastructure**: Google Cloud Platform (GCP)
- **Concepts**: Dual-Model Architecture, Prompt Engineering, Structured JSON extraction, LLM Hallucination Mitigation (Deterministic Stitching), Content Quality Assurance pipelines.

# ✨ Key Features & Highlights

### 1. 🧠 Dual-Model AI Engine
- **Intelligent Extraction (Gemini 2.5 Flash)**: Parses massive Job Descriptions (JDs) to meticulously categorize information into `tech_skills`, `soft_skills`, `requirements`, `nice_to_have`, and `role_keywords`.
- **High-Speed Tailoring (Gemini 2.0 Flash)**: Uses dynamic prompt engineering to immediately rewrite the resume's "Professional Summary" and recent experience bullets to explicitly highlight JD matches—maintaining bullet count parity.

### 2. 🛡️ Deterministic Content Stitching & Hallucination Prevention
- A robust architecture that separates dynamic AI generation from static historical data. The AI only rewrites specific targeted sections, while keeping deep historical experiences and education statically appended.
- Ensures the LLM cannot hallucinate fake jobs or incorrect academic backgrounds.

### 3. 📄 Automated ATS-Friendly PDF Rendering
- Uses a pipeline spanning Markdown generation → HTML conversion with hardcoded CSS formatting → Headless Chromium (Playwright) navigation.
- Prints precise A4-sized PDF outputs with strict 0.5-inch margins for guaranteed Applicant Tracking System (ATS) readability without breaking styling.

### 4. 📊 Automatic Quality Assurance (C2C Automation)
- Runs an analysis (`analyzeTailoredResume` in TypeScript) post-generation, scoring the accuracy in matching requirements, ensuring key sections are present, and verifying experience blocks.
- Smart auto-retry loops: If the resulting resume drops below a 50% match score or fails the bullet-count tests, the system transparently loops back to generate a stronger, more targeted version.
- **Auto-repair mechanisms** detect if the LLM output dropped bullet points from the professional summary and deterministically repairs it using original resume data.

### 5. 🎯 Job Quality / Fit Scorer
- A smart feature that takes a user’s profile (Current Role, YoE, Salary, Visa status) and compares it against the parsed job description.
- Outputs a score (0 to 100), an `apply|maybe|skip` recommendation, and gives candidate 3 matching points + 3 potential concerns.

### 6. ✍️ Personalized Cover Letter Generator
- Pulls out the candidate's core strengths and exactly aligns them with the highest-priority keywords in the JD to construct a 200-word targeted, cohesive cover letter ready for submission.

# 📝 Bullet Points for Portfolio

- **Engineered a comprehensive AI Resume Tailoring application** using Python and FastAPI, executing dual-model Vertex AI (Gemini 2.5 and 2.0 Flash) workflows to parse Job Descriptions, score candidate fit, and rewrite experiences dynamically.
- **Built an automated PDF generation pipeline** using Playwright, translating real-time Markdown and strict CSS into precise, ATS-compliant A4 PDFs in milliseconds.
- **Designed robust fallback and auto-repair algorithms in TypeScript**, guaranteeing that AI-hallucinated missing bullets or poor-quality content matches seamlessly trigger regeneration to consistently exceed a 50% keyword match threshold.
- **Devised a deterministic stitching technique** that isolated static work history from fluid, tailored resume sections, completely resolving AI logic hallucinations around historical work background.
- **Implemented an end-to-end recruitment suite API** that supports resume tailoring, skill extraction, auto-generated targeted cover letters, and quantitative job-fit score metrics used by custom Chrome Extensions.
