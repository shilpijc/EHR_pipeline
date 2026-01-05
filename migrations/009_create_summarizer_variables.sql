-- Migration: Create Summarizer Variables Table
-- Purpose: Store variables extracted by summarizers
-- Date: 2026-01-05

CREATE TABLE IF NOT EXISTS summarizer_variables (
    id SERIAL PRIMARY KEY,
    summarizer_id INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    extraction_method VARCHAR(50) NOT NULL CHECK (extraction_method IN ('section_import', 'llm_query')),
    selected_section VARCHAR(255),
    llm_query TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    -- Foreign Keys
    CONSTRAINT fk_summarizer_variables_summarizer 
        FOREIGN KEY (summarizer_id) 
        REFERENCES summarizers(id) 
        ON DELETE CASCADE,
    
    -- Check constraints
    CONSTRAINT chk_section_import_has_section 
        CHECK (extraction_method != 'section_import' OR selected_section IS NOT NULL),
    CONSTRAINT chk_llm_query_has_query 
        CHECK (extraction_method != 'llm_query' OR llm_query IS NOT NULL)
);

-- Create indices
CREATE INDEX idx_summarizer_variables_summarizer_id ON summarizer_variables(summarizer_id);

-- Add comments
COMMENT ON TABLE summarizer_variables IS 'Variables that can be extracted from summarizer outputs';
COMMENT ON COLUMN summarizer_variables.extraction_method IS 'How to extract: section_import (from template section) or llm_query (LLM extraction)';
COMMENT ON COLUMN summarizer_variables.selected_section IS 'Section key when using section_import method';
COMMENT ON COLUMN summarizer_variables.llm_query IS 'Query text when using llm_query method';

