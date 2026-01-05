import React from 'react';
import { PRACTICES } from '../../constants';
import PageHeader from './PageHeader';
import SearchFilters from './SearchFilters';
import DoctorCard from './DoctorCard';

const DoctorsView = ({
  searchTerm,
  setSearchTerm,
  selectedPractice,
  setSelectedPractice,
  filteredDoctors,
  createTypeDropdown,
  handleCreateSummarizer,
  handleSelectCreateType,
  setCurrentView,
  setSelectedDoctor,
  maskEmail
}) => {
  const handleConfigure = (doctor) => {
    setSelectedDoctor(doctor);
    setCurrentView('summarizers-variables');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <PageHeader onBulkTransfer={() => setCurrentView('bulk-transfer')} />

        <SearchFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedPractice={selectedPractice}
          onPracticeChange={setSelectedPractice}
          practices={PRACTICES}
        />

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/50 overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-200/50 bg-slate-50/50">
            <h2 className="text-xl font-semibold text-slate-800">Healthcare Providers</h2>
            <p className="text-slate-600 text-sm mt-1">
              Select a doctor to create summarizers or configure templates
            </p>
          </div>
          
          <div className="divide-y divide-slate-200/50">
            {filteredDoctors.map((doctor) => (
              <DoctorCard
                key={doctor.id}
                doctor={doctor}
                createTypeDropdown={createTypeDropdown}
                onCreateSummarizer={() => handleCreateSummarizer(doctor)}
                onSelectCreateType={handleSelectCreateType}
                onConfigure={() => handleConfigure(doctor)}
                maskEmail={maskEmail}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorsView;

