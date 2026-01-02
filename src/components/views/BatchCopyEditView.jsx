import React, { useState } from 'react';
import { ChevronRight, Save, Check, AlertCircle } from 'lucide-react';

const BatchCopyEditView = ({
  selectedDoctor,
  batchSummarizers,
  selectedSummarizerId,
  onSelectSummarizer,
  onUpdateSummarizer,
  onSaveAll,
  onBack
}) => {
  const selectedSummarizer = batchSummarizers.find(s => s.id === selectedSummarizerId);

  const handleFieldChange = (field, value) => {
    onUpdateSummarizer(selectedSummarizerId, { [field]: value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex">
      {/* Left Sidebar - Summarizer List */}
      <div className="w-80 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-200">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-4 transition-colors text-sm"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            Back
          </button>
          <h2 className="text-lg font-bold text-slate-800">Batch Edit</h2>
          <p className="text-sm text-slate-600">
            {batchSummarizers.length} summarizers for {selectedDoctor?.name}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {batchSummarizers.map((summarizer, index) => {
            const isSelected = summarizer.id === selectedSummarizerId;
            const hasChanges = summarizer._isModified;

            return (
              <div
                key={summarizer.id}
                onClick={() => onSelectSummarizer(summarizer.id)}
                className={`p-3 rounded-lg cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-blue-100 border-2 border-blue-500'
                    : 'bg-slate-50 border-2 border-transparent hover:border-blue-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-slate-500">#{index + 1}</span>
                      {hasChanges && (
                        <span className="w-2 h-2 bg-orange-500 rounded-full" title="Modified"></span>
                      )}
                    </div>
                    <div className="font-medium text-sm text-slate-800 truncate">
                      {summarizer.name}
                    </div>
                    {summarizer.selectedResource && (
                      <div className="text-xs text-slate-500 truncate mt-1">
                        {summarizer.selectedResource}
                      </div>
                    )}
                  </div>
                  {isSelected && (
                    <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-4 border-t border-slate-200">
          <button
            onClick={onSaveAll}
            className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl"
          >
            <Save className="w-4 h-4" />
            Save All Summarizers
          </button>
        </div>
      </div>

      {/* Right Side - Edit Form */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-8">
          {!selectedSummarizer ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <AlertCircle className="w-16 h-16 mb-4" />
              <p>Select a summarizer from the left to edit</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <h3 className="text-xl font-bold text-slate-800 mb-4">
                  Edit Summarizer
                </h3>

                <div className="space-y-4">
                  {/* Summarizer Name */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Summarizer Name *
                    </label>
                    <input
                      type="text"
                      value={selectedSummarizer.name}
                      onChange={(e) => handleFieldChange('name', e.target.value)}
                      className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Medication List"
                    />
                  </div>

                  {/* Common Prompt */}
                  {!selectedSummarizer.useSeparatePrompts && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Prompt
                      </label>
                      <textarea
                        value={selectedSummarizer.commonPrompt || ''}
                        onChange={(e) => handleFieldChange('commonPrompt', e.target.value)}
                        className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                        rows={6}
                        placeholder="Enter the prompt for this summarizer..."
                      />
                    </div>
                  )}

                  {/* Separate Prompts */}
                  {selectedSummarizer.useSeparatePrompts && (
                    <div className="space-y-4">
                      {selectedSummarizer.pullFromEHR && (
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            EHR Prompt
                          </label>
                          <textarea
                            value={selectedSummarizer.ehrPrompt || ''}
                            onChange={(e) => handleFieldChange('ehrPrompt', e.target.value)}
                            className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                            rows={4}
                          />
                        </div>
                      )}
                      {selectedSummarizer.allowUpload && (
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Upload Prompt
                          </label>
                          <textarea
                            value={selectedSummarizer.uploadPrompt || ''}
                            onChange={(e) => handleFieldChange('uploadPrompt', e.target.value)}
                            className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                            rows={4}
                          />
                        </div>
                      )}
                      {selectedSummarizer.allowText && (
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Text Prompt
                          </label>
                          <textarea
                            value={selectedSummarizer.textPrompt || ''}
                            onChange={(e) => handleFieldChange('textPrompt', e.target.value)}
                            className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                            rows={4}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Active Toggle */}
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                    <input
                      type="checkbox"
                      id="active-toggle"
                      checked={selectedSummarizer.active !== false}
                      onChange={(e) => handleFieldChange('active', e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="active-toggle" className="text-sm font-medium text-slate-700 cursor-pointer">
                      Active (summarizer will be used in template generation)
                    </label>
                  </div>

                  {/* Info Box */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex gap-3">
                      <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-blue-900">
                        <p className="font-medium mb-1">Quick Edit Mode</p>
                        <p className="text-blue-700">
                          Edit the name and prompts for each summarizer. Advanced settings (EHR resources, filters, etc.)
                          can be configured after saving by clicking on the summarizer from the Configure page.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BatchCopyEditView;
