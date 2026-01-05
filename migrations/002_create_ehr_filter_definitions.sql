-- Migration: Create EHR Filter Definitions Table
-- Purpose: Global catalog of all possible filters for EHR resources
-- Date: 2026-01-05

CREATE TABLE IF NOT EXISTS ehr_filter_definitions (
    id SERIAL PRIMARY KEY,
    filter_code VARCHAR(100) UNIQUE NOT NULL,
    filter_name VARCHAR(150) NOT NULL,
    data_type VARCHAR(50) NOT NULL CHECK (data_type IN ('string', 'integer', 'date', 'boolean', 'comma_separated', 'enum')),
    validation_rules JSONB,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create indices
CREATE INDEX idx_ehr_filter_definitions_filter_code ON ehr_filter_definitions(filter_code);

-- Add comments
COMMENT ON TABLE ehr_filter_definitions IS 'Master dictionary of all possible filters that can be applied to EHR resources';
COMMENT ON COLUMN ehr_filter_definitions.filter_code IS 'Machine-readable code (e.g., organization_ids, keywords)';
COMMENT ON COLUMN ehr_filter_definitions.filter_name IS 'Human-readable name (e.g., Organization IDs, Keywords)';
COMMENT ON COLUMN ehr_filter_definitions.data_type IS 'Data type for validation';
COMMENT ON COLUMN ehr_filter_definitions.validation_rules IS 'JSON validation rules (regex, min/max, etc.)';

-- Seed common filter types
INSERT INTO ehr_filter_definitions (filter_code, filter_name, data_type, description) VALUES
('organization_ids', 'Organization IDs', 'comma_separated', 'Filter by organization identifiers (comma-separated list)'),
('template_ids', 'Template IDs', 'string', 'Filter by template identifier'),
('keywords', 'Keywords', 'comma_separated', 'Filter by keywords in document content (comma-separated list)'),
('visit_types', 'Visit Types', 'string', 'Filter by type of visit (e.g., Follow-up, Initial)'),
('document_types', 'Document Types', 'string', 'Filter by document category'),
('sorting_direction', 'Sorting Direction', 'enum', 'Sort order (ascending or descending)'),
('file_type', 'File Type', 'string', 'Filter by file format (PDF, XML, etc.)')
ON CONFLICT (filter_code) DO NOTHING;

