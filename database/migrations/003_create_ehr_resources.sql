-- Migration: Create EHR Resources table
-- Description: Catalog available EHR resources (data sources) per EHR system

CREATE TABLE IF NOT EXISTS ehr_resources (
    id INT AUTO_INCREMENT PRIMARY KEY,
    resource_id VARCHAR(255) NOT NULL UNIQUE,
    ehr_system_id INT NOT NULL,
    document_type VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    
    -- Retrieval Configuration
    retrieval_method ENUM('date_range', 'single_document', 'document_count', 'no_date') NOT NULL,
    supports_date_range BOOLEAN NOT NULL DEFAULT FALSE,
    supports_single_date BOOLEAN NOT NULL DEFAULT FALSE,
    supports_document_count BOOLEAN NOT NULL DEFAULT FALSE,
    default_lookback_years INT NULL,
    default_lookback_months INT NULL,
    default_lookback_days INT NULL,
    default_to_recent BOOLEAN DEFAULT FALSE,
    default_document_count INT NULL,
    date_parameter_label VARCHAR(255) NULL COMMENT 'UI label for date field (e.g., Note date, Document date)',
    
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (ehr_system_id) REFERENCES ehr_systems(id) ON DELETE RESTRICT,
    
    INDEX idx_ehr_system_id (ehr_system_id),
    INDEX idx_document_type (document_type),
    INDEX idx_resource_id (resource_id),
    INDEX idx_is_active (is_active),
    INDEX idx_ehr_system_active (ehr_system_id, is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

