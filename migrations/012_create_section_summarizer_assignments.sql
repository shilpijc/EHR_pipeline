-- Migration: Create Section Summarizer Assignments Table
-- Purpose: Map summarizers to template sections with actions
-- Date: 2026-01-05

CREATE TABLE IF NOT EXISTS section_summarizer_assignments (
    id SERIAL PRIMARY KEY,
    doctor_id INTEGER NOT NULL,
    summarizer_id INTEGER NOT NULL,
    section_key VARCHAR(100) NOT NULL,
    template VARCHAR(50) NOT NULL CHECK (template IN ('general', 'followup', 'neurology', 'initial')),
    action VARCHAR(20) NOT NULL CHECK (action IN ('append', 'prepend', 'inform')),
    instructions TEXT,
    display_order INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    -- Foreign Keys
    CONSTRAINT fk_section_assignments_doctor 
        FOREIGN KEY (doctor_id) 
        REFERENCES doctors(id) 
        ON DELETE CASCADE,
    CONSTRAINT fk_section_assignments_summarizer 
        FOREIGN KEY (summarizer_id) 
        REFERENCES summarizers(id) 
        ON DELETE CASCADE,
    
    -- Unique Constraint
    CONSTRAINT uq_section_summarizer_assignment UNIQUE (doctor_id, summarizer_id, section_key, template)
);

-- Create indices
CREATE INDEX idx_section_assignments_doctor_section_template ON section_summarizer_assignments(doctor_id, section_key, template);
CREATE INDEX idx_section_assignments_summarizer ON section_summarizer_assignments(summarizer_id);
CREATE INDEX idx_section_assignments_section_key ON section_summarizer_assignments(section_key);

-- Add comments
COMMENT ON TABLE section_summarizer_assignments IS 'Links summarizers to template sections with actions (append, prepend, inform)';
COMMENT ON COLUMN section_summarizer_assignments.section_key IS 'Section identifier from template hierarchy';
COMMENT ON COLUMN section_summarizer_assignments.template IS 'Template type: general, followup, neurology, initial';
COMMENT ON COLUMN section_summarizer_assignments.action IS 'How to use summarizer: append, prepend, or inform';
COMMENT ON COLUMN section_summarizer_assignments.instructions IS 'Optional instructions for inform action';
COMMENT ON COLUMN section_summarizer_assignments.display_order IS 'Order within the same cell';

