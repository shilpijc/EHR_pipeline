-- Migration: Create EHR Resources Table
-- Purpose: Catalog available EHR resources (data sources) per EHR system
-- Date: 2026-01-05

CREATE TABLE IF NOT EXISTS ehr_resources (
    id SERIAL PRIMARY KEY,
    resource_id VARCHAR(150) UNIQUE NOT NULL,
    ehr_system_id INTEGER NOT NULL,
    document_type VARCHAR(100) NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true NOT NULL,
    
    -- Retrieval Configuration
    retrieval_method VARCHAR(50) NOT NULL CHECK (retrieval_method IN ('date_range', 'single_document', 'document_count', 'no_date')),
    supports_date_range BOOLEAN DEFAULT false NOT NULL,
    supports_single_date BOOLEAN DEFAULT false NOT NULL,
    supports_document_count BOOLEAN DEFAULT false NOT NULL,
    default_lookback_years INTEGER,
    default_lookback_months INTEGER,
    default_lookback_days INTEGER,
    default_to_recent BOOLEAN DEFAULT false,
    default_document_count INTEGER,
    date_parameter_label VARCHAR(100),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    -- Foreign Keys
    CONSTRAINT fk_ehr_resources_ehr_system 
        FOREIGN KEY (ehr_system_id) 
        REFERENCES ehr_systems(id) 
        ON DELETE RESTRICT
);

-- Create indices
CREATE INDEX idx_ehr_resources_ehr_system_id ON ehr_resources(ehr_system_id);
CREATE INDEX idx_ehr_resources_document_type ON ehr_resources(document_type);
CREATE INDEX idx_ehr_resources_resource_id ON ehr_resources(resource_id);
CREATE INDEX idx_ehr_resources_is_active ON ehr_resources(is_active);
CREATE INDEX idx_ehr_resources_ehr_system_active ON ehr_resources(ehr_system_id, is_active);

-- Add comments
COMMENT ON TABLE ehr_resources IS 'Catalog of available EHR data sources per system with retrieval configurations';
COMMENT ON COLUMN ehr_resources.resource_id IS 'Machine-readable identifier (e.g., ecw-previous-notes-xml)';
COMMENT ON COLUMN ehr_resources.retrieval_method IS 'How data is retrieved: date_range, single_document, document_count, or no_date';
COMMENT ON COLUMN ehr_resources.date_parameter_label IS 'UI label for date field (e.g., "Note date", "Document date")';

