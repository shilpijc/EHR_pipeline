import { useReducer } from 'react';

// Action types
const ACTIONS = {
  SET_SOURCE_DOCTORS: 'SET_SOURCE_DOCTORS',
  SET_TARGET_DOCTORS: 'SET_TARGET_DOCTORS',
  TOGGLE_SOURCE_DOCTOR: 'TOGGLE_SOURCE_DOCTOR',
  TOGGLE_TARGET_DOCTOR: 'TOGGLE_TARGET_DOCTOR',
  SET_SUMMARIZER: 'SET_SUMMARIZER',
  SET_COPY_TYPE: 'SET_COPY_TYPE',
  SET_TARGET_EMAILS: 'SET_TARGET_EMAILS',
  SET_SEARCH_TERM: 'SET_SEARCH_TERM',
  SET_EHR_FILTER: 'SET_EHR_FILTER',
  SET_RESOURCE_MAPPINGS: 'SET_RESOURCE_MAPPINGS',
  UPDATE_RESOURCE_MAPPING: 'UPDATE_RESOURCE_MAPPING',
  SET_SHOW_RESOURCE_MAPPING: 'SET_SHOW_RESOURCE_MAPPING',
  SET_EXECUTION_STATE: 'SET_EXECUTION_STATE',
  SET_EXECUTION_PROGRESS: 'SET_EXECUTION_PROGRESS',
  RESET_FORM: 'RESET_FORM'
};

// Initial state
const initialState = {
  selectedSourceDoctors: [],
  selectedTargetDoctors: [],
  copyType: 'summarizers',
  selectedSummarizer: null,
  targetEmails: '',
  searchTerm: '',
  ehrFilter: 'all',
  showResourceMapping: false,
  resourceMappings: {},
  isExecuting: false,
  executionProgress: null
};

// Reducer function
const bulkTransferReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_SOURCE_DOCTORS:
      return { ...state, selectedSourceDoctors: action.payload };
    
    case ACTIONS.SET_TARGET_DOCTORS:
      return { ...state, selectedTargetDoctors: action.payload };
    
    case ACTIONS.TOGGLE_SOURCE_DOCTOR: {
      const doctorId = action.payload;
      const isSelected = state.selectedSourceDoctors.includes(doctorId);
      return {
        ...state,
        selectedSourceDoctors: isSelected
          ? state.selectedSourceDoctors.filter(id => id !== doctorId)
          : [...state.selectedSourceDoctors, doctorId],
        // Clear selected summarizer when source changes
        selectedSummarizer: isSelected ? null : state.selectedSummarizer
      };
    }
    
    case ACTIONS.TOGGLE_TARGET_DOCTOR: {
      const doctorId = action.payload;
      const isSelected = state.selectedTargetDoctors.includes(doctorId);
      return {
        ...state,
        selectedTargetDoctors: isSelected
          ? state.selectedTargetDoctors.filter(id => id !== doctorId)
          : [...state.selectedTargetDoctors, doctorId]
      };
    }
    
    case ACTIONS.SET_SUMMARIZER:
      return {
        ...state,
        selectedSummarizer: action.payload
      };
    
    case ACTIONS.SET_COPY_TYPE:
      return { ...state, copyType: action.payload };
    
    case ACTIONS.SET_TARGET_EMAILS:
      return { ...state, targetEmails: action.payload };
    
    case ACTIONS.SET_SEARCH_TERM:
      return { ...state, searchTerm: action.payload };
    
    case ACTIONS.SET_EHR_FILTER:
      return { ...state, ehrFilter: action.payload };
    
    case ACTIONS.SET_RESOURCE_MAPPINGS:
      return { ...state, resourceMappings: action.payload };
    
    case ACTIONS.UPDATE_RESOURCE_MAPPING: {
      const { key, targetResource } = action.payload;
      return {
        ...state,
        resourceMappings: {
          ...state.resourceMappings,
          [key]: {
            ...state.resourceMappings[key],
            targetResource
          }
        }
      };
    }
    
    case ACTIONS.SET_SHOW_RESOURCE_MAPPING:
      return { ...state, showResourceMapping: action.payload };
    
    case ACTIONS.SET_EXECUTION_STATE:
      return { ...state, isExecuting: action.payload };
    
    case ACTIONS.SET_EXECUTION_PROGRESS:
      return { ...state, executionProgress: action.payload };
    
    case ACTIONS.RESET_FORM:
      return {
        ...initialState,
        searchTerm: state.searchTerm,
        ehrFilter: state.ehrFilter
      };
    
    default:
      return state;
  }
};

// Custom hook
export const useBulkTransfer = () => {
  const [state, dispatch] = useReducer(bulkTransferReducer, initialState);

  const actions = {
    setSourceDoctors: (doctors) => 
      dispatch({ type: ACTIONS.SET_SOURCE_DOCTORS, payload: doctors }),
    
    setTargetDoctors: (doctors) => 
      dispatch({ type: ACTIONS.SET_TARGET_DOCTORS, payload: doctors }),
    
    toggleSourceDoctor: (doctorId) => 
      dispatch({ type: ACTIONS.TOGGLE_SOURCE_DOCTOR, payload: doctorId }),
    
    toggleTargetDoctor: (doctorId) => 
      dispatch({ type: ACTIONS.TOGGLE_TARGET_DOCTOR, payload: doctorId }),
    
    selectSummarizer: (summarizerId) => 
      dispatch({ type: ACTIONS.SET_SUMMARIZER, payload: summarizerId }),
    
    setCopyType: (type) => 
      dispatch({ type: ACTIONS.SET_COPY_TYPE, payload: type }),
    
    setTargetEmails: (emails) => 
      dispatch({ type: ACTIONS.SET_TARGET_EMAILS, payload: emails }),
    
    setSearchTerm: (term) => 
      dispatch({ type: ACTIONS.SET_SEARCH_TERM, payload: term }),
    
    setEhrFilter: (filter) => 
      dispatch({ type: ACTIONS.SET_EHR_FILTER, payload: filter }),
    
    setResourceMappings: (mappings) => 
      dispatch({ type: ACTIONS.SET_RESOURCE_MAPPINGS, payload: mappings }),
    
    updateResourceMapping: (key, targetResource) => 
      dispatch({ type: ACTIONS.UPDATE_RESOURCE_MAPPING, payload: { key, targetResource } }),
    
    setShowResourceMapping: (show) => 
      dispatch({ type: ACTIONS.SET_SHOW_RESOURCE_MAPPING, payload: show }),
    
    setExecutionState: (isExecuting) => 
      dispatch({ type: ACTIONS.SET_EXECUTION_STATE, payload: isExecuting }),
    
    setExecutionProgress: (progress) => 
      dispatch({ type: ACTIONS.SET_EXECUTION_PROGRESS, payload: progress }),
    
    resetForm: () => 
      dispatch({ type: ACTIONS.RESET_FORM })
  };

  return [state, actions];
};
