import React, { useState, useEffect } from 'react';
import { ChevronRight, Users, Plus, FileText, Database, Settings, Clock, CheckCircle, AlertCircle, Table as TableIcon, MoreVertical, Copy, Pencil, X, Info, Power, Maximize2 } from 'lucide-react';

// Import extracted configs
import { templateHierarchy } from './config/templateHierarchy';
import { resourceSections } from './config/resourceSections';
import { EHR_RESOURCES, getResourcesForEhr, formatResourceOption, getAllDocumentTypes, getDocumentTypesForEhr, getAllEhrDocumentTypeCombinations, getAllEhrNames } from './config/ehrResources';

// Import utility functions
import { computeRelativeDate } from './utils/dateHelpers';

const SummarizerPrototype = () => {
  const [currentView, setCurrentView] = useState('doctors');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPractice, setSelectedPractice] = useState('all');
  const [currentTab, setCurrentTab] = useState('general');
  const [highlightedSection, setHighlightedSection] = useState(null);

  // ============================================================================
  // GENERAL/UI STATE
  // ============================================================================
  const [configMode, setConfigMode] = useState('summarizers'); // 'summarizers' | 'variables'
  const [openDropdown, setOpenDropdown] = useState(null);
  const [createTypeDropdown, setCreateTypeDropdown] = useState(null); // doctor.id for which create dropdown is open
  const [viewAllCreateDropdown, setViewAllCreateDropdown] = useState(null); // 'summarizers' | null for View All page
  const [summarizerPickerDropdown, setSummarizerPickerDropdown] = useState(null); // sectionId for which picker is open
  const [viewAllMode, setViewAllMode] = useState('list'); // 'list' | 'combined' for View All page
  const [showActivateConfirm, setShowActivateConfirm] = useState(null); // summarizerId for which confirmation is shown
  const [pendingActivateAction, setPendingActivateAction] = useState(null); // { summarizerId, newActiveState }
  
  // Initialize default prompts for all (EHR, Document Type) combinations
  const initializeEhrDocumentTypePrompts = () => {
    const combinations = getAllEhrDocumentTypeCombinations();
    const prompts = {};
    
    // Default prompts per document type (will be used as base for all EHRs)
    const defaultPromptsByDocType = {
      'Previous Notes': 'Summarize the key findings, diagnoses, and treatment plans from the previous clinical notes. Include relevant dates and any changes in patient condition.',
      'Lab Results': 'Extract and summarize the key laboratory values, highlighting any abnormal results and trends. Include reference ranges where applicable.',
      'Clinical Documents': 'Summarize the clinical document, focusing on the main findings, diagnoses, and recommendations. Include relevant dates and context.',
      'Imaging Results': 'Summarize the imaging findings, including any abnormalities, measurements, and clinical significance. Reference the imaging modality and date.',
      'Problems List': 'Extract and summarize the patient\'s active and resolved problems, including diagnoses and their current status.'
    };
    
    // Initialize all combinations with defaults
    combinations.forEach(({ ehr, documentType }) => {
      const key = `${ehr}-${documentType}`;
      prompts[key] = defaultPromptsByDocType[documentType] || `Default prompt for ${ehr} ${documentType}`;
    });
    
    return prompts;
  };

  // Default prompts per (EHR, Document Type) combination (managed by Ops)
  const [documentTypePrompts, setDocumentTypePrompts] = useState(() => initializeEhrDocumentTypePrompts());
  
  // State for editing document type prompts
  const [editingDocType, setEditingDocType] = useState(null);
  const [editPrompt, setEditPrompt] = useState('');
  
  // State for EHR filter in Manage Documents view
  const [selectedEhrFilter, setSelectedEhrFilter] = useState('All EHRs');

  // ============================================================================
  // SUMMARIZER STATE
  // ============================================================================
  // Modal state for background prompts
  const [showBgModal, setShowBgModal] = useState(false);
  const [currentSummarizer, setCurrentSummarizer] = useState(null);

  // Modal state for summarizer picker
  const [showPickerModal, setShowPickerModal] = useState(false);
  const [pendingSectionId, setPendingSectionId] = useState(null);

  // Copy modals state
  const [showCopySummarizerModal, setShowCopySummarizerModal] = useState(false);
  const [showCopyDoctorModal, setShowCopyDoctorModal] = useState(false);
  const [copySourceDoctor, setCopySourceDoctor] = useState(null);
  const [selectedSummarizers, setSelectedSummarizers] = useState([]);
  const [targetDoctorEmails, setTargetDoctorEmails] = useState(['']);
  const [targetEHR, setTargetEHR] = useState('');

  // Resource mapping state for different EHR copies
  const [showResourceMappingModal, setShowResourceMappingModal] = useState(false);
  const [pendingResourceMappings, setPendingResourceMappings] = useState([]);

  // Background prompts state (for template configuration)
  const [bgPrompts, setBgPrompts] = useState({
    'lab': 'The doctor has provided a Lab Reports Summary: {summary_content}\n\nUse this information to inform relevant sections, noting dates and key findings.',
    'notes': 'The doctor has provided a Previous Clinical Notes Summary: {summary_content}\n\nUse this to provide context from prior visits.',
    'imaging': 'The doctor has provided an Imaging Reports Summary: {summary_content}\n\nUse this to correlate imaging findings with clinical presentation.',
    'medication': 'The doctor has provided a Medication Summary: {summary_content}\n\nUse this for medication reconciliation and treatment planning.'
  });
  const [editedPrompts, setEditedPrompts] = useState(new Set());

  
  // Store created summarizers
  const [createdSummarizers, setCreatedSummarizers] = useState([
    // Dummy summarizers for testing
    {
      id: 'summarizer-1',
      name: 'Neurology Visit Summary',
      purpose: 'Summarize neurology consultation visits',
      pullFromEHR: true,
      allowUpload: true,
      allowText: false,
      useSeparatePrompts: false,
      commonPrompt: 'Summarize the key findings and recommendations from this visit.',
      doctorId: 1,
      doctorName: 'Dr. Sarah Chen',
      ehr: 'ECW',
      selectedResource: 'ecw-previous-notes-xml',
      resourceType: 'existing',
      dateFrom: '2024-01-01',
      dateTo: '2024-12-31',
      documentCount: 5,
      primaryModel: 'gpt-4-turbo',
      fallbackModel: 'gpt-4',
      active: true
    },
    {
      id: 'summarizer-2',
      name: 'Cardiology Lab Review',
      purpose: 'Review and summarize cardiac lab results',
      pullFromEHR: true,
      allowUpload: false,
      allowText: true,
      useSeparatePrompts: true,
      commonPrompt: '',
      ehrPrompt: 'Extract and summarize cardiac enzyme levels and lipid panels.',
      textPrompt: 'Summarize the key cardiac lab values from the pasted text.',
      doctorId: 2,
      doctorName: 'Dr. Michael Rodriguez',
      ehr: 'AthenaOne',
      selectedResource: 'athenaone-lab-results-pdf',
      resourceType: 'existing',
      singleDate: '2024-12-01',
      documentCount: 10,
      primaryModel: 'claude-3-opus',
      fallbackModel: 'gpt-4-turbo',
      active: true
    }
  ]);

  // Form data for create summarizer
  const [formData, setFormData] = useState({
    name: '',
    purpose: '',
    pullFromEHR: false,
    allowUpload: false,
    allowText: false,
    useSeparatePrompts: false, // Default: one prompt for all
    commonPrompt: '', // Single prompt for all types
    resourceType: 'existing',
    selectedResource: '', // Now stores resource ID from EHR_RESOURCES
    newResourceDesc: '',
    dataSelection: 'count',
    documentCount: 5,
    dateFrom: '',
    dateTo: '',
    singleDate: '',
    organizationIds: '',
    templateIds: '',
    keywords: '',
    visitTypes: '',
    sortingDirection: '',
    documentTypes: '',
    fileType: '',
    ehrPrompt: '',
    uploadPrompt: '',
    textPrompt: '',
    primaryModel: 'claude-3-sonnet',
    fallbackModel: 'gpt-4-turbo',
    avg_summarization_time: 60,
    // Advanced settings
    create_intermediate: true,
    depends_on_summarisers: [],
    active: true,
    // Variables (tied to the selected EHR resource)
    variables: [] // Array of { name, extractionMethod, selectedSection?, llmQuery? }
  });
  
  // Advanced settings visibility state
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  
  // Popup state for advanced settings changes
  const [showAdvancedSettingsPopup, setShowAdvancedSettingsPopup] = useState(false);
  
  // State to track if advanced settings are unlocked for editing
  const [advancedSettingsUnlocked, setAdvancedSettingsUnlocked] = useState(false);
  
  // State to track if advanced settings were edited
  const [advancedSettingsEdited, setAdvancedSettingsEdited] = useState(false);
  
  // State to track if prompts were edited
  const [promptsEdited, setPromptsEdited] = useState(false);
  
  // State for maximized prompt modal
  const [maximizedPromptField, setMaximizedPromptField] = useState(null); // 'common' | 'ehr' | 'upload' | 'text' | null
  const [maximizedPromptValue, setMaximizedPromptValue] = useState('');
  
  // State for adding variables in Create Summarizer form
  const [showAddVariableForm, setShowAddVariableForm] = useState(false);
  const [editingVariableIndex, setEditingVariableIndex] = useState(null);
  const [newVariable, setNewVariable] = useState({
    name: '',
    extractionMethod: '',
    selectedSection: '',
    llmQuery: ''
  });
  
  // Track summarizers added to each section (including children and grandchildren)
  const [sectionSummarizers, setSectionSummarizers] = useState({
    cc: [],
    'cc-primary': [],
    'cc-primary-description': [],
    'cc-primary-location': [],
    'cc-duration': [],
    'cc-severity': [],
    'cc-severity-scale': [],
    'cc-severity-impact': [],
    hpi: [],
    'hpi-onset': [],
    'hpi-onset-timing': [],
    'hpi-onset-circumstances': [],
    'hpi-progression': [],
    'hpi-associated': [],
    'hpi-associated-systemic': [],
    'hpi-associated-local': [],
    'hpi-aggravating': [],
    'hpi-relieving': [],
    pe: [],
    'pe-general': [],
    'pe-neurological': [],
    'pe-neuro-cranial': [],
    'pe-neuro-motor': [],
    'pe-neuro-sensory': [],
    'pe-cardiovascular': [],
    'pe-cardio-inspection': [],
    'pe-cardio-auscultation': [],
    'pe-respiratory': [],
    ap: [],
    'ap-diagnosis': [],
    'ap-diagnosis-evidence': [],
    'ap-diagnosis-severity': [],
    'ap-differential': [],
    'ap-treatment': [],
    'ap-treatment-medications': [],
    'ap-treatment-procedures': [],
    'ap-treatment-lifestyle': [],
    'ap-followup': []
  });


  // ============================================================================
  // CREATE FLOW STATE
  // ============================================================================
  const [createType, setCreateType] = useState(null); // 'summarizer' | null
  const [showCreateTypeModal, setShowCreateTypeModal] = useState(false);
  const [editingSummarizerId, setEditingSummarizerId] = useState(null);

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================
  
  // Generate default 1000-character prompts
  const generateDefaultPrompt = (type) => {
    const prompts = {
      common: `You are a medical documentation assistant specializing in creating comprehensive, accurate, and clinically relevant summaries from patient medical records. Your task is to analyze the provided medical information and generate a structured summary that captures all essential clinical details while maintaining medical accuracy and clarity.

When processing medical data, please:
1. Extract and organize key clinical information including patient demographics, chief complaints, history of present illness, review of systems, physical examination findings, assessment, and plan
2. Identify and highlight critical medical findings, diagnoses, medications, allergies, and important clinical decisions
3. Preserve medical terminology and clinical context while ensuring the summary is readable and well-structured
4. Note any discrepancies, missing information, or areas requiring clarification
5. Maintain patient privacy and confidentiality throughout the summarization process
6. Format the output in a clear, hierarchical structure that facilitates easy review by healthcare providers
7. Include relevant dates, timelines, and temporal relationships between clinical events
8. Cross-reference related information across different sections of the medical record
9. Identify and flag any urgent or critical findings that require immediate attention
10. Ensure all numerical values, measurements, and clinical parameters are accurately represented

The summary should be comprehensive yet concise, providing healthcare providers with a clear understanding of the patient's clinical status, treatment history, and care plan.`,
      
      ehr: `You are a specialized medical documentation assistant focused on extracting and summarizing information from Electronic Health Record (EHR) systems. Your primary responsibility is to process structured and unstructured data from EHR systems and transform it into coherent, clinically meaningful summaries.

When processing EHR data, please:
1. Extract structured data elements including lab results, vital signs, medications, diagnoses, procedures, and clinical notes
2. Identify and organize information by encounter date, provider, and clinical context
3. Highlight trends and patterns in clinical data over time, such as changes in lab values, vital signs, or medication regimens
4. Cross-reference information across different EHR modules (e.g., connect lab results to relevant clinical notes)
5. Identify and flag abnormal values, critical findings, or alerts that require clinical attention
6. Preserve the chronological sequence of clinical events and encounters
7. Extract and summarize provider notes, including assessment and plan details
8. Identify medication changes, dosage adjustments, and medication-related clinical decisions
9. Note any care coordination elements, referrals, or follow-up requirements
10. Ensure compliance with clinical documentation standards and maintain data integrity

The EHR summary should provide a comprehensive view of the patient's medical history, current status, and ongoing care plan as documented in the electronic health record system.`,
      
      upload: `You are a medical documentation assistant specialized in processing uploaded medical documents, including PDFs, scanned records, and other file formats. Your task is to extract, analyze, and summarize medical information from these documents while maintaining accuracy and clinical relevance.

When processing uploaded documents, please:
1. Extract text and structured data from PDFs, scanned images, and other document formats
2. Identify document type (e.g., lab report, imaging study, consultation note, discharge summary, referral letter)
3. Extract key clinical information including patient identifiers, dates, providers, diagnoses, findings, and recommendations
4. Preserve numerical values, measurements, and clinical parameters with their units and reference ranges
5. Identify and highlight abnormal findings, critical values, or urgent clinical information
6. Maintain the original document structure and organization where possible
7. Note any image quality issues, missing pages, or illegible sections that may affect data extraction
8. Cross-reference information within the document to ensure consistency and completeness
9. Format the summary in a clear, structured manner that facilitates clinical review
10. Include document metadata such as source, date, and provider information when available

The summary should accurately represent the content of the uploaded document while presenting the information in a format that is easy to review and integrate into the patient's medical record.`,
      
      text: `You are a medical documentation assistant designed to process and summarize medical information provided as free-text input. Your task is to analyze pasted or typed medical text and extract key clinical information to create a structured, comprehensive summary.

When processing pasted text, please:
1. Identify and extract key clinical elements including symptoms, diagnoses, medications, procedures, and clinical findings
2. Organize the information into logical sections (e.g., history, examination, assessment, plan)
3. Identify temporal relationships and sequence of events mentioned in the text
4. Extract numerical values, measurements, and clinical parameters with appropriate context
5. Identify and highlight critical or urgent information that requires immediate attention
6. Note any ambiguities, incomplete information, or areas requiring clarification
7. Preserve medical terminology and clinical context while ensuring readability
8. Identify relationships between different pieces of information (e.g., symptoms and diagnoses)
9. Format the summary in a clear, hierarchical structure
10. Maintain the clinical accuracy and integrity of the information provided

The summary should transform unstructured text input into a well-organized, clinically relevant summary that captures all essential information while maintaining accuracy and clarity.`
    };
    return prompts[type] || prompts.common;
  };

  // Get summariser options for dropdown (same doctor only)
  const getSummariserOptions = () => {
    if (!selectedDoctor) return [];
    
    return createdSummarizers
      .filter(s => s.doctorId === selectedDoctor.id)
      .map(s => {
        // Get EHR document name/resource from selectedResource
        const resource = s.selectedResource ? 
          getResourcesForEhr(s.ehr).find(r => r.id === s.selectedResource) : null;
        const resourceName = resource ? formatResourceOption(resource) : 'No Resource';
        
        return {
          id: s.id,
          label: `${s.name} - ${resourceName}`,
          name: s.name,
          resourceName: resourceName
        };
      });
  };

  // Handle maximizing prompt field
  const handleMaximizePrompt = (field) => {
    let currentValue = '';
    if (field === 'common') currentValue = formData.commonPrompt;
    else if (field === 'ehr') currentValue = formData.ehrPrompt;
    else if (field === 'upload') currentValue = formData.uploadPrompt;
    else if (field === 'text') currentValue = formData.textPrompt;
    
    setMaximizedPromptValue(currentValue);
    setMaximizedPromptField(field);
  };

  // Handle saving maximized prompt
  const handleSaveMaximizedPrompt = () => {
    if (maximizedPromptField === 'common') {
      setFormData({...formData, commonPrompt: maximizedPromptValue});
    } else if (maximizedPromptField === 'ehr') {
      setFormData({...formData, ehrPrompt: maximizedPromptValue});
    } else if (maximizedPromptField === 'upload') {
      setFormData({...formData, uploadPrompt: maximizedPromptValue});
    } else if (maximizedPromptField === 'text') {
      setFormData({...formData, textPrompt: maximizedPromptValue});
    }
    
    setPromptsEdited(true);
    setMaximizedPromptField(null);
    setMaximizedPromptValue('');
  };

  // ============================================================================
  // TEMPLATE HIERARCHY (shared structure)
  // ============================================================================
  // Now imported from config - templateHierarchy is imported at the top

  // Pre-fill prompts with defaults when input types are selected
  useEffect(() => {
    if (!formData.pullFromEHR && !formData.allowUpload && !formData.allowText) {
      return; // No input types selected yet
    }

    // Only pre-fill if prompts are empty (to avoid overwriting user edits)
    const shouldPreFill = {
      common: !formData.commonPrompt && !formData.useSeparatePrompts,
      ehr: !formData.ehrPrompt && formData.useSeparatePrompts && formData.pullFromEHR,
      upload: !formData.uploadPrompt && formData.useSeparatePrompts && formData.allowUpload,
      text: !formData.textPrompt && formData.useSeparatePrompts && formData.allowText
    };

    if (shouldPreFill.common || shouldPreFill.ehr || shouldPreFill.upload || shouldPreFill.text) {
      setFormData(prev => {
        const updated = {...prev};
        if (shouldPreFill.common) {
          updated.commonPrompt = generateDefaultPrompt('common');
        }
        if (shouldPreFill.ehr) {
          updated.ehrPrompt = generateDefaultPrompt('ehr');
        }
        if (shouldPreFill.upload) {
          updated.uploadPrompt = generateDefaultPrompt('upload');
        }
        if (shouldPreFill.text) {
          updated.textPrompt = generateDefaultPrompt('text');
        }
        return updated;
      });
    }
  }, [formData.pullFromEHR, formData.allowUpload, formData.allowText, formData.useSeparatePrompts]);

  // Initialize with example data including children
  useEffect(() => {
    setSectionSummarizers(prev => ({
      ...prev,
      'hpi-onset': [
        {
          id: 'lab-hpi-onset-1',
          type: 'lab',
          name: '📊 Lab Reports',
          bgColor: '#dbeafe',
          color: '#1e40af',
          action: 'inform',
          instructions: 'Use lab trends to correlate with symptom timeline.'
        }
      ],
      'hpi-associated': [
        {
          id: 'notes-hpi-associated-1',
          type: 'notes',
          name: '📄 Previous Notes',
          bgColor: '#dcfce7',
          color: '#166534',
          action: 'inform',
          instructions: 'Reference previous documented associated symptoms.'
        }
      ]
    }));
  }, []);
  
  // ============================================================================
  // DATA CONSTANTS
  // ============================================================================
  // EHR color mapping for demo
  const ehrColors = {
    ECW: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', badge: 'bg-blue-100' },
    AthenaOne: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', badge: 'bg-green-100' },
    AthenaFlow: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', badge: 'bg-purple-100' },
    AdvancedMD: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', badge: 'bg-amber-100' },
    Charm: { bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-700', badge: 'bg-pink-100' },
    DrChrono: { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700', badge: 'bg-indigo-100' },
    Greenway: { bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-700', badge: 'bg-teal-100' }
  };

  const doctors = [
    {
      id: 1,
      name: "Dr. Sarah Chen",
      email: "s.chen@dent-neuro.com",
      specialty: "Neurology",
      ehr: "ECW",
      summarizers: 8,
      lastActive: "2 hours ago",
      status: "active"
    },
    {
      id: 2,
      name: "Dr. Michael Rodriguez",
      email: "m.rodriguez@cardiocare.com",
      specialty: "Cardiology", 
      ehr: "AthenaOne",
      summarizers: 12,
      lastActive: "1 day ago",
      status: "active"
    },
    {
      id: 3,
      name: "Dr. Emily Johnson",
      email: "e.johnson@orthoplex.com",
      specialty: "Orthopedics",
      ehr: "AthenaFlow",
      summarizers: 6,
      lastActive: "3 hours ago",
      status: "active"
    },
    {
      id: 4,
      name: "Dr. James Park",
      email: "j.park@dermaclinic.com", 
      specialty: "Dermatology",
      ehr: "AdvancedMD",
      summarizers: 3,
      lastActive: "5 days ago",
      status: "inactive"
    },
    {
      id: 5,
      name: "Dr. Lisa Thompson",
      email: "l.thompson@charmcare.com",
      specialty: "Internal Medicine",
      ehr: "Charm",
      summarizers: 5,
      lastActive: "1 hour ago",
      status: "active"
    },
    {
      id: 6,
      name: "Dr. Robert Kim",
      email: "r.kim@drchrono.com",
      specialty: "Family Medicine",
      ehr: "DrChrono",
      summarizers: 7,
      lastActive: "4 hours ago",
      status: "active"
    },
    {
      id: 7,
      name: "Dr. Maria Garcia",
      email: "m.garcia@greenway.com",
      specialty: "Pediatrics",
      ehr: "Greenway",
      summarizers: 4,
      lastActive: "2 days ago",
      status: "active"
    }
  ];

  const practices = ['all', 'Neurology', 'Cardiology', 'Orthopedics', 'Dermatology'];

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         doctor.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPractice = selectedPractice === 'all' || doctor.specialty === selectedPractice;
    return matchesSearch && matchesPractice;
  });

  // ============================================================================
  // SUMMARIZER HANDLERS
  // ============================================================================
  const handleCreateSummarizer = (doctor) => {
    setSelectedDoctor(doctor);
    setCreateTypeDropdown(createTypeDropdown === doctor.id ? null : doctor.id);
  };

  const handleSelectCreateType = (type) => {
    setCreateType(type);
    setCreateTypeDropdown(null);
    setCurrentView('create');
  };

  const handleEditSummarizer = (summarizerId) => {
    const summarizer = createdSummarizers.find(s => s.id === summarizerId);
    if (!summarizer) return;
    
    setEditingSummarizerId(summarizerId);
    setFormData({
      name: summarizer.name,
      purpose: summarizer.purpose,
      pullFromEHR: summarizer.pullFromEHR,
      allowUpload: summarizer.allowUpload,
      allowText: summarizer.allowText,
      useSeparatePrompts: summarizer.useSeparatePrompts,
      commonPrompt: summarizer.commonPrompt || '',
      resourceType: summarizer.resourceType || 'existing',
      selectedResource: summarizer.selectedResource || '',
      newResourceDesc: summarizer.newResourceDesc || '',
      dataSelection: summarizer.dataSelection || 'count',
      documentCount: summarizer.documentCount || 5,
      dateFrom: summarizer.dateFrom || '',
      dateTo: summarizer.dateTo || '',
      singleDate: summarizer.singleDate || '',
      organizationIds: summarizer.organizationIds || '',
      templateIds: summarizer.templateIds || '',
      keywords: summarizer.keywords || '',
      ehrPrompt: summarizer.ehrPrompt || '',
      uploadPrompt: summarizer.uploadPrompt || '',
      textPrompt: summarizer.textPrompt || '',
      primaryModel: summarizer.primaryModel || '',
      fallbackModel: summarizer.fallbackModel || '',
      avg_summarization_time: summarizer.avg_summarization_time || 60,
      create_intermediate: summarizer.create_intermediate || false,
      depends_on_summarisers: summarizer.depends_on_summarisers || [],
      active: summarizer.active !== undefined ? summarizer.active : true,
      variables: summarizer.variables || []
    });
    setCreateType('summarizer');
    setCurrentView('create');
  };

  const handleCancelCreate = () => {
    setCurrentView('doctors');
    setCreateType(null);
    setAdvancedSettingsUnlocked(false);
    setAdvancedSettingsEdited(false);
    setPromptsEdited(false);
    setEditingSummarizerId(null);
    setShowAddVariableForm(false);
    setEditingVariableIndex(null);
    setNewVariable({ name: '', extractionMethod: '', selectedSection: '', llmQuery: '' });
    setMaximizedPromptField(null);
    setMaximizedPromptValue('');
    setFormData({
      name: '',
      purpose: '',
      pullFromEHR: false,
      allowUpload: false,
      allowText: false,
      useSeparatePrompts: false,
      commonPrompt: '',
      resourceType: 'existing',
      selectedResource: '',
      newResourceDesc: '',
      dataSelection: 'count',
      documentCount: 5,
      dateFrom: '',
      dateTo: '',
      singleDate: '',
      organizationIds: '',
      templateIds: '',
      keywords: '',
      ehrPrompt: '',
      uploadPrompt: '',
      textPrompt: '',
      primaryModel: 'claude-3-sonnet',
      fallbackModel: 'gpt-4-turbo',
      avg_summarization_time: 60,
      create_intermediate: true,
      depends_on_summarisers: [],
      active: true,
      variables: []
    });
    setShowAdvancedSettings(false);
  };

  const handleConfigureTemplates = (doctor) => {
    setSelectedDoctor(doctor);
    setCurrentView('templates');
  };

  const handleCopySummarizer = (doctor) => {
    setCopySourceDoctor(doctor);
    setSelectedSummarizers([]);
    setShowCopySummarizerModal(true);
    setOpenDropdown(null);
  };

  const toggleSummarizerSelection = (summarizerId) => {
    setSelectedSummarizers(prev => {
      if (prev.includes(summarizerId)) {
        return prev.filter(id => id !== summarizerId);
      } else {
        return [...prev, summarizerId];
      }
    });
  };

  const handleCopyDoctorConfig = (doctor) => {
    setCopySourceDoctor(doctor);
    setTargetDoctorEmails(['']);
    setTargetEHR('');
    setShowCopyDoctorModal(true);
    setOpenDropdown(null);
  };

  const addEmailField = () => {
    setTargetDoctorEmails([...targetDoctorEmails, '']);
  };

  const removeEmailField = (index) => {
    if (targetDoctorEmails.length > 1) {
      setTargetDoctorEmails(targetDoctorEmails.filter((_, i) => i !== index));
    }
  };

  const updateEmailField = (index, value) => {
    const newEmails = [...targetDoctorEmails];
    newEmails[index] = value;
    setTargetDoctorEmails(newEmails);
  };

  const handleSummarizerClick = (summarizerId, summarizerName) => {
    setCurrentSummarizer({ id: summarizerId, name: summarizerName });
    setShowBgModal(true);
  };

  const handleSaveBgPrompt = (newPrompt) => {
    if (currentSummarizer && newPrompt) {
      setBgPrompts(prev => ({
        ...prev,
        [currentSummarizer.id]: newPrompt
      }));
      // Mark as edited if different from default
      const defaultPrompts = {
        'lab': 'The doctor has provided a Lab Reports Summary: {summary_content}\n\nUse this information to inform relevant sections, noting dates and key findings.',
        'notes': 'The doctor has provided a Previous Clinical Notes Summary: {summary_content}\n\nUse this to provide context from prior visits.',
        'imaging': 'The doctor has provided an Imaging Reports Summary: {summary_content}\n\nUse this to correlate imaging findings with clinical presentation.',
        'medication': 'The doctor has provided a Medication Summary: {summary_content}\n\nUse this for medication reconciliation and treatment planning.'
      };
      
      if (newPrompt !== defaultPrompts[currentSummarizer.id]) {
        setEditedPrompts(prev => new Set([...prev, currentSummarizer.id]));
      } else {
        setEditedPrompts(prev => {
          const newSet = new Set(prev);
          newSet.delete(currentSummarizer.id);
          return newSet;
        });
      }
      
      setShowBgModal(false);
      setCurrentSummarizer(null);
    }
  };

  const closeBgModal = () => {
    setShowBgModal(false);
    setCurrentSummarizer(null);
  };

  const addSummarizer = (sectionId) => {
    setSummarizerPickerDropdown(summarizerPickerDropdown === sectionId ? null : sectionId);
  };

  const selectSummarizerOption = (sectionId, summarizerIndex) => {
    const summarizers = [
      { id: 'lab', name: '📊 Lab Reports', bgColor: '#dbeafe', color: '#1e40af' },
      { id: 'notes', name: '📄 Previous Notes', bgColor: '#dcfce7', color: '#166534' },
      { id: 'imaging', name: '🖼️ Imaging Reports', bgColor: '#fef3c7', color: '#d97706' },
      { id: 'medication', name: '💊 Medication', bgColor: '#f3e8ff', color: '#7c3aed' }
    ];

    if (!sectionId) {
      alert('Error: No section selected');
      return;
    }

    const selectedSummarizer = summarizers[summarizerIndex];
    
    // Create new summarizer object with unique ID
    const newSummarizer = {
      id: `${selectedSummarizer.id}-${sectionId}-${Date.now()}`,
      type: selectedSummarizer.id,
      name: selectedSummarizer.name,
      bgColor: selectedSummarizer.bgColor,
      color: selectedSummarizer.color,
      action: 'inform', // default action
      instructions: '' // empty instructions by default
    };

    // Add summarizer to the section
    setSectionSummarizers(prev => ({
      ...prev,
      [sectionId]: [...prev[sectionId], newSummarizer]
    }));
    
    setSummarizerPickerDropdown(null);
  };

  const removeSummarizer = (sectionId, summarizerId) => {
    if (confirm('Remove this summarizer?')) {
      setSectionSummarizers(prev => ({
        ...prev,
        [sectionId]: prev[sectionId].filter(s => s.id !== summarizerId)
      }));
    }
  };

  const updateSummarizerAction = (sectionId, summarizerId, action) => {
    setSectionSummarizers(prev => ({
      ...prev,
      [sectionId]: prev[sectionId].map(s => 
        s.id === summarizerId ? { ...s, action } : s
      )
    }));
  };

  const updateSummarizerInstructions = (sectionId, summarizerId, instructions) => {
    setSectionSummarizers(prev => ({
      ...prev,
      [sectionId]: prev[sectionId].map(s =>
        s.id === summarizerId ? { ...s, instructions } : s
      )
    }));
  };

  // ============================================================================
  // VARIABLE HANDLERS
  // ============================================================================
  // Variable resource constants
  const variableResources = [
    'Previous Notes',
    'Lab Results',
    'Imaging Reports',
    'Clinical Documents',
    'Discharge Documents',
    'Medication Lists',
    'Vital Signs',
    'Allergies',
    'Problem List'
  ];

  // Available sections/fields for each resource type
  // Now imported from config - resourceSections is imported at the top


  // ============================================================================
  // RENDER FUNCTIONS

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close View All dropdowns
      if (viewAllCreateDropdown && !event.target.closest('.view-all-dropdown-container')) {
        setViewAllCreateDropdown(null);
      }
      // Close doctor card dropdowns
      if (createTypeDropdown && !event.target.closest('.create-dropdown-container')) {
        setCreateTypeDropdown(null);
      }
      if (openDropdown && !event.target.closest('.more-dropdown-container')) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [viewAllCreateDropdown, createTypeDropdown, openDropdown]);

  const jumpToSection = (templateTab, sectionId) => {
    // Switch to templates view and the correct tab
    setCurrentView('templates');
    setCurrentTab(templateTab);

    // Wait for DOM to update, then scroll to section
    setTimeout(() => {
      const sectionElement = document.getElementById(`content-${sectionId}`);
      const iconElement = document.getElementById(`icon-${sectionId}`);

      if (sectionElement) {
        // Open the section if it's closed
        sectionElement.style.display = 'block';
        if (iconElement) {
          iconElement.style.transform = 'rotate(90deg)';
        }

        // Scroll into view
        sectionElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Highlight the section temporarily
        setHighlightedSection(sectionId);
        sectionElement.style.transition = 'background-color 0.3s';
        sectionElement.style.backgroundColor = '#fef3c7';

        setTimeout(() => {
          sectionElement.style.backgroundColor = '';
          setHighlightedSection(null);
        }, 2000);
      }
    }, 100);
  };

  // ============================================================================
  // SUMMARIZER RENDER FUNCTIONS
  // ============================================================================
  const renderSummarizerBlock = (summarizer, sectionId) => (
    <div key={summarizer.id} style={{
      background: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '12px'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px'
      }}>
        <span style={{
          background: summarizer.bgColor,
          color: summarizer.color,
          padding: '6px 12px',
          borderRadius: '6px',
          fontSize: '13px',
          fontWeight: '600'
        }}>
          {summarizer.name}
        </span>
        <button
          onClick={() => removeSummarizer(sectionId, summarizer.id)}
          style={{
            background: 'transparent',
            color: '#ef4444',
            border: '1px solid #ef4444',
            padding: '4px 10px',
            borderRadius: '4px',
            fontSize: '12px',
            cursor: 'pointer',
            fontWeight: '600',
            transition: 'all 0.2s'
          }}
        >
          Remove
        </button>
      </div>
      <div style={{
        display: 'flex',
        gap: '16px',
        marginBottom: '12px'
      }}>
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          cursor: 'pointer',
          fontSize: '14px',
          color: '#374151'
        }}>
          <input 
            type="checkbox" 
            checked={summarizer.action === 'append'}
            onChange={() => updateSummarizerAction(sectionId, summarizer.id, 'append')}
          />
          Append
        </label>
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          cursor: 'pointer',
          fontSize: '14px',
          color: '#374151'
        }}>
          <input 
            type="checkbox" 
            checked={summarizer.action === 'prepend'}
            onChange={() => updateSummarizerAction(sectionId, summarizer.id, 'prepend')}
          />
          Prepend
        </label>
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          cursor: 'pointer',
          fontSize: '14px',
          color: '#374151'
        }}>
          <input 
            type="checkbox" 
            checked={summarizer.action === 'inform'}
            onChange={() => updateSummarizerAction(sectionId, summarizer.id, 'inform')}
          />
          Inform
        </label>
      </div>
      <textarea
        style={{
          width: '100%',
          padding: '10px',
          border: '1px solid #d1d5db',
          borderRadius: '6px',
          fontSize: '14px',
          minHeight: '80px',
          fontFamily: 'inherit',
          resize: 'vertical',
          display: summarizer.action === 'inform' ? 'block' : 'none'
        }}
        placeholder="Custom instructions..."
        value={summarizer.instructions}
        onChange={(e) => updateSummarizerInstructions(sectionId, summarizer.id, e.target.value)}
      />
    </div>
  );

  const renderGrandchildSection = (parentKey, childKey, grandchildKey, grandchild) => (
    <div key={grandchildKey} style={{
      background: '#fefefe',
      border: '1px solid #e5e7eb',
      borderRadius: '6px',
      marginBottom: '6px',
      marginLeft: '20px'
    }}>
      <div
        onClick={() => {
          const content = document.getElementById(`content-${grandchildKey}`);
          const icon = document.getElementById(`icon-${grandchildKey}`);
          if (content.style.display === 'none' || !content.style.display) {
            content.style.display = 'block';
            icon.style.transform = 'rotate(90deg)';
          } else {
            content.style.display = 'none';
            icon.style.transform = 'rotate(0deg)';
          }
        }}
        style={{
          padding: '10px 14px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #e5e7eb',
          position: 'relative'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
        <span id={`icon-${grandchildKey}`} style={{
          fontSize: '7px',
          color: '#9ca3af',
          marginRight: '8px',
          transform: 'rotate(90deg)',
          transition: 'transform 0.2s'
        }}>▶</span>
        <span style={{
          fontSize: '13px',
          fontWeight: '600',
          color: '#64748b'
        }}>{grandchild.name}</span>
      </div>
        {configMode === 'summarizers' && (
          <div className="relative" onClick={(e) => e.stopPropagation()} style={{ position: 'relative' }}>
        <button
          onClick={() => addSummarizer(grandchildKey)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-1.5 py-0.5 rounded text-xs font-medium shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-1"
        >
              <Plus className="w-3 h-3" />
              <span>Add</span>
            </button>
            {summarizerPickerDropdown === grandchildKey && (
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-xl border border-slate-200 py-2 z-30">
                <button
                  onClick={() => selectSummarizerOption(grandchildKey, 0)}
                  className="w-full px-3 py-2 text-left text-xs hover:bg-slate-50 transition-colors flex items-center gap-2"
                >
                  <span>📊</span>
                  <span className="text-slate-700">Lab Reports</span>
                </button>
                <button
                  onClick={() => selectSummarizerOption(grandchildKey, 1)}
                  className="w-full px-3 py-2 text-left text-xs hover:bg-slate-50 transition-colors flex items-center gap-2"
                >
                  <span>📄</span>
                  <span className="text-slate-700">Previous Notes</span>
                </button>
                <button
                  onClick={() => selectSummarizerOption(grandchildKey, 2)}
                  className="w-full px-3 py-2 text-left text-xs hover:bg-slate-50 transition-colors flex items-center gap-2"
                >
                  <span>🖼️</span>
                  <span className="text-slate-700">Imaging Reports</span>
                </button>
                <button
                  onClick={() => selectSummarizerOption(grandchildKey, 3)}
                  className="w-full px-3 py-2 text-left text-xs hover:bg-slate-50 transition-colors flex items-center gap-2"
                >
                  <span>💊</span>
                  <span className="text-slate-700">Medication</span>
        </button>
              </div>
            )}
          </div>
        )}
                      </div>
      <div id={`content-${grandchildKey}`} style={{
        padding: '10px 14px',
        display: 'block'
      }}>
        {/* Grandchild summarizers */}
        {configMode === 'summarizers' && sectionSummarizers[grandchildKey]?.length > 0 && (
          <div style={{ marginBottom: '12px' }}>
            {sectionSummarizers[grandchildKey].map(summarizer =>
              renderSummarizerBlock(summarizer, grandchildKey)
                )}
              </div>
            )}


        {configMode === 'summarizers' && sectionSummarizers[grandchildKey]?.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '16px',
            color: '#9ca3af',
            fontStyle: 'italic',
            fontSize: '11px'
          }}>
            No summarizers configured
          </div>
        )}
      </div>
    </div>
  );

  const renderChildSection = (parentKey, childKey, child) => (
    <div key={childKey} style={{
      background: '#f8fafc',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      marginBottom: '8px',
      marginLeft: '20px'
    }}>
      <div
        onClick={() => {
          const content = document.getElementById(`content-${childKey}`);
          const icon = document.getElementById(`icon-${childKey}`);
          if (content.style.display === 'none' || !content.style.display) {
            content.style.display = 'block';
            icon.style.transform = 'rotate(90deg)';
          } else {
            content.style.display = 'none';
            icon.style.transform = 'rotate(0deg)';
          }
        }}
        style={{
          padding: '12px 16px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #e2e8f0',
          position: 'relative'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
        <span id={`icon-${childKey}`} style={{
          fontSize: '8px',
          color: '#9ca3af',
          marginRight: '8px',
          transform: 'rotate(90deg)',
          transition: 'transform 0.2s'
        }}>▶</span>
        <span style={{
          fontSize: '14px',
          fontWeight: '600',
          color: '#475569'
        }}>{child.name}</span>
      </div>
        {configMode === 'summarizers' && (
          <div className="relative" onClick={(e) => e.stopPropagation()} style={{ position: 'relative' }}>
        <button
          onClick={() => addSummarizer(childKey)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-1.5 py-0.5 rounded text-xs font-medium shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-1"
        >
              <Plus className="w-3 h-3" />
              <span>Add</span>
            </button>
            {summarizerPickerDropdown === childKey && (
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-xl border border-slate-200 py-2 z-30">
                <button
                  onClick={() => selectSummarizerOption(childKey, 0)}
                  className="w-full px-3 py-2 text-left text-xs hover:bg-slate-50 transition-colors flex items-center gap-2"
                >
                  <span>📊</span>
                  <span className="text-slate-700">Lab Reports</span>
                </button>
                <button
                  onClick={() => selectSummarizerOption(childKey, 1)}
                  className="w-full px-3 py-2 text-left text-xs hover:bg-slate-50 transition-colors flex items-center gap-2"
                >
                  <span>📄</span>
                  <span className="text-slate-700">Previous Notes</span>
                </button>
                <button
                  onClick={() => selectSummarizerOption(childKey, 2)}
                  className="w-full px-3 py-2 text-left text-xs hover:bg-slate-50 transition-colors flex items-center gap-2"
                >
                  <span>🖼️</span>
                  <span className="text-slate-700">Imaging Reports</span>
                </button>
                <button
                  onClick={() => selectSummarizerOption(childKey, 3)}
                  className="w-full px-3 py-2 text-left text-xs hover:bg-slate-50 transition-colors flex items-center gap-2"
                >
                  <span>💊</span>
                  <span className="text-slate-700">Medication</span>
        </button>
              </div>
            )}
          </div>
        )}
                      </div>
      <div id={`content-${childKey}`} style={{
        padding: '12px 16px',
        display: 'block'
      }}>
        {/* Child level summarizers */}
        {configMode === 'summarizers' && sectionSummarizers[childKey]?.length > 0 && (
          <div style={{ marginBottom: '12px' }}>
            {sectionSummarizers[childKey].map(summarizer =>
              renderSummarizerBlock(summarizer, childKey)
            )}
          </div>
        )}


        {/* Grandchildren sections */}
        {child.children && Object.keys(child.children).length > 0 && (
          <>
            <div style={{
              fontSize: '11px',
              fontWeight: '600',
              color: '#64748b',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Details
              </div>
            {Object.entries(child.children).map(([grandchildKey, grandchild]) =>
              renderGrandchildSection(parentKey, childKey, grandchildKey, grandchild)
            )}
          </>
        )}

        {configMode === 'summarizers' && sectionSummarizers[childKey]?.length === 0 && (!child.children || Object.keys(child.children).length === 0) && (
          <div style={{
            textAlign: 'center',
            padding: '20px',
            color: '#9ca3af',
            fontStyle: 'italic',
            fontSize: '12px'
          }}>
            No summarizers configured
          </div>
        )}
      </div>
    </div>
  );

  const renderParentSection = (sectionKey, section) => (
    <div key={sectionKey} style={{
      background: 'white',
      border: '2px solid #f3f4f6',
      borderRadius: '12px',
      marginBottom: '16px',
      overflow: 'hidden'
    }}>
      <div
        onClick={() => {
          const content = document.getElementById(`content-${sectionKey}`);
          const icon = document.getElementById(`icon-${sectionKey}`);
          if (content.style.display === 'none' || !content.style.display) {
            content.style.display = 'block';
            icon.style.transform = 'rotate(180deg)';
          } else {
            content.style.display = 'none';
            icon.style.transform = 'rotate(0deg)';
          }
        }}
        style={{
          padding: '20px 24px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(to right, transparent 0%, #667eea05 100%)',
          transition: 'background 0.2s',
          position: 'relative'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
        <span id={`icon-${sectionKey}`} style={{
          fontSize: '10px',
          color: '#9ca3af',
          marginRight: '10px',
          transform: 'rotate(180deg)',
          transition: 'transform 0.2s'
        }}>▼</span>
        <span style={{
          fontSize: '16px',
          fontWeight: '700',
          color: '#1e293b'
        }}>{section.name}</span>
      </div>
        {configMode === 'summarizers' && (
          <div className="relative" onClick={(e) => e.stopPropagation()} style={{ position: 'relative' }}>
        <button
          onClick={() => addSummarizer(sectionKey)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-2 py-1 rounded text-xs font-medium shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-1"
        >
              <Plus className="w-3 h-3" />
              <span>Add</span>
            </button>
            {summarizerPickerDropdown === sectionKey && (
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-xl border border-slate-200 py-2 z-30">
                <button
                  onClick={() => selectSummarizerOption(sectionKey, 0)}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 transition-colors flex items-center gap-2"
                >
                  <span>📊</span>
                  <span className="text-slate-700">Lab Reports</span>
                </button>
                <button
                  onClick={() => selectSummarizerOption(sectionKey, 1)}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 transition-colors flex items-center gap-2"
                >
                  <span>📄</span>
                  <span className="text-slate-700">Previous Notes</span>
                </button>
                <button
                  onClick={() => selectSummarizerOption(sectionKey, 2)}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 transition-colors flex items-center gap-2"
                >
                  <span>🖼️</span>
                  <span className="text-slate-700">Imaging Reports</span>
                </button>
                <button
                  onClick={() => selectSummarizerOption(sectionKey, 3)}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 transition-colors flex items-center gap-2"
                >
                  <span>💊</span>
                  <span className="text-slate-700">Medication</span>
        </button>
              </div>
            )}
          </div>
        )}
                      </div>
      <div id={`content-${sectionKey}`} style={{
        padding: '20px 24px',
        borderTop: '1px solid #f3f4f6',
        background: '#fafbfc',
        display: 'block'
      }}>
        {/* Parent level summarizers */}
        {configMode === 'summarizers' && sectionSummarizers[sectionKey]?.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <div style={{
              fontSize: '12px',
              fontWeight: '600',
              color: '#64748b',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Section-level Summarizers
                  </div>
            {sectionSummarizers[sectionKey].map(summarizer => 
              renderSummarizerBlock(summarizer, sectionKey)
                )}
              </div>
            )}

        
        {/* Children sections */}
        <div style={{
          fontSize: '12px',
          fontWeight: '600',
          color: '#64748b',
          marginBottom: '12px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          Subsections
          </div>
        {Object.entries(section.children).map(([childKey, child]) => 
          renderChildSection(sectionKey, childKey, child)
        )}
      </div>
    </div>
  );


  // ============================================================================
  // VIEWS
  // ============================================================================
  // DOCTORS VIEW
  if (currentView === 'doctors') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Marvix Ops Dashboard
              </h1>
              </div>
              <button
                onClick={() => setCurrentView('manage-documents')}
                className="px-4 py-2 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Settings className="w-4 h-4" />
                Manage Documents
              </button>
            </div>
            <p className="text-slate-600 text-lg">Create summarizers and configure templates for healthcare providers</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/50 mb-6">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search doctors by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <select
                  value={selectedPractice}
                  onChange={(e) => setSelectedPractice(e.target.value)}
                  className="p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white min-w-[160px]"
                >
                  {practices.map(practice => (
                    <option key={practice} value={practice}>
                      {practice === 'all' ? 'All Practices' : practice}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/50 overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-200/50 bg-slate-50/50">
              <h2 className="text-xl font-semibold text-slate-800">Healthcare Providers</h2>
              <p className="text-slate-600 text-sm mt-1">Select a doctor to create summarizers or configure templates</p>
            </div>
            
            <div className="divide-y divide-slate-200/50">
              {filteredDoctors.map((doctor) => {
                const colors = ehrColors[doctor.ehr] || ehrColors.ECW;
                return (
                <div key={doctor.id} className={`p-6 transition-colors group border-l-4 ${colors.border} ${colors.bg} border-b border-slate-100 last:border-b-0 hover:opacity-90`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`w-12 h-12 ${colors.badge} ${colors.text} rounded-xl flex items-center justify-center font-semibold text-lg flex-shrink-0 border-2 ${colors.border}`}>
                        {doctor.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className={`font-semibold ${colors.text} text-lg`}>{doctor.name}</h3>
                          <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{doctor.specialty}</span>
                          <span className={`text-xs ${colors.badge} ${colors.text} px-2 py-0.5 rounded-full font-medium border ${colors.border}`}>
                            {doctor.ehr}
                          </span>
                          </div>
                        <p className="text-sm text-slate-600 truncate">{doctor.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => {
                          setSelectedDoctor(doctor);
                          setCurrentView('summarizers-variables');
                        }}
                        className="px-3 py-1.5 text-sm text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg font-medium flex items-center gap-1.5 transition-all duration-200"
                      >
                        <FileText className="w-4 h-4" />
                        View All
                      </button>

                      <div className="relative create-dropdown-container">
                      <button
                        onClick={() => handleCreateSummarizer(doctor)}
                          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                          <Plus className="w-4 h-4" />
                        Create
                          <ChevronRight className={`w-3 h-3 transition-transform ${createTypeDropdown === doctor.id ? 'rotate-90' : ''}`} />
                      </button>

                        {createTypeDropdown === doctor.id && (
                          <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-[100]" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => handleSelectCreateType('summarizer')}
                              className="w-full px-4 py-2.5 text-left text-sm hover:bg-slate-50 transition-colors flex items-center gap-3"
                            >
                              <span className="text-xl">📊</span>
                              <div>
                                <div className="font-medium text-slate-700">Create Summarizer</div>
                                <div className="text-xs text-slate-500">Extract and summarize data from EHR</div>
                              </div>
                            </button>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => handleConfigureTemplates(doctor)}
                        className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        <Settings className="w-4 h-4" />
                        Configure
                      </button>

                      <div className="relative more-dropdown-container">
                        <button
                          onClick={() => setOpenDropdown(openDropdown === doctor.id ? null : doctor.id)}
                          className="w-9 h-9 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg flex items-center justify-center transition-all duration-200"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {openDropdown === doctor.id && (
                          <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-[100]" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => handleCopySummarizer(doctor)}
                              className="w-full px-4 py-2.5 text-left text-sm hover:bg-slate-50 transition-colors flex items-center gap-3"
                            >
                              <Copy className="w-4 h-4 text-slate-600" />
                              <span className="text-slate-700 font-medium">Copy Summarizer</span>
                            </button>
                            <button
                              onClick={() => handleCopyDoctorConfig(doctor)}
                              className="w-full px-4 py-2.5 text-left text-sm hover:bg-slate-50 transition-colors flex items-center gap-3"
                            >
                              <Copy className="w-4 h-4 text-slate-600" />
                              <span className="text-slate-700 font-medium">Copy Doctor Configuration</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                );
              })}
            </div>
          </div>

          {/* Copy Summarizer Modal */}
          {showCopySummarizerModal && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl p-8 max-w-3xl w-full max-h-[85vh] overflow-y-auto shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-slate-800">
                    Copy Summarizer
                  </h2>
                  <button
                    onClick={() => setShowCopySummarizerModal(false)}
                    className="text-gray-400 hover:text-gray-600 text-3xl w-8 h-8 flex items-center justify-center transition-colors"
                  >
                    ×
                  </button>
                </div>

                {/* Source Doctor Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                  <div className="text-sm text-blue-700 font-semibold mb-2">Copying From:</div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                      {copySourceDoctor?.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800">{copySourceDoctor?.name}</div>
                      <div className="text-sm text-slate-600">{copySourceDoctor?.ehr} EHR • {copySourceDoctor?.specialty}</div>
                    </div>
                  </div>
                </div>

                {/* Summarizer Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Select Summarizers to Copy * (Multiple selection allowed)
                  </label>
                  <div className="space-y-2">
                    {[
                      { id: 'lab', name: '📊 Lab Reports', count: 5 },
                      { id: 'notes', name: '📄 Previous Notes', count: 3 },
                      { id: 'imaging', name: '🖼️ Imaging Reports', count: 7 },
                      { id: 'medication', name: '💊 Medication', count: 2 }
                    ].map(summarizer => (
                      <div
                        key={summarizer.id}
                        onClick={() => toggleSummarizerSelection(summarizer.id)}
                        className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                          selectedSummarizers.includes(summarizer.id)
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50/30'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={selectedSummarizers.includes(summarizer.id)}
                              onChange={() => {}}
                              className="w-4 h-4 text-blue-600 rounded"
                            />
                            <span className="font-semibold text-slate-800">{summarizer.name}</span>
                          </div>
                          <span className="text-sm text-slate-500">{summarizer.count} configurations</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {selectedSummarizers.length > 0 && (
                    <div className="mt-3 text-sm text-blue-600 font-semibold">
                      {selectedSummarizers.length} summarizer{selectedSummarizers.length > 1 ? 's' : ''} selected
                    </div>
                  )}
                </div>

                {/* Target Doctor Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Copy To (Target Doctor) *
                  </label>
                  <select className="w-full p-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
                    <option value="">Select a doctor...</option>
                    {doctors.filter(d => d.id !== copySourceDoctor?.id).map(doctor => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.name} - {doctor.ehr} EHR ({doctor.specialty})
                      </option>
                    ))}
                  </select>
                </div>

                {/* EHR Compatibility Warning */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                  <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-amber-800 mb-1">Copy Scope</div>
                      <div className="text-sm text-amber-700">
                        <strong>Same EHR:</strong> Complete configuration (prompts + resource IDs + mappings) will be copied.<br />
                        <strong>Different EHR:</strong> Only prompts will be copied. EHR resource configurations must be reconfigured.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => {
                      setShowCopySummarizerModal(false);
                      setSelectedSummarizers([]);
                    }}
                    className="px-6 py-2.5 border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (selectedSummarizers.length === 0) {
                        alert('Please select at least one summarizer to copy');
                        return;
                      }
                      alert(`${selectedSummarizers.length} summarizer${selectedSummarizers.length > 1 ? 's' : ''} copied successfully!`);
                      setShowCopySummarizerModal(false);
                      setSelectedSummarizers([]);
                    }}
                    disabled={selectedSummarizers.length === 0}
                    className={`px-6 py-2.5 rounded-xl font-semibold shadow-lg transition-all duration-200 ${
                      selectedSummarizers.length === 0
                        ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white hover:shadow-xl'
                    }`}
                  >
                    Copy {selectedSummarizers.length > 0 ? `${selectedSummarizers.length} ` : ''}Summarizer{selectedSummarizers.length > 1 ? 's' : ''}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Copy Doctor Configuration Modal */}
          {showCopyDoctorModal && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-slate-800">
                    Copy Doctor Configuration
                  </h2>
                  <button
                    onClick={() => {
                      setShowCopyDoctorModal(false);
                      setTargetDoctorEmails(['']);
                      setTargetEHR('');
                    }}
                    className="text-gray-400 hover:text-gray-600 text-3xl w-8 h-8 flex items-center justify-center transition-colors"
                  >
                    ×
                  </button>
                </div>

                {/* Source Doctor Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                  <div className="text-sm text-blue-700 font-semibold mb-2">Copying Configuration From:</div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                      {copySourceDoctor?.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800">{copySourceDoctor?.name}</div>
                      <div className="text-sm text-slate-600">{copySourceDoctor?.ehr} EHR • {copySourceDoctor?.specialty}</div>
                    </div>
                  </div>
                </div>

                {/* Target EHR Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Target EHR System *
                  </label>
                  <select
                    value={targetEHR}
                    onChange={(e) => setTargetEHR(e.target.value)}
                    className="w-full p-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="">Select target EHR system...</option>
                    <option value="ECW">ECW</option>
                    <option value="AthenaOne">AthenaOne</option>
                    <option value="AdvancedMD">AdvancedMD</option>
                    <option value="AthenaFlow">AthenaFlow</option>
                  </select>
                  {targetEHR && (
                    <div className="mt-2 text-sm">
                      {targetEHR === copySourceDoctor?.ehr ? (
                        <div className="flex items-center gap-2 text-green-700">
                          <CheckCircle className="w-4 h-4" />
                          <span className="font-semibold">Same EHR - Full configuration will be copied</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-amber-700">
                          <AlertCircle className="w-4 h-4" />
                          <span className="font-semibold">Different EHR - Resource mapping required after copy</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Target Doctor Emails */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Target Doctor Email(s) * (Configuration will be copied to these doctors)
                  </label>
                  <div className="space-y-3">
                    {targetDoctorEmails.map((email, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="email"
                          placeholder={`doctor${index + 1}@example.com`}
                          value={email}
                          onChange={(e) => updateEmailField(index, e.target.value)}
                          className="flex-1 p-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                        {targetDoctorEmails.length > 1 && (
                          <button
                            onClick={() => removeEmailField(index)}
                            className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-xl transition-colors"
                            title="Remove email"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={addEmailField}
                    className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add another email
                  </button>
                  {targetDoctorEmails.filter(e => e.trim()).length > 0 && (
                    <div className="mt-3 text-sm text-blue-600 font-semibold">
                      {targetDoctorEmails.filter(e => e.trim()).length} doctor{targetDoctorEmails.filter(e => e.trim()).length > 1 ? 's' : ''} will receive this configuration
                    </div>
                  )}
                </div>

                {/* Copy Scope Info - Conditional based on EHR */}
                {targetEHR && targetEHR === copySourceDoctor?.ehr && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                    <div className="flex gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-green-800 mb-2">Same EHR - Complete Copy</div>
                        <div className="text-sm text-green-700 space-y-1.5">
                          <div className="flex items-start gap-2">
                            <span className="font-semibold min-w-[20px]">1.</span>
                            <span>Copy of account created with new Doctor ID</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="font-semibold min-w-[20px]">2.</span>
                            <span>Doctor Name updated automatically from email</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="font-semibold min-w-[20px]">3.</span>
                            <span><strong>All copied:</strong> Summarizer prompts, Templates, Template section → EHR mappings, Summarizer → Template mappings</span>
                          </div>
                          <div className="mt-3 p-3 bg-green-100 rounded-lg">
                            <span className="font-semibold">✓ Ready to use immediately - No additional configuration needed!</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {targetEHR && targetEHR !== copySourceDoctor?.ehr && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                    <div className="flex gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-amber-800 mb-2">Different EHR - Partial Copy (Mapping Required)</div>
                        <div className="text-sm text-amber-700 space-y-1.5">
                          <div className="flex items-start gap-2">
                            <span className="font-semibold min-w-[20px]">1.</span>
                            <span>Copy of account created with new Doctor ID</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="font-semibold min-w-[20px]">2.</span>
                            <span>Doctor Name updated automatically from email</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="font-semibold min-w-[20px]">3.</span>
                            <span><strong>Copied:</strong> Summarizer prompts, Templates, Summarizer → Template mappings</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="font-semibold min-w-[20px]">4.</span>
                            <span><strong>NOT copied:</strong> Template section → EHR mappings (different resource IDs)</span>
                          </div>
                          <div className="mt-3 p-3 bg-amber-100 rounded-lg">
                            <div className="font-semibold mb-1">⚠️ Post-Copy Actions Required:</div>
                            <div className="text-xs space-y-1">
                              <div>• Check if corresponding EHR resources are available for pulled summarizers</div>
                              <div>• Interface will be provided to update/map resources</div>
                              <div>• Complete template section → EHR mappings</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {!targetEHR && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                    <div className="flex gap-3">
                      <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-blue-700">
                        <div className="font-semibold mb-2">Select target EHR to see what will be copied</div>
                        <div>The copy scope differs based on whether the target doctors use the same EHR system as the source doctor.</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => {
                      setShowCopyDoctorModal(false);
                      setTargetDoctorEmails(['']);
                      setTargetEHR('');
                    }}
                    className="px-6 py-2.5 border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      const validEmails = targetDoctorEmails.filter(e => e.trim());
                      if (validEmails.length === 0) {
                        alert('Please enter at least one email address');
                        return;
                      }
                      if (!targetEHR) {
                        alert('Please select target EHR system');
                        return;
                      }

                      const isSameEHR = targetEHR === copySourceDoctor?.ehr;

                      if (isSameEHR) {
                        // Same EHR - complete copy, show success
                        alert(`Configuration copied to ${validEmails.length} doctor${validEmails.length > 1 ? 's' : ''} successfully!\n\n✓ Full configuration copied\n✓ Ready to use immediately`);
                        setShowCopyDoctorModal(false);
                        setTargetDoctorEmails(['']);
                        setTargetEHR('');
                      } else {
                        // Different EHR - show resource mapping modal
                        const summarizersNeedingMapping = [
                          { id: 'lab', name: '📊 Lab Reports', pullFromEHR: true, currentResource: 'Lab Results - Neurology Panel' },
                          { id: 'imaging', name: '🖼️ Imaging Reports', pullFromEHR: true, currentResource: 'Clinical Documents - MRI Scans' },
                          { id: 'notes', name: '📄 Previous Notes', pullFromEHR: false },
                          { id: 'medication', name: '💊 Medication', pullFromEHR: true, currentResource: 'Medication Records - Active Prescriptions' }
                        ].filter(s => s.pullFromEHR);

                        setPendingResourceMappings(summarizersNeedingMapping);
                        setShowCopyDoctorModal(false);
                        setShowResourceMappingModal(true);
                      }
                    }}
                    disabled={targetDoctorEmails.filter(e => e.trim()).length === 0 || !targetEHR}
                    className={`px-6 py-2.5 rounded-xl font-semibold shadow-lg transition-all duration-200 ${
                      targetDoctorEmails.filter(e => e.trim()).length === 0 || !targetEHR
                        ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white hover:shadow-xl'
                    }`}
                  >
                    Copy to {targetDoctorEmails.filter(e => e.trim()).length > 0 ? targetDoctorEmails.filter(e => e.trim()).length : ''} Doctor{targetDoctorEmails.filter(e => e.trim()).length > 1 ? 's' : ''}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Resource Mapping Modal - For Different EHR Copies */}
          {showResourceMappingModal && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[85vh] overflow-y-auto shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">
                      Complete Resource Mapping
                    </h2>
                    <p className="text-sm text-slate-600 mt-1">
                      Update EHR resource selections for copied doctors with {targetEHR} EHR
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowResourceMappingModal(false);
                      setPendingResourceMappings([]);
                      setTargetDoctorEmails(['']);
                      setTargetEHR('');
                    }}
                    className="text-gray-400 hover:text-gray-600 text-3xl w-8 h-8 flex items-center justify-center transition-colors"
                  >
                    ×
                  </button>
                </div>

                {/* Info Banner */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                  <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-700">
                      <div className="font-semibold mb-1">Configuration copied successfully!</div>
                      <div>The following summarizers pull data from EHR and need resource mapping for the new {targetEHR} system. Click "Update Resources" for each summarizer to select the corresponding {targetEHR} resource.</div>
                    </div>
                  </div>
                </div>

                {/* Summarizers Needing Mapping */}
                <div className="space-y-4 mb-6">
                  {pendingResourceMappings.map((summarizer) => (
                    <div
                      key={summarizer.id}
                      className="border-2 border-slate-200 rounded-xl p-5 hover:border-blue-300 transition-all"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl">{summarizer.name.split(' ')[0]}</span>
                            <div>
                              <div className="font-semibold text-slate-800">{summarizer.name}</div>
                              <div className="text-xs text-slate-500">Summarizer ID: {summarizer.id}</div>
                            </div>
                          </div>

                          <div className="bg-slate-50 rounded-lg p-3 mb-3">
                            <div className="text-xs text-slate-600 mb-1">Previous Resource ({copySourceDoctor?.ehr}):</div>
                            <div className="text-sm font-medium text-slate-700">{summarizer.currentResource}</div>
                          </div>

                          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                            <div className="flex items-center gap-2 text-amber-700 text-sm">
                              <AlertCircle className="w-4 h-4" />
                              <span className="font-semibold">Needs mapping to {targetEHR} resource</span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            // Navigate to create/edit view with pre-filled data
                            setShowResourceMappingModal(false);
                            alert(`Opening resource selection for: ${summarizer.name}\n\nYou'll see the create summarizer interface with all fields pre-filled.\nOnly update the "Resource Description" section to select the corresponding ${targetEHR} resource.`);
                            // In real implementation, this would:
                            // setCurrentView('create');
                            // setFormData with pre-filled values
                            // setSelectedDoctor(newCopiedDoctor);
                          }}
                          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200 whitespace-nowrap"
                        >
                          Update Resources
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary Stats */}
                <div className="bg-slate-50 rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-slate-600">
                      <span className="font-semibold text-slate-800">{pendingResourceMappings.length}</span> summarizer{pendingResourceMappings.length > 1 ? 's' : ''} need{pendingResourceMappings.length === 1 ? 's' : ''} resource mapping
                    </div>
                    <div className="text-sm text-slate-600">
                      Target doctors: <span className="font-semibold text-slate-800">{targetDoctorEmails.filter(e => e.trim()).length}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => {
                      if (confirm('Are you sure? Doctors will have incomplete configurations until resources are mapped.')) {
                        alert('You can complete resource mapping later from each doctor\'s configuration page.');
                        setShowResourceMappingModal(false);
                        setPendingResourceMappings([]);
                        setTargetDoctorEmails(['']);
                        setTargetEHR('');
                      }
                    }}
                    className="px-6 py-2.5 border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
                  >
                    Skip for Now
                  </button>
                  <button
                    onClick={() => {
                      alert('Opening batch resource mapping interface...\n\nThis would allow you to map all resources at once.');
                      // In real implementation, could show a batch edit interface
                    }}
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Map All Resources
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Create Type Selection Modal */}
        {showCreateTypeModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">
                  Create New
                </h2>
                <button
                  onClick={() => setShowCreateTypeModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-3xl w-8 h-8 flex items-center justify-center transition-colors"
                >
                  ×
                </button>
              </div>
              <p className="text-gray-600 mb-6">
                Choose what you want to create for {selectedDoctor?.name}
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div
                  onClick={() => handleSelectCreateType('summarizer')}
                  className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 hover:border-blue-500 hover:bg-blue-100 rounded-xl p-6 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <div className="text-4xl mb-3">📊</div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">Create Summarizer</h3>
                  <p className="text-sm text-gray-600">
                    Create a new summarizer to extract and summarize data from EHR
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // SUMMARIZERS & VARIABLES VIEW
  if (currentView === 'summarizers-variables') {
    const doctorSummarizers = createdSummarizers.filter(s => s.doctorId === selectedDoctor?.id);
    
    // Combined View helpers
    const templates = ['general', 'followup', 'neurology', 'initial'];
    const templateNames = {
      general: 'General Template',
      followup: 'Follow-up',
      neurology: 'Neurology',
      initial: 'Initial Consultation'
    };

    const getAllSections = () => {
      const sections = [];
      Object.entries(templateHierarchy).forEach(([parentKey, parent]) => {
        sections.push({
          key: parentKey,
          name: parent.name,
          level: 'parent',
          parentKey: null,
          childKey: null
        });
        if (parent.children) {
          Object.entries(parent.children).forEach(([childKey, child]) => {
            sections.push({
              key: childKey,
              name: child.name,
              level: 'child',
              parentKey: parentKey,
              childKey: null
            });
            if (child.children) {
              Object.entries(child.children).forEach(([grandchildKey, grandchild]) => {
                sections.push({
                  key: grandchildKey,
                  name: grandchild.name,
                  level: 'grandchild',
                  parentKey: parentKey,
                  childKey: childKey
                });
              });
            }
          });
        }
      });
      return sections;
    };

    const allSections = getAllSections();

    const renderCellContent = (sectionKey, templateTab) => {
      if (configMode === 'summarizers') {
        const summarizers = sectionSummarizers[sectionKey];
        if (!summarizers || summarizers.length === 0) {
          return (
            <div
              onClick={() => jumpToSection(templateTab, sectionKey)}
              className="text-gray-400 text-center py-2 cursor-pointer hover:text-gray-600 transition-colors"
            >
              —
            </div>
          );
        }
        return (
          <div
            onClick={() => jumpToSection(templateTab, sectionKey)}
            className="space-y-1 cursor-pointer"
          >
            {summarizers.map(sum => {
              const actionIcon = sum.action === 'append' ? '➕' : sum.action === 'prepend' ? '⬆️' : '💡';
              return (
                <div
                  key={sum.id}
                  className="text-xs px-2 py-1 rounded hover:shadow-md transition-all"
                  style={{
                    background: sum.bgColor,
                    color: sum.color
                  }}
                >
                  {actionIcon} {sum.name}
                </div>
              );
            })}
          </div>
        );
      }
    };
    
    return (
      <div className={`min-h-screen ${
        viewAllMode === 'combined' 
          ? (configMode === 'summarizers' 
              ? 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50' 
              : 'bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50')
          : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-8">
            <button
              onClick={() => setCurrentView('doctors')}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-4 transition-colors"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              Back to Doctors
            </button>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/50 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-semibold text-lg">
                    {selectedDoctor?.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-slate-800">{selectedDoctor?.name}</h1>
                    <p className="text-slate-600">{selectedDoctor?.email} • {selectedDoctor?.ehr} EHR</p>
                  </div>
                </div>
                
                {/* View Toggle */}
                <div className="flex items-center gap-3">
                  <div className="flex gap-2 bg-slate-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewAllMode('list')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        viewAllMode === 'list'
                          ? 'bg-white text-slate-800 shadow-sm'
                          : 'text-slate-600 hover:text-slate-800'
                      }`}
                    >
                      List View
                    </button>
                    <button
                      onClick={() => setViewAllMode('combined')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                        viewAllMode === 'combined'
                          ? 'bg-white text-slate-800 shadow-sm'
                          : 'text-slate-600 hover:text-slate-800'
                      }`}
                    >
                      <TableIcon className="w-4 h-4" />
                      Combined View
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {viewAllMode === 'list' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Summarizers Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/50 relative">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-sm font-bold">
                    📊
                  </div>
                  Summarizers
                </h2>
                <div className="relative z-10 view-all-dropdown-container">
                  <button
                    onClick={() => setViewAllCreateDropdown(viewAllCreateDropdown === 'summarizers' ? null : 'summarizers')}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    Create
                    <ChevronRight className={`w-3 h-3 transition-transform ${viewAllCreateDropdown === 'summarizers' ? 'rotate-90' : ''}`} />
                  </button>

                  {viewAllCreateDropdown === 'summarizers' && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-[100]" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => {
                          setViewAllCreateDropdown(null);
                          handleSelectCreateType('summarizer');
                        }}
                        className="w-full px-4 py-2.5 text-left text-sm hover:bg-slate-50 transition-colors flex items-center gap-3"
                      >
                        <span className="text-xl">📊</span>
                        <div>
                          <div className="font-medium text-slate-700">Create Summarizer</div>
                          <div className="text-xs text-slate-500">Extract and summarize data from EHR</div>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {doctorSummarizers.length > 0 ? (
                <div className="space-y-3">
                  {doctorSummarizers.map(summarizer => (
                    <div
                      key={summarizer.id}
                      className="border border-slate-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-md transition-all duration-200 group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-slate-800">{summarizer.name}</h3>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              summarizer.active !== false
                                ? 'bg-green-100 text-green-700'
                                : 'bg-slate-100 text-slate-600'
                            }`}>
                              {summarizer.active !== false ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 mb-2">{summarizer.purpose}</p>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {summarizer.pullFromEHR && (
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">EHR</span>
                            )}
                            {summarizer.allowUpload && (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Upload</span>
                            )}
                            {summarizer.allowText && (
                              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">Text</span>
                            )}
                          </div>
                          {summarizer.selectedResource && (() => {
                            const resource = getResourcesForEhr(summarizer.ehr).find(r => r.id === summarizer.selectedResource);
                            return resource ? (
                            <p className="text-xs text-slate-500 mb-2">
                                Resource: {formatResourceOption(resource)}
                            </p>
                            ) : null;
                          })()}
                          {summarizer.variables && summarizer.variables.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs text-slate-500 mb-1 font-medium">Variables:</p>
                              <div className="flex flex-wrap gap-1.5">
                                {summarizer.variables.map((variable, idx) => (
                                  <span
                                    key={idx}
                                    className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full border border-purple-200"
                                    title={variable.extractionMethod === 'pickSection' 
                                      ? `Section: ${variable.selectedSection}` 
                                      : `Query: ${variable.llmQuery}`}
                                  >
                                    🔹 {variable.name}
                                  </span>
                  ))}
                </div>
                </div>
              )}
            </div>
                        <div className="flex items-center gap-2">
                  <button
                            onClick={() => {
                              const newActiveState = !(summarizer.active !== false);
                              setPendingActivateAction({ summarizerId: summarizer.id, newActiveState });
                              setShowActivateConfirm(summarizer.id);
                            }}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                              summarizer.active !== false
                                ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                            title={summarizer.active !== false ? 'Deactivate summarizer' : 'Activate summarizer'}
                          >
                            {summarizer.active !== false ? 'Deactivate' : 'Activate'}
                  </button>
                      <button
                          onClick={() => handleEditSummarizer(summarizer.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-slate-100 rounded-lg"
                          title="Edit summarizer"
                        >
                          <Pencil className="w-4 h-4 text-slate-600" />
                        </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl">
                  <p className="text-slate-500 mb-4">No summarizers created yet</p>
                  <button
                    onClick={() => handleCreateSummarizer(selectedDoctor)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-sm font-medium transition-all duration-200"
                  >
                    Create Your First Summarizer
                  </button>
                </div>
              )}
            </div>

          </div>
          ) : (
            // Combined View
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200">
              {/* Mode Toggle: Summarizers vs Variables */}
              <div className="p-6 border-b border-slate-200">
                <div className="flex gap-4">
                  <button
                    onClick={() => setConfigMode('summarizers')}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                      configMode === 'summarizers'
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                        : 'bg-white text-slate-600 border-2 border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    Summarizers
                  </button>
                </div>
              </div>

              {/* Comprehensive Table */}
              <div className="overflow-x-auto" style={{ maxHeight: '70vh' }}>
                <table className="w-full border-collapse">
                  <thead className="sticky top-0 z-10">
                    <tr>
                      <th className="bg-gradient-to-r from-slate-700 to-slate-600 text-white px-6 py-4 text-left font-semibold border-r-2 border-white" style={{ minWidth: '300px' }}>
                        Section / Subsection
                      </th>
                      {templates.map(template => (
                        <th
                          key={template}
                          className={`text-white px-4 py-4 text-center font-semibold border-r-2 border-white ${
                            configMode === 'summarizers' 
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600' 
                              : 'bg-gradient-to-r from-purple-600 to-pink-600'
                          }`}
                          style={{ minWidth: '200px' }}
                        >
                          {templateNames[template]}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {allSections.map((section) => {
                      let bgColor = 'bg-white';
                      let textColor = 'text-slate-900';
                      let paddingLeft = 'pl-6';
                      let fontWeight = 'font-semibold';
                      let fontSize = 'text-base';

                      if (section.level === 'parent') {
                        bgColor = 'bg-gradient-to-r from-slate-50 to-slate-100';
                        textColor = 'text-slate-900';
                        fontWeight = 'font-bold';
                        fontSize = 'text-base';
                      } else if (section.level === 'child') {
                        bgColor = 'bg-blue-50/30';
                        textColor = 'text-slate-700';
                        paddingLeft = 'pl-12';
                        fontSize = 'text-sm';
                      } else {
                        bgColor = 'bg-white';
                        textColor = 'text-slate-600';
                        paddingLeft = 'pl-20';
                        fontSize = 'text-sm';
                      }

                      return (
                        <tr
                          key={section.key}
                          className={`border-b border-slate-200 hover:bg-slate-50/50 transition-colors ${bgColor}`}
                        >
                          <td className={`${paddingLeft} py-3 ${textColor} ${fontWeight} ${fontSize} border-r-2 border-slate-200`}>
                            {section.name}
                          </td>
                          {templates.map(template => (
                            <td
                              key={`${section.key}-${template}`}
                              className="px-4 py-3 border-r border-slate-200"
                            >
                              {renderCellContent(section.key, template)}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Legend */}
              <div className="p-4 border-t border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="text-sm font-bold text-gray-700 mb-2">Legend</div>
                  <div className="flex gap-6 flex-wrap text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">➕</span> Append to section
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">⬆️</span> Prepend to section
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">💡</span> Inform context
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">—</span> No configuration
                    </div>
                  </div>
              </div>
            </div>
          )}
        </div>

        {/* Create Type Selection Modal */}
        {showCreateTypeModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">
                  Create New
                </h2>
                <button
                  onClick={() => setShowCreateTypeModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-3xl w-8 h-8 flex items-center justify-center transition-colors"
                >
                  ×
                </button>
              </div>
              <p className="text-gray-600 mb-6">
                Choose what you want to create for {selectedDoctor?.name}
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div
                  onClick={() => handleSelectCreateType('summarizer')}
                  className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 hover:border-blue-500 hover:bg-blue-100 rounded-xl p-6 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <div className="text-4xl mb-3">📊</div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">Create Summarizer</h3>
                  <p className="text-sm text-gray-600">
                    Create a new summarizer to extract and summarize data from EHR
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // TEMPLATES VIEW
  if (currentView === 'templates') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto bg-white min-h-screen shadow-xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-6 flex justify-between items-center sticky top-0 z-50 shadow-lg">
            <button
              onClick={() => setCurrentView('doctors')}
              className="bg-white/20 border border-white/30 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-white/30 transition-all duration-200 flex items-center gap-2"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              Back to Doctors
            </button>
            <div className="text-xl font-bold text-white">
              {selectedDoctor?.name}
            </div>
            <button
              onClick={() => {
                setCurrentView('summarizers-variables');
                setViewAllMode('combined');
              }}
              className="bg-white/20 border border-white/30 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-white/30 transition-all duration-200 flex items-center gap-2"
            >
              <TableIcon className="w-4 h-4" />
              View All
            </button>
          </div>

          <div className="p-10">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-8">
              Configure Templates
            </h1>

            {/* Mode Toggle: Summarizers vs Variables */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setConfigMode('summarizers')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  configMode === 'summarizers'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                    : 'bg-white text-slate-600 border-2 border-slate-200 hover:border-blue-300'
                }`}
              >
                Summarizers
              </button>
            </div>

            {/* Available Summarizers Bar */}
            {configMode === 'summarizers' && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200/50 rounded-2xl p-6 mb-8">
              <div className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                Created Summarizers
              </div>
              <div className="flex gap-3 flex-wrap mb-3">
                {createdSummarizers
                  .filter(s => s.doctorId === selectedDoctor?.id)
                  .length > 0 ? (
                  createdSummarizers
                    .filter(s => s.doctorId === selectedDoctor?.id)
                    .map(summarizer => (
                      <div
                        key={summarizer.id}
                        className="relative bg-blue-100 text-blue-800 px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 group"
                      >
                        <span>📊 {summarizer.name}</span>
                        <button
                          onClick={() => handleEditSummarizer(summarizer.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-blue-200 rounded"
                          title="Edit summarizer"
                        >
                          <Pencil className="w-3 h-3" />
                        </button>
                      </div>
                    ))
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    No summarizers created yet. Use the "Create" button to create a new summarizer.
                  </p>
                  )}
                </div>
              <p className="text-xs text-gray-500 italic">
                Click the edit icon to modify a summarizer configuration
              </p>
            </div>
            )}


            {/* Template Tabs */}
            <div className="flex border-b-2 border-gray-200 mb-8 overflow-x-auto">
              {[
                { id: 'general', name: 'General Template' },
                { id: 'followup', name: 'Follow-up' },
                { id: 'neurology', name: 'Neurology' },
                { id: 'initial', name: 'Initial Consultation' }
              ].map(tab => (
                <div
                  key={tab.id}
                  onClick={() => setCurrentTab(tab.id)}
                  className={`px-6 py-3.5 cursor-pointer text-sm font-semibold whitespace-nowrap -mb-0.5 border-b-3 transition-colors ${
                    currentTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {tab.name}
                </div>
              ))}
            </div>

            {/* Tab Content */}
            <div>
              {currentTab === 'general' && (
                <div>
                  {Object.entries(templateHierarchy).map(([sectionKey, section]) => 
                    renderParentSection(sectionKey, section)
                  )}

                  {/* Save Configuration Button */}
                  <button
                    onClick={() => alert('Configuration saved for ' + currentTab + ' template!')}
                    className="mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Save Configuration
                  </button>
                </div>
              )}

              {currentTab === 'followup' && (
                <div className="text-center py-20 text-slate-500">
                  <h3 className="text-xl font-semibold mb-2">Follow-up Template</h3>
                  <p>Configure summarizers for follow-up visits</p>
                </div>
              )}

              {currentTab === 'neurology' && (
                <div className="text-center py-20 text-slate-500">
                  <h3 className="text-xl font-semibold mb-2">Neurology Template</h3>
                  <p>Configure summarizers for neurology consultations</p>
                </div>
              )}

              {currentTab === 'initial' && (
                <div className="text-center py-20 text-slate-500">
                  <h3 className="text-xl font-semibold mb-2">Initial Consultation</h3>
                  <p>Configure summarizers for initial consultations</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Activate/Deactivate Confirmation Popup */}
        {showActivateConfirm && pendingActivateAction && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => {
            setShowActivateConfirm(null);
            setPendingActivateAction(null);
          }}>
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    pendingActivateAction.newActiveState
                      ? 'bg-green-100'
                      : 'bg-amber-100'
                  }`}>
                    <Power className={`w-5 h-5 ${
                      pendingActivateAction.newActiveState
                        ? 'text-green-600'
                        : 'text-amber-600'
                    }`} />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    {pendingActivateAction.newActiveState ? 'Activate' : 'Deactivate'} Summarizer
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setShowActivateConfirm(null);
                    setPendingActivateAction(null);
                  }}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-3 mb-6">
                {(() => {
                  const summarizer = doctorSummarizers.find(s => s.id === pendingActivateAction.summarizerId);
                  return (
                    <>
                      <p className="text-sm text-slate-600">
                        Are you sure you want to <strong>{pendingActivateAction.newActiveState ? 'activate' : 'deactivate'}</strong> the summarizer:
                      </p>
                      <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                        <p className="font-semibold text-slate-800">{summarizer?.name}</p>
                        {summarizer?.purpose && (
                          <p className="text-xs text-slate-600 mt-1">{summarizer.purpose}</p>
                        )}
                      </div>
                      {pendingActivateAction.newActiveState ? (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <p className="text-sm text-green-700">
                            <strong>Activating</strong> will enable this summarizer to process data and generate summaries.
                          </p>
                        </div>
                      ) : (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                          <p className="text-sm text-amber-700">
                            <strong>Deactivating</strong> will stop this summarizer from processing new requests. Existing data will remain unchanged.
                          </p>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowActivateConfirm(null);
                    setPendingActivateAction(null);
                  }}
                  className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const { summarizerId, newActiveState } = pendingActivateAction;
                    setCreatedSummarizers(prev => prev.map(s => 
                      s.id === summarizerId ? { ...s, active: newActiveState } : s
                    ));
                    setShowActivateConfirm(null);
                    setPendingActivateAction(null);
                    alert(`Summarizer ${newActiveState ? 'activated' : 'deactivated'} successfully!`);
                  }}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    pendingActivateAction.newActiveState
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-amber-600 text-white hover:bg-amber-700'
                  }`}
                >
                  {pendingActivateAction.newActiveState ? 'Activate' : 'Deactivate'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Background Prompt Modal */}
        {showBgModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-800">
                  Edit Background Prompt - {currentSummarizer?.name}
                </h2>
                <button
                  onClick={closeBgModal}
                  className="text-gray-400 hover:text-gray-600 text-3xl w-8 h-8 flex items-center justify-center transition-colors"
                >
                  ×
                </button>
              </div>
              <div className="mb-6">
                <textarea
                  id="bg-prompt-textarea"
                  defaultValue={currentSummarizer ? bgPrompts[currentSummarizer.id] : ''}
                  placeholder="Enter background prompt for this summarizer..."
                  className="w-full min-h-[200px] p-3 border-2 border-gray-200 rounded-xl text-sm resize-vertical focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={closeBgModal}
                  className="bg-white text-blue-600 border-2 border-blue-600 px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const newPrompt = document.getElementById('bg-prompt-textarea').value;
                    handleSaveBgPrompt(newPrompt);
                  }}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Save Prompt
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Summarizer Picker Modal */}
        {showPickerModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-800">
                  Select a Summarizer
                </h2>
                <button
                  onClick={closePickerModal}
                  className="text-gray-400 hover:text-gray-600 text-3xl w-8 h-8 flex items-center justify-center transition-colors"
                >
                  ×
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div
                  onClick={() => selectSummarizerOption(0)}
                  className="bg-white border-2 border-gray-200 hover:border-blue-500 hover:bg-gray-50 hover:-translate-y-1 rounded-xl p-5 cursor-pointer text-center transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <div className="text-4xl mb-2">📊</div>
                  <div className="text-sm font-semibold text-slate-800">Lab Reports</div>
                </div>
                <div
                  onClick={() => selectSummarizerOption(1)}
                  className="bg-white border-2 border-gray-200 hover:border-blue-500 hover:bg-gray-50 hover:-translate-y-1 rounded-xl p-5 cursor-pointer text-center transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <div className="text-4xl mb-2">📄</div>
                  <div className="text-sm font-semibold text-slate-800">Previous Notes</div>
                </div>
                <div
                  onClick={() => selectSummarizerOption(2)}
                  className="bg-white border-2 border-gray-200 hover:border-blue-500 hover:bg-gray-50 hover:-translate-y-1 rounded-xl p-5 cursor-pointer text-center transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <div className="text-4xl mb-2">🖼️</div>
                  <div className="text-sm font-semibold text-slate-800">Imaging Reports</div>
                </div>
                <div
                  onClick={() => selectSummarizerOption(3)}
                  className="bg-white border-2 border-gray-200 hover:border-blue-500 hover:bg-gray-50 hover:-translate-y-1 rounded-xl p-5 cursor-pointer text-center transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <div className="text-4xl mb-2">💊</div>
                  <div className="text-sm font-semibold text-slate-800">Medication</div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    );
  }

  // COMBINED VIEW - Now integrated into View All page
  // Removed standalone view - use summarizers-variables view with viewAllMode='combined'
  if (false && currentView === 'combined') {
    const templates = ['general', 'followup', 'neurology', 'initial'];
    const templateNames = {
      general: 'General Template',
      followup: 'Follow-up',
      neurology: 'Neurology',
      initial: 'Initial Consultation'
    };

    // Helper function to get all sections in hierarchical order
    const getAllSections = () => {
      const sections = [];

      Object.entries(templateHierarchy).forEach(([parentKey, parent]) => {
        // Add parent section
        sections.push({
          key: parentKey,
          name: parent.name,
          level: 'parent',
          parentKey: null,
          childKey: null
        });

        // Add children
        if (parent.children) {
          Object.entries(parent.children).forEach(([childKey, child]) => {
            sections.push({
              key: childKey,
              name: child.name,
              level: 'child',
              parentKey: parentKey,
              childKey: null
            });

            // Add grandchildren
            if (child.children) {
              Object.entries(child.children).forEach(([grandchildKey, grandchild]) => {
                sections.push({
                  key: grandchildKey,
                  name: grandchild.name,
                  level: 'grandchild',
                  parentKey: parentKey,
                  childKey: childKey
                });
              });
            }
          });
        }
      });

      return sections;
    };

    const allSections = getAllSections();

    // Helper function to render cell content
    const renderCellContent = (sectionKey, templateTab) => {
      if (configMode === 'summarizers') {
      const summarizers = sectionSummarizers[sectionKey];

      if (!summarizers || summarizers.length === 0) {
        return (
          <div
            onClick={() => jumpToSection(templateTab, sectionKey)}
            className="text-gray-400 text-center py-2 cursor-pointer hover:text-gray-600 transition-colors"
          >
            —
          </div>
        );
      }

      return (
        <div
          onClick={() => jumpToSection(templateTab, sectionKey)}
          className="space-y-1 cursor-pointer"
        >
          {summarizers.map(sum => {
            const actionIcon = sum.action === 'append' ? '➕' : sum.action === 'prepend' ? '⬆️' : '💡';
            return (
              <div
                key={sum.id}
                className="text-xs px-2 py-1 rounded hover:shadow-md transition-all"
                style={{
                  background: sum.bgColor,
                  color: sum.color
                }}
              >
                {actionIcon} {sum.name}
                </div>
              );
            })}
          </div>
        );
      }
    };

    return (
      <div className={`min-h-screen ${
        configMode === 'summarizers' 
          ? 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50' 
          : 'bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50'
      }`}>
        <div className="max-w-7xl mx-auto bg-white min-h-screen shadow-xl">
          {/* Header */}
          <div className={`px-6 py-6 flex justify-between items-center sticky top-0 z-50 shadow-lg ${
            configMode === 'summarizers' 
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600' 
              : 'bg-gradient-to-r from-purple-600 to-pink-600'
          }`}>
            <button
              onClick={() => setCurrentView('templates')}
              className="bg-white/20 border border-white/30 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-white/30 transition-all duration-200 flex items-center gap-2"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              Back
            </button>
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-white" />
              <div className="text-xl font-bold text-white">
                {selectedDoctor?.name}
              </div>
            </div>
            <div className="w-32"></div>
          </div>

          <div className="p-10">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-slate-600 mb-6">
              <span className="cursor-pointer hover:text-blue-600" onClick={() => setCurrentView('templates')}>
                Summarizers
              </span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-slate-900 font-semibold">Combined View</span>
            </div>

            {/* Mode Toggle: Summarizers vs Variables */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setConfigMode('summarizers')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  configMode === 'summarizers'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                    : 'bg-white text-slate-600 border-2 border-slate-200 hover:border-blue-300'
                }`}
              >
                Summarizers
              </button>
            </div>

            <h1 className={`text-4xl font-bold bg-clip-text text-transparent mb-8 ${
              configMode === 'summarizers' 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600' 
                : 'bg-gradient-to-r from-purple-600 to-pink-600'
            }`}>
              Combined Configuration View
            </h1>

            {/* Comprehensive Table */}
            <div className="bg-white border-2 border-slate-200 rounded-2xl overflow-hidden shadow-lg">
              <div className="overflow-x-auto" style={{ maxHeight: '70vh' }}>
                <table className="w-full border-collapse">
                  <thead className="sticky top-0 z-10">
                    <tr>
                      <th className="bg-gradient-to-r from-slate-700 to-slate-600 text-white px-6 py-4 text-left font-semibold border-r-2 border-white" style={{ minWidth: '300px' }}>
                        Section / Subsection
                      </th>
                      {templates.map(template => (
                        <th
                          key={template}
                          className={`text-white px-4 py-4 text-center font-semibold border-r-2 border-white ${
                            configMode === 'summarizers' 
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600' 
                              : 'bg-gradient-to-r from-purple-600 to-pink-600'
                          }`}
                          style={{ minWidth: '200px' }}
                        >
                          {templateNames[template]}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {allSections.map((section) => {
                      let bgColor = 'bg-white';
                      let textColor = 'text-slate-900';
                      let paddingLeft = 'pl-6';
                      let fontWeight = 'font-semibold';
                      let fontSize = 'text-base';

                      if (section.level === 'parent') {
                        bgColor = 'bg-gradient-to-r from-slate-50 to-slate-100';
                        textColor = 'text-slate-900';
                        fontWeight = 'font-bold';
                        fontSize = 'text-base';
                      } else if (section.level === 'child') {
                        bgColor = 'bg-blue-50/30';
                        textColor = 'text-slate-700';
                        paddingLeft = 'pl-12';
                        fontSize = 'text-sm';
                      } else {
                        bgColor = 'bg-white';
                        textColor = 'text-slate-600';
                        paddingLeft = 'pl-20';
                        fontSize = 'text-sm';
                      }

                      return (
                        <tr
                          key={section.key}
                          className={`border-b border-slate-200 hover:bg-slate-50/50 transition-colors ${bgColor}`}
                        >
                          <td className={`${paddingLeft} py-3 ${textColor} ${fontWeight} ${fontSize} border-r-2 border-slate-200`}>
                            {section.name}
                          </td>
                          {templates.map(template => (
                            <td
                              key={`${section.key}-${template}`}
                              className="px-4 py-3 border-r border-slate-200"
                            >
                              {renderCellContent(section.key, template)}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Legend */}
            <div className={`mt-6 border-2 rounded-xl p-4 ${
              configMode === 'summarizers' 
                ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200/50' 
                : 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200/50'
            }`}>
              <div className="text-sm font-bold text-gray-700 mb-2">Legend</div>
              <div className="flex gap-6 flex-wrap text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">➕</span> Append to section
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">⬆️</span> Prepend to section
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">💡</span> Inform context
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">—</span> No configuration
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }


  // CREATE SUMMARIZER VIEW
  if (currentView === 'create' && createType === 'summarizer') {
    // Utility functions now imported from utils

    // Helper function to auto-populate prompts from document type defaults
    const autoPopulatePrompts = (formDataState, resource, ehr) => {
      if (!resource || !resource.documentType || !ehr) {
        return formDataState;
      }

      const key = `${ehr}-${resource.documentType}`;
      const defaultPrompt = documentTypePrompts[key];
      
      if (!defaultPrompt) {
        return formDataState;
      }

      const updated = { ...formDataState };

      if (formDataState.useSeparatePrompts) {
        // Separate prompts mode - populate only enabled input types
        if (formDataState.pullFromEHR && !formDataState.ehrPrompt) {
          updated.ehrPrompt = defaultPrompt;
        }
        if (formDataState.allowUpload && !formDataState.uploadPrompt) {
          updated.uploadPrompt = defaultPrompt;
        }
        if (formDataState.allowText && !formDataState.textPrompt) {
          updated.textPrompt = defaultPrompt;
        }
      } else {
        // Single prompt mode - populate common prompt if empty
        if (!formDataState.commonPrompt) {
          updated.commonPrompt = defaultPrompt;
        }
      }

      return updated;
    };

    const handleResourceChange = (resourceId) => {
      const ehr = selectedDoctor?.ehr;
      const resources = getResourcesForEhr(ehr);
      const resource = resources.find((r) => r.id === resourceId);

      if (!resource) {
        setFormData((prev) => ({
          ...prev,
          selectedResource: '',
          dateFrom: '',
          dateTo: '',
          singleDate: '',
          organizationIds: '',
          templateIds: '',
          keywords: '',
          visitTypes: '',
          sortingDirection: '',
          documentTypes: '',
          fileType: '',
          documentCount: 5
        }));
        return;
      }

      // Reset all filter values first
      let next = {
        ...formData,
        selectedResource: resourceId,
        dateFrom: '',
        dateTo: '',
        singleDate: '',
        organizationIds: '',
        templateIds: '',
        keywords: '',
        visitTypes: '',
        sortingDirection: '',
        documentTypes: '',
        fileType: '',
        documentCount: 5
      };

      // Set defaults for editable filters (date and count)
      if (resource.filters && resource.filters.editable) {
      resource.filters.editable.forEach((filter) => {
        if (filter.type === 'dateRange' && filter.default) {
          const from = filter.default.from
            ? computeRelativeDate(filter.default.from)
            : '';
          const to = filter.default.to
            ? computeRelativeDate(filter.default.to)
            : '';
          next.dateFrom = from;
          next.dateTo = to;
        }

        if (filter.type === 'count') {
          if (filter.default && typeof filter.default.value === 'number') {
            next.documentCount = filter.default.value;
          }
        }

        if (filter.type === 'singleDate' && filter.default && filter.default.to) {
          next.singleDate = computeRelativeDate(filter.default.to);
        }
      });
      }

      // Set defaults for advanced filters (read-only, shown in advanced settings)
      if (resource.filters && resource.filters.advanced) {
      resource.filters.advanced.forEach((filter) => {
        if (filter.type === 'organizationIds' && filter.defaultValue) {
          next.organizationIds = filter.defaultValue || '';
        }
        if (filter.type === 'templateIds' && filter.defaultValue) {
          next.templateIds = filter.defaultValue || '';
        }
        if (filter.type === 'sortingDirection' && filter.defaultValue) {
          next.sortingDirection = filter.defaultValue || '';
        }
        if (filter.type === 'keywords' && filter.defaultValue) {
          next.keywords = filter.defaultValue || '';
        }
        if (filter.type === 'visitTypes' && filter.defaultValue) {
          next.visitTypes = filter.defaultValue || '';
        }
        if (filter.type === 'documentTypes' && filter.defaultValue) {
          next.documentTypes = filter.defaultValue || '';
        }
      });
      }

      // Auto-set file type based on resource fileFormat (not user-selectable)
      if (resource.fileFormat) {
        next.fileType = resource.fileFormat;
      }

      // Set preset values for pipeline configuration (if resource has them defined)
      // These are example values to help users understand the functionality
      if (resource.pipelineConfig) {
        if (resource.pipelineConfig.create_intermediate !== undefined) {
          next.create_intermediate = resource.pipelineConfig.create_intermediate;
        }
        if (resource.pipelineConfig.depends_on_summarisers !== undefined) {
          next.depends_on_summarisers = resource.pipelineConfig.depends_on_summarisers;
        }
      } else {
        // Default preset values for demonstration (pre-select create_intermediate)
        next.create_intermediate = true;
        next.depends_on_summarisers = [];
      }

      // Auto-populate default prompt from document type defaults (always populate when resource is selected)
      if (resource.documentType && ehr) {
        const key = `${ehr}-${resource.documentType}`;
        const defaultPrompt = documentTypePrompts[key];
        
        if (defaultPrompt) {
          if (next.useSeparatePrompts) {
            // If separate prompts mode, populate all enabled input types
            if (next.pullFromEHR) {
              next.ehrPrompt = defaultPrompt;
            }
            if (next.allowUpload) {
              next.uploadPrompt = defaultPrompt;
            }
            if (next.allowText) {
              next.textPrompt = defaultPrompt;
            }
          } else {
            // Single prompt mode - populate common prompt
            next.commonPrompt = defaultPrompt;
          }
        }
      }
      
      const updatedWithPrompts = next;

      // Reset unlock state when resource changes
      setAdvancedSettingsUnlocked(false);
      setFormData(updatedWithPrompts);
    };

    // Handle input type changes - auto-populate prompts if resource is selected
    const handleInputTypeChange = (field, value) => {
      const updated = { ...formData, [field]: value };
      
      // If resource is selected, auto-populate prompts for newly enabled input types
      if (formData.selectedResource) {
        const ehr = selectedDoctor?.ehr;
        const resources = getResourcesForEhr(ehr);
        const resource = resources.find((r) => r.id === formData.selectedResource);
        
        if (resource) {
          const withPrompts = autoPopulatePrompts(updated, resource, ehr);
          setFormData(withPrompts);
        } else {
          setFormData(updated);
        }
      } else {
        setFormData(updated);
      }
    };

    // Handle separate prompts toggle - redistribute prompts if resource is selected
    const handleSeparatePromptsToggle = (useSeparate) => {
      const updated = { ...formData, useSeparatePrompts: useSeparate };
      
      // If resource is selected, auto-populate prompts based on new mode
      if (formData.selectedResource) {
        const ehr = selectedDoctor?.ehr;
        const resources = getResourcesForEhr(ehr);
        const resource = resources.find((r) => r.id === formData.selectedResource);
        
        if (resource) {
          const withPrompts = autoPopulatePrompts(updated, resource, ehr);
          setFormData(withPrompts);
        } else {
          setFormData(updated);
        }
      } else {
        setFormData(updated);
      }
    };

    const handleFormSubmit = (e) => {
      e.preventDefault();
      
      // Validate name
      if (!formData.name.trim()) {
        alert('Please enter a summarizer name');
        return;
      }
      
      // Validate that at least one input type is selected
      if (!formData.pullFromEHR && !formData.allowUpload && !formData.allowText) {
        alert('Please select at least one input type (Pull from EHR, Upload, or Paste Text)');
        return;
      }

      // Validate resource selection if Pull from EHR is enabled
      if (formData.pullFromEHR) {
        if (formData.resourceType === 'existing' && !formData.selectedResource) {
          alert('Please select an existing resource or request a new one');
          return;
        }
        if (formData.resourceType === 'new' && !formData.newResourceDesc.trim()) {
          alert('Please describe the new resource you need');
          return;
        }
      }
      
      // Validate prompts
      if (!formData.useSeparatePrompts) {
        if (!formData.commonPrompt.trim()) {
          alert('Please enter a summarization prompt');
          return;
        }
      } else {
        if (formData.pullFromEHR && !formData.ehrPrompt.trim()) {
          alert('Please enter a prompt for EHR data');
          return;
        }
        if (formData.allowUpload && !formData.uploadPrompt.trim()) {
          alert('Please enter a prompt for PDF upload');
          return;
        }
        if (formData.allowText && !formData.textPrompt.trim()) {
          alert('Please enter a prompt for pasted text');
          return;
        }
      }

      // Validate models
      if (!formData.primaryModel) {
        alert('Please select a primary model');
        return;
      }
      if (!formData.fallbackModel) {
        alert('Please select a fallback model');
        return;
      }
      
      if (editingSummarizerId) {
        // Update existing summarizer
        const updatedSummarizer = {
          ...formData,
          id: editingSummarizerId,
          doctorId: selectedDoctor?.id,
          doctorName: selectedDoctor?.name,
          ehr: selectedDoctor?.ehr
        };
        
        setCreatedSummarizers(prev => prev.map(s => 
          s.id === editingSummarizerId ? updatedSummarizer : s
        ));
        
        const statusMessage = formData.pullFromEHR && formData.resourceType === 'new'
          ? 'Summarizer updated successfully!\n\n⚠️ New resource request pending tech team review.\nSummarizer will be operational once resource is created.'
          : 'Summarizer updated successfully!\n\n✓ Configuration saved\n✓ Ready for immediate use';
        
        alert(statusMessage);
        setEditingSummarizerId(null);
      } else {
        // Create new summarizer
        const newSummarizer = {
          ...formData,
          id: `summarizer-${Date.now()}`,
          doctorId: selectedDoctor?.id,
          doctorName: selectedDoctor?.name,
          ehr: selectedDoctor?.ehr,
          active: true
        };
        
        setCreatedSummarizers(prev => [...prev, newSummarizer]);
        
        const statusMessage = formData.pullFromEHR && formData.resourceType === 'new'
          ? 'Summarizer created successfully!\n\n⚠️ New resource request submitted.\nTech team will be notified to create the resource.\nSummarizer will be operational once resource is ready.'
          : 'Summarizer created successfully!\n\n✓ Summarizer entry created in database\n✓ Configuration saved\n✓ Ready for immediate use';
        
        alert(statusMessage);
      }
      
      setCurrentView('doctors');
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="mb-8">
            <button
              onClick={handleCancelCreate}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-4 transition-colors"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              Back to Doctors
            </button>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-semibold text-lg">
                  {selectedDoctor?.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-800">
                    {editingSummarizerId ? 'Edit Summarizer' : 'Create New Summarizer'}
                  </h1>
                  <p className="text-slate-600">for {selectedDoctor?.name} • {selectedDoctor?.ehr} EHR</p>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-8">
            {/* Section 1: Basic Information */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/50">
              <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-sm font-bold">1</div>
                Basic Information
              </h2>
              
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Doctor's Email</label>
                  <input
                    type="email"
                    value={selectedDoctor?.email}
                    disabled
                    className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">EHR System</label>
                  <input
                    type="text"
                    value={selectedDoctor?.ehr}
                    disabled
                    className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-600"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g., Neurology Visit Summary"
                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                  <p className="text-sm text-slate-500 mt-1">User will see this on the web app</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Purpose/Use Case</label>
                  <textarea
                    value={formData.purpose}
                    onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                    placeholder="Describe why you're creating this summarizer and what it will be used for..."
                    rows={4}
                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Functionality Settings */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/50">
              <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-sm font-bold">2</div>
                Functionality Settings
              </h2>
              
              <div className="space-y-6">
                {/* Checkboxes for input types */}
                <div className="space-y-3">
                  <p className="text-sm font-medium text-slate-700 mb-3">Select input types (you can select multiple):</p>
                  
                {/* Pull from EHR */}
                <div className="border border-slate-200 rounded-xl p-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.pullFromEHR}
                      onChange={(e) => handleInputTypeChange('pullFromEHR', e.target.checked)}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <div>
                      <span className="font-medium text-slate-800">Pull from EHR</span>
                      <p className="text-sm text-slate-600">Automatically extract data from connected EHR system</p>
                    </div>
                  </label>
                </div>

                {/* Allow Upload */}
                <div className="border border-slate-200 rounded-xl p-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.allowUpload}
                      onChange={(e) => handleInputTypeChange('allowUpload', e.target.checked)}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <div>
                      <span className="font-medium text-slate-800">Allow user to upload files</span>
                      <p className="text-sm text-slate-600">Enable PDF/document upload functionality</p>
                    </div>
                  </label>
                </div>

                  {/* Allow Text/Paste */}
                <div className="border border-slate-200 rounded-xl p-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.allowText}
                      onChange={(e) => handleInputTypeChange('allowText', e.target.checked)}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <div>
                        <span className="font-medium text-slate-800">Allow user to paste text</span>
                        <p className="text-sm text-slate-600">Enable direct text input/paste functionality</p>
                    </div>
                  </label>
                  </div>
                </div>

                {/* Prompt Configuration */}
                {(formData.pullFromEHR || formData.allowUpload || formData.allowText) && (
                  <div className="border-t border-slate-200 pt-6">
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-slate-700">Default Prompts Configuration</h3>
                          {promptsEdited && (
                            <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full font-medium">
                              [Edited]
                            </span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            // Edit button - prompts are always editable, this is just for visual indication
                            setPromptsEdited(true);
                          }}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
                        >
                          <Pencil className="w-3 h-3" />
                          Edit
                        </button>
                      </div>
                      <p className="text-xs text-slate-500 mb-4">
                        Define the default prompts for this summarizer. These prompts will be used when processing data.
                      </p>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.useSeparatePrompts}
                          onChange={(e) => handleSeparatePromptsToggle(e.target.checked)}
                          className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <div>
                          <span className="font-medium text-slate-800">Use separate prompts for each input type</span>
                          <p className="text-sm text-slate-600">By default, one prompt is used for all input types</p>
                        </div>
                      </label>
                    </div>

                    {/* Single Prompt (Default) */}
                    {!formData.useSeparatePrompts && (
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-sm font-medium text-slate-700">
                          Default Summarization Prompt (for all input types) *
                        </label>
                          <button
                            type="button"
                            onClick={() => handleMaximizePrompt('common')}
                            className="text-blue-600 hover:text-blue-700 p-1 rounded transition-colors"
                            title="Maximize textarea"
                          >
                            <Maximize2 className="w-4 h-4" />
                          </button>
                        </div>
                        <textarea
                          value={formData.commonPrompt}
                          onChange={(e) => {
                            setFormData({...formData, commonPrompt: e.target.value});
                            setPromptsEdited(true);
                          }}
                          placeholder="Enter the default prompt for processing all input types..."
                          rows={4}
                          className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          required
                        />
                        <p className="text-xs text-slate-500 mt-1">
                          This is the default prompt for this summarizer. It will be used for all selected input types.
                        </p>
                      </div>
                    )}

                    {/* Separate Prompts */}
                    {formData.useSeparatePrompts && (
                      <div className="mt-4 space-y-4">
                        {formData.pullFromEHR && (
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <label className="block text-sm font-medium text-slate-700">
                              Default Prompt for EHR Data *
                            </label>
                              <button
                                type="button"
                                onClick={() => handleMaximizePrompt('ehr')}
                                className="text-blue-600 hover:text-blue-700 p-1 rounded transition-colors"
                                title="Maximize textarea"
                              >
                                <Maximize2 className="w-4 h-4" />
                              </button>
                            </div>
                            <textarea
                              value={formData.ehrPrompt}
                              onChange={(e) => {
                                setFormData({...formData, ehrPrompt: e.target.value});
                                setPromptsEdited(true);
                              }}
                              placeholder="Enter the default prompt for processing EHR data..."
                              rows={3}
                              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                              required
                            />
                            <p className="text-xs text-slate-500 mt-1">
                              Default prompt for this summarizer when processing EHR data
                            </p>
                          </div>
                        )}

                        {formData.allowUpload && (
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <label className="block text-sm font-medium text-slate-700">
                              Default Prompt for PDF Upload *
                            </label>
                              <button
                                type="button"
                                onClick={() => handleMaximizePrompt('upload')}
                                className="text-blue-600 hover:text-blue-700 p-1 rounded transition-colors"
                                title="Maximize textarea"
                              >
                                <Maximize2 className="w-4 h-4" />
                              </button>
                            </div>
                            <textarea
                              value={formData.uploadPrompt}
                              onChange={(e) => {
                                setFormData({...formData, uploadPrompt: e.target.value});
                                setPromptsEdited(true);
                              }}
                              placeholder="Enter the default prompt for processing uploaded files..."
                              rows={3}
                              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                              required
                            />
                            <p className="text-xs text-slate-500 mt-1">
                              Default prompt for this summarizer when processing uploaded PDFs
                            </p>
                          </div>
                        )}
                  
                  {formData.allowText && (
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <label className="block text-sm font-medium text-slate-700">
                              Default Prompt for Pasted Text *
                            </label>
                              <button
                                type="button"
                                onClick={() => handleMaximizePrompt('text')}
                                className="text-blue-600 hover:text-blue-700 p-1 rounded transition-colors"
                                title="Maximize textarea"
                              >
                                <Maximize2 className="w-4 h-4" />
                              </button>
                            </div>
                      <textarea
                        value={formData.textPrompt}
                        onChange={(e) => {
                          setFormData({...formData, textPrompt: e.target.value});
                          setPromptsEdited(true);
                        }}
                              placeholder="Enter the default prompt for processing pasted text..."
                        rows={3}
                        className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                              required
                      />
                            <p className="text-xs text-slate-500 mt-1">
                              Default prompt for this summarizer when processing pasted text
                            </p>
                    </div>
                  )}
                </div>
                    )}
                  </div>
                )}

                {!(formData.pullFromEHR || formData.allowUpload || formData.allowText) && (
                  <p className="text-sm text-slate-500 italic text-center py-4">
                    Select at least one input type to configure prompts
                  </p>
                )}
              </div>
            </div>

            {/* Section 3: Data Source Configuration (conditional) */}
            {formData.pullFromEHR && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/50">
                <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-sm font-bold">3</div>
                  Data Source Configuration
                </h2>
                
                <div className="space-y-6">
                  {/* Resource Selection: Existing or New */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">
                      Resource Selection *
                    </label>
                    <div className="space-y-3 mb-4">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="resourceType"
                          value="existing"
                          checked={formData.resourceType === 'existing'}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              resourceType: 'existing',
                              selectedResource: '',
                              newResourceDesc: ''
                            });
                          }}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-slate-700">Select existing resource</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="resourceType"
                          value="new"
                          checked={formData.resourceType === 'new'}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              resourceType: 'new',
                              selectedResource: '',
                              newResourceDesc: ''
                            });
                          }}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-slate-700">Request new resource</span>
                      </label>
                    </div>

                    {/* Existing Resource Dropdown */}
                    {formData.resourceType === 'existing' && (
                      <div>
                    <p className="text-xs text-slate-500 mb-2">
                      Select a resource. Options show resource name with available filters. Only date and number of documents are editable; other filters appear in Advanced Settings.
                    </p>
                            <select
                              value={formData.selectedResource}
                      onChange={(e) => handleResourceChange(e.target.value)}
                      className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      required
                    >
                      <option value="">Select a resource...</option>
                      {getResourcesForEhr(selectedDoctor?.ehr).map((resource) => (
                        <option key={resource.id} value={resource.id}>
                          {formatResourceOption(resource)}
                                </option>
                              ))}
                            </select>
                        {formData.selectedResource && (() => {
                          const resource = getResourcesForEhr(selectedDoctor?.ehr).find((r) => r.id === formData.selectedResource);
                          return resource?.source ? (
                      <p className="mt-2 text-sm text-slate-600">
                              {resource.source}
                            </p>
                          ) : null;
                        })()}
                      </div>
                    )}

                    {/* New Resource Request */}
                    {formData.resourceType === 'new' && (
                      <div>
                        <p className="text-xs text-slate-500 mb-2">
                          Describe the resource you need. Tech team will review and create it.
                        </p>
                        <textarea
                          value={formData.newResourceDesc}
                          onChange={(e) => setFormData({...formData, newResourceDesc: e.target.value})}
                          placeholder="Describe the document type needed, use case, and any special requirements..."
                          rows={4}
                          className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          required
                        />
                        <p className="mt-2 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-3">
                          <strong>Note:</strong> Summarizer will be created with a placeholder resource. Tech team will be notified to develop the new resource. Once complete, the summarizer will become fully operational.
                        </p>
                      </div>
                          )}
                        </div>

                  {/* Dynamic filter rendering based on selected resource & EHR */}
                  {formData.resourceType === 'existing' && formData.selectedResource ? (
                    (() => {
                      const ehr = selectedDoctor?.ehr;
                      const resources = getResourcesForEhr(ehr);
                      const resource = resources.find((r) => r.id === formData.selectedResource);

                      if (!resource) {
                        return (
                          <div className="border border-amber-200 bg-amber-50 text-amber-800 text-sm rounded-xl p-4">
                            Selected resource is not available for this EHR.
                        </div>
                        );
                      }

                      const editableFilters = resource.filters?.editable || [];
                      const advancedFilters = resource.filters?.advanced || [];

                      return (
                        <div className="space-y-4">
                          <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/60">
                            <div className="flex items-center gap-2 mb-2">
                              <Database className="w-4 h-4 text-blue-600" />
                              <span className="text-sm font-medium text-slate-800">
                                Resource: {resource.resourceLabel}
                              </span>
                    </div>
                            <p className="text-xs text-slate-500">
                              Only date range and number of documents are editable. File type is auto-set based on the selected resource. Other filters are shown in Advanced Settings for transparency.
                            </p>
                            {resource.fileFormat && (
                              <p className="text-xs text-slate-600 mt-2 font-medium">
                                File Format: {resource.fileFormat} (auto-set)
                              </p>
                            )}
                  </div>

                          {/* Editable Filters (Date Range and Count) */}
                          {editableFilters.length === 0 ? (
                            <div className="border border-slate-200 rounded-xl p-4 bg-white text-sm text-slate-600">
                              No editable filters for this resource.
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {editableFilters.map((filter) => {
                                if (filter.type === 'count') {
                                  return (
                                    <div key={filter.id}>
                                      <label className="block text-sm font-medium text-slate-700 mb-2">
                                        {filter.label} {filter.required ? '*' : ''}
                      </label>
                            <input
                              type="number"
                              min="1"
                                        value={formData.documentCount}
                                        onChange={(e) =>
                                          setFormData({
                                            ...formData,
                                            documentCount: Number(e.target.value)
                                          })
                                        }
                                        className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                      />
                                      {filter.note && (
                                        <p className="mt-1 text-xs text-amber-600">
                                          {filter.note}
                                        </p>
                                      )}
                                      <p className="mt-1 text-xs text-slate-500">
                                        Number of documents to pull for this summary.
                                      </p>
                        </div>
                                  );
                                }

                                // fileType is auto-set based on resource.fileFormat, not user-selectable

                                if (filter.type === 'dateRange') {
                                  return (
                                    <div key={filter.id}>
                                      <label className="block text-sm font-medium text-slate-700 mb-2">
                                        {filter.label} {filter.editable ? '*' : ''}
                                      </label>
                                      <div className="grid grid-cols-2 gap-2">
                        <input
                                type="date"
                                value={formData.dateFrom}
                                          onChange={(e) =>
                                            setFormData({
                                              ...formData,
                                              dateFrom: e.target.value
                                            })
                                          }
                                          disabled={!filter.editable}
                                          className="p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-slate-50 disabled:text-slate-500"
                              />
                              <input
                                type="date"
                                value={formData.dateTo}
                                          onChange={(e) =>
                                            setFormData({
                                              ...formData,
                                              dateTo: e.target.value
                                            })
                                          }
                                          disabled={!filter.editable}
                                          className="p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-slate-50 disabled:text-slate-500"
                              />
                        </div>
                                      <p className="mt-1 text-xs text-slate-500">
                                        Prefilled using EHR defaults (for example, ECW 3 years → 3
                                        days). You can override the dates if needed.
                                      </p>
                        </div>
                                  );
                                }

                                if (filter.type === 'singleDate') {
                                  return (
                                    <div key={filter.id}>
                                      <label className="block text-sm font-medium text-slate-700 mb-2">
                                        {filter.label} {filter.editable ? '*' : ''}
                      </label>
                                      <input
                                        type="date"
                                        value={formData.singleDate}
                                        onChange={(e) =>
                                          setFormData({
                                            ...formData,
                                            singleDate: e.target.value
                                          })
                                        }
                                        disabled={!filter.editable}
                                        className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-slate-50 disabled:text-slate-500"
                                      />
                    </div>
                                  );
                                }

                                if (filter.type === 'organizationIds') {
                                  return (
                                    <div key={filter.id}>
                                      <label className="block text-sm font-medium text-slate-700 mb-2">
                                        {filter.label}
                                      </label>
                                      <input
                                        type="text"
                                        value={formData.organizationIds}
                                        onChange={(e) =>
                                          setFormData({
                                            ...formData,
                                            organizationIds: e.target.value
                                          })
                                        }
                                        disabled={!filter.editable}
                                        className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-600"
                                      />
                                      <p className="mt-1 text-xs text-slate-500">
                                        Read-only. IDs used to scope retrieval to specific
                                        organizations in the EHR.
                                      </p>
                  </div>
                                  );
                                }

                                if (filter.type === 'templateIds') {
                                  return (
                                    <div key={filter.id}>
                                      <label className="block text-sm font-medium text-slate-700 mb-2">
                                        {filter.label}
                                      </label>
                        <input
                                        type="text"
                                        value={formData.templateIds}
                                        onChange={(e) =>
                                          setFormData({
                                            ...formData,
                                            templateIds: e.target.value
                                          })
                                        }
                                        disabled={!filter.editable}
                                        className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-600"
                                      />
                                      <p className="mt-1 text-xs text-slate-500">
                                        Read-only. Template IDs define which note templates are
                                        eligible.
                                      </p>
                                    </div>
                                  );
                                }

                                if (filter.type === 'documentType') {
                                  return (
                                    <div key={filter.id}>
                                      <label className="block text-sm font-medium text-slate-700 mb-2">
                                        {filter.label} *
                                      </label>
                            <input
                                        type="text"
                                        value={formData.selectedResource}
                                        onChange={(e) =>
                                          setFormData({
                                            ...formData,
                                            selectedResource: e.target.value
                                          })
                                        }
                                        className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                      />
                                      <p className="mt-1 text-xs text-slate-500">
                                        Editable. Use this to narrow to specific document types
                                        (e.g., Discharge Summary, Echo Report).
                                      </p>
                                    </div>
                                  );
                                }

                                if (filter.type === 'keywords') {
                                  return (
                                    <div key={filter.id}>
                                      <label className="block text-sm font-medium text-slate-700 mb-2">
                                        {filter.label}
                                      </label>
                            <textarea
                                        rows={2}
                                        value={formData.keywords}
                                        onChange={(e) =>
                                          setFormData({
                                            ...formData,
                                            keywords: e.target.value
                                          })
                                        }
                                        disabled={!filter.editable}
                                        className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-600"
                                      />
                                      <p className="mt-1 text-xs text-slate-500">
                                        {filter.editable
                                          ? 'Editable keyword filters applied at retrieval time.'
                                          : 'Read-only keywords baked into this preset. Visible for transparency.'}
                                      </p>
                                    </div>
                                  );
                                }

                                return null;
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })()
                  ) : (
                    <div className="border border-dashed border-slate-300 rounded-xl p-4 text-sm text-slate-500">
                      Select a summary preset above to configure resources and filters for this
                      summarizer.
                    </div>
                  )}

                  {/* Advanced Settings - Collapsible */}
                  {formData.selectedResource && (
                    <div className="border-t border-slate-200 pt-6 mt-6">
                      <div className="flex items-center justify-between mb-4">
                      <button
                        type="button"
                        onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                          className="flex items-center gap-3 p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors text-left flex-1"
                      >
                          <Settings className="w-5 h-5 text-slate-600" />
                          <span className="font-semibold text-slate-700">Advanced Settings</span>
                          {advancedSettingsEdited && (
                            <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full font-medium">
                              [Edited]
                            </span>
                          )}
                          <span className="text-xs text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">
                            Optional
                          </span>
                        <ChevronRight 
                          className={`w-5 h-5 text-slate-600 transition-transform duration-200 ${
                            showAdvancedSettings ? 'rotate-90' : ''
                          }`}
                        />
                      </button>
                        {!advancedSettingsUnlocked && (
                          <button
                            type="button"
                            onClick={() => setShowAdvancedSettingsPopup(true)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                          >
                            <Pencil className="w-4 h-4" />
                            Edit
                          </button>
                        )}
                      </div>

                      {showAdvancedSettings && (
                        <div className="mt-4 space-y-6 bg-slate-50 rounded-xl p-5 border border-slate-200">
                          
                          {/* Part 1: Filter Settings */}
                          {(() => {
                            const ehr = selectedDoctor?.ehr;
                            const resources = getResourcesForEhr(ehr);
                            const resource = resources.find((r) => r.id === formData.selectedResource);
                            const advancedFilters = resource?.filters?.advanced || [];

                            if (advancedFilters.length === 0) {
                              return null;
                            }

                            return (
                              <div className="space-y-4 pb-6 border-b-2 border-slate-300">
                                <div className="mb-4">
                                  <h3 className="text-base font-semibold text-slate-800 mb-1">Filter Settings</h3>
                                  <p className="text-xs text-slate-500">Configure advanced filter options for resource retrieval</p>
                                </div>
                                {advancedFilters.map((filter) => {
                                  if (filter.type === 'organizationIds') {
                                    return (
                                      <div key={filter.id}>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                          {filter.label}
                      </label>
                                        <input
                                          type="text"
                                          value={formData.organizationIds}
                                          readOnly={!advancedSettingsUnlocked}
                                          disabled={!advancedSettingsUnlocked}
                                          onClick={() => {
                                            if (!advancedSettingsUnlocked) {
                                              setShowAdvancedSettingsPopup(true);
                                            }
                                          }}
                                          onChange={(e) => {
                                            if (advancedSettingsUnlocked) {
                                              setFormData({
                                                ...formData,
                                                organizationIds: e.target.value
                                              });
                                              setAdvancedSettingsEdited(true);
                                            }
                                          }}
                                          className={`w-full p-2 border rounded-lg transition-colors ${
                                            advancedSettingsUnlocked
                                              ? 'border-slate-200 bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                              : 'border-slate-300 bg-slate-100 text-slate-500 cursor-pointer'
                                          }`}
                                        />
                                        <p className="mt-1 text-xs text-slate-500">
                                          {filter.description || 'IDs used to scope retrieval to specific organizations in the EHR.'}
                                        </p>
                                      </div>
                                    );
                                  }

                                  if (filter.type === 'templateIds') {
                                    return (
                                      <div key={filter.id}>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                          {filter.label}
                                        </label>
                        <input
                                          type="text"
                                          value={formData.templateIds}
                                          readOnly={!advancedSettingsUnlocked}
                                          disabled={!advancedSettingsUnlocked}
                                          onClick={() => {
                                            if (!advancedSettingsUnlocked) {
                                              setShowAdvancedSettingsPopup(true);
                                            }
                                          }}
                                          onChange={(e) => {
                                            if (advancedSettingsUnlocked) {
                                              setFormData({
                                                ...formData,
                                                templateIds: e.target.value
                                              });
                                              setAdvancedSettingsEdited(true);
                                            }
                                          }}
                                          className={`w-full p-2 border rounded-lg transition-colors ${
                                            advancedSettingsUnlocked
                                              ? 'border-slate-200 bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                              : 'border-slate-300 bg-slate-100 text-slate-500 cursor-pointer'
                                          }`}
                                        />
                                        <p className="mt-1 text-xs text-slate-500">
                                          {filter.description || 'Template IDs define which note templates are eligible.'}
                                        </p>
                                      </div>
                                    );
                                  }

                                  if (filter.type === 'keywords') {
                                    return (
                                      <div key={filter.id}>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                          {filter.label}
                                        </label>
                                        <textarea
                                          rows={2}
                                          value={formData.keywords}
                                          readOnly={!advancedSettingsUnlocked}
                                          disabled={!advancedSettingsUnlocked}
                                          onClick={() => {
                                            if (!advancedSettingsUnlocked) {
                                              setShowAdvancedSettingsPopup(true);
                                            }
                                          }}
                                          onChange={(e) => {
                                            if (advancedSettingsUnlocked) {
                                              setFormData({
                                                ...formData,
                                                keywords: e.target.value
                                              });
                                              setAdvancedSettingsEdited(true);
                                            }
                                          }}
                                          className={`w-full p-2 border rounded-lg transition-colors ${
                                            advancedSettingsUnlocked
                                              ? 'border-slate-200 bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                              : 'border-slate-300 bg-slate-100 text-slate-500 cursor-pointer'
                                          }`}
                                          placeholder={filter.examples ? `Examples: ${filter.examples.join(', ')}` : ''}
                                        />
                                        <p className="mt-1 text-xs text-slate-500">
                                          {filter.description || 'Keywords baked into this preset. Visible for transparency.'}
                                        </p>
                                      </div>
                                    );
                                  }

                                  if (filter.type === 'visitTypes') {
                                    return (
                                      <div key={filter.id}>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                          {filter.label}
                                        </label>
                              <input
                                          type="text"
                                          value={formData.visitTypes}
                                          readOnly={!advancedSettingsUnlocked}
                                          disabled={!advancedSettingsUnlocked}
                                          onClick={() => {
                                            if (!advancedSettingsUnlocked) {
                                              setShowAdvancedSettingsPopup(true);
                                            }
                                          }}
                                          onChange={(e) => {
                                            if (advancedSettingsUnlocked) {
                                              setFormData({
                                                ...formData,
                                                visitTypes: e.target.value
                                              });
                                              setAdvancedSettingsEdited(true);
                                            }
                                          }}
                                          className={`w-full p-2 border rounded-lg transition-colors ${
                                            advancedSettingsUnlocked
                                              ? 'border-slate-200 bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                              : 'border-slate-300 bg-slate-100 text-slate-500 cursor-pointer'
                                          }`}
                                        />
                                        <p className="mt-1 text-xs text-slate-500">
                                          {filter.description || 'Filter by visit types.'}
                                        </p>
                        </div>
                                    );
                                  }

                                  if (filter.type === 'sortingDirection') {
                                    return (
                                      <div key={filter.id}>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                          {filter.label}
                                        </label>
                                        <select
                                          value={formData.sortingDirection}
                                          disabled={!advancedSettingsUnlocked}
                                          onClick={() => {
                                            if (!advancedSettingsUnlocked) {
                                              setShowAdvancedSettingsPopup(true);
                                            }
                                          }}
                                          onChange={(e) => {
                                            if (advancedSettingsUnlocked) {
                                              setFormData({
                                                ...formData,
                                                sortingDirection: e.target.value
                                              });
                                              setAdvancedSettingsEdited(true);
                                            }
                                          }}
                                          className={`w-full p-2 border rounded-lg transition-colors ${
                                            advancedSettingsUnlocked
                                              ? 'border-slate-200 bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                              : 'border-slate-300 bg-slate-100 text-slate-500 cursor-pointer'
                                          }`}
                                        >
                                          {filter.options?.map(opt => (
                                            <option key={opt} value={opt}>{opt}</option>
                                          ))}
                                        </select>
                                        <p className="mt-1 text-xs text-slate-500">
                                          {filter.description || 'Direction for sorting and concatenating notes.'}
                                        </p>
                                      </div>
                                    );
                                  }

                                  if (filter.type === 'documentTypes') {
                                    return (
                                      <div key={filter.id}>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                          {filter.label}
                                        </label>
                              <input
                                          type="text"
                                          value={formData.documentTypes}
                                          readOnly={!advancedSettingsUnlocked}
                                          disabled={!advancedSettingsUnlocked}
                                          onClick={() => {
                                            if (!advancedSettingsUnlocked) {
                                              setShowAdvancedSettingsPopup(true);
                                            }
                                          }}
                                          onChange={(e) => {
                                            if (advancedSettingsUnlocked) {
                                              setFormData({
                                                ...formData,
                                                documentTypes: e.target.value
                                              });
                                              setAdvancedSettingsEdited(true);
                                            }
                                          }}
                                          className={`w-full p-2 border rounded-lg transition-colors ${
                                            advancedSettingsUnlocked
                                              ? 'border-slate-200 bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                              : 'border-slate-300 bg-slate-100 text-slate-500 cursor-pointer'
                                          }`}
                                        />
                                        <p className="mt-1 text-xs text-slate-500">
                                          {filter.description || 'Document types might need to be set at practice level.'}
                                        </p>
                            </div>
                                    );
                                  }

                                  // fileType is now in editable filters section, not here
                                  // This section is only for advanced/read-only filters

                                  return null;
                                })}
                              </div>
                            );
                          })()}
                          
                          {/* Part 2: Pipeline Settings */}
                          <div className="space-y-4 pt-6">
                            <div className="mb-4">
                              <h3 className="text-base font-semibold text-slate-800 mb-1">Pipeline Settings</h3>
                              <p className="text-xs text-slate-500">Configure pipeline behavior and dependencies</p>
                            </div>
                            
                            {/* create_intermediate */}
                            <div>
                              <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={formData.create_intermediate}
                                  disabled={!advancedSettingsUnlocked}
                                  onClick={() => {
                                    if (!advancedSettingsUnlocked) {
                                      setShowAdvancedSettingsPopup(true);
                                    }
                                  }}
                                  onChange={(e) => {
                                    if (advancedSettingsUnlocked) {
                                      setFormData({
                                        ...formData,
                                        create_intermediate: e.target.checked
                                      });
                                      setAdvancedSettingsEdited(true);
                                    }
                                  }}
                                  className={`w-5 h-5 text-blue-600 rounded focus:ring-blue-500 transition-opacity ${
                                    advancedSettingsUnlocked
                                      ? 'cursor-pointer'
                                      : 'cursor-pointer opacity-60'
                                  }`}
                                />
                                <div>
                                  <span className={`font-medium ${advancedSettingsUnlocked ? 'text-slate-800' : 'text-slate-600'}`}>
                                    Create Intermediate
                                  </span>
                                  <p className="text-xs text-slate-500 mt-0.5">Enable intermediate resource creation</p>
                        </div>
                      </label>
                    </div>

                            {/* depends_on_summarisers */}
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Depends on Summarisers
                              </label>
                              <select
                                multiple
                                value={formData.depends_on_summarisers}
                                disabled={!advancedSettingsUnlocked}
                                onClick={() => {
                                  if (!advancedSettingsUnlocked) {
                                    setShowAdvancedSettingsPopup(true);
                                  }
                                }}
                                onChange={(e) => {
                                  if (advancedSettingsUnlocked) {
                                    const selected = Array.from(e.target.selectedOptions, option => option.value);
                                    setFormData({
                                      ...formData,
                                      depends_on_summarisers: selected
                                    });
                                    setAdvancedSettingsEdited(true);
                                  }
                                }}
                                className={`w-full p-3 border rounded-xl transition-colors min-h-[100px] ${
                                  advancedSettingsUnlocked
                                    ? 'border-slate-200 bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                    : 'border-slate-300 bg-slate-100 text-slate-500 cursor-pointer'
                                }`}
                              >
                                {getSummariserOptions().map(option => (
                                  <option key={option.id} value={option.id}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                              <p className="text-xs text-slate-500 mt-1">
                                Select summarisers that this resource depends on (hold Ctrl/Cmd to select multiple). Only summarisers for the same doctor are shown.
                              </p>
                            </div>
                          </div>
                            </div>
                          )}
                        </div>
                  )}
                    </div>
                  </div>
            )}

            {/* Section 4: Add Variables (always available) */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/50">
              <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-sm font-bold">4</div>
                Add Variables
              </h2>
              
              <p className="text-sm text-slate-600 mb-6">
                Define variables to extract from the selected data source. Variables can be used to extract specific data points from EHR resources, uploaded files, or text input.
              </p>
              
              {formData.pullFromEHR && formData.resourceType === 'existing' && formData.selectedResource && (() => {
                const ehr = selectedDoctor?.ehr;
                const resources = getResourcesForEhr(ehr);
                const resource = resources.find((r) => r.id === formData.selectedResource);
                return resource ? (
                  <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                    <p className="text-sm text-slate-700">
                      <span className="font-medium">Selected Resource:</span> {formatResourceOption(resource)}
                    </p>
                  </div>
                ) : null;
              })()}
              
              {formData.allowUpload && !formData.pullFromEHR && (
                <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                  <p className="text-sm text-slate-700">
                    <span className="font-medium">Data Source:</span> Uploaded Files
                  </p>
                </div>
              )}
              
              {formData.allowText && !formData.pullFromEHR && !formData.allowUpload && (
                <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                  <p className="text-sm text-slate-700">
                    <span className="font-medium">Data Source:</span> Text Input
                  </p>
                </div>
              )}
              
              {formData.pullFromEHR && formData.allowUpload && (
                <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                  <p className="text-sm text-slate-700">
                    <span className="font-medium">Data Sources:</span> {formData.selectedResource ? 'EHR Resource + Uploaded Files' : 'Uploaded Files'}
                  </p>
                </div>
              )}
              
              {!formData.pullFromEHR && !formData.allowUpload && !formData.allowText && (
                <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-800">
                    Select at least one input type above to add variables.
                  </p>
                </div>
              )}

                {/* Variables List */}
                {formData.variables && formData.variables.length > 0 && (
                  <div className="mb-6 space-y-3">
                    {formData.variables.map((variable, index) => (
                      <div key={index} className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-semibold text-slate-800">{variable.name}</span>
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                {variable.extractionMethod === 'pickSection' ? 'Import Section' : 'LLM Query'}
                              </span>
                            </div>
                            {variable.extractionMethod === 'pickSection' && variable.selectedSection && (
                              <p className="text-sm text-slate-600">Section: {variable.selectedSection}</p>
                            )}
                            {variable.extractionMethod === 'llmSearch' && variable.llmQuery && (
                              <p className="text-sm text-slate-600">Query: {variable.llmQuery}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingVariableIndex(index);
                                setNewVariable({...variable});
                                setShowAddVariableForm(true);
                              }}
                              className="text-blue-600 hover:text-blue-700 p-1"
                              title="Edit variable"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = formData.variables.filter((_, i) => i !== index);
                                setFormData({...formData, variables: updated});
                              }}
                              className="text-red-600 hover:text-red-700 p-1"
                              title="Remove variable"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add/Edit Variable Form */}
                {!showAddVariableForm ? (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingVariableIndex(null);
                      setNewVariable({ name: '', extractionMethod: '', selectedSection: '', llmQuery: '' });
                      setShowAddVariableForm(true);
                    }}
                    className="w-full px-4 py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Add Variable
                  </button>
                ) : (
                  <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-base font-semibold text-slate-800">
                        {editingVariableIndex !== null ? 'Edit Variable' : 'New Variable'}
                      </h3>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddVariableForm(false);
                          setEditingVariableIndex(null);
                          setNewVariable({ name: '', extractionMethod: '', selectedSection: '', llmQuery: '' });
                        }}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Variable Name *</label>
                      <input
                        type="text"
                        value={newVariable.name}
                        onChange={(e) => setNewVariable({...newVariable, name: e.target.value})}
                        placeholder="e.g., Patient Age, Last Visit Date"
                        className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-3">Extraction Method *</label>
                      <div className="space-y-3">
                        <label className="flex items-start gap-3 p-3 border-2 border-slate-200 rounded-lg cursor-pointer hover:bg-white transition-colors">
                          <input
                            type="radio"
                            name="extractionMethod"
                            value="pickSection"
                            checked={newVariable.extractionMethod === 'pickSection'}
                            onChange={(e) => setNewVariable({...newVariable, extractionMethod: e.target.value, llmQuery: ''})}
                            className="w-4 h-4 text-blue-600 mt-0.5"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-slate-800">Import section as is</div>
                            <p className="text-xs text-slate-600">Pick a direct section from the resource</p>
                          </div>
                        </label>
                        <label className="flex items-start gap-3 p-3 border-2 border-slate-200 rounded-lg cursor-pointer hover:bg-white transition-colors">
                          <input
                            type="radio"
                            name="extractionMethod"
                            value="llmSearch"
                            checked={newVariable.extractionMethod === 'llmSearch'}
                            onChange={(e) => setNewVariable({...newVariable, extractionMethod: e.target.value, selectedSection: ''})}
                            className="w-4 h-4 text-blue-600 mt-0.5"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-slate-800">LLM query to extract data</div>
                            <p className="text-xs text-slate-600">Give LLM a command to search and extract data</p>
                          </div>
                        </label>
                      </div>
                    </div>

                    {newVariable.extractionMethod === 'pickSection' && (
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Section Name *</label>
                        <input
                          type="text"
                          value={newVariable.selectedSection}
                          onChange={(e) => setNewVariable({...newVariable, selectedSection: e.target.value})}
                          placeholder="Enter section name to import"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    )}

                    {newVariable.extractionMethod === 'llmSearch' && (
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">LLM Query *</label>
                        <textarea
                          value={newVariable.llmQuery}
                          onChange={(e) => setNewVariable({...newVariable, llmQuery: e.target.value})}
                          placeholder="e.g., Extract the patient's age, Find the date of the last visit, Get the primary diagnosis code..."
                          rows={5}
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y min-h-[120px]"
                              />
                              <p className="text-xs text-slate-500 mt-1">
                          Enter a command or query for the LLM to search through the document and extract specific data
                              </p>
                            </div>
                    )}

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          if (!newVariable.name || !newVariable.extractionMethod) {
                            alert('Please fill in variable name and select extraction method');
                            return;
                          }
                          if (newVariable.extractionMethod === 'pickSection' && !newVariable.selectedSection) {
                            alert('Please select a section');
                            return;
                          }
                          if (newVariable.extractionMethod === 'llmSearch' && !newVariable.llmQuery) {
                            alert('Please enter an LLM query');
                            return;
                          }
                          
                          if (editingVariableIndex !== null) {
                            // Update existing variable
                            const updated = [...(formData.variables || [])];
                            updated[editingVariableIndex] = {...newVariable};
                            setFormData({
                              ...formData,
                              variables: updated
                            });
                          } else {
                            // Add new variable
                            setFormData({
                              ...formData,
                              variables: [...(formData.variables || []), {...newVariable}]
                            });
                          }
                          
                          setNewVariable({ name: '', extractionMethod: '', selectedSection: '', llmQuery: '' });
                          setEditingVariableIndex(null);
                          setShowAddVariableForm(false);
                        }}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        {editingVariableIndex !== null ? 'Update Variable' : 'Add Variable'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddVariableForm(false);
                          setEditingVariableIndex(null);
                          setNewVariable({ name: '', extractionMethod: '', selectedSection: '', llmQuery: '' });
                        }}
                        className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-sm font-medium transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

            {/* Maximized Prompt Modal */}
            {maximizedPromptField && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => {
                setMaximizedPromptField(null);
                setMaximizedPromptValue('');
              }}>
                <div className="bg-white rounded-2xl p-6 max-w-4xl w-full mx-4 shadow-xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-800">
                      {maximizedPromptField === 'common' && 'Default Summarization Prompt'}
                      {maximizedPromptField === 'ehr' && 'Default Prompt for EHR Data'}
                      {maximizedPromptField === 'upload' && 'Default Prompt for PDF Upload'}
                      {maximizedPromptField === 'text' && 'Default Prompt for Pasted Text'}
                    </h3>
                    <button
                      onClick={() => {
                        setMaximizedPromptField(null);
                        setMaximizedPromptValue('');
                      }}
                      className="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="flex-1 overflow-auto">
                    <textarea
                      value={maximizedPromptValue}
                      onChange={(e) => setMaximizedPromptValue(e.target.value)}
                      placeholder={`Enter the prompt for ${maximizedPromptField}...`}
                      rows={20}
                      className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                    />
                    <p className="text-xs text-slate-500 mt-2">
                      Character count: {maximizedPromptValue.length}
                    </p>
                  </div>
                  
                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      onClick={() => {
                        setMaximizedPromptField(null);
                        setMaximizedPromptValue('');
                      }}
                      className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-sm font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveMaximizedPrompt}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      Save
                    </button>
                  </div>
                    </div>
                  </div>
            )}

            {/* Advanced Settings Confirmation Popup */}
            {showAdvancedSettingsPopup && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowAdvancedSettingsPopup(false)}>
                <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                        <Info className="w-5 h-5 text-amber-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-800">Edit Advanced Settings</h3>
                    </div>
                    <button
                      onClick={() => setShowAdvancedSettingsPopup(false)}
                      className="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    <p className="text-sm text-slate-600">
                      Are you sure you want to edit advanced settings? These settings are typically preset and should only be modified by operations.
                    </p>
                    <p className="text-sm text-slate-600 font-medium">
                      Proceeding will allow you to edit all advanced settings fields.
                    </p>
                  </div>
                  
                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      onClick={() => setShowAdvancedSettingsPopup(false)}
                      className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        setAdvancedSettingsUnlocked(true);
                        setShowAdvancedSettingsPopup(false);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Yes, Allow Editing
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Section 5: Model Selection */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/50">
              <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-sm font-bold">
                  {formData.pullFromEHR && formData.selectedResource && formData.resourceType === 'existing' ? '5' : (formData.pullFromEHR ? '4' : '3')}
                </div>
                Model Selection
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Primary Model *
                  </label>
                  <select
                    value={formData.primaryModel}
                    onChange={(e) => setFormData({...formData, primaryModel: e.target.value})}
                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  >
                    <option value="">Select primary model...</option>
                    <option value="gpt-4-turbo">GPT-4 Turbo</option>
                    <option value="gpt-4">GPT-4</option>
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                    <option value="claude-3-opus">Claude 3 Opus</option>
                    <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                    <option value="claude-3-haiku">Claude 3 Haiku</option>
                  </select>
                  <p className="text-sm text-slate-500 mt-1">
                    This model will be used for generating summaries
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Fallback Model *
                  </label>
                  <select
                    value={formData.fallbackModel}
                    onChange={(e) => setFormData({...formData, fallbackModel: e.target.value})}
                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  >
                    <option value="">Select fallback model...</option>
                    <option value="gpt-4-turbo">GPT-4 Turbo</option>
                    <option value="gpt-4">GPT-4</option>
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                    <option value="claude-3-opus">Claude 3 Opus</option>
                    <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                    <option value="claude-3-haiku">Claude 3 Haiku</option>
                  </select>
                  <p className="text-sm text-slate-500 mt-1">
                    This model will be used if the primary model fails or is unavailable
                  </p>
                </div>

                {formData.primaryModel && formData.fallbackModel && formData.primaryModel === formData.fallbackModel && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <div className="flex gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-amber-700">
                        <span className="font-semibold">Warning:</span> Primary and fallback models are the same. Consider selecting a different fallback model for better redundancy.
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Average Summarization Time (seconds) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.avg_summarization_time}
                    onChange={(e) => setFormData({...formData, avg_summarization_time: Number(e.target.value)})}
                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                  <p className="text-sm text-slate-500 mt-1">
                    Expected time for summarization to complete (default: 60 seconds)
                  </p>
                </div>
              </div>
            </div>

            {/* Section 6: Review Configuration Summary */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/50">
              <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-sm font-bold">
                  {formData.pullFromEHR && formData.selectedResource && formData.resourceType === 'existing' ? '6' : (formData.pullFromEHR ? '5' : '4')}
                </div>
                Review Configuration
              </h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Summarizer Name</p>
                    <p className="text-sm text-slate-800">{formData.name || 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Doctor</p>
                    <p className="text-sm text-slate-800">{selectedDoctor?.name} ({selectedDoctor?.ehr})</p>
                  </div>
                  {formData.purpose && (
                    <div className="col-span-2">
                      <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Purpose</p>
                      <p className="text-sm text-slate-800">{formData.purpose}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Input Methods</p>
                    <div className="flex flex-wrap gap-2">
                      {formData.pullFromEHR && <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">EHR Pull</span>}
                      {formData.allowUpload && <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">File Upload</span>}
                      {formData.allowText && <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">Text Input</span>}
                    </div>
                  </div>
                  {formData.pullFromEHR && (
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Resource</p>
                      <p className="text-sm text-slate-800">
                        {formData.resourceType === 'existing' && formData.selectedResource
                          ? (() => {
                              const resource = getResourcesForEhr(selectedDoctor?.ehr).find(r => r.id === formData.selectedResource);
                              return resource ? formatResourceOption(resource) : 'Resource not found';
                            })()
                          : formData.resourceType === 'new'
                          ? 'New Resource Request'
                          : 'Not selected'}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Primary Model</p>
                    <p className="text-sm text-slate-800">{formData.primaryModel || 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Fallback Model</p>
                    <p className="text-sm text-slate-800">{formData.fallbackModel || 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Avg. Time</p>
                    <p className="text-sm text-slate-800">{formData.avg_summarization_time || 60} seconds</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={handleCancelCreate}
                className="px-6 py-3 border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {editingSummarizerId ? 'Update Summarizer' : 'Create Summarizer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // MANAGE DOCUMENTS VIEW
  if (currentView === 'manage-documents') {
    const ehrNames = getAllEhrNames();
    
    // Get document types based on selected EHR filter
    const getFilteredDocumentTypes = () => {
      if (selectedEhrFilter === 'All EHRs') {
        // Show all combinations
        return getAllEhrDocumentTypeCombinations();
      } else {
        // Show only document types for selected EHR
        const docTypes = getDocumentTypesForEhr(selectedEhrFilter);
        return docTypes.map(docType => ({ ehr: selectedEhrFilter, documentType: docType }));
      }
    };

    const filteredCombinations = getFilteredDocumentTypes();

    const handleStartEdit = (ehr, docType) => {
      const key = `${ehr}-${docType}`;
      setEditingDocType(key);
      setEditPrompt(documentTypePrompts[key] || '');
    };

    const handleSavePrompt = (ehr, docType) => {
      const key = `${ehr}-${docType}`;
      setDocumentTypePrompts(prev => ({
        ...prev,
        [key]: editPrompt
      }));
      setEditingDocType(null);
      setEditPrompt('');
      alert(`Default prompt saved for ${ehr} - ${docType}!`);
    };

    const handleCancelEdit = () => {
      setEditingDocType(null);
      setEditPrompt('');
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="mb-8">
            <button
              onClick={() => setCurrentView('doctors')}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-4 transition-colors"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              Back to Doctors
            </button>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/50">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 bg-gradient-to-r from-slate-600 to-slate-700 rounded-xl flex items-center justify-center">
                  <Database className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-800">Manage Document Defaults</h1>
                  <p className="text-slate-600 mt-1">Set default prompts for each (EHR, Document Type) combination. These will auto-populate when creating summarizers.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/50 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-800">Document Type Default Prompts</h2>
                  <p className="text-sm text-slate-600 mt-1">Configure default prompts that will be used when creating summarizers for each (EHR, Document Type) combination.</p>
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-slate-700">Filter by EHR:</label>
                  <select
                    value={selectedEhrFilter}
                    onChange={(e) => setSelectedEhrFilter(e.target.value)}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:border-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="All EHRs">All EHRs</option>
                    {ehrNames.map(ehr => (
                      <option key={ehr} value={ehr}>{ehr}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="divide-y divide-slate-200">
              {filteredCombinations.map(({ ehr, documentType }) => {
                const key = `${ehr}-${documentType}`;
                const isEditing = editingDocType === key;
                const currentPrompt = documentTypePrompts[key] || '';

                return (
                  <div key={key} className="p-6 hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          {selectedEhrFilter === 'All EHRs' ? (
                            <h3 className="text-lg font-semibold text-slate-800">{ehr} - {documentType}</h3>
                          ) : (
                            <h3 className="text-lg font-semibold text-slate-800">{documentType}</h3>
                          )}
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                            Default Prompt
                          </span>
                          {selectedEhrFilter === 'All EHRs' && (
                            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full font-medium">
                              {ehr}
                            </span>
                      )}
                    </div>
                        
                        {isEditing ? (
                          <div className="space-y-3">
                          <textarea
                              value={editPrompt}
                              onChange={(e) => setEditPrompt(e.target.value)}
                              placeholder={`Enter the default prompt for ${ehr} - ${documentType}...`}
                              rows={5}
                              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            />
                            <p className="text-xs text-slate-500">
                              This prompt will auto-populate when creating summarizers for {ehr} {documentType} resources.
                            </p>
                            <div className="flex gap-3">
                              <button
                                onClick={() => handleSavePrompt(ehr, documentType)}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                              >
                                Save Prompt
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-sm font-medium transition-colors"
                              >
                                Cancel
                              </button>
                        </div>
                    </div>
                        ) : (
                          <div className="space-y-3">
                            {currentPrompt ? (
                              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                                <p className="text-sm text-slate-700 whitespace-pre-wrap">{currentPrompt}</p>
                </div>
                            ) : (
                              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                                <p className="text-sm text-amber-700 italic">No default prompt set. Click "Edit" to add one.</p>
              </div>
            )}
              <button
                              onClick={() => handleStartEdit(ehr, documentType)}
                              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                            >
                              <Pencil className="w-4 h-4" />
                              {currentPrompt ? 'Edit Prompt' : 'Set Prompt'}
              </button>
            </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-200">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-slate-600">
                  <p className="font-medium text-slate-800 mb-1">How Default Prompts Work:</p>
                  <ul className="list-disc list-inside space-y-1 text-slate-600">
                    <li>Default prompts are set per (EHR, Document Type) combination (e.g., "ECW - Previous Notes", "AthenaOne - Lab Results")</li>
                    <li>Each EHR can have different default prompts for the same document type</li>
                    <li>When creating a summarizer and selecting a resource, the default prompt for that EHR and document type will auto-populate</li>
                    <li>Ops can still edit the prompt after it's auto-filled if needed</li>
                    <li>Use the filter dropdown to view prompts for a specific EHR or all EHRs</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }


  // Default fallback
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
      <button
        onClick={handleCancelCreate}
        className="mb-4 text-blue-600 hover:text-blue-800"
      >
        ← Back to Doctors
      </button>
      <h1 className="text-2xl font-bold">Create</h1>
      <p>For {selectedDoctor?.name}</p>
    </div>
  );
};

export default SummarizerPrototype;