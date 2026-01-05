// Map resource document types to their prerequisite summarizers
export const RESOURCE_DEPENDENCIES = {
  'Clinical Documents': ['Previous Notes'],
  'Other Docs': ['Previous Notes'],
  'Lab Results': ['Previous Notes'],
  'Imaging Results': ['Previous Notes'],
  'Problems List': ['Previous Notes']
};

// Returns the prerequisite document types for a given resource document type
export const getDependenciesForDocumentType = (documentType) => {
  return RESOURCE_DEPENDENCIES[documentType] || [];
};

