-- Migration: Create Audit Log Table
-- Purpose: Track all changes to summarizers and configurations
-- Date: 2026-01-05

CREATE TABLE IF NOT EXISTS audit_log (
    id SERIAL PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL,
    entity_id INTEGER NOT NULL,
    action VARCHAR(50) NOT NULL CHECK (action IN ('created', 'updated', 'deleted', 'activated', 'deactivated')),
    changed_by VARCHAR(255) NOT NULL,
    old_values JSONB,
    new_values JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create indices
CREATE INDEX idx_audit_log_entity_type ON audit_log(entity_type);
CREATE INDEX idx_audit_log_entity_id ON audit_log(entity_id);
CREATE INDEX idx_audit_log_created_at ON audit_log(created_at);
CREATE INDEX idx_audit_log_changed_by ON audit_log(changed_by);
CREATE INDEX idx_audit_log_entity_type_id ON audit_log(entity_type, entity_id);

-- Add comments
COMMENT ON TABLE audit_log IS 'Audit trail for all changes to critical entities';
COMMENT ON COLUMN audit_log.entity_type IS 'Type of entity changed (e.g., summarizer, section_assignment, prompt)';
COMMENT ON COLUMN audit_log.entity_id IS 'ID of the entity that was changed';
COMMENT ON COLUMN audit_log.action IS 'Action performed: created, updated, deleted, activated, deactivated';
COMMENT ON COLUMN audit_log.changed_by IS 'User who made the change';
COMMENT ON COLUMN audit_log.old_values IS 'JSON snapshot of values before change';
COMMENT ON COLUMN audit_log.new_values IS 'JSON snapshot of values after change';

