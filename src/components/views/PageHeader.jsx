import React from 'react';
import { Users, Copy } from 'lucide-react';

const PageHeader = ({ onBulkTransfer }) => {
  return (
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
        {onBulkTransfer && (
          <button
            onClick={onBulkTransfer}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <Copy className="w-4 h-4" />
            Bulk Transfer
          </button>
        )}
      </div>
      <p className="text-slate-600 text-lg">
        Create summarizers and configure templates for healthcare providers
      </p>
    </div>
  );
};

export default PageHeader;

