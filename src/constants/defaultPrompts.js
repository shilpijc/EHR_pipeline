// Default prompts per document type (used as base for all EHRs)
export const DEFAULT_PROMPTS_BY_DOC_TYPE = {
  'Previous Notes': 'Summarize the key findings, diagnoses, and treatment plans from the previous clinical notes. Include relevant dates and any changes in patient condition.',
  'Lab Results': 'Extract and summarize the key laboratory values, highlighting any abnormal results and trends. Include reference ranges where applicable.',
  'Clinical Documents': 'Summarize the clinical document, focusing on the main findings, diagnoses, and recommendations. Include relevant dates and context.',
  'Imaging Results': 'Summarize the imaging findings, including any abnormalities, measurements, and clinical significance. Reference the imaging modality and date.',
  'Problems List': 'Extract and summarize the patient\'s active and resolved problems, including diagnoses and their current status.'
};

// Background prompts for template configuration
export const DEFAULT_BACKGROUND_PROMPTS = {
  'lab': 'The doctor has provided a Lab Reports Summary: {summary_content}\n\nUse this information to inform relevant sections, noting dates and key findings.',
  'notes': 'The doctor has provided a Previous Clinical Notes Summary: {summary_content}\n\nUse this to provide context from prior visits.',
  'imaging': 'The doctor has provided an Imaging Reports Summary: {summary_content}\n\nUse this to correlate imaging findings with clinical presentation.',
  'medication': 'The doctor has provided a Medication Summary: {summary_content}\n\nUse this for medication reconciliation and treatment planning.'
};

