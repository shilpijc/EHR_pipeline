-- Migration: Create Template Sections Table
-- Purpose: Store template hierarchy (sections, subsections, sub-subsections)
-- Date: 2026-01-05

CREATE TABLE IF NOT EXISTS template_sections (
    id SERIAL PRIMARY KEY,
    section_key VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    parent_id INTEGER,
    level VARCHAR(20) NOT NULL CHECK (level IN ('parent', 'child', 'grandchild')),
    is_custom BOOLEAN DEFAULT false NOT NULL,
    display_order INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    -- Foreign Key (self-referencing for hierarchy)
    CONSTRAINT fk_template_sections_parent 
        FOREIGN KEY (parent_id) 
        REFERENCES template_sections(id) 
        ON DELETE CASCADE
);

-- Create indices
CREATE INDEX idx_template_sections_section_key ON template_sections(section_key);
CREATE INDEX idx_template_sections_parent_id ON template_sections(parent_id);
CREATE INDEX idx_template_sections_is_custom ON template_sections(is_custom);
CREATE INDEX idx_template_sections_display_order ON template_sections(display_order);

-- Add comments
COMMENT ON TABLE template_sections IS 'Hierarchical template structure with parent-child-grandchild relationships';
COMMENT ON COLUMN template_sections.section_key IS 'Machine-readable key for the section';
COMMENT ON COLUMN template_sections.level IS 'Hierarchy level: parent, child, or grandchild';
COMMENT ON COLUMN template_sections.is_custom IS 'Whether this is a user-created section';
COMMENT ON COLUMN template_sections.display_order IS 'Sort order for display';

