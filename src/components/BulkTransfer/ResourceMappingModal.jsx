import React from 'react';
import { getResourcesForEhr, formatResourceOption } from '../../config';

const ResourceMappingModal = ({ 
  resourceMappings, 
  onUpdateMapping, 
  onClose, 
  onExecute 
}) => {
  const handleValidateAndExecute = () => {
    const incomplete = Object.values(resourceMappings).some(m => !m.targetResource);
    if (incomplete) {
      alert('Please complete all resource mappings');
      return;
    }
    onExecute();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[85vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Resource Mapping Required</h2>
            <p className="text-sm text-slate-600 mt-1">
              Map EHR resources for cross-EHR copies
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-3xl w-8 h-8 flex items-center justify-center transition-colors"
          >
            ×
          </button>
        </div>

        <div className="space-y-4 mb-6">
          {Object.entries(resourceMappings).map(([key, mapping]) => (
            <div key={key} className="border-2 border-slate-200 rounded-xl p-5">
              <div className="mb-3">
                <div className="font-semibold text-slate-800">{mapping.summarizerName}</div>
                <div className="text-sm text-slate-600">
                  {mapping.sourceDoctorName} ({mapping.sourceEHR}) → {mapping.targetDoctorName} ({mapping.targetEHR})
                </div>
              </div>
              <div className="bg-slate-50 rounded-lg p-3 mb-3">
                <div className="text-xs text-slate-600 mb-1">Source Resource ({mapping.sourceEHR}):</div>
                <div className="text-sm font-medium text-slate-700">{mapping.sourceResource}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Target Resource ({mapping.targetEHR}) *
                </label>
                <select
                  value={mapping.targetResource || ''}
                  onChange={(e) => onUpdateMapping(key, e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select resource...</option>
                  {getResourcesForEhr(mapping.targetEHR).map(resource => (
                    <option key={resource.id} value={resource.id}>
                      {formatResourceOption(resource)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleValidateAndExecute}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            Continue with Copy
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResourceMappingModal;

