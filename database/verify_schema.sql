-- Verification Script: Check database schema integrity
-- Usage: mysql -u username -p database_name < verify_schema.sql

-- ============================================================================
-- TABLE EXISTENCE CHECK
-- ============================================================================

SELECT 
    'Table Existence Check' as check_type,
    COUNT(*) as total_tables,
    CASE 
        WHEN COUNT(*) = 17 THEN 'PASS ✓'
        ELSE CONCAT('FAIL ✗ (Expected 17, Found ', COUNT(*), ')')
    END as status
FROM information_schema.tables 
WHERE table_schema = DATABASE();

-- ============================================================================
-- LIST ALL TABLES
-- ============================================================================

SELECT 
    table_name,
    table_rows,
    ROUND((data_length + index_length) / 1024 / 1024, 2) as size_mb
FROM information_schema.tables
WHERE table_schema = DATABASE()
ORDER BY table_name;

-- ============================================================================
-- FOREIGN KEY RELATIONSHIPS
-- ============================================================================

SELECT 
    CONCAT(table_name, '.', column_name) as foreign_key,
    CONCAT(referenced_table_name, '.', referenced_column_name) as references,
    constraint_name
FROM information_schema.key_column_usage
WHERE table_schema = DATABASE()
  AND referenced_table_name IS NOT NULL
ORDER BY table_name, column_name;

-- ============================================================================
-- INDEX SUMMARY
-- ============================================================================

SELECT 
    table_name,
    COUNT(*) as index_count,
    GROUP_CONCAT(DISTINCT index_name ORDER BY index_name) as indices
FROM information_schema.statistics
WHERE table_schema = DATABASE()
  AND index_name != 'PRIMARY'
GROUP BY table_name
ORDER BY index_count DESC;

-- ============================================================================
-- SEED DATA VERIFICATION
-- ============================================================================

SELECT 'EHR Systems' as table_name, COUNT(*) as row_count, 
       CASE WHEN COUNT(*) >= 7 THEN 'PASS ✓' ELSE 'FAIL ✗' END as status
FROM ehr_systems

UNION ALL

SELECT 'EHR Filter Definitions', COUNT(*),
       CASE WHEN COUNT(*) >= 7 THEN 'PASS ✓' ELSE 'FAIL ✗' END
FROM ehr_filter_definitions

UNION ALL

SELECT 'EHR Resources', COUNT(*),
       CASE WHEN COUNT(*) >= 15 THEN 'PASS ✓' ELSE 'FAIL ✗' END
FROM ehr_resources

UNION ALL

SELECT 'Resource Dependencies', COUNT(*),
       CASE WHEN COUNT(*) >= 8 THEN 'PASS ✓' ELSE 'FAIL ✗' END
FROM resource_dependencies

UNION ALL

SELECT 'Resource Filters', COUNT(*),
       CASE WHEN COUNT(*) >= 5 THEN 'PASS ✓' ELSE 'FAIL ✗' END
FROM resource_filters

UNION ALL

SELECT 'Doctors', COUNT(*),
       CASE WHEN COUNT(*) >= 7 THEN 'PASS ✓' ELSE 'FAIL ✗' END
FROM doctors;

-- ============================================================================
-- JSON FIELD VALIDATION
-- ============================================================================

-- Check if JSON columns exist and can be queried
SELECT 
    'JSON Field Test' as check_type,
    COUNT(*) as tables_with_json,
    CASE WHEN COUNT(*) > 0 THEN 'PASS ✓' ELSE 'FAIL ✗' END as status
FROM information_schema.columns
WHERE table_schema = DATABASE()
  AND data_type = 'json';

-- ============================================================================
-- UNIQUE CONSTRAINTS CHECK
-- ============================================================================

SELECT 
    table_name,
    constraint_name,
    GROUP_CONCAT(column_name ORDER BY ordinal_position) as columns
FROM information_schema.key_column_usage
WHERE table_schema = DATABASE()
  AND constraint_name != 'PRIMARY'
  AND constraint_name LIKE '%unique%'
GROUP BY table_name, constraint_name
ORDER BY table_name;

-- ============================================================================
-- SUMMARY
-- ============================================================================

SELECT '=' as separator, 'SCHEMA VERIFICATION COMPLETE' as message, '=' as separator2;

