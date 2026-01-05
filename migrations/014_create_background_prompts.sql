-- Migration: Create Background Prompts Table
-- Purpose: Store background prompts for templates
-- Date: 2026-01-05

CREATE TABLE IF NOT EXISTS background_prompts (
    id SERIAL PRIMARY KEY,
    doctor_id INTEGER,
    template_type VARCHAR(50) NOT NULL,
    prompt_text TEXT NOT NULL,
    is_edited BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    -- Foreign Keys
    CONSTRAINT fk_background_prompts_doctor 
        FOREIGN KEY (doctor_id) 
        REFERENCES doctors(id) 
        ON DELETE CASCADE
);

-- Create indices
CREATE INDEX idx_background_prompts_doctor ON background_prompts(doctor_id);
CREATE INDEX idx_background_prompts_template_type ON background_prompts(template_type);

-- Add comments
COMMENT ON TABLE background_prompts IS 'Background prompts for template types (can be global or doctor-specific)';
COMMENT ON COLUMN background_prompts.doctor_id IS 'Doctor ID (NULL for global prompts)';
COMMENT ON COLUMN background_prompts.template_type IS 'Template identifier (e.g., general, followup)';
COMMENT ON COLUMN background_prompts.is_edited IS 'Whether this prompt was modified from default';

