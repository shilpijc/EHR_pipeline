import React from 'react';

const ExecutionProgress = ({ current, total }) => {
  const percentage = (current / total) * 100;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/50 mb-6">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">Copying configurations...</span>
            <span className="text-sm text-slate-600">
              {current} / {total}
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutionProgress;

