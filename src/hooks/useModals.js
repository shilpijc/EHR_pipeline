import { useState } from 'react';

/**
 * Custom hook for managing modal states
 */
export const useModals = () => {
  const [showBgModal, setShowBgModal] = useState(false);
  const [showPickerModal, setShowPickerModal] = useState(false);
  const [showCopyDoctorModal, setShowCopyDoctorModal] = useState(false);
  const [showCopySummarizerModal, setShowCopySummarizerModal] = useState(false);
  const [showCreateTypeModal, setShowCreateTypeModal] = useState(false);
  const [showResourceMappingModal, setShowResourceMappingModal] = useState(false);
  const [showAdvancedSettingsPopup, setShowAdvancedSettingsPopup] = useState(false);
  const [showCreateSectionModal, setShowCreateSectionModal] = useState(false);
  const [showActivateConfirm, setShowActivateConfirm] = useState(null);
  const [promptEditModal, setPromptEditModal] = useState(null);

  const closeAllModals = () => {
    setShowBgModal(false);
    setShowPickerModal(false);
    setShowCopyDoctorModal(false);
    setShowCopySummarizerModal(false);
    setShowCreateTypeModal(false);
    setShowResourceMappingModal(false);
    setShowAdvancedSettingsPopup(false);
    setShowCreateSectionModal(false);
    setShowActivateConfirm(null);
    setPromptEditModal(null);
  };

  return {
    // Background prompts modal
    showBgModal,
    setShowBgModal,
    
    // Picker modal
    showPickerModal,
    setShowPickerModal,
    
    // Copy doctor modal
    showCopyDoctorModal,
    setShowCopyDoctorModal,
    
    // Copy summarizer modal
    showCopySummarizerModal,
    setShowCopySummarizerModal,
    
    // Create type modal
    showCreateTypeModal,
    setShowCreateTypeModal,
    
    // Resource mapping modal
    showResourceMappingModal,
    setShowResourceMappingModal,
    
    // Advanced settings popup
    showAdvancedSettingsPopup,
    setShowAdvancedSettingsPopup,
    
    // Create section modal
    showCreateSectionModal,
    setShowCreateSectionModal,
    
    // Activate confirm
    showActivateConfirm,
    setShowActivateConfirm,
    
    // Prompt edit modal
    promptEditModal,
    setPromptEditModal,
    
    // Utility
    closeAllModals
  };
};

