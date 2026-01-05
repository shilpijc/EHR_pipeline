-- Migration: Create Audit Log table
-- Description: Track all changes to summarizers and configurations

CREATE TABLE IF NOT EXISTS audit_log (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    entity_type VARCHAR(100) NOT NULL COMMENT 'summarizer, section_assignment, prompt, etc.',
    entity_id INT NOT NULL COMMENT 'ID of modified entity',
    action ENUM('created', 'updated', 'deleted', 'activated', 'deactivated') NOT NULL,
    changed_by VARCHAR(255) NOT NULL COMMENT 'User who made the change',
    old_values JSON NULL COMMENT 'Previous values',
    new_values JSON NULL COMMENT 'New values',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_entity_type (entity_type),
    INDEX idx_entity_id (entity_id),
    INDEX idx_entity_type_id (entity_type, entity_id),
    INDEX idx_created_at (created_at),
    INDEX idx_changed_by (changed_by)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

