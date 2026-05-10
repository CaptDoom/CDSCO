# IndiaAI-CDSCO Regulatory Sentinel

## Overview
The **IndiaAI-CDSCO Regulatory Sentinel** is an AI-powered platform designed for the *Health Innovation Acceleration Hackathon*. It streamlines the regulatory review process for the Central Drugs Standard Control Organisation (CDSCO) by automating document-intensive workflows, ensuring data privacy, and enhancing decision-making efficiency.

The platform is built to comply with the **DPDP Act 2023**, **NDHM Health Data Management Policy**, and **ICMR Ethical Guidelines**.

## Key Features

### 1. AI-Powered Anonymisation
- **PII/PHI Detection**: Automatically identifies and classifies Personally Identifiable Information and Protected Health Information in structured and unstructured data.
- **Two-Step Process**: 
  - *Pseudonymisation*: Replaces identifiers with secure tokens.
  - *Irreversible Anonymisation*: Generalises and normalises sensitive data for regulatory innovation.

### 2. Document Summarisation
- **Multi-Source Synthesis**: Precisely extracts critical information from:
  - SUGAM Portal checklists.
  - SAE (Serious Adverse Event) case narrations.
  - Meeting transcripts and audio summaries.
- **Standardised Output**: Converts diverse source materials into a concise, actionable format for reviewers.

### 3. Completeness & Comparison Engine
- **Administrative Audit**: Verifies consistency and accuracy across mandatory forms and regulatory checklists.
- **Version Control**: Highlights substantive changes between different versions of applicant filings (e.g., Clinical Trial protocols).

### 4. SAE Severity Classification
- **Automated Triage**: Classifies adverse events by severity (Death, Disability, Hospitalisation, etc.).
- **Duplicate Detection**: Identifies redundant case reports to optimize officer prioritisation.

### 5. Inspection Report Generation
- **Handwritten-to-Formal**: Converts unstructured field observations into formal CDSCO-templated inspection reports.

## Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion (for real-time animations).
- **Backend**: Express + Socket.io (Simulated real-time audit engine).
- **AI/ML**: LangGraph-inspired orchestration for regulatory consistency (Simulated).

## Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Setup
1. **Clone the repository**:
   ```bash
   git clone https://github.com/CaptDoom/CDSCO.git
   cd CDSCO
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

## Compliance & Ethics
This tool strictly adheres to the Responsible AI principles advocated by IndiaAI, ensuring transparency, accountability, and the protection of citizen privacy through state-of-the-art de-identification protocols.

---
*Developed for the CDSCO-IndiaAI Health Innovation Acceleration Hackathon 2026.*
