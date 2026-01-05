-- Migration: Create Template Sections table
-- Description: Store template hierarchy (sections, subsections, sub-subsections)

CREATE TABLE IF NOT EXISTS template_sections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    section_key VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    parent_id INT NULL COMMENT 'Self-referencing for hierarchy',
    level ENUM('parent', 'child', 'grandchild') NOT NULL,
    is_custom BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Flag for user-created sections',
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (parent_id) REFERENCES template_sections(id) ON DELETE CASCADE,
    
    INDEX idx_section_key (section_key),
    INDEX idx_parent_id (parent_id),
    INDEX idx_level (level),
    INDEX idx_is_custom (is_custom)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

