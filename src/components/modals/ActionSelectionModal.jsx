import React from 'react';
import { X } from 'lucide-react';

const ActionSelectionModal = ({ 
  pendingSelection, 
  onClose, 
  onSelectAction 
}) => {
  if (!pendingSelection) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]" 
      style={{ position: 'fixed', zIndex: 9999 }}
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl" 
        onClick={(e) => e.stopPropagation()}
        style={{ zIndex: 10000 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800">
            Choose Action Type
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-3 mb-6">
          <p className="text-sm text-slate-600 mb-4">
            <span className="font-medium">Summarizer:</span> {pendingSelection.summarizerName || 'Unknown'}
          </p>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              How should this summarizer be used? *
            </label>
            <div className="space-y-3">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectAction('append', pendingSelection);
                }}
                className="w-full p-4 border-2 border-blue-300 bg-blue-50 hover:bg-blue-100 rounded-xl text-left transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">➕</span>
                  <div>
                    <div className="font-semibold text-slate-800">Append to section</div>
                    <div className="text-xs text-slate-600">Add content at the end of the section</div>
                  </div>
                </div>
              </button>
              
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectAction('prepend', pendingSelection);
                }}
                className="w-full p-4 border-2 border-green-300 bg-green-50 hover:bg-green-100 rounded-xl text-left transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⬆️</span>
                  <div>
                    <div className="font-semibold text-slate-800">Prepend to section</div>
                    <div className="text-xs text-slate-600">Add content at the beginning of the section</div>
                  </div>
                </div>
              </button>
              
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectAction('inform', pendingSelection);
                }}
                className="w-full p-4 border-2 border-amber-300 bg-amber-50 hover:bg-amber-100 rounded-xl text-left transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">💡</span>
                  <div>
                    <div className="font-semibold text-slate-800">Inform context</div>
                    <div className="text-xs text-slate-600">Use as background information for the section</div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-sm font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActionSelectionModal;


