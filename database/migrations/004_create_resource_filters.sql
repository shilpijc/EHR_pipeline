-- Migration: Create Resource Filters table
-- Description: Map which filters are available for which resources with default values

CREATE TABLE IF NOT EXISTS resource_filters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    resource_id INT NOT NULL,
    filter_id INT NOT NULL,
    default_value TEXT NULL COMMENT 'Default value for this filter on this resource',
    is_required BOOLEAN NOT NULL DEFAULT FALSE,
    is_editable BOOLEAN NOT NULL DEFAULT TRUE COMMENT 'Can ops modify this filter',
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (resource_id) REFERENCES ehr_resources(id) ON DELETE CASCADE,
    FOREIGN KEY (filter_id) REFERENCES ehr_filter_definitions(id) ON DELETE RESTRICT,
    
    UNIQUE KEY unique_resource_filter (resource_id, filter_id),
    INDEX idx_resource_id (resource_id),
    INDEX idx_filter_id (filter_id),
    INDEX idx_resource_display_order (resource_id, display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

