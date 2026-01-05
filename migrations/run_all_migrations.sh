#!/bin/bash
# Master Migration Script for EHR Pipeline Database
# This script runs all migrations in order

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Database configuration
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-ehr_pipeline}"
DB_USER="${DB_USER:-postgres}"

echo -e "${YELLOW}==================================="
echo "EHR Pipeline Database Migration"
echo "===================================${NC}"
echo ""
echo "Database: $DB_NAME"
echo "Host: $DB_HOST:$DB_PORT"
echo "User: $DB_USER"
echo ""

# Check if psql is installed
if ! command -v psql &> /dev/null; then
    echo -e "${RED}Error: psql command not found. Please install PostgreSQL client.${NC}"
    exit 1
fi

# Prompt for password
read -sp "Enter database password: " DB_PASSWORD
echo ""
export PGPASSWORD="$DB_PASSWORD"

# Test connection
echo -e "${YELLOW}Testing database connection...${NC}"
if ! psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "SELECT 1;" > /dev/null 2>&1; then
    echo -e "${RED}Error: Could not connect to database${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Connected successfully${NC}"
echo ""

# Run migrations
MIGRATION_DIR="$(dirname "$0")"
MIGRATION_COUNT=0
FAILED_COUNT=0

for migration_file in "$MIGRATION_DIR"/*.sql; do
    # Skip README and this script
    if [[ "$migration_file" == *"README"* ]] || [[ "$migration_file" == *"run_all"* ]]; then
        continue
    fi
    
    filename=$(basename "$migration_file")
    echo -e "${YELLOW}Running: $filename${NC}"
    
    if psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$migration_file" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ $filename completed${NC}"
        ((MIGRATION_COUNT++))
    else
        echo -e "${RED}✗ $filename failed${NC}"
        ((FAILED_COUNT++))
    fi
    echo ""
done

# Summary
echo -e "${YELLOW}==================================="
echo "Migration Summary"
echo "===================================${NC}"
echo "Successful: $MIGRATION_COUNT"
echo "Failed: $FAILED_COUNT"
echo ""

if [ $FAILED_COUNT -eq 0 ]; then
    echo -e "${GREEN}All migrations completed successfully!${NC}"
    
    # Run verification
    echo ""
    echo -e "${YELLOW}Running verification queries...${NC}"
    
    echo "Tables created:"
    psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        ORDER BY table_name;
    "
    
    echo ""
    echo "EHR Systems:"
    psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "
        SELECT system_code, system_name, is_active 
        FROM ehr_systems 
        ORDER BY system_code;
    "
    
    echo ""
    echo "EHR Resources Count:"
    psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "
        SELECT es.system_code, COUNT(er.id) as resource_count
        FROM ehr_systems es
        LEFT JOIN ehr_resources er ON es.id = er.ehr_system_id
        GROUP BY es.system_code
        ORDER BY es.system_code;
    "
    
    exit 0
else
    echo -e "${RED}Some migrations failed. Please check the errors above.${NC}"
    exit 1
fi

