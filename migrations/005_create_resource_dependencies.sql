-- Migration: Create Resource Dependencies Table
-- Purpose: Track which resources depend on other resources being pulled first
-- Date: 2026-01-05

CREATE TABLE IF NOT EXISTS resource_dependencies (
    id SERIAL PRIMARY KEY,
    resource_id INTEGER NOT NULL,
    depends_on_resource_id INTEGER NOT NULL,
    dependency_type VARCHAR(20) NOT NULL CHECK (dependency_type IN ('required', 'optional')),
    execution_order INTEGER DEFAULT 1 NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    -- Foreign Keys (self-referencing)
    CONSTRAINT fk_resource_dependencies_resource 
        FOREIGN KEY (resource_id) 
        REFERENCES ehr_resources(id) 
        ON DELETE CASCADE,
    CONSTRAINT fk_resource_dependencies_depends_on 
        FOREIGN KEY (depends_on_resource_id) 
        REFERENCES ehr_resources(id) 
        ON DELETE CASCADE,
    
    -- Unique Constraint
    CONSTRAINT uq_resource_dependency UNIQUE (resource_id, depends_on_resource_id),
    
    -- Check constraint to prevent self-dependency
    CONSTRAINT chk_no_self_dependency CHECK (resource_id != depends_on_resource_id)
);

-- Create indices
CREATE INDEX idx_resource_dependencies_resource_id ON resource_dependencies(resource_id);
CREATE INDEX idx_resource_dependencies_depends_on ON resource_dependencies(depends_on_resource_id);
CREATE INDEX idx_resource_dependencies_resource_exec_order ON resource_dependencies(resource_id, execution_order);

-- Add comments
COMMENT ON TABLE resource_dependencies IS 'Defines which EHR resources depend on others (e.g., Clinical Documents depends on Previous Notes)';
COMMENT ON COLUMN resource_dependencies.resource_id IS 'The resource that has a dependency';
COMMENT ON COLUMN resource_dependencies.depends_on_resource_id IS 'The resource it depends on';
COMMENT ON COLUMN resource_dependencies.dependency_type IS 'Whether dependency is required or optional';
COMMENT ON COLUMN resource_dependencies.execution_order IS 'Order in which dependencies should be resolved';

