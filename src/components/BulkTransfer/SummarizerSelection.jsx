import React from 'react';
import { CheckCircle } from 'lucide-react';

const SummarizerSelection = ({
  availableSummarizers,
  selectedSummarizers,
  onToggleSummarizer,
  doctors
}) => {
  if (availableSummarizers.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/50 mt-6">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Select Summarizers</h2>
        <p className="text-slate-500 text-sm">
          No summarizers available for selected source doctors
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/50 mt-6">
      <h2 className="text-xl font-semibold text-slate-800 mb-4">Select Summarizers</h2>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {availableSummarizers.map(summarizer => (
          <div
            key={summarizer.id}
            onClick={() => onToggleSummarizer(summarizer.id)}
            className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
              selectedSummarizers.includes(summarizer.id)
                ? 'border-blue-500 bg-blue-50'
                : 'border-slate-200 hover:border-blue-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selectedSummarizers.includes(summarizer.id)}
                  onChange={() => {}}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  onClick={(e) => e.stopPropagation()}
                />
                <div>
                  <div className="font-medium text-slate-800">{summarizer.name}</div>
                  <div className="text-sm text-slate-600">
                    {doctors.find(d => d.id === summarizer.doctorId)?.name}
                  </div>
                </div>
              </div>
              {selectedSummarizers.includes(summarizer.id) && (
                <CheckCircle className="w-5 h-5 text-blue-600" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SummarizerSelection;

