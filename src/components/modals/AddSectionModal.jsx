import React, { useState } from 'react';
import { X, Plus, ArrowUp } from 'lucide-react';

const AddSectionModal = ({
  isOpen,
  onClose,
  onAddSection,
  existingSections,
  templates,
  templateNames
}) => {
  const [step, setStep] = useState(1); // 1: Template, 2: Name/Level, 3: Location
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [sectionName, setSectionName] = useState('');
  const [insertPosition, setInsertPosition] = useState(null); // { type: 'start' | 'child-start' | 'after', sectionKey?: string, parentKey?: string }
  const [sectionLevel, setSectionLevel] = useState('parent'); // 'parent', 'child'
  const [parentSection, setParentSection] = useState(null);
  const parentSections = (existingSections || []).filter(section => section.level === 'parent');
  const selectedParentDetails = parentSections.find(section => section.key === parentSection);
  const childSiblings = (existingSections || []).filter(
    (section) => section.level === 'child' && section.parentKey === parentSection
  );
  const selectedTemplateName = selectedTemplate ? templateNames[selectedTemplate] : null;
  const getChildAfterOptions = () => {
    if (!parentSection) return [];
    const options = [];
    if (selectedParentDetails) {
      options.push({
        key: selectedParentDetails.key,
        name: `${selectedParentDetails.name} (after parent)`
      });
    }
    return [...options, ...childSiblings];
  };
  const afterOptions = sectionLevel === 'parent' ? parentSections : getChildAfterOptions();

  if (!isOpen) return null;

  const resetForm = () => {
    setSelectedTemplate(null);
    setSectionName('');
    setInsertPosition(null);
    setSectionLevel('parent');
    setParentSection(null);
    setStep(1);
  };

  const handleTemplateSelect = (template) => {
    if (selectedTemplate === template) return;
    setSelectedTemplate(template);
    setSectionName('');
    setSectionLevel('parent');
    setParentSection(null);
    setInsertPosition(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = () => {
    if (!sectionName.trim()) return;
    if (!selectedTemplate) return;
    if (sectionLevel === 'child' && !parentSection) return;

    onAddSection({
      name: sectionName.trim(),
      templates: [selectedTemplate],
      position: insertPosition,
      level: sectionLevel,
      parent: parentSection,
      isGhost: true // Mark as ghost section initially
    });

    handleClose();
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleNext = () => {
    if (step === 1 && !selectedTemplate) return;
    if (step === 2 && (!sectionName.trim() || (sectionLevel === 'child' && !parentSection))) return;
    if (step < 3) setStep(step + 1);
  };

  const handleLevelChange = (value) => {
    setSectionLevel(value);
    if (value !== 'child') {
      setParentSection(null);
    }
    setInsertPosition(null);
  };

  const handleAfterSelection = (sectionKey) => {
    if (!sectionKey) {
      setInsertPosition(null);
      return;
    }
    setInsertPosition({
      type: 'after',
      sectionKey,
      parentKey: sectionLevel === 'child' ? parentSection : null
    });
  };

  const setParentStartPosition = () => {
    setInsertPosition({ type: 'start' });
  };

  const setChildStartPosition = () => {
    if (!parentSection) return;
    setInsertPosition({ type: 'child-start', parentKey: parentSection });
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

        {/* Step 2: Section Details */}
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
                autoFocus={!sectionName}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Section Level
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                  <input
                    type="radio"
                    name="level"
                    value="parent"
                    checked={sectionLevel === 'parent'}
                    onChange={() => handleLevelChange('parent')}
                    className="w-4 h-4"
                  />
                  <div>
                    <div className="font-medium text-slate-800">Parent Section</div>
                    <div className="text-xs text-slate-500">Top-level section (e.g., Chief Complaint)</div>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                  <input
                    type="radio"
                    name="level"
                    value="child"
                    checked={sectionLevel === 'child'}
                    onChange={() => handleLevelChange('child')}
                    className="w-4 h-4"
                  />
                  <div>
                    <div className="font-medium text-slate-800">Child Section</div>
                    <div className="text-xs text-slate-500">Subsection under a parent (e.g., Symptom Onset)</div>
                  </div>
                </label>
              </div>
            </div>
            {sectionLevel === 'child' && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Parent Section *
                </label>
                <select
                  value={parentSection || ''}
                  onChange={(e) => {
                    setParentSection(e.target.value || null);
                    setInsertPosition(null);
                  }}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="" disabled>
                    Select parent section
                  </option>
                  {parentSections.map(section => (
                    <option key={section.key} value={section.key}>
                      {section.name}
                    </option>
                  ))}
                </select>
                {!parentSections.length && (
                  <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg mt-3">
                    No parent sections are currently available.
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Location Selection */}
        {step === 3 && (
          <div className="space-y-4">
            <p className="text-slate-600 mb-4">
              {sectionLevel === 'parent'
                ? `Where should "${sectionName}" appear in ${selectedTemplateName || 'the template'}?`
                : selectedParentDetails
                  ? `Where should "${sectionName}" appear under "${selectedParentDetails.name}"?`
                  : `Where should "${sectionName}" appear?`
              }
            </p>
            <div className="space-y-4">
              <button
                type="button"
                onClick={sectionLevel === 'parent' ? setParentStartPosition : setChildStartPosition}
                className={`w-full p-3 text-left border-2 rounded-lg transition-all ${
                  (sectionLevel === 'parent' && insertPosition?.type === 'start') ||
                  (sectionLevel === 'child' && insertPosition?.type === 'child-start')
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 hover:border-blue-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <ArrowUp className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">
                    {sectionLevel === 'parent'
                      ? 'Add at the beginning'
                      : `Add at the beginning of ${selectedParentDetails?.name || 'the selected parent'}`
                    }
                  </span>
                </div>
              </button>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Add after an existing {sectionLevel === 'parent' ? 'parent section' : 'child of this parent'}
                </label>
                <select
                  value={insertPosition?.type === 'after' ? insertPosition.sectionKey : ''}
                  onChange={(e) => handleAfterSelection(e.target.value)}
                  disabled={afterOptions.length === 0}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="" disabled>
                    Select section to add after
                  </option>
                  {afterOptions.map(section => (
                    <option key={section.key} value={section.key}>
                      {section.name}
                    </option>
                  ))}
                </select>
                {sectionLevel === 'child' && afterOptions.length === 0 && (
                  <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                    Select a parent to see where this child can be inserted after.
                  </p>
                )}
              </div>
            </div>
            {!insertPosition && (
              <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                Please select a position for the new section
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
                (step === 2 && (!sectionName.trim() || (sectionLevel === 'child' && !parentSection)))
              }
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!insertPosition}
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
