-- Migration: Create Summarizers table
-- Description: Store summarizer configurations created by ops team

CREATE TABLE IF NOT EXISTS summarizers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    doctor_id INT NOT NULL,
    ehr_system VARCHAR(50) NOT NULL COMMENT 'EHR system for which summarizer was configured',
    name VARCHAR(255) NOT NULL,
    purpose TEXT COMMENT 'Use case description',
    
    -- Input Methods
    pull_from_ehr BOOLEAN NOT NULL DEFAULT FALSE,
    allow_upload BOOLEAN NOT NULL DEFAULT FALSE,
    allow_text BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- Prompts
    use_separate_prompts BOOLEAN NOT NULL DEFAULT FALSE,
    common_prompt TEXT NULL COMMENT 'Single prompt for all input types',
    ehr_prompt TEXT NULL COMMENT 'Prompt specifically for EHR data',
    upload_prompt TEXT NULL COMMENT 'Prompt for uploaded files',
    text_prompt TEXT NULL COMMENT 'Prompt for text input',
    
    -- EHR Configuration (when pull_from_ehr = true)
    selected_resource_id INT NULL,
    retrieval_config JSON NULL COMMENT 'Retrieval configuration (date ranges, single date, etc.) based on resource retrieval_method',
    
    -- Model Configuration
    primary_model VARCHAR(100) NOT NULL DEFAULT 'claude-3-sonnet',
    fallback_model VARCHAR(100) NOT NULL DEFAULT 'gpt-4-turbo',
    avg_summarization_time INT NOT NULL DEFAULT 60 COMMENT 'Expected processing time in seconds',
    
    -- Pipeline Settings
    active BOOLEAN NOT NULL DEFAULT TRUE,
    depends_on_summarisers JSON NULL COMMENT 'Array of summarizer IDs that must run first',
    
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
    FOREIGN KEY (selected_resource_id) REFERENCES ehr_resources(id) ON DELETE SET NULL,
    
    INDEX idx_doctor_id (doctor_id),
    INDEX idx_ehr_system (ehr_system),
    INDEX idx_active (active),
    INDEX idx_selected_resource_id (selected_resource_id),
    INDEX idx_ehr_system_active (ehr_system, active),
    INDEX idx_doctor_active (doctor_id, active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

