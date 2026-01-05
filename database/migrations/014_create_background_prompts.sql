-- Migration: Create Background Prompts table
-- Description: Store background prompts for templates

CREATE TABLE IF NOT EXISTS background_prompts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    doctor_id INT NULL COMMENT 'Doctor-specific prompt, NULL for global',
    template_type VARCHAR(100) NOT NULL COMMENT 'Template identifier: general, followup, etc.',
    prompt_text TEXT NOT NULL,
    is_edited BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Flag if modified from default',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
    
    INDEX idx_doctor_template (doctor_id, template_type),
    INDEX idx_template_type (template_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

