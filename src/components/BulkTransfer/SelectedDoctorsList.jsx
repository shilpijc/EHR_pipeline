import React from 'react';
import { X } from 'lucide-react';

const SelectedDoctorsList = ({ doctors, onRemove, variant = 'blue' }) => {
  const colors = {
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-700',
      itemBorder: 'border-blue-300'
    },
    green: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-700',
      itemBorder: 'border-green-300'
    }
  };

  const colorScheme = colors[variant];

  if (doctors.length === 0) return null;

  return (
    <div className={`mb-4 p-3 ${colorScheme.bg} border ${colorScheme.border} rounded-xl`}>
      <div className={`text-sm font-medium ${colorScheme.text} mb-2`}>
        Selected ({doctors.length})
      </div>
      <div className="flex flex-wrap gap-2">
        {doctors.map(doctor => (
          <div
            key={doctor.id}
            className={`px-3 py-1 bg-white border ${colorScheme.itemBorder} rounded-lg text-sm flex items-center gap-2`}
          >
            <span className="font-medium text-slate-800">{doctor.name}</span>
            <span className="text-xs text-slate-500">({doctor.ehr})</span>
            <button
              onClick={() => onRemove(doctor.id)}
              className="text-red-500 hover:text-red-700"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectedDoctorsList;

