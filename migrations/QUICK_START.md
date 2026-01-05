# Quick Start Guide: EHR Pipeline Database Setup

This guide will help you set up the database schema in minutes.

## Prerequisites

- PostgreSQL 12+ installed
- Database created
- Database user with CREATE TABLE permissions

## Step-by-Step Setup

### 1. Create Database (if not exists)

```sql
CREATE DATABASE ehr_pipeline;
```

### 2. Option A: Automatic Setup (Recommended)

```bash
# Set environment variables
export DB_HOST=localhost
export DB_PORT=5432
export DB_NAME=ehr_pipeline
export DB_USER=postgres

# Run migrations
cd migrations
./run_all_migrations.sh
```

### 3. Option B: Manual Setup

```bash
cd migrations

# Run each migration file in order
psql -U postgres -d ehr_pipeline -f 001_create_ehr_systems.sql
psql -U postgres -d ehr_pipeline -f 002_create_ehr_filter_definitions.sql
psql -U postgres -d ehr_pipeline -f 003_create_ehr_resources.sql
# ... continue with all files in order
```

### 4. Verify Installation

```sql
-- Check tables
\dt

-- Check seeded data
SELECT * FROM ehr_systems;
SELECT COUNT(*) FROM ehr_resources;
SELECT COUNT(*) FROM resource_dependencies;
```

Expected results:
- 17 tables created
- 7 EHR systems
- 15+ resources
- 9 dependencies

## Configuration by Environment

### Development

```bash
DB_NAME=ehr_pipeline_dev
DB_USER=dev_user
```

### Staging

```bash
DB_NAME=ehr_pipeline_staging
DB_USER=staging_user
```

### Production

```bash
DB_NAME=ehr_pipeline_prod
DB_USER=prod_user
# Use stronger authentication
# Enable SSL connection
# Set up backups
```

## Common Issues

### Issue: "psql: command not found"

**Solution**: Install PostgreSQL client
```bash
# macOS
brew install postgresql

# Ubuntu/Debian
sudo apt-get install postgresql-client

# Windows
# Download from postgresql.org
```

### Issue: "permission denied"

**Solution**: Grant necessary permissions
```sql
GRANT CREATE ON DATABASE ehr_pipeline TO your_user;
GRANT ALL ON SCHEMA public TO your_user;
```

### Issue: "relation already exists"

**Solution**: Drop and recreate (dev only)
```bash
# WARNING: This deletes all data
psql -U postgres -d ehr_pipeline -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
# Then rerun migrations
```

## Next Steps After Setup

1. **Seed Doctor Data**: Add your doctors to the `doctors` table
2. **Configure Application**: Update app config with database credentials
3. **Test Connection**: Run application and verify database connectivity
4. **Create First Summarizer**: Test the full workflow

## Sample Doctor Insert

```sql
INSERT INTO doctors (name, email, ehr_system, specialty, practice)
VALUES 
('Dr. Sarah Chen', 's.chen@example.com', 'ECW', 'Neurology', 'Dent Neuro'),
('Dr. Michael Rodriguez', 'm.rodriguez@example.com', 'AthenaOne', 'Cardiology', 'CardioPlus')
RETURNING *;
```

## Sample Summarizer Insert

```sql
-- First, get resource ID
SELECT id, name FROM ehr_resources WHERE resource_id = 'ecw-previous-notes-xml';

-- Insert summarizer
INSERT INTO summarizers (
    doctor_id, 
    ehr_system, 
    name, 
    purpose,
    pull_from_ehr,
    selected_resource_id,
    retrieval_config,
    common_prompt
) VALUES (
    1,  -- doctor_id from above
    'ECW',
    'Neurology Visit Summary',
    'Summarize neurology consultation visits',
    true,
    1,  -- resource_id from above
    '{"type":"date_range","how_far_back_years":3,"how_far_back_to_days":3}'::jsonb,
    'Summarize the key findings, diagnoses, and treatment recommendations'
)
RETURNING *;
```

## Backup & Restore

### Create Backup

```bash
pg_dump -U postgres ehr_pipeline > backup_$(date +%Y%m%d).sql
```

### Restore from Backup

```bash
psql -U postgres ehr_pipeline < backup_20260105.sql
```

## Performance Tuning (Production)

Add these PostgreSQL configurations:

```ini
# postgresql.conf
shared_buffers = 256MB
effective_cache_size = 1GB
work_mem = 16MB
maintenance_work_mem = 128MB

# For JSONB performance
gin_pending_list_limit = 4MB
```

## Monitoring Queries

```sql
-- Table sizes
SELECT 
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Most active tables
SELECT 
    schemaname,
    tablename,
    seq_scan,
    idx_scan
FROM pg_stat_user_tables
ORDER BY seq_scan DESC;
```

## Need Help?

- Check `README.md` for detailed documentation
- Check `SCHEMA_ERD.md` for visual schema
- Review individual migration files for table structures

