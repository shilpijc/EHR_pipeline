-- Migration: Create EHR Systems table
-- Description: Master catalog of supported EHR systems

CREATE TABLE IF NOT EXISTS ehr_systems (
    id INT AUTO_INCREMENT PRIMARY KEY,
    system_code VARCHAR(50) NOT NULL UNIQUE,
    system_name VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    configuration JSON,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_system_code (system_code),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

