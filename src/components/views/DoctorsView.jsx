import React from 'react';
import { Users, Plus, FileText, Settings, ChevronRight, Copy } from 'lucide-react';
import { maskEmail } from '../../utils';
import { EHR_COLORS, PRACTICES } from '../../constants';

const DoctorsView = ({
  searchTerm,
  setSearchTerm,
  selectedPractice,
  setSelectedPractice,
  doctors,
  filteredDoctors,
  createTypeDropdown,
  setCreateTypeDropdown,
  handleCreateSummarizer,
  handleSelectCreateType,
  handleConfigureTemplates,
  setCurrentView,
  setSelectedDoctor,
  maskEmail: maskEmailProp
}) => {
  const ehrColors = EHR_COLORS;
  const practices = PRACTICES;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Marvix Ops Dashboard
              </h1>
            </div>
            <button
              onClick={() => setCurrentView('bulk-transfer')}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Copy className="w-4 h-4" />
              Bulk Transfer
            </button>
          </div>
          <p className="text-slate-600 text-lg">Create summarizers and configure templates for healthcare providers</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/50 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search doctors by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            <div>
              <select
                value={selectedPractice}
                onChange={(e) => setSelectedPractice(e.target.value)}
                className="p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white min-w-[160px]"
              >
                {practices.map(practice => (
                  <option key={practice} value={practice}>
                    {practice === 'all' ? 'All Practices' : practice}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/50 overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-200/50 bg-slate-50/50">
            <h2 className="text-xl font-semibold text-slate-800">Healthcare Providers</h2>
            <p className="text-slate-600 text-sm mt-1">Select a doctor to create summarizers or configure templates</p>
          </div>
          
          <div className="divide-y divide-slate-200/50">
            {filteredDoctors.map((doctor) => {
              const colors = ehrColors[doctor.ehr] || ehrColors.ECW;
              return (
                <div key={doctor.id} className={`p-6 transition-colors group border-l-4 ${colors.border} ${colors.bg} border-b border-slate-100 last:border-b-0 hover:opacity-90`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`w-12 h-12 ${colors.badge} ${colors.text} rounded-xl flex items-center justify-center font-semibold text-lg flex-shrink-0 border-2 ${colors.border}`}>
                        {doctor.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className={`font-semibold ${colors.text} text-lg`}>{doctor.name}</h3>
                          <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{doctor.specialty}</span>
                          <span className={`text-xs ${colors.badge} ${colors.text} px-2 py-0.5 rounded-full font-medium border ${colors.border}`}>
                            {doctor.ehr}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 truncate">{(maskEmailProp || maskEmail)(doctor.email)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => {
                          setSelectedDoctor(doctor);
                          setCurrentView('summarizers-variables');
                        }}
                        className="px-3 py-1.5 text-sm text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg font-medium flex items-center gap-1.5 transition-all duration-200"
                      >
                        <FileText className="w-4 h-4" />
                        Configure
                      </button>

                      <div className="relative create-dropdown-container">
                        <button
                          onClick={() => handleCreateSummarizer(doctor)}
                          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                          <Plus className="w-4 h-4" />
                          Add
                          <ChevronRight className={`w-3 h-3 transition-transform ${createTypeDropdown === doctor.id ? 'rotate-90' : ''}`} />
                        </button>

                        {createTypeDropdown === doctor.id && (
                          <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-[100]" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => handleSelectCreateType('summarizer')}
                              className="w-full px-4 py-2.5 text-left text-sm hover:bg-slate-50 transition-colors flex items-center gap-3"
                            >
                              <span className="text-xl">📊</span>
                              <div>
                                <div className="font-medium text-slate-700">Add Summarizer</div>
                                <div className="text-xs text-slate-500">Extract and summarize data from EHR</div>
                              </div>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorsView;

