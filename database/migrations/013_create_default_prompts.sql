-- Migration: Create Default Prompts table
-- Description: Store default prompts per EHR + Document Type combination

CREATE TABLE IF NOT EXISTS default_prompts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ehr_system VARCHAR(50) NOT NULL,
    document_type VARCHAR(255) NOT NULL,
    prompt_text TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_ehr_document_type (ehr_system, document_type),
    INDEX idx_ehr_document_type (ehr_system, document_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

