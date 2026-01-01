// Default form data for creating summarizers
export const DEFAULT_FORM_DATA = {
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
  dateFrom: '', // Legacy - kept for backward compatibility but not used in UI
  dateTo: '', // Legacy - kept for backward compatibility but not used in UI
  singleDate: '',
  // How far back parameters
  howFarBackYears: 0,
  howFarBackMonths: 0,
  howFarBackDays: 0,
  howFarBackToDays: null,
  toRecent: false,
  // Retrieval method: 'latest', 'all', or 'count'
  retrievalMethod: 'latest',
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
};

