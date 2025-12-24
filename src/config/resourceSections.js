// Available sections/fields for each resource type (used for variable extraction)
export const resourceSections = {
  'Previous Notes': [
    'Patient Name',
    'Visit Date',
    'Chief Complaint',
    'History of Present Illness',
    'Physical Examination',
    'Assessment',
    'Plan',
    'Diagnosis',
    'Medications',
    'Vital Signs',
    'Provider Name',
    'Provider Specialty'
  ],
  'Lab Results': [
    'Test Name',
    'Test Date',
    'Result Value',
    'Reference Range',
    'Units',
    'Status (Normal/Abnormal)',
    'Ordering Provider',
    'Lab Name'
  ],
  'Imaging Reports': [
    'Study Type',
    'Study Date',
    'Body Part',
    'Findings',
    'Impression',
    'Radiologist Name',
    'Modality',
    'Contrast Used'
  ],
  'Clinical Documents': [
    'Document Type',
    'Document Date',
    'Author',
    'Title',
    'Content',
    'Status',
    'Category'
  ],
  'Discharge Documents': [
    'Discharge Date',
    'Admission Date',
    'Length of Stay',
    'Discharge Diagnosis',
    'Discharge Instructions',
    'Follow-up Date',
    'Discharging Provider'
  ],
  'Medication Lists': [
    'Medication Name',
    'Dosage',
    'Frequency',
    'Route',
    'Start Date',
    'End Date',
    'Prescribing Provider',
    'Status'
  ],
  'Vital Signs': [
    'Blood Pressure',
    'Heart Rate',
    'Temperature',
    'Respiratory Rate',
    'Oxygen Saturation',
    'Weight',
    'Height',
    'BMI',
    'Measurement Date'
  ],
  'Allergies': [
    'Allergen Name',
    'Reaction',
    'Severity',
    'Onset Date',
    'Status'
  ],
  'Problem List': [
    'Problem Name',
    'ICD Code',
    'Onset Date',
    'Status',
    'Severity'
  ]
};

