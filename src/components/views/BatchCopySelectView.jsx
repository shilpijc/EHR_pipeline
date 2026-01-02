import React, { useState } from 'react';
import { ChevronRight, Check, Users } from 'lucide-react';
import { maskEmail } from '../../utils';

const BatchCopySelectView = ({
  selectedDoctor,
  allDoctors,
  createdSummarizers,
  onBack,
  onSelectSummarizers
}) => {
  const [selectedSource, setSelectedSource] = useState(null);
  const [selectedSummarizers, setSelectedSummarizers] = useState([]);

  // Get other doctors (exclude the selected doctor)
  const otherDoctors = allDoctors.filter(d => d.id !== selectedDoctor?.id);

  // Get summarizers for the selected source doctor
  const sourceSummarizers = selectedSource
    ? createdSummarizers.filter(s => s.doctorId === selectedSource.id)
    : [];

  const toggleSummarizer = (summarizerId) => {
    setSelectedSummarizers(prev =>
      prev.includes(summarizerId)
        ? prev.filter(id => id !== summarizerId)
        : [...prev, summarizerId]
    );
  };

  const handleContinue = () => {
    const summarizersData = createdSummarizers
      .filter(s => selectedSummarizers.includes(s.id))
      .map(s => ({
        ...s,
        // Create a new ID for the copy
        originalId: s.id,
        id: `${s.id}-copy-${Date.now()}-${Math.random()}`,
        doctorId: selectedDoctor.id,
        // Mark as unsaved
        _isNew: true
      }));

    onSelectSummarizers(summarizersData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-4 transition-colors"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            Back to Doctors
          </button>

          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Copy Multiple Summarizers
          </h1>
          <p className="text-slate-600">
            Copy summarizers from another doctor to <span className="font-semibold">{selectedDoctor?.name}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Step 1: Select Source Doctor */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold">
                1
              </div>
              <h2 className="text-xl font-semibold text-slate-800">
                Select Source Doctor
              </h2>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {otherDoctors.map(doctor => {
                const doctorSummarizers = createdSummarizers.filter(s => s.doctorId === doctor.id);
                const isSelected = selectedSource?.id === doctor.id;

                return (
                  <div
                    key={doctor.id}
                    onClick={() => {
                      setSelectedSource(doctor);
                      setSelectedSummarizers([]);
                    }}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-semibold">
                          {doctor.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-medium text-slate-800">{doctor.name}</div>
                          <div className="text-sm text-slate-600">
                            {doctorSummarizers.length} summarizers • {doctor.ehr}
                          </div>
                        </div>
                      </div>
                      {isSelected && (
                        <Check className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 2: Select Summarizers */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold">
                2
              </div>
              <h2 className="text-xl font-semibold text-slate-800">
                Select Summarizers to Copy
              </h2>
            </div>

            {!selectedSource ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                <Users className="w-16 h-16 mb-4" />
                <p className="text-sm">Select a source doctor first</p>
              </div>
            ) : sourceSummarizers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                <p className="text-sm">No summarizers available for this doctor</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {sourceSummarizers.map(summarizer => {
                  const isSelected = selectedSummarizers.includes(summarizer.id);

                  return (
                    <div
                      key={summarizer.id}
                      onClick={() => toggleSummarizer(summarizer.id)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-green-500 bg-green-50'
                          : 'border-slate-200 hover:border-green-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                            onClick={(e) => e.stopPropagation()}
                          />
                          <div>
                            <div className="font-medium text-slate-800">{summarizer.name}</div>
                            <div className="text-sm text-slate-600">
                              {summarizer.pullFromEHR && summarizer.selectedResource && (
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                                  {summarizer.selectedResource}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-between bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="text-sm text-slate-600">
            {selectedSummarizers.length > 0 && (
              <span className="font-semibold text-blue-600">
                {selectedSummarizers.length} summarizer{selectedSummarizers.length !== 1 ? 's' : ''} selected
              </span>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onBack}
              className="px-6 py-2.5 border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleContinue}
              disabled={selectedSummarizers.length === 0}
              className={`px-6 py-2.5 rounded-xl font-semibold shadow-lg transition-all ${
                selectedSummarizers.length === 0
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white hover:shadow-xl'
              }`}
            >
              Continue to Edit ({selectedSummarizers.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchCopySelectView;
