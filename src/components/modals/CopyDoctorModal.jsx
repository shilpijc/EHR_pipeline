import React from 'react';
import { CheckCircle, AlertCircle, Plus, X } from 'lucide-react';
import { getAllEhrNames } from '../../config';

const CopyDoctorModal = ({
  showCopyDoctorModal,
  setShowCopyDoctorModal,
  copySourceDoctor,
  targetEHR,
  setTargetEHR,
  targetDoctorEmails,
  updateEmailField,
  removeEmailField,
  addEmailField,
  handleCopyDoctor
}) => {
  if (!showCopyDoctorModal) return null;

  const ehrNames = getAllEhrNames();

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">
            Copy Doctor Configuration
          </h2>
          <button
            onClick={() => {
              setShowCopyDoctorModal(false);
            }}
            className="text-gray-400 hover:text-gray-600 text-3xl w-8 h-8 flex items-center justify-center transition-colors"
          >
            ×
          </button>
        </div>

        {/* Source Doctor Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <div className="text-sm text-blue-700 font-semibold mb-2">Copying Configuration From:</div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
              {copySourceDoctor?.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div className="font-semibold text-slate-800">{copySourceDoctor?.name}</div>
              <div className="text-sm text-slate-600">{copySourceDoctor?.ehr} EHR • {copySourceDoctor?.specialty}</div>
            </div>
          </div>
        </div>

        {/* Target EHR Selection */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Target EHR System *
          </label>
          <select
            value={targetEHR}
            onChange={(e) => setTargetEHR(e.target.value)}
            className="w-full p-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="">Select target EHR system...</option>
            {ehrNames.map(ehr => (
              <option key={ehr} value={ehr}>{ehr}</option>
            ))}
          </select>
          {targetEHR && (
            <div className="mt-2 text-sm">
              {targetEHR === copySourceDoctor?.ehr ? (
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="w-4 h-4" />
                  <span className="font-semibold">Same EHR - Full configuration will be copied</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-amber-700">
                  <AlertCircle className="w-4 h-4" />
                  <span className="font-semibold">Different EHR - Resource mapping required after copy</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Target Doctor Emails */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Target Doctor Email(s) * (Configuration will be copied to these doctors)
          </label>
          <div className="space-y-3">
            {targetDoctorEmails.map((email, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="email"
                  placeholder={`doctor${index + 1}@example.com`}
                  value={email}
                  onChange={(e) => updateEmailField(index, e.target.value)}
                  className="flex-1 p-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                {targetDoctorEmails.length > 1 && (
                  <button
                    onClick={() => removeEmailField(index)}
                    className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-xl transition-colors"
                    title="Remove email"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            onClick={addEmailField}
            className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add another email
          </button>
          {targetDoctorEmails.filter(e => e.trim()).length > 0 && (
            <div className="mt-3 text-sm text-blue-600 font-semibold">
              {targetDoctorEmails.filter(e => e.trim()).length} doctor{targetDoctorEmails.filter(e => e.trim()).length > 1 ? 's' : ''} will receive this configuration
            </div>
          )}
        </div>

        {/* Copy Scope Info */}
        {targetEHR && targetEHR === copySourceDoctor?.ehr && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
            <div className="flex gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-green-800 mb-2">Same EHR - Complete Copy</div>
                <div className="text-sm text-green-700 space-y-1.5">
                  <div className="flex items-start gap-2">
                    <span className="font-semibold min-w-[20px]">1.</span>
                    <span>Copy of account created with new Doctor ID</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-semibold min-w-[20px]">2.</span>
                    <span>Doctor Name updated automatically from email</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-semibold min-w-[20px]">3.</span>
                    <span><strong>All copied:</strong> Summarizer prompts, Templates, Template section → EHR mappings, Summarizer → Template mappings</span>
                  </div>
                  <div className="mt-3 p-3 bg-green-100 rounded-lg">
                    <span className="font-semibold">✓ Ready to use immediately - No additional configuration needed!</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {targetEHR && targetEHR !== copySourceDoctor?.ehr && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-amber-800 mb-2">Different EHR - Partial Copy (Mapping Required)</div>
                <div className="text-sm text-amber-700 space-y-1.5">
                  <div className="flex items-start gap-2">
                    <span className="font-semibold min-w-[20px]">1.</span>
                    <span>Copy of account created with new Doctor ID</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-semibold min-w-[20px]">2.</span>
                    <span>Doctor Name updated automatically from email</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-semibold min-w-[20px]">3.</span>
                    <span><strong>Copied:</strong> Summarizer prompts, Templates, Summarizer → Template mappings</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-semibold min-w-[20px]">4.</span>
                    <span><strong>NOT copied:</strong> Template section → EHR mappings (different resource IDs)</span>
                  </div>
                  <div className="mt-3 p-3 bg-amber-100 rounded-lg">
                    <div className="font-semibold mb-1">⚠️ Post-Copy Actions Required:</div>
                    <div className="text-xs space-y-1">
                      <div>• Check if corresponding EHR resources are available for pulled summarizers</div>
                      <div>• Interface will be provided to update/map resources</div>
                      <div>• Complete template section → EHR mappings</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {!targetEHR && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-700">
                <div className="font-semibold mb-2">Select target EHR to see what will be copied</div>
                <div>The copy scope differs based on whether the target doctors use the same EHR system as the source doctor.</div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={() => {
              setShowCopyDoctorModal(false);
            }}
            className="px-6 py-2.5 border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCopyDoctor}
            disabled={targetDoctorEmails.filter(e => e.trim()).length === 0 || !targetEHR}
            className={`px-6 py-2.5 rounded-xl font-semibold shadow-lg transition-all duration-200 ${
              targetDoctorEmails.filter(e => e.trim()).length === 0 || !targetEHR
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white hover:shadow-xl'
            }`}
          >
            Copy to {targetDoctorEmails.filter(e => e.trim()).length > 0 ? targetDoctorEmails.filter(e => e.trim()).length : ''} Doctor{targetDoctorEmails.filter(e => e.trim()).length > 1 ? 's' : ''}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CopyDoctorModal;

