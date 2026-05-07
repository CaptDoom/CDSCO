export const OPEN_SOURCE_SAMPLES = {
  anonymization: [
    {
      name: "i2b2 Clinical Sample",
      source: "i2b2/UTHealth 2014 PHI",
      text: `Record date: 2024-10-12
Patient: Johnathan Doe, MRN: 9928310
Phone: 555-0199, Address: 123 Maple St, Mumbai, Maharashtra.
The patient was admitted to City Hospital on Oct 5th after experiencing severe chest pain. 
Dr. Amit Sharma performed a coronary angiogram.`
    },
    {
      name: "MIMIC-III Case",
      source: "MIMIC-III (PHI)",
      text: `ADMISSION DATE: [**2175-5-2**] DISCHARGE DATE: [**2175-5-10**]
Patient is a 65 year old male with a history of hypertension.
Contact: 9876543210 (Mobile).
Email: patient.contact@kailash.org`
    },
    {
      name: "MedSec Privacy Test",
      source: "HIPAA Training Data",
      text: `Visit Date: Jan 15, 2024.
Physician: Dr. Sarah Williams (NPI: 1234567890).
Subject: Michael Richards, DOB: 05/12/1982.
Employer: Tech Solutions Ltd, Bangalore.
The patient reported persistent migraines and was prescribed Sumatriptan.`
    },
    {
      name: "Clinical Trial Profile",
      source: "Draft Enrollment Doc",
      text: `Study ID: NCT04429910.
Participant: Priya Krishnan (ID: SUB-882).
Location: Apollo Hospitals, Chennai.
SSN-Equivalent: 4421-2291-0021.
Consent signed on 2024-03-01. Patient history includes Type 2 Diabetes.`
    },
    {
      name: "Mental Health Progress",
      source: "Synthea (Synthetic)",
      text: `Psychiatry Progress Note - 2024-06-20.
Patient: Robert Miller. Therapist: Dr. Leanord Hofstadter.
Current home address: 4A Oak Ridge, Pune.
Patient discussed anxiety regarding his job at Goldman Sachs.
Recommendation: Increase Lexapro to 20mg.`
    }
  ],
  summarization: [
    {
      name: "CNN/DailyMail News",
      source: "CNN/DailyMail (NLU)",
      text: `(CNN) -- A new clinical trial in India has shown promising results for a malaria vaccine. 
The trial, which involved 500 children in the regions of Odisha, showed an efficacy rate of 77%. 
Leading researchers at Bharat Biotech suggest that this could be a breakthrough for public health access. 
The WHO is currently reviewing the data before providing a global recommendation.`
    },
    {
      name: "Regulatory Transcript",
      source: "Internal CDSCO Mock",
      text: `Meeting Minutes: SEC Endocrinology - 14th April 2024.
Agenda: Review of Phase III protocol for Novo-Aspart.
Observations: The committee noted that the sample size calculation was not stratified by HbA1c levels.
Decision: The applicant must submit a revised protocol with a larger cohort for the Indian population.`
    },
    {
      name: "PMC Research Abstract",
      source: "PubMed Central OA",
      text: `Background: Chronic obstructive pulmonary disease (COPD) remains a leading cause of morbidity.
Methods: We conducted a double-blind, randomized controlled trial evaluating Tiotropium + Formoterol.
Results: Patients in the combination group showed a 15% improvement in FEV1 scores compared to monotherapy.
Conclusion: Dual bronchodilation significantly improves lung function in moderate to severe COPD.`
    },
    {
      name: "Stability Study Report",
      source: "Pharma R&D Log",
      text: `Stability Summary for Batch LX-442 (Paracetamol 500mg).
Testing period: 24 months under accelerated conditions (40C/75% RH).
Key findings: All parameters remained within specifications (USP).
Assay value dropped from 100.2% to 98.4% over 24 months. Impurity levels (p-aminophenol) remained below 0.1%.`
    },
    {
      name: "Pharmacopoeia Monograph",
      source: "IP 2022 Excerpt",
      text: `Sodium Bicarbonate IP. 
Identification: A solution of the substance in water gives a white precipitate with magnesium sulfate.
Storage: Store in well-closed containers.
Labelling: The label states the content of NaHCO3 as a percentage of the labelled amount.
Assay: Dissolve in 50ml of carbon dioxide-free water and titrate with 1M hydrochloric acid.`
    }
  ],
  sae: [
    {
      name: "FAERS Report",
      source: "FDA FAERS (Public)",
      text: `Case ID: 199201. Admitted following administration of Study Drug-X. 
Patient developed anaphylactic shock within 12 minutes. 
Emergency intubation was required. Outcome: Hospitalisation for 4 days. 
No previous history of allergies noted in screening docs.`
    },
    {
      name: "Cardiovascular SAE",
      source: "Clinical Portal (E3)",
      text: `Patient 021-X experienced acute myocardial infarction (AMI) on Day 45 of treatment.
The patient was a 58-year-old male with pre-existing coronary artery disease.
Administered drug: HyperStat-B.
Principal Investigator’s Assessment: Possibly related. The event was life-threatening and required surgical intervention (CABG).`
    },
    {
      name: "Liver Injury Case",
      source: "DILIrank Dataset",
      text: `Patient ID: Hepat-402. Drug: Antifungal-K.
AST/ALT levels rose 10x from baseline in week 3. 
Bilirubin measured at 3.5 mg/dL (Jaundice observed). 
Drug was immediately discontinued. Treatment: IV N-acetylcysteine.
Classification: Serious (Hys Law criteria met).`
    },
    {
      name: "Vaccine AE Report",
      source: "VAERS (CDC)",
      text: `Patient: 28M. Vaccine: mRNA-1273.
Symptoms: Pericarditis, chest pain, SOB. 
Reported 3 days after second dose. EKG showed diffuse ST-segment elevation.
Hospitalised for 2 days. Recovered with ibuprofen and colchicine.
Event reported by Attending Cardiologist.`
    },
    {
      name: "Neurological Event",
      source: "MS Trial Safety Lab",
      text: `Case: Neuro-99. Subject experienced focal seizures within 24 hours of IV infusion.
History of epilepsy: None.
Imaging: Brain MRI showed localized oedema in the frontal lobe.
Causality: Probable. Action taken: Trial enrollment paused for the specific batch (Batch A-2).`
    }
  ],
  inspection: [
    {
      name: "SROIE Hand-written",
      source: "ICDAR SROIE",
      text: `Date: 12/04/2024. Location: Manufacturing Unit B.
Observed temp in storage was 28C, exceeding 25C limit.
Signature is illegible on the log sheets for March 2024.
Incomplete records for raw material batch RM-492.`
    },
    {
      name: "FDA Form 483 Obs",
      source: "FDA Dashboard (OAI)",
      text: `Observation 1: Procedures designed to prevent microbiological contamination of drug products are not followed.
Specifically, operators in the aseptic processing area were seen with exposed skin around the mask area.
Observation 2: The responsibilities of the quality control unit were not adequately documented.`
    },
    {
      name: "Clean Room Audit",
      source: "ISO 14644 Log",
      text: `Audit Date: 2024-08-01. Area: Grade A Filling Suite.
Particle count (0.5um) exceeded limits at rest (7,000 counts/m3).
HEPA filter integrity test showed a leak in filter HF-092.
Corrective Action Request (CAR-22) issued to Maintenance Dept.`
    },
    {
      name: "Data Integrity Check",
      source: "ALCOA+ Review",
      text: `Logbook MB-L-20 contained white-out on critical measurement fields.
Back-dating of signatures observed on batch release documents for Feb 2024.
Computer system passwords shared among 5 lab technicians in the QC department.
Critical failure in 'Contemporaneous' and 'Accountable' standards.`
    },
    {
      name: "Packaging Line Error",
      source: "Internal Deviation",
      text: `Event: Mismatch between secondary packaging (carton) and primary label (vial).
Batch: VAX-008. 100 units found where 50mcg labels were placed in 100mcg cartons.
Root Cause: Roll set-up error on the labelling machine.
Impact: Significant risk of dosage error. Batch quarantined for 100% inspection.`
    }
  ],
  comparison: [
    {
      name: "Labeling v1 vs v2",
      source: "FDA Labeling Revision",
      textA: "Indications and Usage: For the treatment of hypertension in adults. Recommended starting dose is 5mg daily.",
      textB: "Indications and Usage: For the treatment of hypertension and heart failure in adults and pediatric patients > 12 years. Recommended starting dose is 2.5mg for heart failure and 5mg for hypertension."
    },
    {
      name: "Form 44 Revision",
      source: "SUGAM Draft Comparison",
      textA: "IV. Applicant Details: Name: PharmaCorp Ltd. License: MH-4929. Date of Registration: 2020-01-01.",
      textB: "IV. Applicant Details: Name: PharmaCorp Global Pvt Ltd. License: MH-4929-B-REV. Date of Registration: 2020-01-01. Registered Office removed to New Delhi."
    },
    {
      name: "Study Protocol Delta",
      source: "NCT Study Amendment",
      textA: "Exclusion Criteria: Patients with baseline HbA1c > 9.0%. Patients with history of stroke in the last 6 months.",
      textB: "Exclusion Criteria: Patients with baseline HbA1c > 10.0%. Patients with history of stroke in the last 12 months. Patients with renal impairment (CrCl < 30ml/min)."
    },
    {
      name: "Drug Master File Upd",
      source: "DMF Section 3.2.S",
      textA: "Synthesis Route: Route A involves 3 steps. Step 1 uses Toluene as a solvent at 80C. Yield: 85%.",
      textB: "Synthesis Route: Route A-Prime involves 3 steps. Step 1 uses Ethanol as a green solvent at 70C. Yield: 92%. Reduced residual solvent toxicity."
    },
    {
      name: "Safety Data Sheet v4",
      source: "GHS MSDS Comparison",
      textA: "Hazards: Flammable liquid. Category 3. H226. Flash point 24C.",
      textB: "Hazards: Flammable liquid. Category 2. H225. Flash point 18C. Toxic if swallowed. H301."
    }
  ],
  completeness: [
    {
      name: "Incomplete SUGAM Form",
      source: "Mock Audit Case A",
      text: "Application for Import of Drugs. Applicant: IndiaPharma. Drugs: Paracetamol. Manufacturer: Global Chemicals. (Missing: Registration Certificate number, Manufacturing License date, Clinical Data summary)."
    },
    {
      name: "Missing Stability Data",
      source: "Regulatory Screen B",
      text: "Product: Aspirin 100mg. Batch size: 100k. Packaging: Blister. Shelf life: 36 months requested. Attached: 6 months accelerated data. (Missing: 12 months long term data, humidity sensitive study)."
    },
    {
      name: "BE Study Gap",
      source: "Clinical Review C",
      text: "Bioequivalence Study Report. Test: Generic-X. Ref: Brand-Y. Sample size: 12 subjects. (Incomplete: Power calculation missing, 12 subjects is below the required 24 for this pharmacokinetic profile)."
    },
    {
      name: "Labeling Omission",
      source: "Compliance Audit D",
      text: "Draft Label for Injection-Z. Content: Sterile water. Dose: 10ml. Caution: For IV use only. (Missing: Schedule H1 warning, Storage temp, Manufacturer address)."
    },
    {
      name: "Site Master File Gap",
      source: "Quality Systems E",
      text: "Site Master File for Unit 1. Sections: Personnel, Premise, Equipment. (Missing: Complaint handling procedure, Validation master plan, Risk assessment for cross-contamination)."
    }
  ]
};
