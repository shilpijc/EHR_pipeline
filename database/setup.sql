-- EHR Pipeline Database Setup
-- This file runs all migrations and seeds in order
-- Usage: mysql -u username -p database_name < setup.sql

-- ============================================================================
-- MIGRATIONS: Create all tables
-- ============================================================================

SOURCE migrations/001_create_ehr_systems.sql;
SOURCE migrations/002_create_ehr_filter_definitions.sql;
SOURCE migrations/003_create_ehr_resources.sql;
SOURCE migrations/004_create_resource_filters.sql;
SOURCE migrations/005_create_resource_dependencies.sql;
SOURCE migrations/006_create_cross_ehr_resource_mappings.sql;
SOURCE migrations/007_create_doctors.sql;
SOURCE migrations/008_create_summarizers.sql;
SOURCE migrations/009_create_summarizer_variables.sql;
SOURCE migrations/010_create_summarizer_filter_values.sql;
SOURCE migrations/011_create_template_sections.sql;
SOURCE migrations/012_create_section_summarizer_assignments.sql;
SOURCE migrations/013_create_default_prompts.sql;
SOURCE migrations/014_create_background_prompts.sql;
SOURCE migrations/015_create_bulk_transfer_jobs.sql;
SOURCE migrations/016_create_bulk_transfer_logs.sql;
SOURCE migrations/017_create_audit_log.sql;

-- ============================================================================
-- SEED DATA: Insert initial data
-- ============================================================================

SOURCE seeds/001_seed_ehr_systems.sql;
SOURCE seeds/002_seed_ehr_filter_definitions.sql;
SOURCE seeds/003_seed_ehr_resources.sql;
SOURCE seeds/004_seed_resource_dependencies.sql;
SOURCE seeds/005_seed_resource_filters.sql;
SOURCE seeds/006_seed_mock_doctors.sql;

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Show table counts
SELECT 'ehr_systems' as table_name, COUNT(*) as row_count FROM ehr_systems
UNION ALL
SELECT 'ehr_filter_definitions', COUNT(*) FROM ehr_filter_definitions
UNION ALL
SELECT 'ehr_resources', COUNT(*) FROM ehr_resources
UNION ALL
SELECT 'resource_filters', COUNT(*) FROM resource_filters
UNION ALL
SELECT 'resource_dependencies', COUNT(*) FROM resource_dependencies
UNION ALL
SELECT 'doctors', COUNT(*) FROM doctors;

-- Show all tables
SHOW TABLES;

