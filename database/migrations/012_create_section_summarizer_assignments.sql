-- Migration: Create Section Summarizer Assignments table
-- Description: Map summarizers to template sections with actions

CREATE TABLE IF NOT EXISTS section_summarizer_assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    doctor_id INT NOT NULL,
    summarizer_id INT NOT NULL,
    section_key VARCHAR(255) NOT NULL,
    template VARCHAR(100) NOT NULL COMMENT 'Template type: general, followup, neurology, initial',
    action ENUM('append', 'prepend', 'inform') NOT NULL,
    instructions TEXT NULL COMMENT 'Optional instructions for inform action',
    display_order INT NOT NULL DEFAULT 0 COMMENT 'Order within cell',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
    FOREIGN KEY (summarizer_id) REFERENCES summarizers(id) ON DELETE CASCADE,
    
    UNIQUE KEY unique_doctor_summarizer_section_template (doctor_id, summarizer_id, section_key, template),
    INDEX idx_doctor_section_template (doctor_id, section_key, template),
    INDEX idx_summarizer_id (summarizer_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

