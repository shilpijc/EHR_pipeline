// Template hierarchy structure for medical note sections
export const templateHierarchy = {
  cc: {
    name: 'Chief Complaint',
    children: {
      'cc-primary': {
        name: 'Primary Concern',
        children: {
          'cc-primary-description': { name: 'Detailed Description' },
          'cc-primary-location': { name: 'Location' }
        }
      },
      'cc-duration': { name: 'Duration of Symptoms' },
      'cc-severity': {
        name: 'Severity Assessment',
        children: {
          'cc-severity-scale': { name: 'Pain Scale' },
          'cc-severity-impact': { name: 'Impact on Daily Life' }
        }
      }
    }
  },
  hpi: {
    name: 'History of Present Illness',
    children: {
      'hpi-onset': {
        name: 'Symptom Onset',
        children: {
          'hpi-onset-timing': { name: 'Exact Timing' },
          'hpi-onset-circumstances': { name: 'Circumstances' }
        }
      },
      'hpi-progression': { name: 'Disease Progression' },
      'hpi-associated': {
        name: 'Associated Symptoms',
        children: {
          'hpi-associated-systemic': { name: 'Systemic Symptoms' },
          'hpi-associated-local': { name: 'Local Symptoms' }
        }
      },
      'hpi-aggravating': { name: 'Aggravating Factors' },
      'hpi-relieving': { name: 'Relieving Factors' }
    }
  },
  pe: {
    name: 'Physical Examination',
    children: {
      'pe-general': { name: 'General Appearance' },
      'pe-neurological': {
        name: 'Neurological Exam',
        children: {
          'pe-neuro-cranial': { name: 'Cranial Nerves' },
          'pe-neuro-motor': { name: 'Motor Function' },
          'pe-neuro-sensory': { name: 'Sensory Function' }
        }
      },
      'pe-cardiovascular': {
        name: 'Cardiovascular Exam',
        children: {
          'pe-cardio-inspection': { name: 'Inspection' },
          'pe-cardio-auscultation': { name: 'Auscultation' }
        }
      },
      'pe-respiratory': { name: 'Respiratory Exam' }
    }
  },
  ap: {
    name: 'Assessment & Plan',
    children: {
      'ap-diagnosis': {
        name: 'Primary Diagnosis',
        children: {
          'ap-diagnosis-evidence': { name: 'Supporting Evidence' },
          'ap-diagnosis-severity': { name: 'Severity Classification' }
        }
      },
      'ap-differential': { name: 'Differential Diagnosis' },
      'ap-treatment': {
        name: 'Treatment Plan',
        children: {
          'ap-treatment-medications': { name: 'Medications' },
          'ap-treatment-procedures': { name: 'Procedures' },
          'ap-treatment-lifestyle': { name: 'Lifestyle Modifications' }
        }
      },
      'ap-followup': { name: 'Follow-up Instructions' }
    }
  }
};

