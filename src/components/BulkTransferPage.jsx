import React, { useState } from 'react';
import { ChevronRight, Users, Copy, CheckCircle, AlertCircle, X, Search, Filter } from 'lucide-react';
import { getResourcesForEhr, formatResourceOption } from '../config';

const BulkTransferPage = ({ 
  doctors, 
  createdSummarizers, 
  onBack, 
  onExecuteCopy,
  maskEmail 
}) => {
  // State management
  const [selectedSourceDoctors, setSelectedSourceDoctors] = useState([]);
  const [selectedTargetDoctors, setSelectedTargetDoctors] = useState([]);
  const [copyType, setCopyType] = useState('summarizers'); // 'summarizers', 'full', 'templates'
  const [selectedSummarizers, setSelectedSummarizers] = useState([]);
  const [targetEHR, setTargetEHR] = useState('');
  const [targetEmails, setTargetEmails] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [ehrFilter, setEhrFilter] = useState('all');
  const [showResourceMapping, setShowResourceMapping] = useState(false);
  const [resourceMappings, setResourceMappings] = useState({});
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionProgress, setExecutionProgress] = useState(null);

  // Get unique EHR systems
  const uniqueEHRs = [...new Set(doctors.map(d => d.ehr))];

  // Filter doctors based on search and EHR filter
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         doctor.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEHR = ehrFilter === 'all' || doctor.ehr === ehrFilter;
    return matchesSearch && matchesEHR;
  });

  // Get summarizers for selected source doctors
  const availableSummarizers = createdSummarizers.filter(s => 
    selectedSourceDoctors.includes(s.doctorId)
  );

  // Toggle source doctor selection
  const toggleSourceDoctor = (doctorId) => {
    setSelectedSourceDoctors(prev => {
      if (prev.includes(doctorId)) {
        return prev.filter(id => id !== doctorId);
      } else {
        return [...prev, doctorId];
      }
    });
    // Clear selected summarizers when source changes
    if (!selectedSourceDoctors.includes(doctorId)) {
      setSelectedSummarizers([]);
    }
  };

  // Toggle target doctor selection
  const toggleTargetDoctor = (doctorId) => {
    setSelectedTargetDoctors(prev => {
      if (prev.includes(doctorId)) {
        return prev.filter(id => id !== doctorId);
      } else {
        return [...prev, doctorId];
      }
    });
  };

  // Toggle summarizer selection
  const toggleSummarizer = (summarizerId) => {
    setSelectedSummarizers(prev => {
      if (prev.includes(summarizerId)) {
        return prev.filter(id => id !== summarizerId);
      } else {
        return [...prev, summarizerId];
      }
    });
  };

  // Handle bulk email input
  const handleBulkEmailInput = (value) => {
    setTargetEmails(value);
    // Parse emails from text (comma or line separated)
    const emails = value.split(/[,\n]/)
      .map(e => e.trim())
      .filter(e => e.length > 0);
    
    // Find matching doctors by email
    const matchingDoctors = doctors.filter(d => 
      emails.some(email => d.email.toLowerCase() === email.toLowerCase())
    );
    
    setSelectedTargetDoctors(matchingDoctors.map(d => d.id));
  };

  // Check if cross-EHR copy is needed
  const needsResourceMapping = () => {
    if (selectedSourceDoctors.length === 0 || selectedTargetDoctors.length === 0) return false;
    
    const sourceEHRs = [...new Set(selectedSourceDoctors.map(id => {
      const doctor = doctors.find(d => d.id === id);
      return doctor?.ehr;
    }))];
    
    const targetEHRs = [...new Set(selectedTargetDoctors.map(id => {
      const doctor = doctors.find(d => d.id === id);
      return doctor?.ehr;
    }))];
    
    // Check if any target EHR is different from any source EHR
    return targetEHRs.some(targetEHR => 
      sourceEHRs.every(sourceEHR => sourceEHR !== targetEHR)
    );
  };

  // Prepare resource mappings for cross-EHR copies
  const prepareResourceMappings = () => {
    if (!needsResourceMapping()) return;

    const mappings = {};
    const sourceDoctors = doctors.filter(d => selectedSourceDoctors.includes(d.id));
    const targetDoctors = doctors.filter(d => selectedTargetDoctors.includes(d.id));
    
    // For each source doctor's summarizers that pull from EHR
    sourceDoctors.forEach(sourceDoctor => {
      const sourceSummarizers = availableSummarizers.filter(s => 
        s.doctorId === sourceDoctor.id && s.pullFromEHR && s.selectedResource
      );
      
      targetDoctors.forEach(targetDoctor => {
        if (sourceDoctor.ehr !== targetDoctor.ehr) {
          sourceSummarizers.forEach(summarizer => {
            const key = `${summarizer.id}-${targetDoctor.id}`;
            if (!mappings[key]) {
              mappings[key] = {
                summarizerId: summarizer.id,
                summarizerName: summarizer.name,
                sourceDoctorId: sourceDoctor.id,
                sourceDoctorName: sourceDoctor.name,
                sourceEHR: sourceDoctor.ehr,
                sourceResource: summarizer.selectedResource,
                targetDoctorId: targetDoctor.id,
                targetDoctorName: targetDoctor.name,
                targetEHR: targetDoctor.ehr,
                targetResource: null
              };
            }
          });
        }
      });
    });
    
    setResourceMappings(mappings);
    return Object.keys(mappings).length > 0;
  };

  // Handle execute copy
  const handleExecute = async () => {
    // Validation
    if (selectedSourceDoctors.length === 0) {
      alert('Please select at least one source doctor');
      return;
    }

    if (copyType === 'summarizers' && selectedSummarizers.length === 0) {
      alert('Please select at least one summarizer to copy');
      return;
    }

    if (selectedTargetDoctors.length === 0 && !targetEmails.trim()) {
      alert('Please select target doctors or enter email addresses');
      return;
    }

    // Check if resource mapping is needed
    if (needsResourceMapping()) {
      const hasMappings = prepareResourceMappings();
      if (hasMappings) {
        setShowResourceMapping(true);
        return;
      }
    }

    // Execute the copy
    await executeCopy();
  };

  // Execute the actual copy operation
  const executeCopy = async () => {
    setIsExecuting(true);
    setExecutionProgress({ current: 0, total: selectedTargetDoctors.length });

    try {
      // Simulate progress (in real implementation, this would be actual API calls)
      for (let i = 0; i < selectedTargetDoctors.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setExecutionProgress({ current: i + 1, total: selectedTargetDoctors.length });
      }

      // Call the parent's execute function
      if (onExecuteCopy) {
        await onExecuteCopy({
          sourceDoctors: selectedSourceDoctors,
          targetDoctors: selectedTargetDoctors,
          targetEmails: targetEmails.split(/[,\n]/).map(e => e.trim()).filter(e => e),
          copyType,
          selectedSummarizers,
          resourceMappings
        });
      }

      alert(`Successfully copied to ${selectedTargetDoctors.length} doctor(s)!`);
      
      // Reset form
      setSelectedSourceDoctors([]);
      setSelectedTargetDoctors([]);
      setSelectedSummarizers([]);
      setTargetEmails('');
      setTargetEHR('');
      setShowResourceMapping(false);
      setResourceMappings({});
    } catch (error) {
      alert(`Error during copy operation: ${error.message}`);
    } finally {
      setIsExecuting(false);
      setExecutionProgress(null);
    }
  };

  // Get selected source doctors
  const getSelectedSourceDoctorsData = () => {
    return doctors.filter(d => selectedSourceDoctors.includes(d.id));
  };

  // Get selected target doctors data
  const getSelectedTargetDoctorsData = () => {
    return doctors.filter(d => selectedTargetDoctors.includes(d.id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-4 transition-colors"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            Back to Dashboard
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <Copy className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Bulk Transfer Operations
            </h1>
          </div>
          <p className="text-slate-600 text-lg">Copy summarizers and configurations across multiple doctors</p>
        </div>

        {/* Execution Progress */}
        {isExecuting && executionProgress && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/50 mb-6">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">Copying configurations...</span>
                  <span className="text-sm text-slate-600">
                    {executionProgress.current} / {executionProgress.total}
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(executionProgress.current / executionProgress.total) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Resource Mapping Modal */}
        {showResourceMapping && Object.keys(resourceMappings).length > 0 && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[85vh] overflow-y-auto shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">Resource Mapping Required</h2>
                  <p className="text-sm text-slate-600 mt-1">
                    Map EHR resources for cross-EHR copies
                  </p>
                </div>
                <button
                  onClick={() => setShowResourceMapping(false)}
                  className="text-gray-400 hover:text-gray-600 text-3xl w-8 h-8 flex items-center justify-center transition-colors"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4 mb-6">
                {Object.values(resourceMappings).map((mapping, index) => (
                  <div key={index} className="border-2 border-slate-200 rounded-xl p-5">
                    <div className="mb-3">
                      <div className="font-semibold text-slate-800">{mapping.summarizerName}</div>
                      <div className="text-sm text-slate-600">
                        {mapping.sourceDoctorName} ({mapping.sourceEHR}) → {mapping.targetDoctorName} ({mapping.targetEHR})
                      </div>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3 mb-3">
                      <div className="text-xs text-slate-600 mb-1">Source Resource ({mapping.sourceEHR}):</div>
                      <div className="text-sm font-medium text-slate-700">{mapping.sourceResource}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Target Resource ({mapping.targetEHR}) *
                      </label>
                      <select
                        value={mapping.targetResource || ''}
                        onChange={(e) => {
                          setResourceMappings(prev => ({
                            ...prev,
                            [Object.keys(resourceMappings)[index]]: {
                              ...mapping,
                              targetResource: e.target.value
                            }
                          }));
                        }}
                        className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select resource...</option>
                        {getResourcesForEhr(mapping.targetEHR).map(resource => (
                          <option key={resource.id} value={resource.id}>
                            {formatResourceOption(resource)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowResourceMapping(false)}
                  className="px-6 py-2.5 border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    // Validate all mappings are complete
                    const incomplete = Object.values(resourceMappings).some(m => !m.targetResource);
                    if (incomplete) {
                      alert('Please complete all resource mappings');
                      return;
                    }
                    setShowResourceMapping(false);
                    await executeCopy();
                  }}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Continue with Copy
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Source Selection */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/50">
            <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Source Doctors
            </h2>
            
            {/* Search and Filter */}
            <div className="mb-4 space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search doctors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <select
                  value={ehrFilter}
                  onChange={(e) => setEhrFilter(e.target.value)}
                  className="flex-1 p-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All EHR Systems</option>
                  {uniqueEHRs.map(ehr => (
                    <option key={ehr} value={ehr}>{ehr}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Selected Source Doctors */}
            {selectedSourceDoctors.length > 0 && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="text-sm font-medium text-blue-700 mb-2">
                  Selected ({selectedSourceDoctors.length})
                </div>
                <div className="flex flex-wrap gap-2">
                  {getSelectedSourceDoctorsData().map(doctor => (
                    <div
                      key={doctor.id}
                      className="px-3 py-1 bg-white border border-blue-300 rounded-lg text-sm flex items-center gap-2"
                    >
                      <span className="font-medium text-slate-800">{doctor.name}</span>
                      <span className="text-xs text-slate-500">({doctor.ehr})</span>
                      <button
                        onClick={() => toggleSourceDoctor(doctor.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Doctor List */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredDoctors.map(doctor => (
                <div
                  key={doctor.id}
                  onClick={() => toggleSourceDoctor(doctor.id)}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedSourceDoctors.includes(doctor.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedSourceDoctors.includes(doctor.id)}
                        onChange={() => {}}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div>
                        <div className="font-medium text-slate-800">{doctor.name}</div>
                        <div className="text-sm text-slate-600">{maskEmail(doctor.email)} • {doctor.ehr}</div>
                      </div>
                    </div>
                    {selectedSourceDoctors.includes(doctor.id) && (
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Target Selection */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/50">
            <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-green-600" />
              Target Doctors
            </h2>

            {/* Bulk Email Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Bulk Email Input (comma or line separated)
              </label>
              <textarea
                value={targetEmails}
                onChange={(e) => handleBulkEmailInput(e.target.value)}
                placeholder="Enter email addresses separated by commas or new lines..."
                rows={3}
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Selected Target Doctors */}
            {selectedTargetDoctors.length > 0 && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl">
                <div className="text-sm font-medium text-green-700 mb-2">
                  Selected ({selectedTargetDoctors.length})
                </div>
                <div className="flex flex-wrap gap-2">
                  {getSelectedTargetDoctorsData().map(doctor => (
                    <div
                      key={doctor.id}
                      className="px-3 py-1 bg-white border border-green-300 rounded-lg text-sm flex items-center gap-2"
                    >
                      <span className="font-medium text-slate-800">{doctor.name}</span>
                      <span className="text-xs text-slate-500">({doctor.ehr})</span>
                      <button
                        onClick={() => toggleTargetDoctor(doctor.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Target Doctor List */}
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {filteredDoctors
                .filter(d => !selectedSourceDoctors.includes(d.id))
                .map(doctor => (
                  <div
                    key={doctor.id}
                    onClick={() => toggleTargetDoctor(doctor.id)}
                    className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedTargetDoctors.includes(doctor.id)
                        ? 'border-green-500 bg-green-50'
                        : 'border-slate-200 hover:border-green-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedTargetDoctors.includes(doctor.id)}
                          onChange={() => {}}
                          className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div>
                          <div className="font-medium text-slate-800">{doctor.name}</div>
                          <div className="text-sm text-slate-600">{maskEmail(doctor.email)} • {doctor.ehr}</div>
                        </div>
                      </div>
                      {selectedTargetDoctors.includes(doctor.id) && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Copy Type Selection */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/50 mt-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Copy Type</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setCopyType('summarizers')}
              className={`p-4 rounded-xl border-2 transition-all ${
                copyType === 'summarizers'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-slate-200 hover:border-blue-300'
              }`}
            >
              <div className="font-semibold text-slate-800 mb-1">Copy Summarizers</div>
              <div className="text-sm text-slate-600">Select specific summarizers to copy</div>
            </button>
            <button
              onClick={() => setCopyType('full')}
              className={`p-4 rounded-xl border-2 transition-all ${
                copyType === 'full'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-slate-200 hover:border-blue-300'
              }`}
            >
              <div className="font-semibold text-slate-800 mb-1">Copy Full Configuration</div>
              <div className="text-sm text-slate-600">All summarizers + templates</div>
            </button>
            <button
              onClick={() => setCopyType('templates')}
              className={`p-4 rounded-xl border-2 transition-all ${
                copyType === 'templates'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-slate-200 hover:border-blue-300'
              }`}
            >
              <div className="font-semibold text-slate-800 mb-1">Copy Templates Only</div>
              <div className="text-sm text-slate-600">Template configurations only</div>
            </button>
          </div>
        </div>

        {/* Summarizer Selection (only for 'summarizers' copy type) */}
        {copyType === 'summarizers' && selectedSourceDoctors.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/50 mt-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Select Summarizers</h2>
            {availableSummarizers.length > 0 ? (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {availableSummarizers.map(summarizer => (
                  <div
                    key={summarizer.id}
                    onClick={() => toggleSummarizer(summarizer.id)}
                    className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedSummarizers.includes(summarizer.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedSummarizers.includes(summarizer.id)}
                          onChange={() => {}}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div>
                          <div className="font-medium text-slate-800">{summarizer.name}</div>
                          <div className="text-sm text-slate-600">
                            {doctors.find(d => d.id === summarizer.doctorId)?.name}
                          </div>
                        </div>
                      </div>
                      {selectedSummarizers.includes(summarizer.id) && (
                        <CheckCircle className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-sm">No summarizers available for selected source doctors</p>
            )}
          </div>
        )}

        {/* Review & Execute */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/50 mt-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Review & Execute</h2>
          
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-slate-600 mb-1">Source Doctors</div>
                <div className="text-lg font-semibold text-slate-800">
                  {selectedSourceDoctors.length} selected
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-slate-600 mb-1">Target Doctors</div>
                <div className="text-lg font-semibold text-slate-800">
                  {selectedTargetDoctors.length} selected
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-slate-600 mb-1">Copy Type</div>
                <div className="text-lg font-semibold text-slate-800 capitalize">
                  {copyType === 'summarizers' ? 'Selected Summarizers' : 
                   copyType === 'full' ? 'Full Configuration' : 
                   'Templates Only'}
                </div>
              </div>
              {copyType === 'summarizers' && (
                <div>
                  <div className="text-sm font-medium text-slate-600 mb-1">Selected Summarizers</div>
                  <div className="text-lg font-semibold text-slate-800">
                    {selectedSummarizers.length} selected
                  </div>
                </div>
              )}
            </div>

            {needsResourceMapping() && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-700">
                    <div className="font-semibold mb-1">Cross-EHR Copy Detected</div>
                    <div>Resource mapping will be required for summarizers that pull from EHR.</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-4">
            <button
              onClick={onBack}
              className="px-6 py-2.5 border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleExecute}
              disabled={isExecuting}
              className={`px-6 py-2.5 rounded-xl font-semibold shadow-lg transition-all ${
                isExecuting
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white hover:shadow-xl'
              }`}
            >
              {isExecuting ? 'Copying...' : 'Execute Copy'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkTransferPage;


