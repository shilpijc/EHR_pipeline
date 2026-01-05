-- Migration: Seed EHR Resources
-- Purpose: Populate EHR resources with retrieval configurations for all supported systems
-- Date: 2026-01-05

-- ECW Resources
INSERT INTO ehr_resources (
    resource_id, ehr_system_id, document_type, name, 
    retrieval_method, supports_date_range, supports_single_date, 
    date_parameter_label, default_lookback_years, default_lookback_days, default_to_recent,
    description, is_active
) VALUES
('ecw-previous-notes-xml', 
 (SELECT id FROM ehr_systems WHERE system_code = 'ECW'), 
 'Previous Notes', 'Previous Notes XML', 
 'date_range', true, false, 
 'From X years/days ago to Y days ago', 3, 3, false,
 'ECW Previous Notes in XML format with date range support (3 years to 3 days ago)', true)
ON CONFLICT (resource_id) DO NOTHING;

-- AthenaOne Resources (all single document retrieval)
INSERT INTO ehr_resources (
    resource_id, ehr_system_id, document_type, name, 
    retrieval_method, supports_date_range, supports_single_date, 
    date_parameter_label, description, is_active
) VALUES
('athenaone-previous-notes-pdf', 
 (SELECT id FROM ehr_systems WHERE system_code = 'AthenaOne'), 
 'Previous Notes', 'Previous Notes PDF', 
 'single_document', false, true, 
 'Note date',
 'AthenaOne Previous Notes in PDF format - single document by note date', true),
 
('athenaone-lab-results-pdf', 
 (SELECT id FROM ehr_systems WHERE system_code = 'AthenaOne'), 
 'Lab Results', 'Lab Results PDF', 
 'single_document', false, true, 
 'Lab date',
 'AthenaOne Lab Results in PDF format - single document by lab date', true),
 
('athenaone-clinical-documents-pdf', 
 (SELECT id FROM ehr_systems WHERE system_code = 'AthenaOne'), 
 'Clinical Documents', 'Clinical Documents PDF', 
 'single_document', false, true, 
 'Document date',
 'AthenaOne Clinical Documents in PDF format - single document by date', true),
 
('athenaone-clinical-documents-xml', 
 (SELECT id FROM ehr_systems WHERE system_code = 'AthenaOne'), 
 'Clinical Documents', 'Clinical Documents XML', 
 'single_document', false, true, 
 'Document date',
 'AthenaOne Clinical Documents in XML format - single document by date', true),
 
('athenaone-imaging-results', 
 (SELECT id FROM ehr_systems WHERE system_code = 'AthenaOne'), 
 'Imaging Results', 'Imaging Results', 
 'single_document', false, true, 
 'Imaging date',
 'AthenaOne Imaging Results - single document by imaging date', true),
 
('athenaone-problems-list', 
 (SELECT id FROM ehr_systems WHERE system_code = 'AthenaOne'), 
 'Problems List', 'Problems List', 
 'single_document', false, true, 
 'Note date',
 'AthenaOne Problems List - single document by note date', true)
ON CONFLICT (resource_id) DO NOTHING;

-- AthenaFlow Resources
INSERT INTO ehr_resources (
    resource_id, ehr_system_id, document_type, name, 
    retrieval_method, supports_date_range, supports_single_date, 
    date_parameter_label, default_lookback_years, default_to_recent,
    description, is_active
) VALUES
('athenaflow-previous-notes', 
 (SELECT id FROM ehr_systems WHERE system_code = 'AthenaFlow'), 
 'Previous Notes', 'Previous Notes', 
 'date_range', true, false, 
 'From X years ago to recent', 1, true,
 'AthenaFlow Previous Notes with date range (1 year ago to recent)', true)
ON CONFLICT (resource_id) DO NOTHING;

-- AdvancedMD Resources
INSERT INTO ehr_resources (
    resource_id, ehr_system_id, document_type, name, 
    retrieval_method, supports_date_range, supports_single_date, 
    date_parameter_label, description, is_active
) VALUES
('advancedmd-previous-notes', 
 (SELECT id FROM ehr_systems WHERE system_code = 'AdvancedMD'), 
 'Previous Notes', 'Previous Notes', 
 'single_document', false, true, 
 'Document date',
 'AdvancedMD Previous Notes - single document by document date', true),
 
('advancedmd-clinical-documents', 
 (SELECT id FROM ehr_systems WHERE system_code = 'AdvancedMD'), 
 'Clinical Documents', 'Clinical Documents', 
 'single_document', false, true, 
 'Document date',
 'AdvancedMD Clinical Documents - single document by document date', true)
ON CONFLICT (resource_id) DO NOTHING;

-- Charm Resources
INSERT INTO ehr_resources (
    resource_id, ehr_system_id, document_type, name, 
    retrieval_method, supports_date_range, supports_single_date, 
    date_parameter_label, description, is_active
) VALUES
('charm-previous-notes', 
 (SELECT id FROM ehr_systems WHERE system_code = 'Charm'), 
 'Previous Notes', 'Previous Notes', 
 'single_document', false, true, 
 'Document date',
 'Charm Previous Notes - single document by document date', true),
 
('charm-clinical-documents-pdf', 
 (SELECT id FROM ehr_systems WHERE system_code = 'Charm'), 
 'Clinical Documents', 'Clinical Documents PDF', 
 'single_document', false, true, 
 'Document date',
 'Charm Clinical Documents in PDF format - single document by date', true)
ON CONFLICT (resource_id) DO NOTHING;

-- DrChrono Resources
INSERT INTO ehr_resources (
    resource_id, ehr_system_id, document_type, name, 
    retrieval_method, supports_date_range, supports_single_date, 
    date_parameter_label, description, is_active
) VALUES
('drchrono-previous-notes', 
 (SELECT id FROM ehr_systems WHERE system_code = 'DrChrono'), 
 'Previous Notes', 'Previous Notes', 
 'single_document', false, true, 
 'Note date',
 'DrChrono Previous Notes - single document by note date', true)
ON CONFLICT (resource_id) DO NOTHING;

-- Greenway Resources (no date required)
INSERT INTO ehr_resources (
    resource_id, ehr_system_id, document_type, name, 
    retrieval_method, supports_date_range, supports_single_date, 
    description, is_active
) VALUES
('greenway-previous-notes-pdf', 
 (SELECT id FROM ehr_systems WHERE system_code = 'Greenway'), 
 'Previous Notes', 'Previous Notes PDF (CCDA)', 
 'no_date', false, false, 
 'Greenway Previous Notes in PDF (CCDA only) - no date configuration needed', true)
ON CONFLICT (resource_id) DO NOTHING;

