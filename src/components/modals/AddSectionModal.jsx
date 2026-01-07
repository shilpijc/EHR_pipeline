import React, { useState } from 'react';
import { X, Plus, ArrowDown, ArrowUp } from 'lucide-react';

const AddSectionModal = ({
  isOpen,
  onClose,
  onAddSection,
  existingSections,
  templates,
  templateNames
}) => {
  const [step, setStep] = useState(1); // 1: Template, 2: Name, 3: Location
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [sectionName, setSectionName] = useState('');
  const [insertPosition, setInsertPosition] = useState(null); // { type: 'before' | 'after' | 'first-child', sectionKey: string }
  const [positionType, setPositionType] = useState('after'); // 'before', 'after', 'first-child'
  const [selectedSection, setSelectedSection] = useState(null);
  // Get all sections for the selected template
  // Base sections (from templateHierarchy) are available in all templates
  // Custom sections have a templates array property
  const templateSections = (existingSections || []).filter(
    section => !section.templates || section.templates.includes(selectedTemplate)
  );

  const selectedTemplateName = selectedTemplate ? templateNames[selectedTemplate] : null;

  // Get sections that can have children (for first-child option)
  const sectionsWithChildrenSupport = templateSections;

  if (!isOpen) return null;

  const resetForm = () => {
    setSelectedTemplate(null);
    setSectionName('');
    setInsertPosition(null);
    setPositionType('after');
    setSelectedSection(null);
    setStep(1);
  };

  const handleTemplateSelect = (template) => {
    if (selectedTemplate === template) return;
    setSelectedTemplate(template);
    setSectionName('');
    setInsertPosition(null);
    setPositionType('after');
    setSelectedSection(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = () => {
    if (!sectionName.trim()) return;
    if (!selectedTemplate) return;
    if (!insertPosition) return;

    onAddSection({
      name: sectionName.trim(),
      templates: [selectedTemplate],
      position: insertPosition,
      isGhost: true // Mark as ghost section initially
    });

    handleClose();
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleNext = () => {
    if (step === 1 && !selectedTemplate) return;
    if (step === 2 && !sectionName.trim()) return;
    if (step < 3) setStep(step + 1);
  };

  const handlePositionTypeChange = (type) => {
    setPositionType(type);
    setSelectedSection(null);
    setInsertPosition(null);
  };

  const handleSectionSelect = (sectionKey) => {
    if (!sectionKey) {
      setSelectedSection(null);
      setInsertPosition(null);
      return;
    }
    setSelectedSection(sectionKey);
    setInsertPosition({
      type: positionType,
      sectionKey
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              Add New Section
            </h2>
            <p className="text-sm text-slate-500 mt-1">Step {step} of 3</p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 text-3xl w-8 h-8 flex items-center justify-center transition-colors"
          >
            ×
          </button>
        </div>

        {/* Step 1: Template Selection */}
        {step === 1 && (
          <div className="space-y-4">
            <p className="text-slate-600 mb-2">
              Choose the template where the new section should live
            </p>
            <div className="grid grid-cols-2 gap-3">
              {templates.map(template => (
                <button
                  key={template}
                  type="button"
                  onClick={() => handleTemplateSelect(template)}
                  className={`text-left p-4 border-2 rounded-lg transition-all focus:outline-none ${
                    selectedTemplate === template
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-blue-300'
                  }`}
                >
                  <div className="font-medium text-slate-800">{templateNames[template]}</div>
                  <div className="text-xs text-slate-500">Template key: {template}</div>
                </button>
              ))}
            </div>
            {!selectedTemplate && (
              <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                Please select a template before continuing
              </p>
            )}
          </div>
        )}

        {/* Step 2: Section Name */}
        {step === 2 && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Adding a section to{' '}
              <strong>{selectedTemplate ? templateNames[selectedTemplate] : 'the selected template'}</strong>
            </p>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Section Name *
              </label>
              <input
                type="text"
                value={sectionName}
                onChange={(e) => setSectionName(e.target.value)}
                placeholder="e.g., Review of Systems, Medication List"
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                autoFocus
              />
              <p className="text-xs text-slate-500 mt-2">
                Enter a descriptive name for your new section
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Location Selection */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <p className="text-slate-700 font-medium mb-2">
                Where should "{sectionName}" be placed?
              </p>
              <p className="text-sm text-slate-500">
                Choose a position relative to an existing section
              </p>
            </div>

            {/* Position Type Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Position Type
              </label>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handlePositionTypeChange('before')}
                  className={`p-3 border-2 rounded-lg transition-all text-center ${
                    positionType === 'before'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-slate-200 hover:border-blue-300 text-slate-700'
                  }`}
                >
                  <ArrowUp className="w-4 h-4 mx-auto mb-1" />
                  <div className="text-xs font-medium">Before</div>
                </button>

                <button
                  type="button"
                  onClick={() => handlePositionTypeChange('after')}
                  className={`p-3 border-2 rounded-lg transition-all text-center ${
                    positionType === 'after'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-slate-200 hover:border-blue-300 text-slate-700'
                  }`}
                >
                  <ArrowDown className="w-4 h-4 mx-auto mb-1" />
                  <div className="text-xs font-medium">After</div>
                </button>

                <button
                  type="button"
                  onClick={() => handlePositionTypeChange('first-child')}
                  className={`p-3 border-2 rounded-lg transition-all text-center ${
                    positionType === 'first-child'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-slate-200 hover:border-blue-300 text-slate-700'
                  }`}
                >
                  <Plus className="w-4 h-4 mx-auto mb-1" />
                  <div className="text-xs font-medium">First Child</div>
                </button>
              </div>
            </div>

            {/* Section Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">
                {positionType === 'before' && 'Select section to insert before'}
                {positionType === 'after' && 'Select section to insert after'}
                {positionType === 'first-child' && 'Select parent section'}
              </label>
              <select
                value={selectedSection || ''}
                onChange={(e) => handleSectionSelect(e.target.value)}
                disabled={templateSections.length === 0}
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="" disabled>
                  {positionType === 'before' && 'Choose a section...'}
                  {positionType === 'after' && 'Choose a section...'}
                  {positionType === 'first-child' && 'Choose a parent section...'}
                </option>
                {templateSections.map(section => (
                  <option key={section.key} value={section.key}>
                    {section.name}
                    {section.level === 'child' && section.parentKey ? ' (child)' : ''}
                  </option>
                ))}
              </select>
              {templateSections.length === 0 && (
                <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                  No existing sections found in this template. Please add at least one section first.
                </p>
              )}
            </div>

            {/* Visual Preview */}
            {insertPosition && selectedSection && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm font-medium text-blue-900 mb-1">Preview</p>
                <p className="text-xs text-blue-700">
                  "{sectionName}" will be inserted{' '}
                  {positionType === 'before' && 'before'}
                  {positionType === 'after' && 'after'}
                  {positionType === 'first-child' && 'as the first child of'}{' '}
                  "{templateSections.find(s => s.key === selectedSection)?.name}"
                </p>
              </div>
            )}

            {!insertPosition && (
              <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                Please select a section to determine the position
              </p>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-3 justify-end mt-6 pt-6 border-t border-slate-200">
          {step > 1 && (
            <button
              onClick={handleBack}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
            >
              Back
            </button>
          )}
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          {step < 3 ? (
            <button
              onClick={handleNext}
              disabled={
                (step === 1 && !selectedTemplate) ||
                (step === 2 && !sectionName.trim())
              }
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!insertPosition || !selectedSection}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Section
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddSectionModal;
