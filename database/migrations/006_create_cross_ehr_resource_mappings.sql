-- Migration: Create Cross-EHR Resource Mappings table
-- Description: Track equivalent resources across different EHR systems (for bulk transfer)

CREATE TABLE IF NOT EXISTS cross_ehr_resource_mappings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    source_resource_id INT NOT NULL COMMENT 'Resource from source EHR',
    target_resource_id INT NOT NULL COMMENT 'Equivalent resource in target EHR',
    mapping_quality ENUM('exact', 'approximate', 'manual_required') NOT NULL DEFAULT 'approximate',
    confidence_score DECIMAL(3,2) NOT NULL DEFAULT 0.50 COMMENT 'Confidence 0.0-1.0',
    notes TEXT COMMENT 'Human-readable notes about the mapping',
    created_by VARCHAR(255) NULL COMMENT 'User who created/verified the mapping',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (source_resource_id) REFERENCES ehr_resources(id) ON DELETE CASCADE,
    FOREIGN KEY (target_resource_id) REFERENCES ehr_resources(id) ON DELETE CASCADE,
    
    UNIQUE KEY unique_resource_mapping (source_resource_id, target_resource_id),
    INDEX idx_source_resource_id (source_resource_id),
    INDEX idx_target_resource_id (target_resource_id),
    INDEX idx_mapping_quality (mapping_quality),
    
    CHECK (source_resource_id != target_resource_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

