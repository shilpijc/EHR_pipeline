import React from 'react';
import { Plus, FileText, ChevronRight } from 'lucide-react';
import { maskEmail as maskEmailUtil } from '../../utils';
import { EHR_COLORS } from '../../constants';

const DoctorCard = ({
  doctor,
  createTypeDropdown,
  onCreateSummarizer,
  onSelectCreateType,
  onConfigure,
  maskEmail
}) => {
  const colors = EHR_COLORS[doctor.ehr] || EHR_COLORS.ECW;
  const displayEmail = (maskEmail || maskEmailUtil)(doctor.email);
  const initials = doctor.name.split(' ').map(n => n[0]).join('');

  return (
    <div 
      className={`p-6 transition-colors group border-l-4 ${colors.border} ${colors.bg} border-b border-slate-100 last:border-b-0 hover:opacity-90`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div 
            className={`w-12 h-12 ${colors.badge} ${colors.text} rounded-xl flex items-center justify-center font-semibold text-lg flex-shrink-0 border-2 ${colors.border}`}
          >
            {initials}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <h3 className={`font-semibold ${colors.text} text-lg`}>
                {doctor.name}
              </h3>
              <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                {doctor.specialty}
              </span>
              <span 
                className={`text-xs ${colors.badge} ${colors.text} px-2 py-0.5 rounded-full font-medium border ${colors.border}`}
              >
                {doctor.ehr}
              </span>
            </div>
            <p className="text-sm text-slate-600 truncate">{displayEmail}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={onConfigure}
            className="px-3 py-1.5 text-sm text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg font-medium flex items-center gap-1.5 transition-all duration-200"
          >
            <FileText className="w-4 h-4" />
            Configure
          </button>

          <div className="relative create-dropdown-container">
            <button
              onClick={onCreateSummarizer}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Plus className="w-4 h-4" />
              Add
              <ChevronRight 
                className={`w-3 h-3 transition-transform ${
                  createTypeDropdown === doctor.id ? 'rotate-90' : ''
                }`} 
              />
            </button>

            {createTypeDropdown === doctor.id && (
              <div 
                className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-[100]" 
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => onSelectCreateType('summarizer')}
                  className="w-full px-4 py-2.5 text-left text-sm hover:bg-slate-50 transition-colors flex items-center gap-3"
                >
                  <span className="text-xl">📊</span>
                  <div>
                    <div className="font-medium text-slate-700">Add Summarizer</div>
                    <div className="text-xs text-slate-500">
                      Extract and summarize data from EHR
                    </div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;

