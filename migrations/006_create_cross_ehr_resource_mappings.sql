-- Migration: Create Cross-EHR Resource Mappings Table
-- Purpose: Track equivalent resources across different EHR systems for bulk transfer
-- Date: 2026-01-05

CREATE TABLE IF NOT EXISTS cross_ehr_resource_mappings (
    id SERIAL PRIMARY KEY,
    source_resource_id INTEGER NOT NULL,
    target_resource_id INTEGER NOT NULL,
    mapping_quality VARCHAR(20) NOT NULL CHECK (mapping_quality IN ('exact', 'approximate', 'manual_required')),
    confidence_score DECIMAL(3,2) CHECK (confidence_score BETWEEN 0.0 AND 1.0),
    notes TEXT,
    created_by VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    -- Foreign Keys
    CONSTRAINT fk_cross_ehr_mappings_source 
        FOREIGN KEY (source_resource_id) 
        REFERENCES ehr_resources(id) 
        ON DELETE CASCADE,
    CONSTRAINT fk_cross_ehr_mappings_target 
        FOREIGN KEY (target_resource_id) 
        REFERENCES ehr_resources(id) 
        ON DELETE CASCADE,
    
    -- Unique Constraint
    CONSTRAINT uq_cross_ehr_mapping UNIQUE (source_resource_id, target_resource_id)
);

-- Create indices
CREATE INDEX idx_cross_ehr_mappings_source ON cross_ehr_resource_mappings(source_resource_id);
CREATE INDEX idx_cross_ehr_mappings_target ON cross_ehr_resource_mappings(target_resource_id);
CREATE INDEX idx_cross_ehr_mappings_quality ON cross_ehr_resource_mappings(mapping_quality);

-- Add comments
COMMENT ON TABLE cross_ehr_resource_mappings IS 'Maps equivalent resources across different EHR systems (e.g., ECW Previous Notes → AthenaOne Previous Notes)';
COMMENT ON COLUMN cross_ehr_resource_mappings.mapping_quality IS 'Quality of mapping: exact, approximate, or manual_required';
COMMENT ON COLUMN cross_ehr_resource_mappings.confidence_score IS 'Confidence score from 0.0 to 1.0';

