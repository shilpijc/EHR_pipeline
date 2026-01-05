-- Migration: Create Summarizers Table
-- Purpose: Store summarizer configurations created by ops team
-- Date: 2026-01-05

CREATE TABLE IF NOT EXISTS summarizers (
    id SERIAL PRIMARY KEY,
    doctor_id INTEGER NOT NULL,
    ehr_system VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    purpose TEXT,
    
    -- Input Methods
    pull_from_ehr BOOLEAN DEFAULT false NOT NULL,
    allow_upload BOOLEAN DEFAULT false NOT NULL,
    allow_text BOOLEAN DEFAULT false NOT NULL,
    
    -- Prompts
    use_separate_prompts BOOLEAN DEFAULT false NOT NULL,
    common_prompt TEXT,
    ehr_prompt TEXT,
    upload_prompt TEXT,
    text_prompt TEXT,
    
    -- EHR Configuration (when pull_from_ehr = true)
    selected_resource_id INTEGER,
    retrieval_config JSONB,
    
    -- Model Configuration
    primary_model VARCHAR(100) DEFAULT 'claude-3-sonnet' NOT NULL,
    fallback_model VARCHAR(100) DEFAULT 'gpt-4-turbo' NOT NULL,
    avg_summarization_time INTEGER DEFAULT 60 NOT NULL,
    
    -- Pipeline Settings
    active BOOLEAN DEFAULT true NOT NULL,
    depends_on_summarisers JSONB DEFAULT '[]'::jsonb,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    -- Foreign Keys
    CONSTRAINT fk_summarizers_doctor 
        FOREIGN KEY (doctor_id) 
        REFERENCES doctors(id) 
        ON DELETE CASCADE,
    CONSTRAINT fk_summarizers_resource 
        FOREIGN KEY (selected_resource_id) 
        REFERENCES ehr_resources(id) 
        ON DELETE RESTRICT,
    
    -- Check constraints
    CONSTRAINT chk_at_least_one_input_method 
        CHECK (pull_from_ehr = true OR allow_upload = true OR allow_text = true),
    CONSTRAINT chk_prompts_configuration 
        CHECK (
            (use_separate_prompts = false AND common_prompt IS NOT NULL) OR
            (use_separate_prompts = true)
        )
);

-- Create indices
CREATE INDEX idx_summarizers_doctor_id ON summarizers(doctor_id);
CREATE INDEX idx_summarizers_ehr_system ON summarizers(ehr_system);
CREATE INDEX idx_summarizers_active ON summarizers(active);
CREATE INDEX idx_summarizers_selected_resource ON summarizers(selected_resource_id);
CREATE INDEX idx_summarizers_ehr_system_active ON summarizers(ehr_system, active);
CREATE INDEX idx_summarizers_doctor_active ON summarizers(doctor_id, active);

-- Add comments
COMMENT ON TABLE summarizers IS 'Summarizer configurations with input methods, prompts, and pipeline settings';
COMMENT ON COLUMN summarizers.ehr_system IS 'EHR system for which summarizer was configured (stored directly for performance)';
COMMENT ON COLUMN summarizers.retrieval_config IS 'JSON config for data retrieval (structure depends on resource retrieval_method)';
COMMENT ON COLUMN summarizers.depends_on_summarisers IS 'JSON array of summarizer IDs that must run first';
COMMENT ON COLUMN summarizers.use_separate_prompts IS 'If false, use common_prompt for all inputs; if true, use specific prompts';

