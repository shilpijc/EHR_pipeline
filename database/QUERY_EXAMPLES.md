## Common SQL Query Examples

This document provides ready-to-use SQL queries for common operations in the EHR Pipeline database.

---

## 1. Get All Resources for an EHR System

```sql
SELECT 
    er.resource_id,
    er.name,
    er.document_type,
    er.retrieval_method,
    er.date_parameter_label
FROM ehr_resources er
JOIN ehr_systems es ON er.ehr_system_id = es.id
WHERE es.system_code = 'ECW'  -- Change to desired EHR
  AND er.is_active = TRUE;
```

---

## 2. Get All Filters for a Resource (with Defaults)

```sql
SELECT 
    fd.filter_code,
    fd.filter_name,
    fd.data_type,
    rf.default_value,
    rf.is_required,
    rf.is_editable
FROM resource_filters rf
JOIN ehr_filter_definitions fd ON rf.filter_id = fd.id
JOIN ehr_resources er ON rf.resource_id = er.id
WHERE er.resource_id = 'ecw-previous-notes-xml'  -- Change to desired resource
ORDER BY rf.display_order;
```

---

## 3. Get Filters for a Summarizer (with Custom Overrides)

```sql
SELECT 
    fd.filter_code,
    fd.filter_name,
    COALESCE(sfv.custom_value, rf.default_value) as value,
    CASE 
        WHEN sfv.custom_value IS NOT NULL THEN 'custom'
        ELSE 'default'
    END as source
FROM ehr_resources er
JOIN resource_filters rf ON er.id = rf.resource_id
JOIN ehr_filter_definitions fd ON rf.filter_id = fd.id
LEFT JOIN summarizer_filter_values sfv 
    ON sfv.summarizer_id = 1  -- Change to desired summarizer ID
    AND sfv.filter_id = fd.id
WHERE er.id = (SELECT selected_resource_id FROM summarizers WHERE id = 1)
ORDER BY rf.display_order;
```

---

## 4. Check Resource Dependencies Before Creating Summarizer

```sql
-- Check if doctor has required dependencies for a resource
WITH required_dependencies AS (
    SELECT 
        rd.depends_on_resource_id,
        er.name as dependency_name,
        er.document_type as dependency_doc_type
    FROM resource_dependencies rd
    JOIN ehr_resources er ON rd.depends_on_resource_id = er.id
    WHERE rd.resource_id = 5  -- Resource ID doctor wants to use
      AND rd.dependency_type = 'required'
),
existing_resources AS (
    SELECT DISTINCT s.selected_resource_id
    FROM summarizers s
    WHERE s.doctor_id = 1  -- Doctor ID
      AND s.active = TRUE
)
SELECT 
    rd.depends_on_resource_id,
    rd.dependency_name,
    rd.dependency_doc_type,
    CASE 
        WHEN ex.selected_resource_id IS NULL THEN 'MISSING ⚠️'
        ELSE 'OK ✓'
    END as status
FROM required_dependencies rd
LEFT JOIN existing_resources ex ON rd.depends_on_resource_id = ex.selected_resource_id;

-- If any rows show 'MISSING', warn ops before allowing creation
```

---

## 5. Get All Summarizers for a Doctor

```sql
SELECT 
    s.id,
    s.name,
    s.purpose,
    s.ehr_system,
    s.active,
    s.pull_from_ehr,
    s.allow_upload,
    s.allow_text,
    er.name as resource_name,
    er.document_type
FROM summarizers s
LEFT JOIN ehr_resources er ON s.selected_resource_id = er.id
WHERE s.doctor_id = 1  -- Change to desired doctor ID
ORDER BY s.created_at DESC;
```

---

## 6. Get Summarizer Details (Full Configuration)

```sql
SELECT 
    s.*,
    d.name as doctor_name,
    d.email as doctor_email,
    er.name as resource_name,
    er.retrieval_method,
    er.date_parameter_label
FROM summarizers s
JOIN doctors d ON s.doctor_id = d.id
LEFT JOIN ehr_resources er ON s.selected_resource_id = er.id
WHERE s.id = 1;  -- Change to desired summarizer ID
```

---

## 7. Get Section Assignments for a Doctor

```sql
SELECT 
    ssa.section_key,
    ssa.template,
    ssa.action,
    s.name as summarizer_name,
    ssa.instructions,
    ssa.display_order
FROM section_summarizer_assignments ssa
JOIN summarizers s ON ssa.summarizer_id = s.id
WHERE ssa.doctor_id = 1  -- Change to desired doctor ID
  AND ssa.template = 'general'  -- Change to desired template
ORDER BY ssa.section_key, ssa.display_order;
```

---

## 8. Find Cross-EHR Resource Mappings

```sql
-- Find equivalent resource in target EHR
SELECT 
    es_source.system_code as source_ehr,
    er_source.name as source_resource,
    es_target.system_code as target_ehr,
    er_target.name as target_resource,
    cm.mapping_quality,
    cm.confidence_score
FROM cross_ehr_resource_mappings cm
JOIN ehr_resources er_source ON cm.source_resource_id = er_source.id
JOIN ehr_resources er_target ON cm.target_resource_id = er_target.id
JOIN ehr_systems es_source ON er_source.ehr_system_id = es_source.id
JOIN ehr_systems es_target ON er_target.ehr_system_id = es_target.id
WHERE er_source.resource_id = 'ecw-previous-notes-xml'  -- Source resource
  AND es_target.system_code = 'AthenaOne';  -- Target EHR
```

