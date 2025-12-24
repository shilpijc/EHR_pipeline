# Product Requirements Document: Self-Service Summarizer Creation

**Version:** 1.0  
**Date:** January 2025

---

## 1. Problem Statement

### Current Workflow Issues

- **Manual Coordination:** Every summarizer creation requires Ops → Tech handoff for EHR pipeline configuration
- **Knowledge Gaps:** Ops doesn't know what data is available in EHR systems
- **Technical Bottlenecks:** Tech team spends time on routine configuration instead of new features
- **Poor Documentation:** No clear record of why summarizers were created or their purpose

### Business Impact

- Delayed time-to-market (days/weeks instead of hours)
- Tech team overloaded with repetitive tasks
- Low reusability of existing EHR resource configurations

---

## 2. Solution

Enable Ops teams to create complete, functional summarizers independently through a self-service configuration interface.

### Key Capabilities

1. **Three-Tier Data Sources:**
   - Pull from EHR (automated extraction)
   - User file upload (PDF/document upload)
   - Text input (direct text entry)

2. **Self-Service Configuration:**
   - Select existing EHR resources or request new ones
   - Configure filters, date ranges, document counts
   - Set prompts for each data input method
   - Configure advanced settings (with unlock confirmation)

3. **Resource Management:**
   - Dropdown of available EHR resources per system
   - Request new resources (creates placeholder, tech develops async)
   - Resource selection auto-populates filter defaults

---

## 3. User Flows

### 3.1 Create Summarizer

```
1. Navigate to doctor's profile
2. Click "Create Summarizer"
3. Fill Basic Information:
   - Name (required)
   - Purpose/Use Case (required)
4. Configure Functionality:
   - Select input methods (EHR pull, file upload, text input)
5. IF "Pull from EHR" selected:
   a. Select existing resource OR request new resource
   b. Configure data selection (count OR date range)
   c. Review advanced filter settings (read-only until unlocked)
6. Configure prompts for each enabled input method
7. Set technical configuration:
   - Primary Model (default: claude-sonnet-4)
   - Fallback Model (default: claude-sonnet-4)
   - Average Summarization Time (default: 60 seconds)
8. Submit form
9. System creates summarizer record
10. Summarizer immediately available for use
```

### 3.2 Request New EHR Resource

```
1. Create summarizer with "Pull from EHR" enabled
2. Select "Request new resource" option
3. Provide resource description
4. System creates summarizer with placeholder resource
5. Tech team receives notification
6. Tech develops resource
7. System links resource to summarizer
8. Summarizer becomes operational
9. New resource available in dropdown
```

### 3.3 Edit Summarizer

```
1. Navigate to doctor's profile
2. Click "Edit" on summarizer
3. Form pre-populated with current values
4. Make desired changes
5. IF resource changed: Advanced settings reset, filters update
6. IF advanced settings changed: Unlock confirmation required
7. Submit form
8. System updates summarizer record
9. Changes take effect immediately
```

### 3.4 View Summarizer Details

```
1. Navigate to doctor's profile
2. View summarizer cards showing:
   - Name, Purpose
   - Input method badges (EHR, Upload, Text)
   - Selected resource (if applicable)
3. Hover to see edit button
```

### 3.5 Activate/Deactivate Summarizer

```
1. Open edit form for summarizer
2. Navigate to Advanced Settings → Pipeline Settings
3. Toggle "Active" status
4. Save changes
5. IF deactivated: Stops new requests, completes in-progress
6. IF activated: Immediately available, configuration validated
```

### 3.6 Edit Advanced Settings

```
1. Open edit form
2. Navigate to Advanced Settings (collapsible)
3. View settings in read-only state with preset values
4. Click any field → Confirmation popup
5. Confirm "Yes, Allow Editing"
6. All advanced settings become editable
7. Make changes to filters or pipeline settings
8. Save configuration
9. Settings applied immediately
```

---

## 4. Data Structure

### 4.1 EHR Documents Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | Primary Key | Auto-increment |
| `name` | String | Document source name (e.g., "Previous Notes - Cardiology") |
| `resource_id` | String | Document type identifier (e.g., "previous_notes") |
| `filters` | JSON | Default filter values |
| `created_at` | Timestamp | Creation time |
| `updated_at` | Timestamp | Last update time |

**Notes:**
- Populated by tech team
- Dropdown shows entries from this table
- `resource_id` refers to document type

