import React from 'react';
import { ChevronRight, Plus, X } from 'lucide-react';
import { templateHierarchy } from '../../config';
import { maskEmail } from '../../utils';
import ActionSelectionModal from '../modals/ActionSelectionModal';
import PromptEditModal from '../modals/PromptEditModal';

const SummarizersVariablesView = ({
  selectedDoctor,
  createdSummarizers,
  configMode,
  setConfigMode,
  sectionSummarizers,
  setSectionSummarizers,
  customSections,
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
  onJumpToSection
}) => {
  const doctorSummarizers = createdSummarizers.filter(s => s.doctorId === selectedDoctor?.id);
  
  // Combined View helpers
  const templates = ['general', 'followup', 'neurology', 'initial', 'patient-recap'];
  const templateNames = {
    general: 'General Template',
    followup: 'Follow-up',
    neurology: 'Neurology',
    initial: 'Initial Consultation',
    'patient-recap': 'Patient Recap'
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

  const renderCellContent = (sectionKey, templateTab) => {
    // Patient Recap template - special handling: only summarizer selection, no sections
    if (templateTab === 'patient-recap' || sectionKey === 'patient-recap') {
      const recapSummarizers = sectionSummarizers['patient-recap'] || [];
      const cellKey = `patient-recap-${templateTab}`;
      const isDropdownOpen = cellSummarizerDropdown === cellKey;
      
      if (configMode === 'summarizers') {
        if (recapSummarizers.length === 0) {
          return (
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCellSummarizerDropdown(isDropdownOpen ? null : cellKey);
                }}
                className="w-full h-full min-h-[40px] flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors border-2 border-dashed border-gray-300 hover:border-blue-400"
                title="Add summarizer to Patient Recap"
              >
                <Plus className="w-5 h-5" />
              </button>
              
              {isDropdownOpen && (
                <div 
                  className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-xl border border-slate-200 py-2 z-50"
                  onClick={(e) => e.stopPropagation()}
                >
                  {doctorSummarizers.length > 0 ? (
                    doctorSummarizers.map(summarizer => (
                      <button
                        key={summarizer.id}
                        onClick={() => {
                          const newSummarizer = {
                            id: `${summarizer.id}-patient-recap-${Date.now()}`,
                            type: 'summarizer',
                            name: summarizer.name,
                            bgColor: '#dbeafe',
                            color: '#1e40af',
                            action: 'append'
                          };
                          setSectionSummarizers(prev => ({
                            ...prev,
                            'patient-recap': [...(prev['patient-recap'] || []), newSummarizer]
                          }));
                          setCellSummarizerDropdown(null);
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 transition-colors flex items-center gap-2"
                      >
                        <span className="text-lg">📊</span>
                        <span className="font-medium text-slate-700">{summarizer.name}</span>
                      </button>
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
            {recapSummarizers.map(sum => (
              <div
                key={sum.id}
                className="text-xs px-2 py-1 rounded hover:shadow-md transition-all cursor-pointer"
                style={{
                  background: sum.bgColor || '#dbeafe',
                  color: sum.color || '#1e40af'
                }}
              >
                📊 {sum.name}
              </div>
            ))}
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
                className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-xl border border-slate-200 py-2 z-50"
                onClick={(e) => e.stopPropagation()}
              >
                {doctorSummarizers.length > 0 ? (
                  doctorSummarizers.map(summarizer => (
                    <button
                      key={summarizer.id}
                      onClick={() => {
                        const newSummarizer = {
                          id: `${summarizer.id}-patient-recap-${Date.now()}`,
                          type: 'summarizer',
                          name: summarizer.name,
                          bgColor: '#dbeafe',
                          color: '#1e40af',
                          action: 'append'
                        };
                        setSectionSummarizers(prev => ({
                          ...prev,
                          'patient-recap': [...(prev['patient-recap'] || []), newSummarizer]
                        }));
                        setCellSummarizerDropdown(null);
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 transition-colors flex items-center gap-2"
                    >
                      <span className="text-lg">📊</span>
                      <span className="font-medium text-slate-700">{summarizer.name}</span>
                    </button>
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
      return null;
    }
    
    if (configMode === 'summarizers') {
      const summarizers = sectionSummarizers[sectionKey];
      const cellKey = `${sectionKey}-${templateTab}`;
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
                className="absolute top-full left-0 mt-1 w-80 bg-white rounded-lg shadow-xl border border-slate-200 py-2 z-50"
                onClick={(e) => e.stopPropagation()}
              >
                {doctorSummarizers.length > 0 ? (
                  doctorSummarizers.map(summarizer => (
                    <div key={summarizer.id} className="px-3 py-2 hover:bg-slate-50">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">📊</span>
                        <span className="font-medium text-slate-700 text-sm">{summarizer.name}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-1.5 ml-7">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const newSummarizer = {
                              id: `${summarizer.id}-${sectionKey}-${Date.now()}`,
                              type: 'summarizer',
                              name: summarizer.name,
                              bgColor: '#dbeafe',
                              color: '#1e40af',
                              action: 'append',
                              instructions: ''
                            };
                            setSectionSummarizers(prev => ({
                              ...prev,
                              [sectionKey]: [...(prev[sectionKey] || []), newSummarizer]
                            }));
                            setCellSummarizerDropdown(null);
                          }}
                          className="px-2 py-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-300 rounded text-xs font-medium text-blue-700 transition-colors flex items-center justify-center gap-1"
                        >
                          <span>➕</span>
                          <span>Append</span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const newSummarizer = {
                              id: `${summarizer.id}-${sectionKey}-${Date.now()}`,
                              type: 'summarizer',
                              name: summarizer.name,
                              bgColor: '#dcfce7',
                              color: '#166534',
                              action: 'prepend',
                              instructions: ''
                            };
                            setSectionSummarizers(prev => ({
                              ...prev,
                              [sectionKey]: [...(prev[sectionKey] || []), newSummarizer]
                            }));
                            setCellSummarizerDropdown(null);
                          }}
                          className="px-2 py-1.5 bg-green-50 hover:bg-green-100 border border-green-300 rounded text-xs font-medium text-green-700 transition-colors flex items-center justify-center gap-1"
                        >
                          <span>⬆️</span>
                          <span>Prepend</span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const newSummarizer = {
                              id: `${summarizer.id}-${sectionKey}-${Date.now()}`,
                              type: 'summarizer',
                              name: summarizer.name,
                              bgColor: '#fef3c7',
                              color: '#92400e',
                              action: 'inform',
                              instructions: ''
                            };
                            setSectionSummarizers(prev => ({
                              ...prev,
                              [sectionKey]: [...(prev[sectionKey] || []), newSummarizer]
                            }));
                            setCellSummarizerDropdown(null);
                          }}
                          className="px-2 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded text-xs font-medium text-amber-700 transition-colors flex items-center justify-center gap-1"
                        >
                          <span>💡</span>
                          <span>Inform</span>
                        </button>
                      </div>
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
            return (
              <div
                key={sum.id}
                onClick={() => onJumpToSection(templateTab, sectionKey)}
                className="text-xs px-2 py-1 rounded hover:shadow-md transition-all cursor-pointer"
                style={{
                  background: sum.bgColor,
                  color: sum.color
                }}
              >
                {actionIcon} {sum.name}
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
              className="absolute top-full left-0 mt-1 w-80 bg-white rounded-lg shadow-xl border border-slate-200 py-2 z-50"
              onClick={(e) => e.stopPropagation()}
            >
              {doctorSummarizers.length > 0 ? (
                doctorSummarizers.map(summarizer => (
                  <div key={summarizer.id} className="px-3 py-2 hover:bg-slate-50">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">📊</span>
                      <span className="font-medium text-slate-700 text-sm">{summarizer.name}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5 ml-7">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const newSummarizer = {
                            id: `${summarizer.id}-${sectionKey}-${Date.now()}`,
                            type: 'summarizer',
                            name: summarizer.name,
                            bgColor: '#dbeafe',
                            color: '#1e40af',
                            action: 'append',
                            instructions: ''
                          };
                          setSectionSummarizers(prev => ({
                            ...prev,
                            [sectionKey]: [...(prev[sectionKey] || []), newSummarizer]
                          }));
                          setCellSummarizerDropdown(null);
                        }}
                        className="px-2 py-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-300 rounded text-xs font-medium text-blue-700 transition-colors flex items-center justify-center gap-1"
                      >
                        <span>➕</span>
                        <span>Append</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const newSummarizer = {
                            id: `${summarizer.id}-${sectionKey}-${Date.now()}`,
                            type: 'summarizer',
                            name: summarizer.name,
                            bgColor: '#dcfce7',
                            color: '#166534',
                            action: 'prepend',
                            instructions: ''
                          };
                          setSectionSummarizers(prev => ({
                            ...prev,
                            [sectionKey]: [...(prev[sectionKey] || []), newSummarizer]
                          }));
                          setCellSummarizerDropdown(null);
                        }}
                        className="px-2 py-1.5 bg-green-50 hover:bg-green-100 border border-green-300 rounded text-xs font-medium text-green-700 transition-colors flex items-center justify-center gap-1"
                      >
                        <span>⬆️</span>
                        <span>Prepend</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const newSummarizer = {
                            id: `${summarizer.id}-${sectionKey}-${Date.now()}`,
                            type: 'summarizer',
                            name: summarizer.name,
                            bgColor: '#fef3c7',
                            color: '#92400e',
                            action: 'inform',
                            instructions: ''
                          };
                          setSectionSummarizers(prev => ({
                            ...prev,
                            [sectionKey]: [...(prev[sectionKey] || []), newSummarizer]
                          }));
                          setCellSummarizerDropdown(null);
                        }}
                        className="px-2 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded text-xs font-medium text-amber-700 transition-colors flex items-center justify-center gap-1"
                      >
                        <span>💡</span>
                        <span>Inform</span>
                      </button>
                    </div>
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
                  doctorSummarizers.map(summarizer => (
                    <div
                      key={summarizer.id}
                      className="px-4 py-2 bg-white border-2 border-blue-300 rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer"
                      onClick={() => onEditSummarizer(summarizer.id)}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-800">{summarizer.name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          summarizer.active !== false
                            ? 'bg-green-100 text-green-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {summarizer.active !== false ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  ))
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
                  {/* Patient Recap template - special row */}
                  {templates.includes('patient-recap') && (
                    <tr className="border-b border-slate-200 hover:bg-slate-50/50 transition-colors bg-gradient-to-r from-purple-50 to-pink-50">
                      <td className="pl-6 py-3 text-slate-900 font-bold text-base border-r-2 border-slate-200">
                        Patient Recap
                      </td>
                      {templates.map(template => (
                        <td
                          key={`patient-recap-${template}`}
                          className="px-4 py-3 border-r border-slate-200"
                        >
                          {template === 'patient-recap' 
                            ? renderCellContent('patient-recap', template) 
                            : <span className="text-gray-400">—</span>}
                        </td>
                      ))}
                    </tr>
                  )}
                  
                  {/* Regular template sections */}
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
                            {template === 'patient-recap' 
                              ? <span className="text-gray-400">—</span> 
                              : renderCellContent(section.key, template)}
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
      </div>
    </>
  );
};

export default SummarizersVariablesView;

