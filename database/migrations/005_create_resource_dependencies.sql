-- Migration: Create Resource Dependencies table
-- Description: Track which resources depend on other resources being pulled first

CREATE TABLE IF NOT EXISTS resource_dependencies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    resource_id INT NOT NULL COMMENT 'The resource that has a dependency',
    depends_on_resource_id INT NOT NULL COMMENT 'The resource it depends on',
    dependency_type ENUM('required', 'optional') NOT NULL DEFAULT 'required',
    execution_order INT NOT NULL DEFAULT 1 COMMENT 'Order in which dependencies should be resolved',
    description TEXT COMMENT 'Human-readable explanation of why this dependency exists',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (resource_id) REFERENCES ehr_resources(id) ON DELETE CASCADE,
    FOREIGN KEY (depends_on_resource_id) REFERENCES ehr_resources(id) ON DELETE CASCADE,
    
    UNIQUE KEY unique_resource_dependency (resource_id, depends_on_resource_id),
    INDEX idx_resource_id (resource_id),
    INDEX idx_depends_on_resource_id (depends_on_resource_id),
    INDEX idx_resource_execution_order (resource_id, execution_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

