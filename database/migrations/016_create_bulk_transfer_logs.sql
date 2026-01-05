-- Migration: Create Bulk Transfer Logs table
-- Description: Detailed logs for bulk operations

CREATE TABLE IF NOT EXISTS bulk_transfer_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_id INT NOT NULL,
    source_doctor_id INT NULL,
    target_doctor_id INT NULL,
    summarizer_id INT NULL,
    status ENUM('success', 'failed') NOT NULL,
    details JSON NULL COMMENT 'Operation details',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (job_id) REFERENCES bulk_transfer_jobs(id) ON DELETE CASCADE,
    
    INDEX idx_job_id (job_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

