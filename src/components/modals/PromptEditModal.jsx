import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const PromptEditModal = ({ 
  modalData, 
  actionType, 
  onClose, 
  onAssign,
  getAllSections,
  templateNames,
  doctorSummarizers
}) => {
  const [instructions, setInstructions] = useState('');
  const [selectedAction, setSelectedAction] = useState(actionType || 'append');

  useEffect(() => {
    setSelectedAction(actionType || 'append');
  }, [actionType]);

  if (!modalData) return null;

  const section = getAllSections().find(s => s.key === modalData.sectionKey);
  const sectionName = section ? section.name : modalData.sectionKey;

  const handleAssign = () => {
    onAssign({
      ...modalData,
      action: selectedAction,
      instructions: instructions
    });
    // Reset local state when closing
    setInstructions('');
    setSelectedAction('append');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800">
            Assign Summarizer to Section
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-4 mb-4">
          <div>
            <p className="text-sm text-slate-600 mb-2">
              <span className="font-medium">Section:</span> {sectionName}
            </p>
            <p className="text-sm text-slate-600 mb-2">
              <span className="font-medium">Template:</span> {templateNames[modalData.template]}
            </p>
            <p className="text-sm text-slate-600 mb-4">
              <span className="font-medium">Summarizer:</span> {modalData.summarizerName}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Action Type *
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="actionType"
                  value="append"
                  checked={selectedAction === 'append'}
                  onChange={() => setSelectedAction('append')}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm text-slate-700">➕ Append to section</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="actionType"
                  value="prepend"
                  checked={selectedAction === 'prepend'}
                  onChange={() => setSelectedAction('prepend')}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm text-slate-700">⬆️ Prepend to section</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="actionType"
                  value="inform"
                  checked={selectedAction === 'inform'}
                  onChange={() => setSelectedAction('inform')}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm text-slate-700">💡 Inform context</span>
              </label>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Custom Instructions (Optional)
            </label>
            <textarea
              rows={4}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Add any specific instructions for how this summarizer should be used in this section..."
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-3">
          <button
            onClick={() => {
              setInstructions('');
              setSelectedAction('append');
              onClose();
            }}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Assign Summarizer
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromptEditModal;