### 4.2 Summarizer Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | Primary Key | Auto-increment |
| `doctor_id` | Foreign Key | Doctor identifier |
| `name` | String | Summarizer name (required) |
| `purpose` | Text | Use case description |
| `pull_from_ehr` | Boolean | Enable EHR data pull |
| `allow_file_upload` | Boolean | Enable file upload |
| `allow_text_input` | Boolean | Enable text input |
| `ehr_document_id` | Foreign Key | Selected EHR document (nullable) |
| `ehr_prompt` | Text | Prompt for EHR data (nullable) |
| `upload_prompt` | Text | Prompt for file upload (nullable) |
| `text_prompt` | Text | Prompt for text input (nullable) |
| `primary_model` | String | Primary AI model (default: "claude-sonnet-4") |
| `fallback_model` | String | Fallback AI model (default: "claude-sonnet-4") |
| `avg_summarization_time` | Integer | Average time in seconds (default: 60) |
| `filter_values` | JSON | Customized filter values (nullable) |
| `active` | Boolean | Pipeline active status (default: true) |
| `create_intermediate` | Boolean | Create intermediate files (default: true) |
| `depends_on_pipelines` | JSON Array | Pipeline dependencies |
| `created_at` | Timestamp | Creation time |
| `updated_at` | Timestamp | Last update time |

**Notes:**
- `filter_values` overrides EHR Document defaults if provided
- Pipeline settings embedded in Summarizer table
- If `filter_values` is null, uses defaults from selected EHR Document

### 4.3 Filter Values JSON Structure

```json
{
  "organization_ids": "789, 012",
  "template_ids": "TEMPLATE_002",
  "keywords": "custom, keywords",
  "visit_types": "Follow-up",
  "document_types": "Consultation Note",
  "sorting_direction": "ascending",
  "pull_count": 5,
  "date_range_from": "2024-01-01",
  "date_range_to": "2024-12-31"
}
```

**Filter Fields:**
- `organization_ids`: Comma-separated (AthenaFlow)
- `template_ids`: Template ID (AdvancedMD)
- `keywords`: Comma-separated (AthenaOne, AdvancedMD)
- `visit_types`: Visit type (ECW)
- `document_types`: Document type (AdvancedMD, Charm)
- `sorting_direction`: "ascending" or "descending" (ECW)
- `pull_count`: Integer
- `date_range_from`: Date string
- `date_range_to`: Date string

**Note:** Database uses snake_case. Frontend may use camelCase but must map to snake_case when storing.

---

## 5. Form Structure

### Section 1: Basic Information
- Doctor's Email (auto-filled, required)
- EHR System (auto-filled, required)
- Name (required)
- Purpose/Use Case (required, large text area)

### Section 2: Functionality Settings
- Pull from EHR (checkbox, optional)
- Allow user to upload files (checkbox, optional)
- Allow user to Send Text to AI (checkbox, optional)
- Make available for Patient Recap (checkbox, optional)

### Section 3: Data Source Configuration
**Visible only when "Pull from EHR" enabled**

- **Resource Selection:**
  - Radio: "Select existing resource" OR "Request new resource"
  - If existing: Dropdown of resources for selected EHR
  - If new: Text input for resource description

- **Data Selection:**
  - Radio: "Document count" OR "Date range"
  - Document count: Number input (1-N)
  - Date range: From/To date pickers

- **Advanced Settings (Collapsible, Read-only until unlocked):**
  - Filter Settings: Organization IDs, Template IDs, Keywords, Visit Types, Document Types, Sorting Direction
  - Pipeline Settings: Create Intermediate (checkbox, default: true), Depends on Pipelines (comma-separated)

### Section 4: Prompt Configuration
- Summarization Prompt for EHR Data (required if EHR pull enabled)
- Summarization Prompt for PDF Upload (required if file upload enabled)
- Summarization Prompt for Send Text to AI (required if text input enabled)

### Section 5: Technical Configuration
- Primary Model (dropdown, default: claude-sonnet-4)
- Fallback Model (dropdown, default: claude-sonnet-4)
- Average Summarization Time (number input, default: 60 seconds)

---

## 6. Supported EHR Systems

| EHR System | Document Types | Date Parameter | Retrieval Method |
|------------|----------------|----------------|------------------|
| **ECW** | Previous Notes XML | 3 years ago to 3 days ago | Date Range |
| **AthenaOne** | Previous Notes, Lab Results, Clinical Documents, Imaging Results, Problems List | Note date | Single Document |
| **AthenaFlow** | Previous Notes | 1 year ago to recent | Date Range |
| **AdvancedMD** | Previous Notes, Clinical Documents | Document date | Single Document |
| **Greenway** | Previous Notes | No date | Single Document (CCDA only) |
| **Charm** | Previous Notes, Clinical Documents (PDF) | Document date | Single Document |
| **DrChrono** | Previous Notes | Note date | Single Document |

### Advanced Filters by EHR

- **AthenaOne - Clinical Documents:** Keywords filter
- **AthenaFlow - Previous Notes:** Organization IDs filter
- **AdvancedMD - Previous Notes:** Template IDs filter
- **AdvancedMD - Clinical Documents:** Document Types, Keywords filters
- **ECW - Previous Notes:** Visit Types, Sorting Direction filters

---

**Document End**
