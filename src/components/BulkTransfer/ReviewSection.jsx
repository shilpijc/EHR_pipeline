import React from 'react';
import { AlertCircle } from 'lucide-react';

const ReviewSection = ({
  selectedSourceCount,
  selectedTargetCount,
  copyType,
  selectedSummarizersCount,
  needsResourceMapping,
  onCancel,
  onExecute,
  isExecuting
}) => {
  const getCopyTypeLabel = () => {
    switch (copyType) {
      case 'summarizers':
        return 'Selected Summarizers';
      case 'full':
        return 'Full Configuration';
      case 'templates':
        return 'Templates Only';
      default:
        return copyType;
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/50 mt-6">
      <h2 className="text-xl font-semibold text-slate-800 mb-4">Review & Execute</h2>
      
      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm font-medium text-slate-600 mb-1">Source Doctors</div>
            <div className="text-lg font-semibold text-slate-800">
              {selectedSourceCount} selected
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-slate-600 mb-1">Target Doctors</div>
            <div className="text-lg font-semibold text-slate-800">
              {selectedTargetCount} selected
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-slate-600 mb-1">Copy Type</div>
            <div className="text-lg font-semibold text-slate-800 capitalize">
              {getCopyTypeLabel()}
            </div>
          </div>
          {copyType === 'summarizers' && (
            <div>
              <div className="text-sm font-medium text-slate-600 mb-1">Selected Summarizers</div>
              <div className="text-lg font-semibold text-slate-800">
                {selectedSummarizersCount} selected
              </div>
            </div>
          )}
        </div>

        {needsResourceMapping && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-700">
                <div className="font-semibold mb-1">Cross-EHR Copy Detected</div>
                <div>Resource mapping will be required for summarizers that pull from EHR.</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-4">
        <button
          onClick={onCancel}
          className="px-6 py-2.5 border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onExecute}
          disabled={isExecuting}
          className={`px-6 py-2.5 rounded-xl font-semibold shadow-lg transition-all ${
            isExecuting
              ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white hover:shadow-xl'
          }`}
        >
          {isExecuting ? 'Copying...' : 'Execute Copy'}
        </button>
      </div>
    </div>
  );
};

export default ReviewSection;

