-- Migration: Create Summarizer Filter Values table
-- Description: Store custom filter values for summarizers (overrides defaults from resource_filters)

CREATE TABLE IF NOT EXISTS summarizer_filter_values (
    id INT AUTO_INCREMENT PRIMARY KEY,
    summarizer_id INT NOT NULL,
    filter_id INT NOT NULL,
    custom_value TEXT NULL COMMENT 'Custom value set by ops (overrides default from resource_filters)',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (summarizer_id) REFERENCES summarizers(id) ON DELETE CASCADE,
    FOREIGN KEY (filter_id) REFERENCES ehr_filter_definitions(id) ON DELETE RESTRICT,
    
    UNIQUE KEY unique_summarizer_filter (summarizer_id, filter_id),
    INDEX idx_summarizer_id (summarizer_id),
    INDEX idx_filter_id (filter_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