---

## 9. Get Audit History for an Entity

```sql
SELECT 
    al.action,
    al.changed_by,
    al.old_values,
    al.new_values,
    al.created_at
FROM audit_log al
WHERE al.entity_type = 'summarizer'
  AND al.entity_id = 1  -- Change to desired entity ID
ORDER BY al.created_at DESC
LIMIT 20;
```

---

## 10. Get Bulk Transfer Job Status

```sql
SELECT 
    btj.id,
    btj.copy_type,
    btj.status,
    btj.progress,
    btj.total,
    ROUND((btj.progress / btj.total) * 100, 2) as progress_percentage,
    btj.initiated_by,
    btj.created_at,
    btj.completed_at,
    TIMESTAMPDIFF(SECOND, btj.created_at, 
        COALESCE(btj.completed_at, NOW())) as duration_seconds
FROM bulk_transfer_jobs btj
WHERE btj.id = 1;  -- Change to desired job ID
```

---

## 11. Get Summarizers Using Date Ranges Older Than X Years

```sql
-- Find summarizers with old date ranges (PostgreSQL)
SELECT 
    s.id,
    s.name,
    d.name as doctor_name,
    s.retrieval_config->>'how_far_back_years' as years_back,
    s.created_at
FROM summarizers s
JOIN doctors d ON s.doctor_id = d.id
WHERE s.retrieval_config->>'type' = 'date_range'
  AND CAST(s.retrieval_config->>'how_far_back_years' AS INTEGER) > 5
ORDER BY CAST(s.retrieval_config->>'how_far_back_years' AS INTEGER) DESC;

-- For MySQL 5.7+, use JSON_EXTRACT:
SELECT 
    s.id,
    s.name,
    d.name as doctor_name,
    JSON_UNQUOTE(JSON_EXTRACT(s.retrieval_config, '$.how_far_back_years')) as years_back
FROM summarizers s
JOIN doctors d ON s.doctor_id = d.id
WHERE JSON_EXTRACT(s.retrieval_config, '$.type') = 'date_range'
  AND CAST(JSON_UNQUOTE(JSON_EXTRACT(s.retrieval_config, '$.how_far_back_years')) AS UNSIGNED) > 5;
```

---

## 12. Get All Doctors Using a Specific EHR

```sql
SELECT 
    d.id,
    d.name,
    d.email,
    d.specialty,
    d.practice,
    COUNT(s.id) as summarizer_count
FROM doctors d
LEFT JOIN summarizers s ON d.id = s.doctor_id AND s.active = TRUE
WHERE d.ehr_system = 'ECW'  -- Change to desired EHR
GROUP BY d.id, d.name, d.email, d.specialty, d.practice
ORDER BY d.name;
```

---

## 13. Find Summarizers Without Dependencies (Safe to Copy)

```sql
-- Find summarizers that don't depend on others
SELECT 
    s.id,
    s.name,
    d.name as doctor_name,
    s.ehr_system
FROM summarizers s
JOIN doctors d ON s.doctor_id = d.id
WHERE s.depends_on_summarisers IS NULL 
   OR JSON_LENGTH(s.depends_on_summarisers) = 0
   AND s.active = TRUE
ORDER BY s.created_at DESC;
```

---

## 14. Get Template Hierarchy

```sql
-- Get full template hierarchy with indentation
SELECT 
    CONCAT(
        CASE ts.level
            WHEN 'parent' THEN ''
            WHEN 'child' THEN '  '
            WHEN 'grandchild' THEN '    '
        END,
        ts.name
    ) as section_hierarchy,
    ts.section_key,
    ts.level,
    ts.is_custom,
    ts.display_order
FROM template_sections ts
ORDER BY ts.display_order, ts.parent_id, ts.id;
```

---

## 15. Count Active Summarizers by EHR System

```sql
SELECT 
    s.ehr_system,
    COUNT(*) as active_count,
    COUNT(DISTINCT s.doctor_id) as doctor_count,
    AVG(s.avg_summarization_time) as avg_time_seconds
FROM summarizers s
WHERE s.active = TRUE
GROUP BY s.ehr_system
ORDER BY active_count DESC;
```

---

## Performance Tips

### Use Indices Effectively
All queries above leverage the existing indices. For custom queries:
- Filter by indexed columns first (id, doctor_id, ehr_system, active)
- Use composite indices when filtering by multiple columns
- Avoid functions on indexed columns in WHERE clauses

### JSON Queries
- Use native JSON functions (`->`, `->>` in PostgreSQL, `JSON_EXTRACT` in MySQL)
- Consider adding generated columns for frequently queried JSON fields
- Index generated columns if needed

### Large Result Sets
- Always use LIMIT for queries that might return many rows
- Use pagination with OFFSET for UI lists
- Consider adding indexes on `created_at` for time-based queries

---

## Additional Resources

- **Schema Documentation**: `/database/README.md`
- **Migration Files**: `/database/migrations/`
- **Plan Document**: `.cursor/plans/database_schema_design_2290a56d.plan.md`

