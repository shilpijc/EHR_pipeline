-- Migration: Create Summarizer Variables table
-- Description: Store variables extracted by summarizers

CREATE TABLE IF NOT EXISTS summarizer_variables (
    id INT AUTO_INCREMENT PRIMARY KEY,
    summarizer_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    extraction_method ENUM('section_import', 'llm_query') NOT NULL,
    selected_section VARCHAR(255) NULL COMMENT 'Section key if extraction_method = section_import',
    llm_query TEXT NULL COMMENT 'Query text if extraction_method = llm_query',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (summarizer_id) REFERENCES summarizers(id) ON DELETE CASCADE,
    
    INDEX idx_summarizer_id (summarizer_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

