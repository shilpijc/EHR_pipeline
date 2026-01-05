import React, { useState } from 'react';
import { ChevronRight, Plus, X } from 'lucide-react';
import { templateHierarchy } from '../../config';
import { maskEmail } from '../../utils';
import ActionSelectionModal from '../modals/ActionSelectionModal';
import PromptEditModal from '../modals/PromptEditModal';

const SummarizersVariablesView = ({
  selectedDoctor,
  createdSummarizers,
  setCreatedSummarizers,
  configMode,
  setConfigMode,
  sectionSummarizers,
  setSectionSummarizers,
  customSections,
  ghostSections,
  setGhostSections,
  cellSummarizerDropdown,
  setCellSummarizerDropdown,
  pendingSummarizerSelection,
  setPendingSummarizerSelection,
  promptEditModal,
  setPromptEditModal,
  promptModalAction,
  setPromptModalAction,
  showCreateTypeModal,
  setShowCreateTypeModal,
  onBack,
  onEditSummarizer,
  onSelectCreateType,
  onJumpToSection,
  onAddNewSection
}) => {
  const doctorSummarizers = createdSummarizers.filter(s => s.doctorId === selectedDoctor?.id);

  // State for inline inform prompt
  const [informPromptExpanded, setInformPromptExpanded] = useState(null); // Format: `${summarizer.id}-${sectionKey}`
  const [informPromptText, setInformPromptText] = useState('');

  // State for section hover and context menu
  const [hoveredSection, setHoveredSection] = useState(null);

  // State for delete functionality
  const [hoveredBadge, setHoveredBadge] = useState(null); // Format: `${sum.id}`
  const [deleteConfirmation, setDeleteConfirmation] = useState(null); // { cellKey, summarizerId }
  const [hoveredSummarizerCard, setHoveredSummarizerCard] = useState(null); // Format: `${summarizer.id}`
  const [deleteSummarizerConfirmation, setDeleteSummarizerConfirmation] = useState(null); // summarizer object
  
  // Combined View helpers
  const templates = ['general', 'followup', 'neurology', 'initial'];
  const templateNames = {
    general: 'General Template',
    followup: 'Follow-up',
    neurology: 'Neurology',
    initial: 'Initial Consultation'
  };

  // Abbreviations for combined view
  const templateAbbreviations = {
    general: 'GEN',
    followup: 'FU',
    neurology: 'NEURO',
    initial: 'IC'
  };

  const getAllSections = () => {
    const sections = [];
    // Merge base templateHierarchy with custom sections
    const mergedHierarchy = {...templateHierarchy, ...customSections};
    
    Object.entries(mergedHierarchy).forEach(([parentKey, parent]) => {
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

  // Helper to check if a summarizer already has ANY action in a cell
  const hasExistingAction = (cellKey, summarizerId) => {
    const cellSummarizers = sectionSummarizers[cellKey] || [];
    return cellSummarizers.some(s => s.id.startsWith(`${summarizerId}-`));
  };

  // Helper to get the existing action for a summarizer in a cell
  const getExistingAction = (cellKey, summarizerId) => {
    const cellSummarizers = sectionSummarizers[cellKey] || [];
    const existing = cellSummarizers.find(s => s.id.startsWith(`${summarizerId}-`));
    return existing ? existing.action : null;
  };

  // Helper to get the section name where a summarizer is being used
  const getSectionName = (cellKey) => {
    const [sectionKey] = cellKey.split('-');
    const section = allSections.find(s => s.key === sectionKey);
    return section ? section.name : 'this section';
  };

  // Helper to check if a summarizer is already appended/prepended in any other section
  const hasSummarizerAppendPrependInOtherSection = (summarizerId, currentCellKey) => {
    // Safety check: if sectionSummarizers is not available, return false
    if (!sectionSummarizers || typeof sectionSummarizers !== 'object') {
      return false;
    }
    
    // Iterate through all cells in sectionSummarizers
    for (const [cellKey, cellSummarizers] of Object.entries(sectionSummarizers)) {
      // Skip the current cell
      if (cellKey === currentCellKey) {
        continue;
      }
      
      // Safety check: ensure cellSummarizers is an array
      if (!Array.isArray(cellSummarizers) || cellSummarizers.length === 0) {
        continue;
      }
      
      // Check if any summarizer in this cell matches the summarizerId and has append/prepend action
      const hasAppendPrepend = cellSummarizers.some(s => {
        // Safety check: ensure s is an object with id and action properties
        if (!s || !s.id || !s.action) {
          return false;
        }
        // Check if this summarizer assignment belongs to the given summarizer
        const matchesSummarizer = s.id.startsWith(`${summarizerId}-`);
        // Check if the action is append or prepend (ignore inform)
        const isAppendPrepend = s.action === 'append' || s.action === 'prepend';
        return matchesSummarizer && isAppendPrepend;
      });
      
      if (hasAppendPrepend) {
        console.log(`[Restriction] Summarizer ${summarizerId} already has append/prepend in cell ${cellKey}, blocking in ${currentCellKey}`);
        return true;
      }
    }
    
    return false;
  };

  // Helper to get usage information for a summarizer in another section
  const getSummarizerUsageInOtherSection = (summarizerId, currentCellKey) => {
    // Safety check: if sectionSummarizers is not available, return null
    if (!sectionSummarizers || typeof sectionSummarizers !== 'object') {
      return null;
    }
    
    // Iterate through all cells in sectionSummarizers
    for (const [cellKey, cellSummarizers] of Object.entries(sectionSummarizers)) {
      // Skip the current cell
      if (cellKey === currentCellKey) {
        continue;
      }
      
      // Safety check: ensure cellSummarizers is an array
      if (!Array.isArray(cellSummarizers) || cellSummarizers.length === 0) {
        continue;
      }
      
      // Find the summarizer assignment in this cell
      const assignment = cellSummarizers.find(s => {
        if (!s || !s.id || !s.action) {
          return false;
        }
        return s.id.startsWith(`${summarizerId}-`);
      });
      
      if (assignment) {
        const [sectionKey] = cellKey.split('-');
        const section = allSections.find(s => s.key === sectionKey);
        const sectionName = section ? section.name : 'another section';
        return {
          cellKey,
          action: assignment.action,
          sectionName
        };
      }
    }
    
    return null;
  };

  const renderCellContent = (sectionKey, templateTab) => {
    if (configMode === 'summarizers') {
      const cellKey = `${sectionKey}-${templateTab}`;
      const summarizers = sectionSummarizers[cellKey];
      const isDropdownOpen = cellSummarizerDropdown === cellKey;
      
      if (!summarizers || summarizers.length === 0) {
        return (
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCellSummarizerDropdown(isDropdownOpen ? null : cellKey);
              }}
              className="w-full h-full min-h-[40px] flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors border-2 border-dashed border-gray-300 hover:border-blue-400"
              title="Add summarizer"
            >
              <Plus className="w-5 h-5" />
            </button>
            
            {isDropdownOpen && (
              <div
                className="fixed w-80 bg-white rounded-lg shadow-xl border border-slate-200 py-2"
                style={{
                  zIndex: 9999,
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)'
                }}
                onMouseDown={(e) => {
                  console.log('Dropdown mousedown!', e.target);
                }}
                onClick={(e) => {
                  console.log('Dropdown container clicked!', e.target);
                  e.stopPropagation();
                }}
              >
                {doctorSummarizers.length > 0 ? (
                  doctorSummarizers.map(summarizer => (
                    <div key={summarizer.id} className="px-3 py-2 hover:bg-slate-50">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">📊</span>
                        <span className="font-medium text-slate-700 text-sm">{summarizer.name}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-1.5 ml-7">
                        {(() => {
                          const hasExisting = hasExistingAction(cellKey, summarizer.id);
                          const hasInOtherSection = hasSummarizerAppendPrependInOtherSection(summarizer.id, cellKey);
                          const existingAction = getExistingAction(cellKey, summarizer.id);
                          const sectionName = getSectionName(cellKey);
                          const usageInOtherSection = getSummarizerUsageInOtherSection(summarizer.id, cellKey);
                          
                          // Check if this is the selected action
                          const isSelected = existingAction === 'append';
                          const isDisabled = hasExisting || hasInOtherSection;
                          
                          // Determine button text
                          let buttonText = 'Append';
                          if (isSelected) {
                            buttonText = 'Append (Selected)';
                          } else if (hasInOtherSection && usageInOtherSection) {
                            buttonText = 'Already Used';
                          } else if (hasExisting) {
                            buttonText = 'Already Used';
                          }
                          
                          // Determine tooltip text
                          let tooltipText = 'Append to section';
                          if (hasExisting) {
                            tooltipText = `Already appending to ${sectionName}`;
                          } else if (hasInOtherSection && usageInOtherSection) {
                            const otherActionLabel = usageInOtherSection.action === 'append' ? 'appending' : 'prepending';
                            tooltipText = `Already ${otherActionLabel} in ${usageInOtherSection.sectionName}`;
                          }
                          
                          // Determine button styling
                          let buttonClassName = 'px-2 py-1.5 border rounded text-xs font-medium transition-colors flex items-center justify-center gap-1 ';
                          if (isSelected) {
                            buttonClassName += 'bg-blue-100 border-blue-400 text-blue-800 cursor-default';
                          } else if (isDisabled) {
                            buttonClassName += 'bg-slate-100 border-slate-300 text-slate-400 cursor-not-allowed';
                          } else {
                            buttonClassName += 'bg-blue-50 hover:bg-blue-100 border-blue-300 text-blue-700';
                          }
                          
                          return (
                            <button
                              type="button"
                              disabled={isDisabled}
                              onMouseDown={(e) => {
                                if (isDisabled) {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  return;
                                }
                                // Double-check before adding (in case state changed)
                                if (hasExistingAction(cellKey, summarizer.id) || 
                                    hasSummarizerAppendPrependInOtherSection(summarizer.id, cellKey)) {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  return;
                                }
                                e.preventDefault();
                                e.stopPropagation();
                                console.log('Append clicked for summarizer:', summarizer.name, 'cellKey:', cellKey);
                                const newSummarizer = {
                                  id: `${summarizer.id}-${cellKey}-${Date.now()}`,
                                  type: 'summarizer',
                                  name: summarizer.name,
                                  bgColor: '#dbeafe',
                                  color: '#1e40af',
                                  action: 'append',
                                  instructions: ''
                                };
                                console.log('Creating new summarizer:', newSummarizer);
                                setSectionSummarizers(prev => {
                                  const updated = {
                                    ...prev,
                                    [cellKey]: [...(prev[cellKey] || []), newSummarizer]
                                  };
                                  console.log('Updated sectionSummarizers:', updated);
                                  return updated;
                                });

                                // Remove from ghost sections if this is the first summarizer
                                const [sectionKey] = cellKey.split('-');
                                if (ghostSections && ghostSections[sectionKey]) {
                                  setGhostSections(prev => {
                                    const { [sectionKey]: removed, ...rest } = prev;
                                    return rest;
                                  });
                                }

                                setCellSummarizerDropdown(null);
                              }}
                              className={buttonClassName}
                              title={tooltipText}
                            >
                              <span>➕</span>
                              <span>{buttonText}</span>
                            </button>
                          );
                        })()}
                        {(() => {
                          const hasExisting = hasExistingAction(cellKey, summarizer.id);
                          const hasInOtherSection = hasSummarizerAppendPrependInOtherSection(summarizer.id, cellKey);
                          const existingAction = getExistingAction(cellKey, summarizer.id);
                          const sectionName = getSectionName(cellKey);
                          const usageInOtherSection = getSummarizerUsageInOtherSection(summarizer.id, cellKey);
                          
                          // Check if this is the selected action
                          const isSelected = existingAction === 'prepend';
                          const isDisabled = hasExisting || hasInOtherSection;
                          
                          // Determine button text
                          let buttonText = 'Prepend';
                          if (isSelected) {
                            buttonText = 'Prepend (Selected)';
                          } else if (hasInOtherSection && usageInOtherSection) {
                            buttonText = 'Already Used';
                          } else if (hasExisting) {
                            buttonText = 'Already Used';
                          }
                          
                          // Determine tooltip text
                          let tooltipText = 'Prepend to section';
                          if (hasExisting) {
                            tooltipText = `Already prepending to ${sectionName}`;
                          } else if (hasInOtherSection && usageInOtherSection) {
                            const otherActionLabel = usageInOtherSection.action === 'append' ? 'appending' : 'prepending';
                            tooltipText = `Already ${otherActionLabel} in ${usageInOtherSection.sectionName}`;
                          }
                          
                          // Determine button styling
                          let buttonClassName = 'px-2 py-1.5 border rounded text-xs font-medium transition-colors flex items-center justify-center gap-1 ';
                          if (isSelected) {
                            buttonClassName += 'bg-green-100 border-green-400 text-green-800 cursor-default';
                          } else if (isDisabled) {
                            buttonClassName += 'bg-slate-100 border-slate-300 text-slate-400 cursor-not-allowed';
                          } else {
                            buttonClassName += 'bg-green-50 hover:bg-green-100 border-green-300 text-green-700';
                          }
                          
                          return (
                            <button
                              type="button"
                              disabled={isDisabled}
                              onMouseDown={(e) => {
                                if (isDisabled) {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  return;
                                }
                                // Double-check before adding (in case state changed)
                                if (hasExistingAction(cellKey, summarizer.id) || 
                                    hasSummarizerAppendPrependInOtherSection(summarizer.id, cellKey)) {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  return;
                                }
                                e.preventDefault();
                                e.stopPropagation();
                                const newSummarizer = {
                                  id: `${summarizer.id}-${cellKey}-${Date.now()}`,
                                  type: 'summarizer',
                                  name: summarizer.name,
                                  bgColor: '#dcfce7',
                                  color: '#166534',
                                  action: 'prepend',
                                  instructions: ''
                                };
                                setSectionSummarizers(prev => ({
                                  ...prev,
                                  [cellKey]: [...(prev[cellKey] || []), newSummarizer]
                                }));

                                // Remove from ghost sections if this is the first summarizer
                                const [sectionKey] = cellKey.split('-');
                                if (ghostSections && ghostSections[sectionKey]) {
                                  setGhostSections(prev => {
                                    const { [sectionKey]: removed, ...rest } = prev;
                                    return rest;
                                  });
                                }

                                setCellSummarizerDropdown(null);
                              }}
                              className={buttonClassName}
                              title={tooltipText}
                            >
                              <span>⬆️</span>
                              <span>{buttonText}</span>
                            </button>
                          );
                        })()}
                        {(() => {
                          const hasExisting = hasExistingAction(cellKey, summarizer.id);
                          const existingAction = getExistingAction(cellKey, summarizer.id);
                          const sectionName = getSectionName(cellKey);
                          
                          // Check if this is the selected action
                          const isSelected = existingAction === 'inform';
                          const isDisabled = hasExisting;
                          
                          // Determine button text
                          let buttonText = 'Inform';
                          if (isSelected) {
                            buttonText = 'Inform (Selected)';
                          } else if (hasExisting) {
                            buttonText = 'Already Used';
                          }
                          
                          // Determine tooltip text
                          let tooltipText = 'Inform context';
                          if (hasExisting) {
                            const actionLabel = existingAction === 'append' ? 'appending' : existingAction === 'prepend' ? 'prepending' : 'informing';
                            tooltipText = `Already ${actionLabel} to ${sectionName}`;
                          }
                          
                          // Determine button styling
                          let buttonClassName = 'px-2 py-1.5 border rounded text-xs font-medium transition-colors flex items-center justify-center gap-1 ';
                          if (isSelected) {
                            buttonClassName += 'bg-amber-100 border-amber-400 text-amber-800 cursor-default';
                          } else if (isDisabled) {
                            buttonClassName += 'bg-slate-100 border-slate-300 text-slate-400 cursor-not-allowed';
                          } else {
                            buttonClassName += 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-700 cursor-pointer';
                          }
                          
                          return (
                            <button
                              type="button"
                              disabled={isDisabled}
                              onMouseDown={(e) => {
                                if (isDisabled) {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  return;
                                }
                                e.preventDefault();
                                e.stopPropagation();
                                const expandKey = `${summarizer.id}-${cellKey}`;
                                console.log('Inform clicked! Setting expandKey:', expandKey);
                                setInformPromptExpanded(expandKey);
                                setInformPromptText('');
                                console.log('State should be updated now');
                              }}
                              className={buttonClassName}
                              style={{pointerEvents: 'auto', position: 'relative', zIndex: 10000}}
                              title={tooltipText}
                            >
                              <span>💡</span>
                              <span>{buttonText}</span>
                            </button>
                          );
                        })()}
                      </div>

                      {/* Inline Inform Prompt Textbox */}
                      {(() => {
                        const shouldShow = informPromptExpanded === `${summarizer.id}-${cellKey}`;
                        console.log('Checking if should show inform prompt:', {
                          informPromptExpanded,
                          expectedKey: `${summarizer.id}-${cellKey}`,
                          shouldShow
                        });
                        return shouldShow;
                      })() && (
                        <div className="mt-3 ml-7 p-3 bg-amber-50 border border-amber-200 rounded">
                          <label className="block text-xs font-semibold text-amber-900 mb-2">
                            Inform Instructions (optional)
                          </label>
                          <textarea
                            value={informPromptText}
                            onChange={(e) => setInformPromptText(e.target.value)}
                            placeholder="Enter instructions for this inform action..."
                            className="w-full p-2 text-xs border border-amber-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-none"
                            rows={3}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <div className="flex gap-2 mt-2">
                            <button
                              type="button"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                const newSummarizer = {
                                  id: `${summarizer.id}-${cellKey}-${Date.now()}`,
                                  type: 'summarizer',
                                  name: summarizer.name,
                                  bgColor: '#fef3c7',
                                  color: '#92400e',
                                  action: 'inform',
                                  instructions: informPromptText
                                };
                                setSectionSummarizers(prev => ({
                                  ...prev,
                                  [cellKey]: [...(prev[cellKey] || []), newSummarizer]
                                }));

                                // Remove from ghost sections if this is the first summarizer
                                const [sectionKey] = cellKey.split('-');
                                if (ghostSections && ghostSections[sectionKey]) {
                                  setGhostSections(prev => {
                                    const { [sectionKey]: removed, ...rest } = prev;
                                    return rest;
                                  });
                                }

                                setInformPromptExpanded(null);
                                setInformPromptText('');
                                setCellSummarizerDropdown(null);
                              }}
                              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-medium transition-colors"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setInformPromptExpanded(null);
                                setInformPromptText('');
                              }}
                              className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded text-xs font-medium transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2 text-sm text-slate-500">
                    No summarizers available. Create one first.
                  </div>
                )}
              </div>
            )}
          </div>
        );
      }
      return (
        <div className="space-y-1 relative">
          {summarizers.map(sum => {
            const actionIcon = sum.action === 'append' ? '➕' : sum.action === 'prepend' ? '⬆️' : '💡';
            const isHovered = hoveredBadge === sum.id;
            return (
              <div
                key={sum.id}
                onMouseEnter={() => setHoveredBadge(sum.id)}
                onMouseLeave={() => setHoveredBadge(null)}
                className="text-xs px-2 py-1 rounded hover:shadow-md transition-all cursor-pointer relative flex items-center justify-between group"
                style={{
                  background: sum.bgColor,
                  color: sum.color
                }}
              >
                <span onClick={() => onJumpToSection(templateTab, sectionKey)} className="flex-1">
                  {actionIcon} {sum.name}
                </span>
                {isHovered && (
                  <button
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setDeleteConfirmation({ cellKey, summarizerId: sum.id });
                    }}
                    className="ml-2 p-0.5 hover:bg-red-100 rounded transition-colors"
                    title="Delete this assignment"
                  >
                    <X className="w-3 h-3 text-red-600" />
                  </button>
                )}
              </div>
            );
          })}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCellSummarizerDropdown(isDropdownOpen ? null : cellKey);
            }}
            className="mt-1 w-full flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors border border-dashed border-gray-300 hover:border-blue-400 p-1"
            title="Add another summarizer"
          >
            <Plus className="w-4 h-4" />
          </button>
          
          {isDropdownOpen && (
            <div
              className="fixed w-80 bg-white rounded-lg shadow-xl border border-slate-200 py-2"
              style={{
                zIndex: 9999,
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
              }}
              onMouseDown={(e) => {
                console.log('[SECOND DROPDOWN] Dropdown mousedown!', e.target);
              }}
              onClick={(e) => {
                console.log('[SECOND DROPDOWN] Dropdown container clicked!', e.target);
                e.stopPropagation();
              }}
            >
              {doctorSummarizers.length > 0 ? (
                doctorSummarizers.map(summarizer => (
                  <div key={summarizer.id} className="px-3 py-2 hover:bg-slate-50">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">📊</span>
                      <span className="font-medium text-slate-700 text-sm">{summarizer.name}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5 ml-7">
                      {(() => {
                        const hasExisting = hasExistingAction(cellKey, summarizer.id);
                        const hasInOtherSection = hasSummarizerAppendPrependInOtherSection(summarizer.id, cellKey);
                        const existingAction = getExistingAction(cellKey, summarizer.id);
                        const sectionName = getSectionName(cellKey);
                        const usageInOtherSection = getSummarizerUsageInOtherSection(summarizer.id, cellKey);
                        
                        // Check if this is the selected action
                        const isSelected = existingAction === 'append';
                        const isDisabled = hasExisting || hasInOtherSection;
                        
                        // Determine button text
                        let buttonText = 'Append';
                        if (isSelected) {
                          buttonText = 'Append (Selected)';
                        } else if (hasInOtherSection && usageInOtherSection) {
                          buttonText = 'Already Used';
                        } else if (hasExisting) {
                          buttonText = 'Already Used';
                        }
                        
                        // Determine tooltip text
                        let tooltipText = 'Append to section';
                        if (hasExisting) {
                          tooltipText = `Already appending to ${sectionName}`;
                        } else if (hasInOtherSection && usageInOtherSection) {
                          const otherActionLabel = usageInOtherSection.action === 'append' ? 'appending' : 'prepending';
                          tooltipText = `Already ${otherActionLabel} in ${usageInOtherSection.sectionName}`;
                        }
                        
                        // Determine button styling
                        let buttonClassName = 'px-2 py-1.5 border rounded text-xs font-medium transition-colors flex items-center justify-center gap-1 ';
                        if (isSelected) {
                          buttonClassName += 'bg-blue-100 border-blue-400 text-blue-800 cursor-default';
                        } else if (isDisabled) {
                          buttonClassName += 'bg-slate-100 border-slate-300 text-slate-400 cursor-not-allowed';
                        } else {
                          buttonClassName += 'bg-blue-50 hover:bg-blue-100 border-blue-300 text-blue-700';
                        }
                        
                        return (
                          <button
                            type="button"
                            disabled={isDisabled}
                            onMouseDown={(e) => {
                              if (isDisabled) {
                                e.preventDefault();
                                e.stopPropagation();
                                return;
                              }
                              // Double-check before adding (in case state changed)
                              if (hasExistingAction(cellKey, summarizer.id) || 
                                  hasSummarizerAppendPrependInOtherSection(summarizer.id, cellKey)) {
                                e.preventDefault();
                                e.stopPropagation();
                                return;
                              }
                              e.preventDefault();
                              e.stopPropagation();
                              const newSummarizer = {
                                id: `${summarizer.id}-${cellKey}-${Date.now()}`,
                                type: 'summarizer',
                                name: summarizer.name,
                                bgColor: '#dbeafe',
                                color: '#1e40af',
                                action: 'append',
                                instructions: ''
                              };
                              setSectionSummarizers(prev => ({
                                ...prev,
                                [cellKey]: [...(prev[cellKey] || []), newSummarizer]
                              }));
                              setCellSummarizerDropdown(null);
                            }}
                            className={buttonClassName}
                            title={tooltipText}
                          >
                            <span>➕</span>
                            <span>{buttonText}</span>
                          </button>
                        );
                      })()}
                      {(() => {
                        const hasExisting = hasExistingAction(cellKey, summarizer.id);
                        const hasInOtherSection = hasSummarizerAppendPrependInOtherSection(summarizer.id, cellKey);
                        const existingAction = getExistingAction(cellKey, summarizer.id);
                        const sectionName = getSectionName(cellKey);
                        const usageInOtherSection = getSummarizerUsageInOtherSection(summarizer.id, cellKey);
                        
                        // Check if this is the selected action
                        const isSelected = existingAction === 'prepend';
                        const isDisabled = hasExisting || hasInOtherSection;
                        
                        // Determine button text
                        let buttonText = 'Prepend';
                        if (isSelected) {
                          buttonText = 'Prepend (Selected)';
                        } else if (hasInOtherSection && usageInOtherSection) {
                          buttonText = 'Already Used';
                        } else if (hasExisting) {
                          buttonText = 'Already Used';
                        }
                        
                        // Determine tooltip text
                        let tooltipText = 'Prepend to section';
                        if (hasExisting) {
                          tooltipText = `Already prepending to ${sectionName}`;
                        } else if (hasInOtherSection && usageInOtherSection) {
                          const otherActionLabel = usageInOtherSection.action === 'append' ? 'appending' : 'prepending';
                          tooltipText = `Already ${otherActionLabel} in ${usageInOtherSection.sectionName}`;
                        }
                        
                        // Determine button styling
                        let buttonClassName = 'px-2 py-1.5 border rounded text-xs font-medium transition-colors flex items-center justify-center gap-1 ';
                        if (isSelected) {
                          buttonClassName += 'bg-green-100 border-green-400 text-green-800 cursor-default';
                        } else if (isDisabled) {
                          buttonClassName += 'bg-slate-100 border-slate-300 text-slate-400 cursor-not-allowed';
                        } else {
                          buttonClassName += 'bg-green-50 hover:bg-green-100 border-green-300 text-green-700';
                        }
                        
                        return (
                          <button
                            type="button"
                            disabled={isDisabled}
                            onMouseDown={(e) => {
                              if (isDisabled) {
                                e.preventDefault();
                                e.stopPropagation();
                                return;
                              }
                              // Double-check before adding (in case state changed)
                              if (hasExistingAction(cellKey, summarizer.id) || 
                                  hasSummarizerAppendPrependInOtherSection(summarizer.id, cellKey)) {
                                e.preventDefault();
                                e.stopPropagation();
                                return;
                              }
                              e.preventDefault();
                              e.stopPropagation();
                              const newSummarizer = {
                                id: `${summarizer.id}-${cellKey}-${Date.now()}`,
                                type: 'summarizer',
                                name: summarizer.name,
                                bgColor: '#dcfce7',
                                color: '#166534',
                                action: 'prepend',
                                instructions: ''
                              };
                              setSectionSummarizers(prev => ({
                                ...prev,
                                [cellKey]: [...(prev[cellKey] || []), newSummarizer]
                              }));

                              // Remove from ghost sections if this is the first summarizer
                              const [sectionKey] = cellKey.split('-');
                              if (ghostSections && ghostSections[sectionKey]) {
                                setGhostSections(prev => {
                                  const { [sectionKey]: removed, ...rest } = prev;
                                  return rest;
                                });
                              }

                              setCellSummarizerDropdown(null);
                            }}
                            className={buttonClassName}
                            title={tooltipText}
                          >
                            <span>⬆️</span>
                            <span>{buttonText}</span>
                          </button>
                        );
                      })()}
                      {(() => {
                        const hasExisting = hasExistingAction(cellKey, summarizer.id);
                        const existingAction = getExistingAction(cellKey, summarizer.id);
                        const sectionName = getSectionName(cellKey);
                        
                        // Check if this is the selected action
                        const isSelected = existingAction === 'inform';
                        const isDisabled = hasExisting;
                        
                        // Determine button text
                        let buttonText = 'Inform';
                        if (isSelected) {
                          buttonText = 'Inform (Selected)';
                        } else if (hasExisting) {
                          buttonText = 'Already Used';
                        }
                        
                        // Determine tooltip text
                        let tooltipText = 'Inform context';
                        if (hasExisting) {
                          const actionLabel = existingAction === 'append' ? 'appending' : existingAction === 'prepend' ? 'prepending' : 'informing';
                          tooltipText = `Already ${actionLabel} to ${sectionName}`;
                        }
                        
                        // Determine button styling
                        let buttonClassName = 'px-2 py-1.5 border rounded text-xs font-medium transition-colors flex items-center justify-center gap-1 ';
                        if (isSelected) {
                          buttonClassName += 'bg-amber-100 border-amber-400 text-amber-800 cursor-default';
                        } else if (isDisabled) {
                          buttonClassName += 'bg-slate-100 border-slate-300 text-slate-400 cursor-not-allowed';
                        } else {
                          buttonClassName += 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-700';
                        }
                        
                        return (
                          <button
                            type="button"
                            disabled={isDisabled}
                            onMouseDown={(e) => {
                              if (isDisabled) {
                                e.preventDefault();
                                e.stopPropagation();
                                return;
                              }
                              e.preventDefault();
                              e.stopPropagation();
                              const expandKey = `${summarizer.id}-${cellKey}`;
                              console.log('[SECOND DROPDOWN] Inform clicked! Setting expandKey:', expandKey);
                              setInformPromptExpanded(expandKey);
                              setInformPromptText('');
                              console.log('[SECOND DROPDOWN] State should be updated now');
                            }}
                            className={buttonClassName}
                            style={{pointerEvents: 'auto', position: 'relative', zIndex: 10000}}
                            title={tooltipText}
                          >
                            <span>💡</span>
                            <span>{buttonText}</span>
                          </button>
                        );
                      })()}
                    </div>

                    {/* Inline Inform Prompt Textbox */}
                    {(() => {
                      const shouldShow = informPromptExpanded === `${summarizer.id}-${cellKey}`;
                      console.log('[SECOND DROPDOWN] Checking if should show inform prompt:', {
                        informPromptExpanded,
                        expectedKey: `${summarizer.id}-${cellKey}`,
                        shouldShow
                      });
                      return shouldShow;
                    })() && (
                      <div className="mt-3 ml-7 p-3 bg-amber-50 border border-amber-200 rounded">
                        <label className="block text-xs font-semibold text-amber-900 mb-2">
                          Inform Instructions (optional)
                        </label>
                        <textarea
                          value={informPromptText}
                          onChange={(e) => setInformPromptText(e.target.value)}
                          placeholder="Enter instructions for this inform action..."
                          className="w-full p-2 text-xs border border-amber-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-none"
                          rows={3}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div className="flex gap-2 mt-2">
                          <button
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              const newSummarizer = {
                                id: `${summarizer.id}-${cellKey}-${Date.now()}`,
                                type: 'summarizer',
                                name: summarizer.name,
                                bgColor: '#fef3c7',
                                color: '#92400e',
                                action: 'inform',
                                instructions: informPromptText
                              };
                              setSectionSummarizers(prev => ({
                                ...prev,
                                [cellKey]: [...(prev[cellKey] || []), newSummarizer]
                              }));

                              // Remove from ghost sections if this is the first summarizer
                              const [sectionKey] = cellKey.split('-');
                              if (ghostSections && ghostSections[sectionKey]) {
                                setGhostSections(prev => {
                                  const { [sectionKey]: removed, ...rest } = prev;
                                  return rest;
                                });
                              }

                              setInformPromptExpanded(null);
                              setInformPromptText('');
                              setCellSummarizerDropdown(null);
                            }}
                            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-medium transition-colors"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setInformPromptExpanded(null);
                              setInformPromptText('');
                            }}
                            className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded text-xs font-medium transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 text-sm text-slate-500">
                  No summarizers available. Create one first.
                </div>
              )}
            </div>
          )}
        </div>
      );
    }
  };

  const handleActionSelect = (action, selection) => {
    setPromptModalAction(action);
    setPromptEditModal(selection);
    setPendingSummarizerSelection(null);
  };

  const handleAssignSummarizer = (assignData) => {
    const summarizer = doctorSummarizers.find(s => s.id === assignData.summarizerId);

    if (!summarizer) {
      console.error('Summarizer not found:', assignData.summarizerId);
      return;
    }

    const newSummarizer = {
      id: `${assignData.summarizerId}-${assignData.sectionKey}-${Date.now()}`,
      type: 'summarizer',
      name: summarizer.name,
      bgColor: assignData.action === 'append' ? '#dbeafe' : assignData.action === 'prepend' ? '#dcfce7' : '#fef3c7',
      color: assignData.action === 'append' ? '#1e40af' : assignData.action === 'prepend' ? '#166534' : '#92400e',
      action: assignData.action,
      instructions: assignData.instructions || ''
    };

    setSectionSummarizers(prev => ({
      ...prev,
      [assignData.sectionKey]: [...(prev[assignData.sectionKey] || []), newSummarizer]
    }));

    setPromptEditModal(null);
  };

  const handleDeleteSummarizer = () => {
    if (!deleteConfirmation) return;

    const { cellKey, summarizerId } = deleteConfirmation;

    setSectionSummarizers(prev => {
      const cellSummarizers = prev[cellKey] || [];
      const updatedSummarizers = cellSummarizers.filter(s => s.id !== summarizerId);

      // If no summarizers left, remove the key entirely
      if (updatedSummarizers.length === 0) {
        const { [cellKey]: removed, ...rest } = prev;
        return rest;
      }

      return {
        ...prev,
        [cellKey]: updatedSummarizers
      };
    });

    setDeleteConfirmation(null);
  };

  const handleDeleteEntireSummarizer = () => {
    if (!deleteSummarizerConfirmation) return;

    const summarizerToDelete = deleteSummarizerConfirmation;

    // Remove the summarizer from createdSummarizers
    setCreatedSummarizers(prev => prev.filter(s => s.id !== summarizerToDelete.id));

    // Remove all assignments of this summarizer from all cells
    setSectionSummarizers(prev => {
      const updated = { ...prev };

      // Iterate through all cells and remove assignments that reference this summarizer
      Object.keys(updated).forEach(cellKey => {
        const cellSummarizers = updated[cellKey];
        // Filter out any summarizer assignments that start with the deleted summarizer's id
        const filteredSummarizers = cellSummarizers.filter(s => !s.id.startsWith(`${summarizerToDelete.id}-`));

        if (filteredSummarizers.length === 0) {
          // If no summarizers left in this cell, remove the cell key entirely
          delete updated[cellKey];
        } else {
          updated[cellKey] = filteredSummarizers;
        }
      });

      return updated;
    });

    setDeleteSummarizerConfirmation(null);
  };

  return (
    <>
      <ActionSelectionModal
        pendingSelection={pendingSummarizerSelection}
        onClose={() => setPendingSummarizerSelection(null)}
        onSelectAction={handleActionSelect}
      />

      <div className={`min-h-screen ${
        configMode === 'summarizers' 
          ? 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50' 
          : 'bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-8">
            <button
              onClick={onBack}
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
                    <p className="text-slate-600">{maskEmail(selectedDoctor?.email)} • {selectedDoctor?.ehr} EHR</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Available Summarizers Bar */}
          {configMode === 'summarizers' && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200/50 rounded-2xl p-6 mb-6">
              <div className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                Available Summarizers
              </div>
              <div className="flex gap-3 flex-wrap mb-3">
                {doctorSummarizers.length > 0 ? (
                  doctorSummarizers.map(summarizer => {
                    const isHovered = hoveredSummarizerCard === summarizer.id;
                    return (
                      <div
                        key={summarizer.id}
                        className="relative px-4 py-2 bg-white border-2 border-blue-300 rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer"
                        onMouseEnter={() => setHoveredSummarizerCard(summarizer.id)}
                        onMouseLeave={() => setHoveredSummarizerCard(null)}
                      >
                        <div className="flex items-center gap-2" onClick={() => onEditSummarizer(summarizer.id)}>
                          <span className="font-semibold text-slate-800">{summarizer.name}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            summarizer.active !== false
                              ? 'bg-green-100 text-green-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {summarizer.active !== false ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        {isHovered && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteSummarizerConfirmation(summarizer);
                            }}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors shadow-md"
                            title="Delete this summarizer and all its assignments"
                          >
                            <X className="w-4 h-4 text-white" />
                          </button>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p className="text-slate-500 text-sm">No summarizers created yet</p>
                )}
              </div>
            </div>
          )}

          {/* Combined View Only */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200">
            {/* Mode Toggle: Summarizers vs Variables */}
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
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
                {onAddNewSection && (
                  <button
                    onClick={onAddNewSection}
                    className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    Add New Section
                  </button>
                )}
              </div>
            </div>

            {/* Comprehensive Table */}
            <div className="overflow-x-auto overflow-y-visible" style={{ maxHeight: '70vh' }}>
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
                        title={templateNames[template]}
                      >
                        {templateAbbreviations[template]}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Regular template sections */}
                  {allSections.map((section) => {
                    // Check if this is a ghost section
                    const isGhost = ghostSections && ghostSections[section.key];

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

                    // Apply ghost section styling
                    if (isGhost) {
                      bgColor = 'bg-slate-100/50';
                      textColor = 'text-slate-400';
                    }

                    return (
                      <tr
                        key={section.key}
                        className={`border-b border-slate-200 hover:bg-slate-50/50 transition-colors ${bgColor} ${isGhost ? 'opacity-60' : ''}`}
                        onMouseEnter={() => setHoveredSection(section.key)}
                        onMouseLeave={() => setHoveredSection(null)}
                      >
                        <td className={`${paddingLeft} py-3 ${textColor} ${fontWeight} ${fontSize} border-r-2 border-slate-200 relative`}>
                          <div className="flex items-center gap-2">
                            <span>{section.name}{isGhost && <span className="ml-2 text-xs text-slate-400 italic">(no summarizers yet)</span>}</span>
                          </div>
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

          {/* Prompt Edit Modal */}
          <PromptEditModal
            modalData={promptEditModal}
            actionType={promptModalAction}
            onClose={() => setPromptEditModal(null)}
            onAssign={handleAssignSummarizer}
            getAllSections={getAllSections}
            templateNames={templateNames}
            doctorSummarizers={doctorSummarizers}
          />
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
                  onClick={() => onSelectCreateType('summarizer')}
                  className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 hover:border-blue-500 hover:bg-blue-100 rounded-xl p-6 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <div className="text-4xl mb-3">📊</div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">Add Summarizer</h3>
                  <p className="text-sm text-gray-600">
                    Add a new summarizer to extract and summarize data from EHR
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Assignment Confirmation Modal */}
        {deleteConfirmation && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <X className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Delete Assignment?</h2>
                  <p className="text-sm text-slate-600">This action cannot be undone</p>
                </div>
              </div>
              <p className="text-slate-600 mb-6">
                Are you sure you want to remove this summarizer assignment from this cell?
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setDeleteConfirmation(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteSummarizer}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Entire Summarizer Confirmation Modal */}
        {deleteSummarizerConfirmation && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <X className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Delete Summarizer?</h2>
                  <p className="text-sm text-slate-600">This will remove all assignments</p>
                </div>
              </div>
              <p className="text-slate-600 mb-2">
                Are you sure you want to delete <strong>{deleteSummarizerConfirmation.name}</strong>?
              </p>
              <p className="text-slate-500 text-sm mb-6">
                This will permanently remove the summarizer and all its assignments from all template sections. This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setDeleteSummarizerConfirmation(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteEntireSummarizer}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                >
                  Delete Summarizer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SummarizersVariablesView;

