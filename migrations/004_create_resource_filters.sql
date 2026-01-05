-- Migration: Create Resource Filters Table
-- Purpose: Map which filters are available for which resources with default values
-- Date: 2026-01-05

CREATE TABLE IF NOT EXISTS resource_filters (
    id SERIAL PRIMARY KEY,
    resource_id INTEGER NOT NULL,
    filter_id INTEGER NOT NULL,
    default_value TEXT,
    is_required BOOLEAN DEFAULT false NOT NULL,
    is_editable BOOLEAN DEFAULT true NOT NULL,
    display_order INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    -- Foreign Keys
    CONSTRAINT fk_resource_filters_resource 
        FOREIGN KEY (resource_id) 
        REFERENCES ehr_resources(id) 
        ON DELETE CASCADE,
    CONSTRAINT fk_resource_filters_filter 
        FOREIGN KEY (filter_id) 
        REFERENCES ehr_filter_definitions(id) 
        ON DELETE RESTRICT,
    
    -- Unique Constraint
    CONSTRAINT uq_resource_filter UNIQUE (resource_id, filter_id)
);

-- Create indices
CREATE INDEX idx_resource_filters_resource_id ON resource_filters(resource_id);
CREATE INDEX idx_resource_filters_filter_id ON resource_filters(filter_id);
CREATE INDEX idx_resource_filters_resource_display_order ON resource_filters(resource_id, display_order);

-- Add comments
COMMENT ON TABLE resource_filters IS 'Links filters to resources with default values and configuration';
COMMENT ON COLUMN resource_filters.default_value IS 'Default value for this filter on this resource';
COMMENT ON COLUMN resource_filters.is_required IS 'Whether this filter must be provided';
COMMENT ON COLUMN resource_filters.is_editable IS 'Whether ops can modify this filter value';
COMMENT ON COLUMN resource_filters.display_order IS 'Order in which filters should be displayed in UI';

