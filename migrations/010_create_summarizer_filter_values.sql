-- Migration: Create Summarizer Filter Values Table
-- Purpose: Store custom filter values for summarizers (overrides defaults)
-- Date: 2026-01-05

CREATE TABLE IF NOT EXISTS summarizer_filter_values (
    id SERIAL PRIMARY KEY,
    summarizer_id INTEGER NOT NULL,
    filter_id INTEGER NOT NULL,
    custom_value TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    -- Foreign Keys
    CONSTRAINT fk_summarizer_filter_values_summarizer 
        FOREIGN KEY (summarizer_id) 
        REFERENCES summarizers(id) 
        ON DELETE CASCADE,
    CONSTRAINT fk_summarizer_filter_values_filter 
        FOREIGN KEY (filter_id) 
        REFERENCES ehr_filter_definitions(id) 
        ON DELETE RESTRICT,
    
    -- Unique Constraint
    CONSTRAINT uq_summarizer_filter UNIQUE (summarizer_id, filter_id)
);

-- Create indices
CREATE INDEX idx_summarizer_filter_values_summarizer ON summarizer_filter_values(summarizer_id);
CREATE INDEX idx_summarizer_filter_values_filter ON summarizer_filter_values(filter_id);

-- Add comments
COMMENT ON TABLE summarizer_filter_values IS 'Custom filter values that override resource defaults for specific summarizers';
COMMENT ON COLUMN summarizer_filter_values.custom_value IS 'Custom value set by ops (overrides default from resource_filters)';

