import { useState } from 'react';

/**
 * Custom hook for managing summarizers state and operations
 */
export const useSummarizers = (initialSummarizers = []) => {
  const [createdSummarizers, setCreatedSummarizers] = useState(initialSummarizers);
  const [editingSummarizerId, setEditingSummarizerId] = useState(null);
  const [currentSummarizer, setCurrentSummarizer] = useState(null);

  const addSummarizer = (summarizer) => {
    const newSummarizer = {
      ...summarizer,
      id: summarizer.id || `summarizer-${Date.now()}-${Math.random()}`
    };
    setCreatedSummarizers(prev => [...prev, newSummarizer]);
    return newSummarizer.id;
  };

  const updateSummarizer = (id, updates) => {
    setCreatedSummarizers(prev =>
      prev.map(s => s.id === id ? { ...s, ...updates } : s)
    );
  };

  const deleteSummarizer = (id) => {
    setCreatedSummarizers(prev => prev.filter(s => s.id !== id));
  };

  const getSummarizer = (id) => {
    return createdSummarizers.find(s => s.id === id);
  };

  const getSummarizersByDoctor = (doctorId) => {
    return createdSummarizers.filter(s => s.doctorId === doctorId);
  };

  const toggleSummarizerActive = (id) => {
    const summarizer = getSummarizer(id);
    if (summarizer) {
      updateSummarizer(id, { active: !summarizer.active });
    }
  };

  const copySummarizer = (sourceId, targetDoctorId, targetDoctorName, targetEHR, isSameEHR) => {
    const source = getSummarizer(sourceId);
    if (!source) return null;

    const newSummarizer = {
      ...source,
      id: `summarizer-${Date.now()}-${Math.random()}`,
      doctorId: targetDoctorId,
      doctorName: targetDoctorName,
      ehr: targetEHR,
      selectedResource: isSameEHR ? source.selectedResource : '',
      active: true
    };

    addSummarizer(newSummarizer);
    return newSummarizer.id;
  };

  return {
    createdSummarizers,
    setCreatedSummarizers,
    editingSummarizerId,
    setEditingSummarizerId,
    currentSummarizer,
    setCurrentSummarizer,
    addSummarizer,
    updateSummarizer,
    deleteSummarizer,
    getSummarizer,
    getSummarizersByDoctor,
    toggleSummarizerActive,
    copySummarizer
  };
};

