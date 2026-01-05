-- Migration: Create Doctors table
-- Description: Store doctor profiles and their EHR system information

CREATE TABLE IF NOT EXISTS doctors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    ehr_system VARCHAR(50) NOT NULL COMMENT 'Current EHR system doctor uses',
    specialty VARCHAR(255) NULL,
    practice VARCHAR(255) NULL COMMENT 'Practice name/group',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_ehr_system (ehr_system),
    INDEX idx_practice (practice)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

