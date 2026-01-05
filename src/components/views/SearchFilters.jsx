import React from 'react';

const SearchFilters = ({ 
  searchTerm, 
  onSearchChange, 
  selectedPractice, 
  onPracticeChange, 
  practices 
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/50 mb-6">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search doctors by name or email..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>
        <div>
          <select
            value={selectedPractice}
            onChange={(e) => onPracticeChange(e.target.value)}
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
  );
};

export default SearchFilters;

