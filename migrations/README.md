# Database Migrations for EHR Pipeline Application

This directory contains SQL migration files to create the complete database schema for the EHR Pipeline application.

## Overview

The migrations are numbered sequentially and should be run in order. They create all necessary tables, indices, constraints, and seed data for the application.

## Database Support

These migrations are written for **PostgreSQL** with the following features:
- SERIAL for auto-increment primary keys
- JSONB for JSON storage with indexing support
- TIMESTAMP WITH TIME ZONE for proper timezone handling
- CHECK constraints for data validation
- Foreign key constraints with CASCADE/RESTRICT

## Migration Order

### Core EHR Configuration (001-006)
1. `001_create_ehr_systems.sql` - EHR systems catalog
2. `002_create_ehr_filter_definitions.sql` - Filter definitions dictionary
3. `003_create_ehr_resources.sql` - EHR resources with retrieval configs
4. `004_create_resource_filters.sql` - Filter-to-resource mappings
5. `005_create_resource_dependencies.sql` - Resource dependencies
6. `006_create_cross_ehr_resource_mappings.sql` - Cross-EHR mappings

### Doctors & Summarizers (007-010)
7. `007_create_doctors.sql` - Doctor profiles
8. `008_create_summarizers.sql` - Main summarizer configurations
9. `009_create_summarizer_variables.sql` - Variable extraction configs
10. `010_create_summarizer_filter_values.sql` - Custom filter overrides

### Templates (011-012)
11. `011_create_template_sections.sql` - Template hierarchy
12. `012_create_section_summarizer_assignments.sql` - Summarizer-to-section mappings

### Prompts (013-014)
13. `013_create_default_prompts.sql` - Default prompts per EHR/doc type
14. `014_create_background_prompts.sql` - Template background prompts

### Operations & Audit (015-017)
15. `015_create_bulk_transfer_jobs.sql` - Bulk transfer tracking
16. `016_create_bulk_transfer_logs.sql` - Bulk transfer logs
17. `017_create_audit_log.sql` - Audit trail

### Seed Data (018-019)
18. `018_seed_ehr_resources.sql` - Seed all EHR resources
19. `019_seed_resource_dependencies.sql` - Seed resource dependencies

## Running Migrations

### Option 1: Run All Migrations (PostgreSQL)

```bash
# Using psql
for file in migrations/*.sql; do
  psql -U your_username -d your_database -f "$file"
done
```

### Option 2: Run Individual Migrations

```bash
psql -U your_username -d your_database -f migrations/001_create_ehr_systems.sql
```

### Option 3: Using a Migration Tool

If you're using a migration tool like Flyway, Liquibase, or Rails Active Record:

1. Copy migration files to your tool's migrations directory
2. Adjust naming convention if needed (e.g., Flyway: `V001__create_ehr_systems.sql`)
3. Run your tool's migrate command

## Database Schema Summary

### Core Tables (17 total)

#### EHR Configuration
- `ehr_systems` - Catalog of EHR systems
- `ehr_resources` - Available resources per EHR
- `ehr_filter_definitions` - Global filter catalog
- `resource_filters` - Filters per resource
- `resource_dependencies` - Resource dependencies
- `cross_ehr_resource_mappings` - Cross-EHR resource equivalents

#### Doctors & Summarizers
- `doctors` - Doctor profiles
- `summarizers` - Summarizer configurations
- `summarizer_variables` - Variable extraction
- `summarizer_filter_values` - Custom filter values

#### Templates
- `template_sections` - Template hierarchy
- `section_summarizer_assignments` - Summarizer assignments

#### Prompts
- `default_prompts` - EHR/doc type prompts
- `background_prompts` - Template prompts

#### Operations
- `bulk_transfer_jobs` - Bulk operations
- `bulk_transfer_logs` - Operation logs
- `audit_log` - Audit trail

## Key Design Decisions

### 1. EHR System Denormalization
The `ehr_system` field is stored in BOTH `doctors` and `summarizers` tables for:
- Performance (no joins needed)
- Data integrity (old summarizers stay valid if doctor switches EHRs)

### 2. Retrieval Config as JSON
Summarizers store `retrieval_config` as JSONB instead of separate columns because:
- Different EHRs need different fields
- Avoids 8+ nullable columns
- Flexible for future additions

### 3. Three-Layer Filter System
1. `ehr_filter_definitions` - What filters exist
2. `resource_filters` - Which filters apply where
3. `summarizer_filter_values` - Custom values per summarizer

### 4. Resource Dependencies
Self-referencing `resource_dependencies` table ensures proper execution order (e.g., Clinical Documents depends on Previous Notes).

## Verification Queries

After running migrations, verify the schema:

```sql
-- Check all tables were created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check EHR systems were seeded
SELECT * FROM ehr_systems;

-- Check EHR resources were seeded
SELECT 
  es.system_code,
  er.document_type,
  er.name,
  er.retrieval_method
FROM ehr_resources er
JOIN ehr_systems es ON er.ehr_system_id = es.id
ORDER BY es.system_code, er.document_type;

-- Check resource dependencies
SELECT 
  r1.name as resource_name,
  r2.name as depends_on,
  rd.dependency_type
FROM resource_dependencies rd
JOIN ehr_resources r1 ON rd.resource_id = r1.id
JOIN ehr_resources r2 ON rd.depends_on_resource_id = r2.id;
```

## Rollback

To drop all tables (CAUTION: This will delete all data):

```sql
DROP TABLE IF EXISTS audit_log CASCADE;
DROP TABLE IF EXISTS bulk_transfer_logs CASCADE;
DROP TABLE IF EXISTS bulk_transfer_jobs CASCADE;
DROP TABLE IF EXISTS background_prompts CASCADE;
DROP TABLE IF EXISTS default_prompts CASCADE;
DROP TABLE IF EXISTS section_summarizer_assignments CASCADE;
DROP TABLE IF EXISTS template_sections CASCADE;
DROP TABLE IF EXISTS summarizer_filter_values CASCADE;
DROP TABLE IF EXISTS summarizer_variables CASCADE;
DROP TABLE IF EXISTS summarizers CASCADE;
DROP TABLE IF EXISTS doctors CASCADE;
DROP TABLE IF EXISTS cross_ehr_resource_mappings CASCADE;
DROP TABLE IF EXISTS resource_dependencies CASCADE;
DROP TABLE IF EXISTS resource_filters CASCADE;
DROP TABLE IF EXISTS ehr_resources CASCADE;
DROP TABLE IF EXISTS ehr_filter_definitions CASCADE;
DROP TABLE IF EXISTS ehr_systems CASCADE;
```

## Next Steps

1. Run all migrations in order
2. Verify schema using verification queries
3. Seed doctor data (see `seed_doctors.sql` if available)
4. Configure application database connection
5. Test database operations through application

## Support

For questions or issues with migrations, refer to the main database schema design document.

