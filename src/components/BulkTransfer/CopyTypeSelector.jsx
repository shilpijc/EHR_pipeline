import React from 'react';

const copyTypes = [
  {
    id: 'summarizers',
    title: 'Copy Summarizers',
    description: 'Select specific summarizers to copy'
  },
  {
    id: 'full',
    title: 'Copy Full Configuration',
    description: 'All summarizers + templates'
  },
  {
    id: 'templates',
    title: 'Copy Templates Only',
    description: 'Template configurations only'
  }
];

const CopyTypeSelector = ({ selectedType, onChange }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/50 mt-6">
      <h2 className="text-xl font-semibold text-slate-800 mb-4">Copy Type</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {copyTypes.map(type => (
          <button
            key={type.id}
            onClick={() => onChange(type.id)}
            className={`p-4 rounded-xl border-2 transition-all ${
              selectedType === type.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-slate-200 hover:border-blue-300'
            }`}
          >
            <div className="font-semibold text-slate-800 mb-1">{type.title}</div>
            <div className="text-sm text-slate-600">{type.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CopyTypeSelector;

