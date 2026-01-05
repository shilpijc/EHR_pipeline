-- Seed Data: EHR Filter Definitions
-- Description: Insert all possible filter types

INSERT INTO ehr_filter_definitions (filter_code, filter_name, data_type, description) VALUES
('organization_ids', 'Organization IDs', 'comma_separated', 'Filter by organization identifiers (AthenaFlow)'),
('template_ids', 'Template IDs', 'string', 'Filter by template identifier (AdvancedMD)'),
('keywords', 'Keywords', 'comma_separated', 'Filter by keywords in document (AthenaOne, AdvancedMD)'),
('visit_types', 'Visit Types', 'string', 'Filter by type of visit (ECW)'),
('document_types', 'Document Types', 'string', 'Filter by document category (AdvancedMD, Charm)'),
('sorting_direction', 'Sorting Direction', 'enum', 'Sort order: ascending or descending (ECW)'),
('file_type', 'File Type', 'string', 'Filter by file format: PDF, XML, etc.');

