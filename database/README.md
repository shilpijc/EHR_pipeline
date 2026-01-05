# EHR Pipeline Database Schema

Complete database schema for the EHR Pipeline Application, supporting doctors, summarizers, EHR resources, templates, and bulk operations.

## Quick Start

### Setup Database

```bash
# Create database
mysql -u root -p -e "CREATE DATABASE ehr_pipeline CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Run all migrations and seeds
cd database
mysql -u root -p ehr_pipeline < setup.sql
```

### Individual Migration

```bash
# Run specific migration
mysql -u root -p ehr_pipeline < migrations/001_create_ehr_systems.sql
```

## Database Structure

### Core Tables (17 total)

#### 1. EHR Management (6 tables)
- `ehr_systems` - Master catalog of EHR systems (ECW, AthenaOne, etc.)
- `ehr_resources` - Available data sources per EHR with retrieval configs
- `ehr_filter_definitions` - Global filter catalog (keywords, visit_types, etc.)
- `resource_filters` - Which filters apply to which resources
- `resource_dependencies` - Resource dependency chain (e.g., Clinical Docs → Previous Notes)
- `cross_ehr_resource_mappings` - Equivalent resources across EHRs for bulk transfer

#### 2. Doctors & Summarizers (5 tables)
- `doctors` - Doctor profiles and EHR system info
- `summarizers` - Summarizer configurations with prompts and retrieval settings
- `summarizer_variables` - Variables extracted by summarizers
- `summarizer_filter_values` - Custom filter overrides per summarizer
- `section_summarizer_assignments` - Map summarizers to template sections

#### 3. Templates & Prompts (3 tables)
- `template_sections` - Template hierarchy (sections, subsections)
- `default_prompts` - Default prompts per EHR + Document Type
- `background_prompts` - Background prompts for templates

#### 4. Operations & Audit (3 tables)
- `bulk_transfer_jobs` - Track bulk copy operations
- `bulk_transfer_logs` - Detailed logs for bulk operations
- `audit_log` - Audit trail for all changes

## Key Design Decisions

### 1. EHR System Storage

`ehr_system` is stored in BOTH `doctors` and `summarizers` tables:
- **doctors**: Current EHR system doctor uses
- **summarizers**: EHR system for which summarizer was configured

**Why?** If doctor switches EHRs, old summarizers remain valid for original EHR.

### 2. Retrieval Config (JSON Field)

The `retrieval_config` field in summarizers stores date/count configuration as JSON instead of multiple nullable columns:

```json
// Date Range (ECW, AthenaFlow)
{
  "type": "date_range",
  "how_far_back_years": 3,
  "how_far_back_to_days": 3
}

// Single Document (AthenaOne, AdvancedMD, etc.)
{
  "type": "single_document",
  "document_date": "2024-01-15"
}

// No Date (Greenway)
{
  "type": "no_date"
}
```

**Why?** Different EHRs need different fields. JSON avoids 8+ nullable columns.

### 3. Filter Architecture (3-Layer System)

1. **ehr_filter_definitions**: Global catalog of all filter types
2. **resource_filters**: Which filters apply to which resources (with defaults)
3. **summarizer_filter_values**: Custom values per summarizer (overrides defaults)

**Query Pattern:**
```sql
SELECT 
  fd.filter_code,
  COALESCE(sfv.custom_value, rf.default_value) as value
FROM ehr_resources er
JOIN resource_filters rf ON er.id = rf.resource_id
JOIN ehr_filter_definitions fd ON rf.filter_id = fd.id
LEFT JOIN summarizer_filter_values sfv ON sfv.summarizer_id = ? AND sfv.filter_id = fd.id
WHERE er.id = ?
```

## Supported EHR Systems

| EHR | Retrieval Method | Date Configuration | Dependencies |
|-----|------------------|-------------------|--------------|
| ECW | Date Range | 3 years ago to 3 days ago | None |
| AthenaOne | Single Document | Note date | Clinical Docs, Labs, Imaging, Problems depend on Previous Notes |
| AthenaFlow | Date Range | 1 year ago to recent | None |
| AdvancedMD | Single Document | Document date | Clinical Docs depends on Previous Notes |
| Charm | Single Document | Document date | Clinical Docs depends on Previous Notes |
| DrChrono | Single Document | Note date | None |
| Greenway | No Date | CCDA only | None |

## Seed Data

After running `setup.sql`, the database contains:

- **7 EHR Systems**: ECW, AthenaOne, AthenaFlow, AdvancedMD, Charm, DrChrono, Greenway
- **7 Filter Definitions**: organization_ids, template_ids, keywords, visit_types, document_types, sorting_direction, file_type
- **16 EHR Resources**: All documented resources across all EHR systems
- **10+ Resource Dependencies**: All documented dependencies (e.g., Clinical Docs → Previous Notes)
- **7 Mock Doctors**: Sample doctor data for each EHR system

## Migration Order

Migrations must run in order due to foreign key dependencies:

1. Core EHR tables (001-003)
2. EHR relationships (004-006)
3. Doctors (007)
4. Summarizers (008-010)
5. Templates (011-012)
6. Prompts (013-014)
7. Operations (015-017)

## Indices

All tables include appropriate indices for:
- Primary keys (auto-indexed)
- Foreign keys
- Unique constraints
- Common query patterns (e.g., `doctor_id + active`, `ehr_system + is_active`)

See individual migration files for complete index definitions.

## Data Validation

### Resource Dependencies

Before creating a summarizer with a dependent resource:

```sql
-- Check if required dependencies exist
WITH required_dependencies AS (
  SELECT depends_on_resource_id
  FROM resource_dependencies
  WHERE resource_id = ? AND dependency_type = 'required'
),
existing_resources AS (
  SELECT DISTINCT selected_resource_id
  FROM summarizers
  WHERE doctor_id = ? AND active = true
)
SELECT rd.depends_on_resource_id, er.name as missing_resource
FROM required_dependencies rd
LEFT JOIN existing_resources ex ON rd.depends_on_resource_id = ex.selected_resource_id
LEFT JOIN ehr_resources er ON rd.depends_on_resource_id = er.id
WHERE ex.selected_resource_id IS NULL;
```

If query returns rows, dependencies are missing.

## Maintenance

### Backup

```bash
mysqldump -u root -p ehr_pipeline > backup_$(date +%Y%m%d).sql
```

### Reset Database

```bash
mysql -u root -p -e "DROP DATABASE IF EXISTS ehr_pipeline; CREATE DATABASE ehr_pipeline CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -u root -p ehr_pipeline < setup.sql
```

### View Schema

```bash
mysql -u root -p ehr_pipeline -e "SHOW TABLES;"
mysql -u root -p ehr_pipeline -e "DESCRIBE summarizers;"
```

## Troubleshooting

### Foreign Key Errors

Ensure migrations run in order. If issues persist:

```sql
SET FOREIGN_KEY_CHECKS=0;
-- Run problematic migration
SET FOREIGN_KEY_CHECKS=1;
```

### JSON Query Errors (MySQL < 5.7)

This schema requires MySQL 5.7+ or MariaDB 10.2+ for JSON support.

Check version:
```sql
SELECT VERSION();
```

### Character Encoding Issues

All tables use `utf8mb4` for full Unicode support (including emojis).

## Contact

For questions about the database schema, refer to the main plan document:
`/Users/shilpijain/.cursor/plans/database_schema_design_2290a56d.plan.md`

