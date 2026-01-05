-- Migration: Create Bulk Transfer Jobs table
-- Description: Track bulk copy operations

CREATE TABLE IF NOT EXISTS bulk_transfer_jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    initiated_by VARCHAR(255) NOT NULL COMMENT 'User who started the operation',
    copy_type ENUM('summarizers', 'full', 'templates') NOT NULL,
    source_doctor_ids JSON NOT NULL COMMENT 'Array of source doctor IDs',
    target_doctor_ids JSON NOT NULL COMMENT 'Array of target doctor IDs',
    target_emails JSON NULL COMMENT 'Emails for new doctors',
    selected_summarizer_ids JSON NULL COMMENT 'Summarizers to copy (for summarizers type)',
    resource_mappings JSON NULL COMMENT 'Cross-EHR resource mappings',
    status ENUM('pending', 'in_progress', 'completed', 'failed') NOT NULL DEFAULT 'pending',
    progress INT NOT NULL DEFAULT 0 COMMENT 'Current progress count',
    total INT NOT NULL DEFAULT 0 COMMENT 'Total operations count',
    error_message TEXT NULL COMMENT 'Error details if failed',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    
    INDEX idx_initiated_by (initiated_by),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

