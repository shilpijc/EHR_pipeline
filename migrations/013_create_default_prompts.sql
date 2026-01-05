-- Migration: Create Default Prompts Table
-- Purpose: Store default prompts per EHR + Document Type combination
-- Date: 2026-01-05

CREATE TABLE IF NOT EXISTS default_prompts (
    id SERIAL PRIMARY KEY,
    ehr_system VARCHAR(50) NOT NULL,
    document_type VARCHAR(100) NOT NULL,
    prompt_text TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    -- Unique Constraint
    CONSTRAINT uq_default_prompt_ehr_doctype UNIQUE (ehr_system, document_type)
);

-- Create indices
CREATE INDEX idx_default_prompts_ehr_doctype ON default_prompts(ehr_system, document_type);

-- Add comments
COMMENT ON TABLE default_prompts IS 'Default prompts for each EHR system + document type combination';
COMMENT ON COLUMN default_prompts.ehr_system IS 'EHR system name (e.g., ECW, AthenaOne)';
COMMENT ON COLUMN default_prompts.document_type IS 'Document type (e.g., Previous Notes, Lab Results)';
COMMENT ON COLUMN default_prompts.prompt_text IS 'Default prompt content for this combination';

