// EHR Resources Configuration
// Structure: Resource + Filter Values for each EHR
// Filters are categorized as: editable (date, count) vs advanced (rest)

export const EHR_RESOURCES = {
  ECW: [
    {
      id: 'ecw-previous-notes-xml',
      resourceLabel: 'Previous Notes XML',
      documentType: 'Previous Notes',
      fileFormat: 'XML',
      filters: {
        editable: [
          {
            id: 'dateRange',
            type: 'dateRange',
            label: 'Date Range',
            required: true
          },
          {
            id: 'count',
            type: 'count',
            label: 'Number of Notes',
            required: false
          }
        ],
        advanced: [
          {
            id: 'visitTypes',
            type: 'visitTypes',
            label: 'Visit Types',
            description: 'Filter by visit types',
            defaultValue: 'Office Visit, Follow-up, Consultation'
          },
          {
            id: 'sortingDirection',
            type: 'sortingDirection',
            label: 'Sorting Direction',
            description: 'Direction for sorting and concatenating notes',
            options: ['ascending', 'descending'],
            defaultValue: 'descending'
          }
        ]
      },
      source: 'Previous notes - Single XML file (each paragraph is filtered)',
      pipelineConfig: {
        create_intermediate: true,
        depends_on_pipelines: 'pipeline_ecw_001, pipeline_ecw_002'
      }
    }
  ],
  AthenaOne: [
    {
      id: 'athenaone-previous-notes',
      resourceLabel: 'Previous Notes',
      documentType: 'Previous Notes',
      fileFormat: null,
      filters: {
        editable: [
          {
            id: 'dateRange',
            type: 'dateRange',
            label: 'Date Range',
            required: true
          },
          {
            id: 'count',
            type: 'count',
            label: 'Number of Notes',
            required: true
          }
        ],
        advanced: []
      },
      source: 'Previous notes'
    },
    {
      id: 'athenaone-lab-results-pdf',
      resourceLabel: 'Lab Results (PDF)',
      documentType: 'Lab Results',
      fileFormat: 'PDF',
      filters: {
        editable: [
          {
            id: 'dateRange',
            type: 'dateRange',
            label: 'Date Range',
            required: true
          },
          {
            id: 'count',
            type: 'count',
            label: 'Number of Documents',
            required: true
          }
        ],
        advanced: []
      },
      source: 'Lab results'
    },
    {
      id: 'athenaone-clinical-docs-pdf-discharge',
      resourceLabel: 'Clinical Documents -> Discharge Summary',
      documentType: 'Clinical Documents',
      subType: 'Discharge Summary',
      fileFormat: 'PDF',
      filters: {
        editable: [
          {
            id: 'dateRange',
            type: 'dateRange',
            label: 'Date Range',
            required: true
          },
          {
            id: 'count',
            type: 'count',
            label: 'Number of Notes',
            required: false,
            note: 'Can apply, not implemented rn'
          },
        ],
        advanced: [
          {
            id: 'keywords',
            type: 'keywords',
            label: 'Keyword Filter',
            description: 'Customized according to need',
            examples: ['hospital', 'discharge'],
            defaultValue: 'hospital, discharge'
          }
        ]
      },
      source: 'Clinical document → discharge summary (keywords: hospital, discharge)'
    },
    {
      id: 'athenaone-clinical-docs-pdf-other-doctor',
      resourceLabel: 'Clinical Documents -> Previous Note (Other Doctor)',
      documentType: 'Clinical Documents',
      subType: 'Previous Note (Other Doctor)',
      fileFormat: 'PDF',
      filters: {
        editable: [
          {
            id: 'dateRange',
            type: 'dateRange',
            label: 'Date Range',
            required: true
          },
          {
            id: 'count',
            type: 'count',
            label: 'Number of Notes',
            required: false,
            note: 'Can apply, not implemented rn'
          },
        ],
        advanced: [
          {
            id: 'keywords',
            type: 'keywords',
            label: 'Keyword Filter',
            description: 'Customized according to need',
            examples: ['consult', 'note'],
            defaultValue: 'consult, note'
          }
        ]
      },
      source: 'Clinical document → Previous Note (Other Doctor) (keywords: consult, note)'
    },
    {
      id: 'athenaone-clinical-docs-xml-previous-encounter',
      resourceLabel: 'Clinical Documents (XML) -> Previous Encounter',
      documentType: 'Clinical Documents',
      subType: 'Previous Encounter',
      fileFormat: 'XML',
      filters: {
        editable: [
          {
            id: 'dateRange',
            type: 'dateRange',
            label: 'Date Range',
            required: true
          },
          {
            id: 'count',
            type: 'count',
            label: 'Number of Notes',
            required: false,
            note: 'Can apply, not implemented rn'
          }
        ],
        advanced: [
          {
            id: 'keywords',
            type: 'keywords',
            label: 'Keyword Filter',
            description: 'Customized according to need',
            examples: ['consult', 'note'],
            defaultValue: 'consult, note'
          }
        ]
      },
      source: 'Clinical document(XML) → previous encounter (keywords: consult, note)'
    },
    {
      id: 'athenaone-imaging-results',
      resourceLabel: 'Imaging Results',
      documentType: 'Imaging Results',
      fileFormat: null,
      filters: {
        editable: [
          {
            id: 'dateRange',
            type: 'dateRange',
            label: 'Date Range',
            required: true
          },
          {
            id: 'count',
            type: 'count',
            label: 'Number of Notes',
            required: false,
            note: 'Can apply, not implemented rn'
          }
        ],
        advanced: []
      },
      source: 'Imaging Results'
    }
  ],
  AthenaFlow: [
    {
      id: 'athenaflow-previous-notes',
      resourceLabel: 'Previous Notes',
      documentType: 'Previous Notes',
      fileFormat: null,
      filters: {
        editable: [
          {
            id: 'dateRange',
            type: 'dateRange',
            label: 'Date Range',
            required: true
          },
          {
            id: 'count',
            type: 'count',
            label: 'Number of Notes',
            required: false,
            note: 'Can apply, not implemented rn'
          }
        ],
        advanced: [
          {
            id: 'organizationIds',
            type: 'organizationIds',
            label: 'Organization IDs (List)',
            description: 'Practice level',
            isList: true,
            defaultValue: '12345, 67890, 11111'
          }
        ]
      },
      source: 'Previous notes',
      pipelineConfig: {
        create_intermediate: true,
        depends_on_pipelines: 'pipeline_athenaflow_notes'
      }
    }
  ],
  AdvancedMD: [
    {
      id: 'advancedmd-previous-notes',
      resourceLabel: 'Previous Notes',
      documentType: 'Previous Notes',
      fileFormat: null,
      filters: {
        editable: [
          {
            id: 'count',
            type: 'count',
            label: 'Number of Notes',
            required: true
          }
        ],
        advanced: [
          {
            id: 'templateIds',
            type: 'templateIds',
            label: 'Note Template IDs (List)',
            description: 'List of template IDs',
            isList: true,
            defaultValue: 'TEMPLATE_001, TEMPLATE_002, TEMPLATE_003'
          }
        ]
      },
      source: 'Previous notes',
      pipelineConfig: {
        create_intermediate: false,
        depends_on_pipelines: 'pipeline_advancedmd_001'
      }
    },
    {
      id: 'advancedmd-clinical-documents',
      resourceLabel: 'Clinical Documents',
      documentType: 'Clinical Documents',
      fileFormat: null,
      filters: {
        editable: [
          {
            id: 'dateRange',
            type: 'dateRange',
            label: 'Date Range',
            required: true
          },
          {
            id: 'count',
            type: 'count',
            label: 'Number of Notes',
            required: false,
            note: 'Can apply, not implemented rn'
          }
        ],
        advanced: [
          {
            id: 'documentTypes',
            type: 'documentTypes',
            label: 'Document Types (List)',
            description: 'Might need to set at practice level',
            isList: true,
            defaultValue: 'Progress Note, Consultation Note, Discharge Summary'
          },
          {
            id: 'keywords',
            type: 'keywords',
            label: 'Keywords',
            description: 'Customized according to need',
            defaultValue: 'clinical, assessment, diagnosis'
          }
        ]
      },
      source: 'Clinical Documents'
    }
  ],
  Charm: [
    {
      id: 'charm-previous-notes',
      resourceLabel: 'Previous Notes',
      documentType: 'Previous Notes',
      fileFormat: null,
      filters: {
        editable: [
          {
            id: 'dateRange',
            type: 'dateRange',
            label: 'Date Range',
            required: true
          },
          {
            id: 'count',
            type: 'count',
            label: 'Number of Notes',
            required: true
          }
        ],
        advanced: []
      },
      source: 'Previous notes'
    },
    {
      id: 'charm-clinical-documents-pdf',
      resourceLabel: 'Clinical Documents (PDF)',
      documentType: 'Clinical Documents',
      fileFormat: 'PDF',
      filters: {
        editable: [
          {
            id: 'dateRange',
            type: 'dateRange',
            label: 'Date Range',
            required: true
          },
          {
            id: 'count',
            type: 'count',
            label: 'Number of Notes',
            required: false,
            note: 'Can apply, not implemented rn'
          },
        ],
        advanced: [
          {
            id: 'documentTypes',
            type: 'documentTypes',
            label: 'Document Types (List)',
            description: 'Might need to set at practice level',
            isList: true,
            defaultValue: 'Progress Note, Consultation Note, Discharge Summary'
          }
        ]
      },
      source: 'Clinical Documents'
    }
  ],
  DrChrono: [
    {
      id: 'drchrono-previous-notes',
      resourceLabel: 'Previous Notes',
      documentType: 'Previous Notes',
      fileFormat: null,
      filters: {
        editable: [
          {
            id: 'dateRange',
            type: 'dateRange',
            label: 'Date Range',
            required: true
          },
          {
            id: 'count',
            type: 'count',
            label: 'Number of Notes',
            required: true
          }
        ],
        advanced: []
      },
      source: 'Previous notes'
    }
  ],
  Greenway: [
    {
      id: 'greenway-previous-notes',
      resourceLabel: 'Previous Notes',
      documentType: 'Previous Notes',
      fileFormat: null,
      filters: {
        editable: [],
        advanced: []
      },
      source: 'Previous notes (CCDA only)'
    }
  ]
};

