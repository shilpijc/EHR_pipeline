## Complete Entity Relationship Diagram

This document provides visual representation of the database schema relationships.

### Main Schema Overview

```mermaid
erDiagram
    %% Core EHR Configuration
    EHR_SYSTEMS ||--o{ EHR_RESOURCES : "has many"
    EHR_RESOURCES ||--o{ RESOURCE_FILTERS : "configures"
    EHR_RESOURCES ||--o{ RESOURCE_DEPENDENCIES : "depends on"
    EHR_RESOURCES ||--o{ RESOURCE_DEPENDENCIES : "required by"
    EHR_FILTER_DEFINITIONS ||--o{ RESOURCE_FILTERS : "defines"
    
    %% Doctors & Summarizers
    DOCTORS ||--o{ SUMMARIZERS : "creates"
    EHR_RESOURCES ||--o{ SUMMARIZERS : "uses"
    SUMMARIZERS ||--o{ SUMMARIZER_VARIABLES : "extracts"
    SUMMARIZERS ||--o{ SUMMARIZER_FILTER_VALUES : "customizes"
    EHR_FILTER_DEFINITIONS ||--o{ SUMMARIZER_FILTER_VALUES : "overrides"
    
    %% Templates
    DOCTORS ||--o{ SECTION_SUMMARIZER_ASSIGNMENTS : "configures"
    SUMMARIZERS ||--o{ SECTION_SUMMARIZER_ASSIGNMENTS : "assigned to"
    TEMPLATE_SECTIONS ||--o{ TEMPLATE_SECTIONS : "parent of"
    
    %% Prompts
    DOCTORS ||--o{ BACKGROUND_PROMPTS : "customizes"
    
    %% Bulk Operations
    BULK_TRANSFER_JOBS ||--o{ BULK_TRANSFER_LOGS : "tracks"
    
    %% Cross-EHR Mappings
    EHR_RESOURCES ||--o{ CROSS_EHR_RESOURCE_MAPPINGS : "maps from"
    EHR_RESOURCES ||--o{ CROSS_EHR_RESOURCE_MAPPINGS : "maps to"
    
    EHR_SYSTEMS {
        int id PK
        string system_code UK
        string system_name
        boolean is_active
        jsonb configuration
        timestamp created_at
        timestamp updated_at
    }
    
    EHR_RESOURCES {
        int id PK
        string resource_id UK
        int ehr_system_id FK
        string document_type
        string name
        string retrieval_method
        boolean supports_date_range
        boolean supports_single_date
        int default_lookback_years
        string date_parameter_label
        timestamp created_at
    }
    
    EHR_FILTER_DEFINITIONS {
        int id PK
        string filter_code UK
        string filter_name
        string data_type
        jsonb validation_rules
        timestamp created_at
    }
    
    RESOURCE_FILTERS {
        int id PK
        int resource_id FK
        int filter_id FK
        string default_value
        boolean is_required
        boolean is_editable
        int display_order
    }
    
    RESOURCE_DEPENDENCIES {
        int id PK
        int resource_id FK
        int depends_on_resource_id FK
        string dependency_type
        int execution_order
        text description
    }
    
    DOCTORS {
        int id PK
        string name
        string email UK
        string ehr_system
        string specialty
        string practice
        timestamp created_at
    }
    
    SUMMARIZERS {
        int id PK
        int doctor_id FK
        string ehr_system
        string name
        boolean pull_from_ehr
        boolean allow_upload
        boolean allow_text
        int selected_resource_id FK
        jsonb retrieval_config
        string primary_model
        boolean active
        jsonb depends_on_summarisers
        timestamp created_at
    }
    
    SUMMARIZER_VARIABLES {
        int id PK
        int summarizer_id FK
        string name
        string extraction_method
        string selected_section
        text llm_query
    }
    
    SUMMARIZER_FILTER_VALUES {
        int id PK
        int summarizer_id FK
        int filter_id FK
        text custom_value
    }
    
    TEMPLATE_SECTIONS {
        int id PK
        string section_key UK
        string name
        int parent_id FK
        string level
        boolean is_custom
        int display_order
    }
    
    SECTION_SUMMARIZER_ASSIGNMENTS {
        int id PK
        int doctor_id FK
        int summarizer_id FK
        string section_key
        string template
        string action
        text instructions
    }
    
    DEFAULT_PROMPTS {
        int id PK
        string ehr_system
        string document_type
        text prompt_text
        boolean is_active
    }
    
    BACKGROUND_PROMPTS {
        int id PK
        int doctor_id FK
        string template_type
        text prompt_text
        boolean is_edited
    }
    
    BULK_TRANSFER_JOBS {
        int id PK
        string initiated_by
        string copy_type
        jsonb source_doctor_ids
        jsonb target_doctor_ids
        string status
        int progress
    }
    
    BULK_TRANSFER_LOGS {
        int id PK
        int job_id FK
        int source_doctor_id
        int target_doctor_id
        string status
        jsonb details
    }
    
    CROSS_EHR_RESOURCE_MAPPINGS {
        int id PK
        int source_resource_id FK
        int target_resource_id FK
        string mapping_quality
        decimal confidence_score
    }
    
    AUDIT_LOG {
        int id PK
        string entity_type
        int entity_id
        string action
        string changed_by
        jsonb old_values
        jsonb new_values
    }
```

