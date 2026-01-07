import React, { useCallback, useMemo } from 'react';
import { ChevronRight, Copy } from 'lucide-react';
import { useBulkTransfer } from './BulkTransfer/useBulkTransfer';
import {
  needsResourceMapping,
  prepareResourceMappings,
  parseEmailInput,
  findDoctorsByEmails,
  validateCopyOperation,
  filterDoctors
} from './BulkTransfer/bulkTransferHelpers';
import ResourceMappingModal from './BulkTransfer/ResourceMappingModal';
import ExecutionProgress from './BulkTransfer/ExecutionProgress';
import DoctorSelectionPanel from './BulkTransfer/DoctorSelectionPanel';
import CopyTypeSelector from './BulkTransfer/CopyTypeSelector';
import SummarizerSelection from './BulkTransfer/SummarizerSelection';
import ReviewSection from './BulkTransfer/ReviewSection';

const BulkTransferPage = ({
  doctors,
  createdSummarizers,
  onBack,
  onExecuteCopy,
  maskEmail
}) => {
  const [state, actions] = useBulkTransfer();

  const {
    selectedSourceDoctors,
    selectedTargetDoctors,
    copyType,
    selectedSummarizer,
    targetEmails,
    searchTerm,
    ehrFilter,
    showResourceMapping,
    resourceMappings,
    isExecuting,
    executionProgress
  } = state;

  const {
    setSourceDoctors,
    setTargetDoctors,
    toggleSourceDoctor,
    toggleTargetDoctor,
    selectSummarizer,
    setCopyType,
    setTargetEmails,
    setSearchTerm,
    setEhrFilter,
    setResourceMappings,
    updateResourceMapping,
    setShowResourceMapping,
    setExecutionState,
    setExecutionProgress,
    resetForm
  } = actions;

  const uniqueEHRs = useMemo(
    () => [...new Set(doctors.map((d) => d.ehr))],
    [doctors]
  );

  const filteredDoctors = useMemo(
    () => filterDoctors(doctors, searchTerm, ehrFilter),
    [doctors, searchTerm, ehrFilter]
  );

  const selectedSourceDoctorsData = useMemo(
    () => doctors.filter((d) => selectedSourceDoctors.includes(d.id)),
    [doctors, selectedSourceDoctors]
  );

  const selectedTargetDoctorsData = useMemo(
    () => doctors.filter((d) => selectedTargetDoctors.includes(d.id)),
    [doctors, selectedTargetDoctors]
  );

  const availableTargetDoctors = useMemo(
    () => filteredDoctors.filter((d) => !selectedSourceDoctors.includes(d.id)),
    [filteredDoctors, selectedSourceDoctors]
  );

  const availableSummarizers = useMemo(
    () => createdSummarizers.filter((s) => selectedSourceDoctors.includes(s.doctorId)),
    [createdSummarizers, selectedSourceDoctors]
  );

  const requiresResourceMapping = useMemo(
    () => needsResourceMapping(selectedSourceDoctors, selectedTargetDoctors, doctors),
    [selectedSourceDoctors, selectedTargetDoctors, doctors]
  );

  const handleBulkEmailInput = useCallback(
    (value) => {
      setTargetEmails(value);
      const emails = parseEmailInput(value);
      const matchingDoctors = findDoctorsByEmails(emails, doctors);
      setTargetDoctors(matchingDoctors.map((d) => d.id));
    },
    [doctors, setTargetDoctors, setTargetEmails]
  );

  const handlePrepareResourceMapping = useCallback(() => {
    const mappings = prepareResourceMappings(
      selectedSourceDoctors,
      selectedTargetDoctors,
      doctors,
      availableSummarizers
    );
    setResourceMappings(mappings);
    return Object.keys(mappings).length > 0;
  }, [
    availableSummarizers,
    doctors,
    selectedSourceDoctors,
    selectedTargetDoctors,
    setResourceMappings
  ]);

  const executeCopy = useCallback(async () => {
    const targetsCount =
      selectedTargetDoctors.length || parseEmailInput(targetEmails).length || 1;

    setExecutionState(true);
    setExecutionProgress({ current: 0, total: targetsCount });

    try {
      for (let i = 0; i < targetsCount; i++) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        setExecutionProgress({ current: i + 1, total: targetsCount });
      }

      if (onExecuteCopy) {
        await onExecuteCopy({
          sourceDoctors: selectedSourceDoctors,
          targetDoctors: selectedTargetDoctors,
          targetEmails: parseEmailInput(targetEmails),
          copyType,
          selectedSummarizer,
          resourceMappings
        });
      }

      alert(`Successfully copied to ${targetsCount} recipient(s)!`);
      resetForm();
      setSourceDoctors([]);
      setTargetDoctors([]);
    } catch (error) {
      alert(`Error during copy operation: ${error.message}`);
    } finally {
      setExecutionState(false);
      setExecutionProgress(null);
    }
  }, [
    copyType,
    onExecuteCopy,
    resourceMappings,
    selectedSourceDoctors,
    selectedSummarizer,
    selectedTargetDoctors,
    setExecutionProgress,
    setExecutionState,
    setSourceDoctors,
    setTargetDoctors,
    targetEmails,
    resetForm
  ]);

  const handleExecute = useCallback(async () => {
    const validation = validateCopyOperation(state);
    if (!validation.valid) {
      alert(validation.message);
      return;
    }

    if (requiresResourceMapping) {
      const hasMappings = handlePrepareResourceMapping();
      if (hasMappings) {
        setShowResourceMapping(true);
        return;
      }
    }

    await executeCopy();
  }, [executeCopy, handlePrepareResourceMapping, requiresResourceMapping, state, setShowResourceMapping]);

  const handleResourceMappingExecute = useCallback(async () => {
    setShowResourceMapping(false);
    await executeCopy();
  }, [executeCopy, setShowResourceMapping]);

  // Get the selected summarizer object for display in ReviewSection
  const selectedSummarizerData = useMemo(
    () => availableSummarizers.find((s) => s.id === selectedSummarizer),
    [availableSummarizers, selectedSummarizer]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
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
          <p className="text-slate-600 text-lg">
            Copy summarizer and configurations across multiple doctors
          </p>
        </div>

        {isExecuting && executionProgress && (
          <ExecutionProgress
            current={executionProgress.current}
            total={executionProgress.total}
          />
        )}

        {showResourceMapping && Object.keys(resourceMappings).length > 0 && (
          <ResourceMappingModal
            resourceMappings={resourceMappings}
            onUpdateMapping={updateResourceMapping}
            onClose={() => setShowResourceMapping(false)}
            onExecute={handleResourceMappingExecute}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DoctorSelectionPanel
            title="Source Doctors"
            iconColor="text-blue-600"
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            ehrFilter={ehrFilter}
            onEhrFilterChange={setEhrFilter}
            uniqueEHRs={uniqueEHRs}
            selectedDoctors={selectedSourceDoctorsData}
            availableDoctors={filteredDoctors}
            onToggleDoctor={toggleSourceDoctor}
            maskEmail={maskEmail}
            variant="blue"
          />

          <DoctorSelectionPanel
            title="Target Doctors"
            iconColor="text-green-600"
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            ehrFilter={ehrFilter}
            onEhrFilterChange={setEhrFilter}
            uniqueEHRs={uniqueEHRs}
            selectedDoctors={selectedTargetDoctorsData}
            availableDoctors={availableTargetDoctors}
            onToggleDoctor={toggleTargetDoctor}
            maskEmail={maskEmail}
            variant="green"
            additionalContent={
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
            }
          />
        </div>

        <CopyTypeSelector selectedType={copyType} onChange={setCopyType} />

        {copyType === 'summarizers' && selectedSourceDoctors.length > 0 && (
          <SummarizerSelection
            availableSummarizers={availableSummarizers}
            selectedSummarizer={selectedSummarizer}
            onSelectSummarizer={selectSummarizer}
            doctors={doctors}
          />
        )}

        <ReviewSection
          selectedSourceCount={selectedSourceDoctors.length}
          selectedTargetCount={selectedTargetDoctors.length || parseEmailInput(targetEmails).length}
          copyType={copyType}
          selectedSummarizer={selectedSummarizerData}
          needsResourceMapping={requiresResourceMapping}
          onCancel={onBack}
          onExecute={handleExecute}
          isExecuting={isExecuting}
        />
      </div>
    </div>
  );
};

export default BulkTransferPage;
