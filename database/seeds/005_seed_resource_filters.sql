-- Seed Data: Resource Filters
-- Description: Map filters to resources with default values

-- ECW Previous Notes Filters
INSERT INTO resource_filters (resource_id, filter_id, default_value, is_required, is_editable, display_order)
VALUES
-- Visit Types filter
((SELECT id FROM ehr_resources WHERE resource_id = 'ecw-previous-notes-xml'),
 (SELECT id FROM ehr_filter_definitions WHERE filter_code = 'visit_types'),
 'Follow-up',
 FALSE,
 TRUE,
 1),

-- Sorting Direction filter
((SELECT id FROM ehr_resources WHERE resource_id = 'ecw-previous-notes-xml'),
 (SELECT id FROM ehr_filter_definitions WHERE filter_code = 'sorting_direction'),
 'descending',
 FALSE,
 TRUE,
 2);

-- AthenaOne Clinical Documents (PDF) Filters
INSERT INTO resource_filters (resource_id, filter_id, default_value, is_required, is_editable, display_order)
VALUES
-- Keywords filter
((SELECT id FROM ehr_resources WHERE resource_id = 'athenaone-clinical-documents-pdf'),
 (SELECT id FROM ehr_filter_definitions WHERE filter_code = 'keywords'),
 'cardiology',
 FALSE,
 TRUE,
 1);

-- AthenaFlow Previous Notes Filters
INSERT INTO resource_filters (resource_id, filter_id, default_value, is_required, is_editable, display_order)
VALUES
-- Organization IDs filter
((SELECT id FROM ehr_resources WHERE resource_id = 'athenaflow-previous-notes'),
 (SELECT id FROM ehr_filter_definitions WHERE filter_code = 'organization_ids'),
 NULL,
 FALSE,
 TRUE,
 1);

-- AdvancedMD Previous Notes Filters
INSERT INTO resource_filters (resource_id, filter_id, default_value, is_required, is_editable, display_order)
VALUES
-- Template IDs filter
((SELECT id FROM ehr_resources WHERE resource_id = 'advancedmd-previous-notes'),
 (SELECT id FROM ehr_filter_definitions WHERE filter_code = 'template_ids'),
 NULL,
 FALSE,
 TRUE,
 1);

-- AdvancedMD Clinical Documents Filters
INSERT INTO resource_filters (resource_id, filter_id, default_value, is_required, is_editable, display_order)
VALUES
-- Document Types filter
((SELECT id FROM ehr_resources WHERE resource_id = 'advancedmd-clinical-documents'),
 (SELECT id FROM ehr_filter_definitions WHERE filter_code = 'document_types'),
 NULL,
 FALSE,
 TRUE,
 1),

-- Keywords filter
((SELECT id FROM ehr_resources WHERE resource_id = 'advancedmd-clinical-documents'),
 (SELECT id FROM ehr_filter_definitions WHERE filter_code = 'keywords'),
 NULL,
 FALSE,
 TRUE,
 2);