### Relationship Details

#### 1. EHR Configuration Layer

**Purpose**: Define what EHR resources exist and how they work

- `ehr_systems` → `ehr_resources` (1:M)
  - Each EHR system has multiple resources
  
- `ehr_resources` → `resource_filters` (1:M)
  - Each resource can have multiple filters
  
- `ehr_filter_definitions` → `resource_filters` (1:M)
  - Global filter catalog linked to resources
  
- `ehr_resources` → `resource_dependencies` (Self-referencing M:M)
  - Resources can depend on other resources

#### 2. Doctor & Summarizer Layer

**Purpose**: Store actual configurations created by ops

- `doctors` → `summarizers` (1:M)
  - Each doctor has multiple summarizers
  
- `ehr_resources` → `summarizers` (1:M)
  - Each resource is used by multiple summarizers
  
- `summarizers` → `summarizer_variables` (1:M)
  - Each summarizer can extract multiple variables
  
- `summarizers` → `summarizer_filter_values` (1:M)
  - Each summarizer can override filter defaults

#### 3. Template Layer

**Purpose**: Map summarizers to template sections

- `template_sections` → `template_sections` (Self-referencing 1:M)
  - Hierarchical parent-child structure
  
- `summarizers` → `section_summarizer_assignments` (1:M)
  - Link summarizers to specific sections

#### 4. Cross-System Features

**Purpose**: Support bulk operations and cross-EHR transfers

- `ehr_resources` → `cross_ehr_resource_mappings` (M:M)
  - Map equivalent resources across EHRs
  
- `bulk_transfer_jobs` → `bulk_transfer_logs` (1:M)
  - Track individual operations within jobs

### Data Flow Example

**Creating a Summarizer:**

```
1. Select Doctor (doctors table)
   ↓
2. Select EHR Resource (ehr_resources table)
   ↓
3. Load Available Filters (resource_filters table)
   ↓
4. Create Summarizer (summarizers table)
   ↓
5. Save Custom Filters (summarizer_filter_values table)
   ↓
6. Validate Dependencies (resource_dependencies table)
   ↓
7. Assign to Sections (section_summarizer_assignments table)
```

### Key Constraints

1. **Uniqueness**:
   - `doctors.email` - One doctor per email
   - `ehr_systems.system_code` - One record per EHR
   - `(summarizer_id, filter_id)` - One custom value per filter per summarizer

2. **Referential Integrity**:
   - CASCADE deletes: When doctor deleted, summarizers deleted
   - RESTRICT deletes: Cannot delete EHR resource if in use

3. **Check Constraints**:
   - Summarizer must have at least one input method
   - Resource dependency cannot be self-referencing
   - Retrieval method must match configured supports flags

### Index Strategy

**Performance-Critical Indices:**

1. Foreign keys (all)
2. Composite indices on commonly queried pairs
3. JSON indices on JSONB columns (PostgreSQL)
4. Partial indices on active records

**Example Query Optimizations:**

```sql
-- Fast: Uses idx_summarizers_doctor_active
SELECT * FROM summarizers 
WHERE doctor_id = 1 AND active = true;

-- Fast: Uses idx_ehr_resources_ehr_system_active
SELECT * FROM ehr_resources 
WHERE ehr_system_id = 2 AND is_active = true;
```

