# CDSCO-IndiaAI: Regulatory Analysis Platform

An AI-powered intelligence suite designed for regulatory compliance, safety monitoring, and document auditing in the pharmaceutical and clinical research domain.

## 🚀 Core Features

### 1. PII Anonymization Engine
- **Strict Compliance:** Automatically detects and masks Personally Identifiable Information (PII) according to global privacy standards.
- **Dual Mode:** Supports both *Pseudonymisation* (reversible mapping) and *Irreversible Anonymization*.
- **Entity Detection:** Identifies Names, MRNs, Addresses, Phone numbers, and DOBs in clinical documents.

### 2. Regulatory Summarizer
- **Context-Aware:** Tailored for SUGAM forms, Clinical protocols, and Manufacturing logs.
- **Structured Insights:** Extracts key findings, regulatory gaps, and action items using neural evaluation.

### 3. SAE Classification Board
- **Fatal/Non-Fatal Classification:** AI-driven triage of Serious Adverse Events (SAE).
- **Explainable AI (SHAP):** Visualizes which medical terms influenced the severity verdict.
- **Narrative Audit:** Direct ingestion of clinical narratives for immediate risk scoring.

### 4. Version Comparison & Delta Analysis
- **Differential Tracking:** Side-by-side comparison of document versions (e.g., Labeling v1 vs v2).
- **Magnitude Scoring:** Quantifies the extent of changes in clinical protocols or drug master files.

### 5. Completeness & Integrity Audit
- **SUGAM Verification:** Audits regulatory submissions for missing fields or inconsistent data.
- **Data Integrity:** Flags back-dating, illegible signatures, and non-contemporaneous entries in lab logs.

### 6. Neural Inspection Reports
- **Field Observations:** Converts raw inspection notes and OCR data into structured regulatory reports.
- **Risk Assessment:** Categorizes observations by severity (Critical, Major, Minor).

## 🛠️ Getting Started

### Prerequisites
- **Node.js**: Version 18.x or higher
- **Package Manager**: npm or yarn
- **API Key**: A Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-repo/cdsco-india-ai.git
   cd cdsco-india-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_actual_api_key_here
   ```

4. **Launch Development Server**
   ```bash
   npm run dev
   ```

### Deployment

Build the optimized production assets:
```bash
npm run build
```
The static files will be generated in the `dist/` directory.

## ⚙️ Technical Stack

- **Frontend:** React 18+ with Vite
- **Styling:** Tailwind CSS (Modern, high-density regulatory UI)
- **Intelligence:** Google Gemini Pro / Flash (Neural processing)
- **Animations:** Motion (Framer Motion)
- **Icons:** Lucide React

## 📊 Dataset Testing
The platform comes pre-loaded with open-source datasets for testing:
- **i2b2/UTHealth:** Clinical PHI samples
- **MIMIC-III:** Patient narrative cases
- **CDSCO/SUGAM:** Mock regulatory transcripts
- **FDA FAERS:** Public safety reports
- **ICDAR SROIE:** Hand-written inspection logs

## 📄 License
Internal Regulatory Use Only. Prepared for CDSCO Modernization Initiative.
