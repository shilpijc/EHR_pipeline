/**
 * Helper functions for BulkTransferPage
 */

/**
 * Check if cross-EHR copy is needed based on selected doctors
 */
export const needsResourceMapping = (selectedSourceDoctors, selectedTargetDoctors, doctors) => {
  if (selectedSourceDoctors.length === 0 || selectedTargetDoctors.length === 0) {
    return false;
  }
  
  const sourceEHRs = [...new Set(selectedSourceDoctors.map(id => {
    const doctor = doctors.find(d => d.id === id);
    return doctor?.ehr;
  }))];
  
  const targetEHRs = [...new Set(selectedTargetDoctors.map(id => {
    const doctor = doctors.find(d => d.id === id);
    return doctor?.ehr;
  }))];
  
  // Check if any target EHR is different from any source EHR
  return targetEHRs.some(targetEHR => 
    sourceEHRs.every(sourceEHR => sourceEHR !== targetEHR)
  );
};

/**
 * Prepare resource mappings for cross-EHR copies
 */
export const prepareResourceMappings = (
  selectedSourceDoctors,
  selectedTargetDoctors,
  doctors,
  availableSummarizers
) => {
  const mappings = {};
  const sourceDoctors = doctors.filter(d => selectedSourceDoctors.includes(d.id));
  const targetDoctors = doctors.filter(d => selectedTargetDoctors.includes(d.id));
  
  // For each source doctor's summarizers that pull from EHR
  sourceDoctors.forEach(sourceDoctor => {
    const sourceSummarizers = availableSummarizers.filter(s => 
      s.doctorId === sourceDoctor.id && s.pullFromEHR && s.selectedResource
    );
    
    targetDoctors.forEach(targetDoctor => {
      if (sourceDoctor.ehr !== targetDoctor.ehr) {
        sourceSummarizers.forEach(summarizer => {
          const key = `${summarizer.id}-${targetDoctor.id}`;
          if (!mappings[key]) {
            mappings[key] = {
              summarizerId: summarizer.id,
              summarizerName: summarizer.name,
              sourceDoctorId: sourceDoctor.id,
              sourceDoctorName: sourceDoctor.name,
              sourceEHR: sourceDoctor.ehr,
              sourceResource: summarizer.selectedResource,
              targetDoctorId: targetDoctor.id,
              targetDoctorName: targetDoctor.name,
              targetEHR: targetDoctor.ehr,
              targetResource: null
            };
          }
        });
      }
    });
  });
  
  return mappings;
};

/**
 * Parse bulk email input into array of email addresses
 */
export const parseEmailInput = (emailString) => {
  return emailString
    .split(/[,\n]/)
    .map(e => e.trim())
    .filter(e => e.length > 0);
};

/**
 * Find doctors matching email addresses
 */
export const findDoctorsByEmails = (emails, doctors) => {
  return doctors.filter(d => 
    emails.some(email => d.email.toLowerCase() === email.toLowerCase())
  );
};

/**
 * Validate copy operation before execution
 */
export const validateCopyOperation = (state) => {
  if (state.selectedSourceDoctors.length === 0) {
    return { valid: false, message: 'Please select at least one source doctor' };
  }

  if (state.copyType === 'summarizers' && !state.selectedSummarizer) {
    return { valid: false, message: 'Please select a summarizer to copy' };
  }

  if (state.selectedTargetDoctors.length === 0 && !state.targetEmails.trim()) {
    return { valid: false, message: 'Please select target doctors or enter email addresses' };
  }

  return { valid: true };
};

/**
 * Filter doctors based on search term and EHR filter
 */
export const filterDoctors = (doctors, searchTerm, ehrFilter) => {
  return doctors.filter(doctor => {
    const matchesSearch = 
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      doctor.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEHR = ehrFilter === 'all' || doctor.ehr === ehrFilter;
    return matchesSearch && matchesEHR;
  });
};