// Helper function to get resources for an EHR
export const getResourcesForEhr = (ehr) => {
  return EHR_RESOURCES[ehr] || [];
};

// Helper function to format dropdown option text
export const formatResourceOption = (resource) => {
  // If resource already has -> format, use it as is
  if (resource.resourceLabel.includes('->')) {
    return resource.resourceLabel;
  }
  
  // Otherwise, format as Resource -> SubType or just Resource
  const baseLabel = resource.subType 
    ? `${resource.documentType} -> ${resource.subType}`
    : resource.resourceLabel;
  
  return baseLabel;
};

// Helper function to get all unique document types across all EHRs
export const getAllDocumentTypes = () => {
  const documentTypes = new Set();
  Object.values(EHR_RESOURCES).forEach(resources => {
    resources.forEach(resource => {
      if (resource.documentType) {
        documentTypes.add(resource.documentType);
      }
    });
  });
  return Array.from(documentTypes).sort();
};

// Helper function to get unique document types for a specific EHR
export const getDocumentTypesForEhr = (ehr) => {
  const documentTypes = new Set();
  const resources = EHR_RESOURCES[ehr] || [];
  resources.forEach(resource => {
    if (resource.documentType) {
      documentTypes.add(resource.documentType);
    }
  });
  return Array.from(documentTypes).sort();
};

// Helper function to get all (EHR, Document Type) combinations
export const getAllEhrDocumentTypeCombinations = () => {
  const combinations = [];
  Object.keys(EHR_RESOURCES).forEach(ehr => {
    const documentTypes = getDocumentTypesForEhr(ehr);
    documentTypes.forEach(docType => {
      combinations.push({ ehr, documentType: docType });
    });
  });
  return combinations;
};

// Helper function to get all EHR names
export const getAllEhrNames = () => {
  return Object.keys(EHR_RESOURCES).sort();
};

