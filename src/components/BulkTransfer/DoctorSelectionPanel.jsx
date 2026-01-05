import React from 'react';
import { Users, Search, Filter, CheckCircle } from 'lucide-react';
import SelectedDoctorsList from './SelectedDoctorsList';

const DoctorSelectionPanel = ({
  title,
  icon: Icon = Users,
  iconColor,
  searchTerm,
  onSearchChange,
  ehrFilter,
  onEhrFilterChange,
  uniqueEHRs,
  selectedDoctors,
  availableDoctors,
  onToggleDoctor,
  maskEmail,
  variant = 'blue',
  additionalContent
}) => {
  const borderColors = {
    blue: 'border-blue-500 bg-blue-50',
    green: 'border-green-500 bg-green-50'
  };

  const checkColors = {
    blue: 'text-blue-600',
    green: 'text-green-600'
  };

  const hoverColors = {
    blue: 'hover:border-blue-300',
    green: 'hover:border-green-300'
  };

  const checkboxColors = {
    blue: 'text-blue-600 focus:ring-blue-500',
    green: 'text-green-600 focus:ring-green-500'
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/50">
      <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <Icon className={`w-5 h-5 ${iconColor}`} />
        {title}
      </h2>
      
      {/* Search and Filter */}
      <div className="mb-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search doctors..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={ehrFilter}
            onChange={(e) => onEhrFilterChange(e.target.value)}
            className="flex-1 p-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All EHR Systems</option>
            {uniqueEHRs.map(ehr => (
              <option key={ehr} value={ehr}>{ehr}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Additional Content (e.g., bulk email input) */}
      {additionalContent}

      {/* Selected Doctors */}
      <SelectedDoctorsList
        doctors={selectedDoctors}
        onRemove={onToggleDoctor}
        variant={variant}
      />

      {/* Doctor List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {availableDoctors.map(doctor => (
          <div
            key={doctor.id}
            onClick={() => onToggleDoctor(doctor.id)}
            className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
              selectedDoctors.some(d => d.id === doctor.id)
                ? borderColors[variant]
                : `border-slate-200 ${hoverColors[variant]} hover:bg-slate-50`
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selectedDoctors.some(d => d.id === doctor.id)}
                  onChange={() => {}}
                  className={`w-4 h-4 ${checkboxColors[variant]} rounded`}
                  onClick={(e) => e.stopPropagation()}
                />
                <div>
                  <div className="font-medium text-slate-800">{doctor.name}</div>
                  <div className="text-sm text-slate-600">
                    {maskEmail(doctor.email)} • {doctor.ehr}
                  </div>
                </div>
              </div>
              {selectedDoctors.some(d => d.id === doctor.id) && (
                <CheckCircle className={`w-5 h-5 ${checkColors[variant]}`} />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorSelectionPanel;

