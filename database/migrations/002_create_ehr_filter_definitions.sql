-- Migration: Create EHR Filter Definitions table
-- Description: Global catalog of all possible filters that can be applied to EHR resources

CREATE TABLE IF NOT EXISTS ehr_filter_definitions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    filter_code VARCHAR(100) NOT NULL UNIQUE,
    filter_name VARCHAR(255) NOT NULL,
    data_type ENUM('string', 'integer', 'date', 'boolean', 'comma_separated', 'enum') NOT NULL,
    validation_rules JSON COMMENT 'Validation configuration (regex, min/max, allowed values, etc.)',
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_filter_code (filter_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

