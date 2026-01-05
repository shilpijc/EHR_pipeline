-- Seed Data: EHR Resources
-- Description: Insert all EHR resources with retrieval configurations

-- ECW Resources
INSERT INTO ehr_resources 
(resource_id, ehr_system_id, document_type, name, retrieval_method, supports_date_range, supports_single_date, date_parameter_label, default_lookback_years, default_lookback_days, default_to_recent, is_active)
VALUES
('ecw-previous-notes-xml', 
 (SELECT id FROM ehr_systems WHERE system_code = 'ECW'), 
 'Previous Notes', 
 'Previous Notes XML', 
 'date_range', 
 TRUE, 
 FALSE, 
 'From X to Y', 
 3, 
 3, 
 FALSE, 
 TRUE);

-- AthenaOne Resources  
INSERT INTO ehr_resources 
(resource_id, ehr_system_id, document_type, name, retrieval_method, supports_date_range, supports_single_date, date_parameter_label, is_active)
VALUES
('athenaone-previous-notes-pdf', 
 (SELECT id FROM ehr_systems WHERE system_code = 'AthenaOne'), 
 'Previous Notes', 
 'Previous Notes PDF', 
 'single_document', 
 FALSE, 
 TRUE, 
 'Note date', 
 TRUE),
 
('athenaone-lab-results-pdf', 
 (SELECT id FROM ehr_systems WHERE system_code = 'AthenaOne'), 
 'Lab Results', 
 'Lab Results PDF', 
 'single_document', 
 FALSE, 
 TRUE, 
 'Lab date', 
 TRUE),
 
('athenaone-clinical-documents-pdf', 
 (SELECT id FROM ehr_systems WHERE system_code = 'AthenaOne'), 
 'Clinical Documents', 
 'Clinical Documents PDF', 
 'single_document', 
 FALSE, 
 TRUE, 
 'Document date', 
 TRUE),
 
('athenaone-clinical-documents-xml', 
 (SELECT id FROM ehr_systems WHERE system_code = 'AthenaOne'), 
 'Clinical Documents', 
 'Clinical Documents XML', 
 'single_document', 
 FALSE, 
 TRUE, 
 'Document date', 
 TRUE),
 
('athenaone-imaging-results', 
 (SELECT id FROM ehr_systems WHERE system_code = 'AthenaOne'), 
 'Imaging Results', 
 'Imaging Results', 
 'single_document', 
 FALSE, 
 TRUE, 
 'Imaging date', 
 TRUE),
 
('athenaone-problems-list', 
 (SELECT id FROM ehr_systems WHERE system_code = 'AthenaOne'), 
 'Problems List', 
 'Problems List', 
 'single_document', 
 FALSE, 
 TRUE, 
 'Note date', 
 TRUE);

-- AthenaFlow Resources
INSERT INTO ehr_resources 
(resource_id, ehr_system_id, document_type, name, retrieval_method, supports_date_range, supports_single_date, date_parameter_label, default_lookback_years, default_to_recent, is_active)
VALUES
('athenaflow-previous-notes', 
 (SELECT id FROM ehr_systems WHERE system_code = 'AthenaFlow'), 
 'Previous Notes', 
 'Previous Notes', 
 'date_range', 
 TRUE, 
 FALSE, 
 'From X to recent', 
 1, 
 TRUE, 
 TRUE);

-- AdvancedMD Resources
INSERT INTO ehr_resources 
(resource_id, ehr_system_id, document_type, name, retrieval_method, supports_date_range, supports_single_date, date_parameter_label, is_active)
VALUES
('advancedmd-previous-notes', 
 (SELECT id FROM ehr_systems WHERE system_code = 'AdvancedMD'), 
 'Previous Notes', 
 'Previous Notes', 
 'single_document', 
 FALSE, 
 TRUE, 
 'Document date', 
 TRUE),
 
('advancedmd-clinical-documents', 
 (SELECT id FROM ehr_systems WHERE system_code = 'AdvancedMD'), 
 'Clinical Documents', 
 'Clinical Documents', 
 'single_document', 
 FALSE, 
 TRUE, 
 'Document date', 
 TRUE);

-- Charm Resources
INSERT INTO ehr_resources 
(resource_id, ehr_system_id, document_type, name, retrieval_method, supports_date_range, supports_single_date, date_parameter_label, is_active)
VALUES
('charm-previous-notes', 
 (SELECT id FROM ehr_systems WHERE system_code = 'Charm'), 
 'Previous Notes', 
 'Previous Notes', 
 'single_document', 
 FALSE, 
 TRUE, 
 'Document date', 
 TRUE),
 
('charm-clinical-documents-pdf', 
 (SELECT id FROM ehr_systems WHERE system_code = 'Charm'), 
 'Clinical Documents', 
 'Clinical Documents PDF', 
 'single_document', 
 FALSE, 
 TRUE, 
 'Document date', 
 TRUE);

-- DrChrono Resources
INSERT INTO ehr_resources 
(resource_id, ehr_system_id, document_type, name, retrieval_method, supports_date_range, supports_single_date, date_parameter_label, is_active)
VALUES
('drchrono-previous-notes', 
 (SELECT id FROM ehr_systems WHERE system_code = 'DrChrono'), 
 'Previous Notes', 
 'Previous Notes', 
 'single_document', 
 FALSE, 
 TRUE, 
 'Note date', 
 TRUE);

-- Greenway Resources
INSERT INTO ehr_resources 
(resource_id, ehr_system_id, document_type, name, retrieval_method, supports_date_range, supports_single_date, is_active, description)
VALUES
('greenway-previous-notes-pdf', 
 (SELECT id FROM ehr_systems WHERE system_code = 'Greenway'), 
 'Previous Notes', 
 'Previous Notes PDF (CCDA)', 
 'no_date', 
 FALSE, 
 FALSE, 
 TRUE,
 'Pulls most recent CCDA document, no date selection required');

