# EHR Summarizer - Features & User Flows

> **Branch:** `cleanup/file-structure`
> **Last Updated:** January 1, 2026

This document outlines all user-facing features and interaction flows in the EHR Summarizer Self-Service Portal.

---

## 📋 Table of Contents

1. [Dashboard Overview](#dashboard-overview)
2. [Doctor Management](#doctor-management)
3. [Summarizer Creation & Management](#summarizer-creation--management)
4. [Template Configuration](#template-configuration)
5. [Copy & Transfer Operations](#copy--transfer-operations)
6. [Advanced Features](#advanced-features)

---

## Dashboard Overview

### Main Dashboard (Doctors View)

**Entry Point:** Application loads to this view

**Features:**
- View all doctors across different EHR systems
- Search doctors by name or email
- Filter doctors by practice (Neurology, Cardiology, Orthopedics, Dermatology)
- Color-coded doctor cards by EHR system (ECW, AthenaOne, AthenaFlow, AdvancedMD, Charm, DrChrono, Greenway)

**Available Actions per Doctor:**
1. **View All** - Navigate to comprehensive doctor configuration view
2. **Add** (dropdown) - Create new summarizer
3. **Configure** - Set up template configurations
4. **Bulk Transfer** (top-right button) - Access bulk operations

---

## Doctor Management

### Doctor Card Information
Each doctor card displays:
- Doctor name and initials badge
- Specialty
- EHR system (color-coded badge)
- Masked email address (e.g., `s***_22@g**l.com`)
- Number of active summarizers

### Search & Filter
**User Flow:**
1. Type in search box to filter by name/email (real-time)
2. Select practice from dropdown to filter by specialty
3. Results update automatically

---

## Summarizer Creation & Management

### Creating a New Summarizer

**User Flow:**
1. Click **"Add"** button on doctor card
2. Dropdown appears with option: "Add Summarizer"
3. Click "Add Summarizer" to open creation form

### Summarizer Creation Form

**Section 1: Basic Information**
- **Doctor's Email** (read-only, auto-filled)
- **EHR System** (read-only, auto-filled)
- **File Type*** (required) - Name/identifier for the summarizer
- **Purpose*** (required) - Description of what this summarizer does

**Section 2: Data Sources** (Choose one or more)
- ☑️ **Pull from EHR** - Extract data from Electronic Health Records
- ☑️ **Allow Upload** - Accept file uploads (PDF, images, etc.)
- ☑️ **Allow Text** - Accept pasted/typed text input

**Section 3: EHR Configuration** (if "Pull from EHR" is checked)

*Resource Selection:*
- Choose between:
  - **Use Existing Resource** - Select from predefined EHR resources
  - **Create New Resource** - Define custom resource (with description)

*EHR Resource Dropdown:* (dynamically populated based on doctor's EHR)
- Example for AthenaOne:
  - Previous Notes
    - Lab Results (PDF)
  - Clinical Documents → Discharge Summary
  - Clinical Documents → Previous Note (Other Doctor)
  - Clinical Documents (XML) → Previous Encounter
  - Imaging Results
  - Problems List

*Data Selection Method:*
- **Latest X Documents** - Get most recent N documents
- **Documents from Specific Date** - Select single date
- **Documents within Date Range** - Select from and to dates
- **How Far Back** - Specify years/months/days back
  - Option: Include "days back to" parameter
  - Option: "To Recent" (up to current date)

*Advanced Filters:* (varies by EHR resource)
- Organization IDs (list)
- Template IDs (list)
- Keywords (comma-separated)
- Visit Types
- Sorting Direction (ascending/descending)
- Document Types (list)

**Section 4: Prompts**

*Prompt Strategy:*
- **One prompt for all sources** (radio - default)
- **Separate prompts per source** (radio)

If "One prompt for all sources":
- **Common Prompt** (textarea) - Single prompt used for all data sources

If "Separate prompts per source":
- **EHR Prompt** (textarea, if Pull from EHR enabled)
- **Upload Prompt** (textarea, if Allow Upload enabled)
- **Text Prompt** (textarea, if Allow Text enabled)

*Helper:* Auto-generate prompts with "Generate Default Prompt" buttons

**Section 5: AI Model Selection**
- **Primary Model*** (dropdown)
  - Options: Claude 3.5 Sonnet, Claude 3 Sonnet, GPT-4 Turbo, GPT-4, GPT-3.5 Turbo
- **Fallback Model** (dropdown) - Used if primary fails
- **Average Summarization Time** (number, seconds) - Expected processing time

**Section 6: Advanced Settings** (expandable)
- ☑️ **Create Intermediate** - Generate intermediate processing steps
- **Depends on Summarizers** (multi-select) - List of prerequisite summarizers
- ☑️ **Active** - Enable/disable this summarizer

**Form Actions:**
- **Cancel** - Discard changes and return
- **Create Summarizer** - Save and create

### Copy from Existing Summarizer

**User Flow:**
1. In the Create Summarizer form, click **"Copy from Existing Summarizers"** button (top of form)
2. Modal opens showing all existing summarizers for this doctor
3. Select a summarizer to copy from
4. Form auto-fills with copied values
5. Modify as needed
6. Click "Create Summarizer"

**Benefits:**
- Saves time by reusing configurations
- Ensures consistency across similar summarizers
- Reduces errors in manual data entry

### Editing a Summarizer

**User Flow:**
1. Navigate to "View All" for a doctor
2. Click on a summarizer in the "Available Summarizers" section
3. Edit form opens with current values pre-filled
4. Modify fields as needed
5. Click "Update Summarizer" or "Cancel"

### Activating/Deactivating Summarizers

**User Flow:**
1. In the edit form, toggle the "Active" checkbox
2. Confirmation modal appears if changing active state
3. Confirm or cancel the change
4. Active summarizers show green "Active" badge
5. Inactive summarizers show gray "Inactive" badge

---

## Template Configuration

### Accessing Template Configuration

**User Flow:**
1. Click **"Configure"** button on doctor card
2. OR click **"View All"** → Navigate to "Summarizers" tab
3. Comprehensive template configuration table appears

### Template Configuration Table

**Structure:**
- **Rows:** Template sections (hierarchical)
  - Parent sections (bold, gray background)
  - Child sections (indented, blue tint)
  - Grandchild sections (more indented, white background)
- **Columns:** 5 Templates
  - General Template
  - Follow-up
  - Neurology
  - Initial Consultation
  - Patient Recap

**Special: Patient Recap Template**
- Single row at top
- Only applies to "Patient Recap" column
- All other columns show "—" (not applicable)

### Assigning Summarizers to Template Sections

**User Flow:**
1. Click on any cell (section + template combination)
2. If empty, shows **"+"** button
3. Click **"+"** to open summarizer picker dropdown
4. Select a summarizer from the list
5. **Action Selection Modal** appears with three options:

   **Action Options:**
   - **➕ Append** - Add content to end of section
   - **⬆️ Prepend** - Add content to beginning of section
   - **💡 Inform** - Provide context without direct insertion

6. Select action type
7. **Prompt Edit Modal** opens (optional)
   - Add custom instructions for this specific placement
   - Specify how to use the summarizer output
8. Click "Assign"
9. Summarizer appears in the cell with:
   - Action icon (➕/⬆️/💡)
   - Summarizer name
   - Color coding (blue for append, green for prepend, yellow for inform)

### Managing Cell Assignments

**Multiple Summarizers per Cell:**
1. Cells can have multiple summarizers
2. Click **"+"** at bottom of cell to add more
3. Each appears as a colored chip with action icon

**Removing Assignments:**
1. Click on summarizer chip in cell
2. Removal options appear
3. Confirm removal

**Editing Assignments:**
1. Click on summarizer chip
2. Prompt Edit Modal reopens
3. Modify instructions or action type
4. Save changes

### Jumping to Sections

**User Flow:**
1. Click on any summarizer chip in a cell
2. View jumps to detailed section editor (if applicable)
3. Can modify section-specific prompts

---

## Copy & Transfer Operations

### 1. Copy Doctor Configuration

**Purpose:** Copy entire doctor setup to new doctors

**User Flow:**
1. From dashboard, click Copy icon on doctor card (or use dedicated button)
2. **Copy Doctor Modal** opens showing:
   - Source doctor information (name, EHR, specialty)
   - Target EHR selection dropdown
   - Target doctor email fields (can add multiple)

3. **Select Target EHR:**
   - Choose target EHR system from dropdown
   - If **same EHR as source:**
     - Green checkmark appears
     - Message: "Same EHR - Full configuration will be copied"
     - Shows what will be copied:
       1. New Doctor ID created
       2. Doctor name auto-updated from email
       3. All copied: Summarizer prompts, Templates, Template→EHR mappings, Summarizer→Template mappings
       4. ✓ Ready to use immediately!

   - If **different EHR:**
     - Amber warning appears
     - Message: "Different EHR - Resource mapping required after copy"
     - Shows what will be copied:
       1. New Doctor ID created
       2. Doctor name auto-updated from email
       3. Copied: Summarizer prompts, Templates, Summarizer→Template mappings
       4. NOT copied: Template→EHR mappings (different resource IDs)
       5. ⚠️ Post-copy actions required:
          - Check if corresponding EHR resources available
          - Interface provided to update/map resources
          - Complete template→EHR mappings

4. **Enter Target Emails:**
   - Add email addresses (one or more)
   - Click **"+"** to add additional email fields
   - Click **"×"** to remove email fields
   - Counter shows how many doctors will receive configuration

5. **Execute Copy:**
   - Click **"Copy to N Doctor(s)"** button
   - If same EHR: Success message appears immediately
   - If different EHR: Resource Mapping Modal opens (see below)

### 2. Resource Mapping (Cross-EHR Copy)

**Triggered when:** Copying to different EHR system

**User Flow:**
1. **Resource Mapping Modal** opens showing all summarizers that need mapping
2. For each summarizer:
   - Shows summarizer name
   - Shows source doctor → target doctor
   - Shows source EHR and current resource
   - Dropdown to select corresponding resource in target EHR

3. **Map Resources:**
   - Select appropriate resource from target EHR for each summarizer
   - Resources are filtered by target EHR system
   - Must complete all mappings before proceeding

4. **Validate & Continue:**
   - Click **"Continue with Copy"**
   - System validates all mappings are complete
   - If incomplete: Error message
   - If complete: Copy executes with new mappings

### 3. Bulk Transfer Operations

**Purpose:** Copy configurations across multiple doctors simultaneously

**User Flow:**

**Step 1: Access Bulk Transfer**
1. Click **"Bulk Transfer"** button (top-right of dashboard)
2. Bulk Transfer page opens with side-by-side panels

**Step 2: Select Source Doctors**

*Source Doctors Panel (Left):*
- **Search:** Type to filter doctors by name/email
- **Filter:** Dropdown to filter by EHR system
- **Select Multiple:** Click checkboxes to select source doctors
- Selected doctors appear in blue chips above the list
- Click **"×"** on chip to deselect

**Step 3: Select Target Doctors**

*Target Doctors Panel (Right):*
- **Bulk Email Input:**
  - Paste comma or line-separated email addresses
  - System auto-selects matching doctors
- **Manual Selection:**
  - Click checkboxes on individual doctors
  - Cannot select doctors who are already sources
- Selected doctors appear in green chips above the list

**Step 4: Choose Copy Type**

Three options displayed as cards:
1. **Copy Summarizers** - Select specific summarizers to copy
2. **Copy Full Configuration** - All summarizers + templates
3. **Copy Templates Only** - Template configurations only

**Step 5: Select Summarizers** (if "Copy Summarizers" selected)
- List shows all summarizers from selected source doctors
- Check boxes to select which summarizers to copy
- Counter shows how many selected

**Step 6: Review & Execute**

*Review Section displays:*
- Number of source doctors selected
- Number of target doctors selected
- Copy type chosen
- Number of summarizers selected (if applicable)
- ⚠️ Warning if cross-EHR copy detected

*Execute:*
1. Click **"Execute Copy"** button
2. If same EHR: Progress bar shows copy operation
3. If cross-EHR: **Resource Mapping Modal** opens
   - Shows all summarizer→doctor combinations needing mapping
   - Map resources for each combination
   - Click **"Continue with Copy"**
4. Progress bar shows completion status
5. Success message displays number of doctors updated

**Step 7: Reset or Return**
- Click **"Cancel"** to return to dashboard
- After successful copy, form resets automatically
- Click **"Back to Dashboard"** to exit

---

## Advanced Features

### Background Prompts (Template Context)

**Purpose:** Provide additional context to template sections

**User Flow:**
1. In template configuration, access background prompts settings
2. Define prompts that inform multiple sections
3. Use placeholders like `{summary_content}` for dynamic content
4. Background prompts appear in "Inform" mode (💡)

### Dependent Summarizers

**Purpose:** Create processing pipelines where summarizers depend on others

**User Flow:**
1. In Advanced Settings, select "Depends on Summarizers"
2. Multi-select dropdown shows all available summarizers
3. Selected summarizers must complete before this one runs
4. System ensures correct execution order

### EHR-Specific Resource Filters

**Dynamic Filters by EHR:**
- **ECW:**
  - How Far Back (years/days parameters)
  - Visit Types (comma-separated)
  - Sorting Direction
  - Document Count

- **AthenaOne:**
  - Retrieval Method (latest/all/count)
  - Document Count
  - Keywords (for clinical documents)

- **AthenaFlow:**
  - How Far Back (years/to recent toggle)
  - Organization IDs (list)

- **AdvancedMD:**
  - Retrieval Method
  - Template IDs (list)
  - Document Types (list)
  - Keywords

- **Charm:**
  - Retrieval Method
  - Document Types (list)

- **DrChrono:**
  - Retrieval Method
  - Document Count

- **Greenway:**
  - CCDA only (no filters)

### Email Masking

**Privacy Feature:**
- All email addresses displayed with masking
- Pattern: `R***_22@G**l.com`
- First character + asterisks + last 2 chars @ First char + asterisks + last char . domain

### Form Auto-Fill & Smart Defaults

**Features:**
- Default prompts generated based on data source type
- Form remembers selections within session
- Pre-filled values when copying
- Smart defaults for common configurations

---

## User Interaction Summary

### Click Interactions
1. **Doctor cards** - Select/expand doctor
2. **Buttons** - Primary actions (Create, Save, Copy, etc.)
3. **Dropdowns** - Select from options
4. **Checkboxes** - Enable/disable features or multi-select
5. **Chips/Badges** - Click to edit or remove
6. **Table cells** - Click to assign summarizers
7. **Modal overlays** - Click outside to close (some)

### Form Inputs
1. **Text fields** - Single-line input
2. **Textareas** - Multi-line input (prompts, descriptions)
3. **Dropdowns/Selects** - Choose from predefined options
4. **Multi-select** - Choose multiple options
5. **Number inputs** - Numeric values with validation
6. **Date pickers** - Calendar selection
7. **Radio buttons** - Mutually exclusive choices
8. **Checkboxes** - Boolean on/off toggles

### Navigation
1. **View switching** - Doctors → Summarizers → Templates
2. **Back buttons** - Return to previous view
3. **Breadcrumbs** - Show current location (implied)
4. **Tabs** - Switch between modes (Summarizers/Variables)

### Modals & Overlays
1. **Copy Doctor Modal** - Doctor configuration copying
2. **Copy Summarizer Modal** - Summarizer template selection
3. **Resource Mapping Modal** - Cross-EHR resource mapping
4. **Action Selection Modal** - Choose append/prepend/inform
5. **Prompt Edit Modal** - Edit section-specific prompts
6. **Confirmation Modals** - Confirm destructive actions

### Real-time Feedback
1. **Search** - Instant filtering as you type
2. **Form validation** - Immediate error messages
3. **Color coding** - Visual status indicators
4. **Progress bars** - Operation status
5. **Loading states** - Processing indicators
6. **Success/Error messages** - Action confirmation

---

## Keyboard Shortcuts & Accessibility

*(Future enhancement - not yet implemented)*

Planned shortcuts:
- `Esc` - Close modals
- `Ctrl/Cmd + S` - Save form
- `Tab` - Navigate form fields
- `Enter` - Submit forms

---

## Error Handling & Validation

### Form Validation
- Required fields marked with `*`
- Real-time validation on blur
- Error messages appear below fields
- Submit button disabled until valid

### Error Messages
- Missing required fields: "This field is required"
- Invalid email format: "Please enter a valid email address"
- Empty selections: "Please select at least one option"
- Cross-EHR validation: "Resource mapping required for cross-EHR copies"

### Success Confirmations
- Copy operations: "Successfully copied to N doctor(s)!"
- Summarizer creation: "Summarizer created successfully!"
- Template updates: "Template configuration saved!"

---

## Technical Notes for Developers

### State Management
- React useState hooks throughout
- Local state in components
- No global state management (Redux/Context) yet
- Props drilling for shared state

### Component Architecture
```
App.jsx (main container)
├── DoctorsView.jsx
│   └── CopyDoctorModal.jsx
├── SummarizersVariablesView.jsx
│   ├── ActionSelectionModal.jsx
│   └── PromptEditModal.jsx
└── BulkTransferPage.jsx
    └── Resource Mapping (inline)
```

### Data Flow
1. User interaction triggers event handler
2. Event handler updates state
3. State change triggers re-render
4. UI updates to reflect new state

### Future Enhancements
- API integration for backend persistence
- Real-time collaboration features
- Undo/redo functionality
- Keyboard shortcuts
- Accessibility improvements (ARIA labels, screen reader support)
- Export/import configurations
- Audit logs
- Version control for configurations

---

## Support & Documentation

For questions or issues:
- Create an issue at: https://github.com/shilpijc/EHR_pipeline/issues
- Reference this document for feature explanations
- Check code comments for technical details

---

**Document Version:** 1.0
**Branch:** cleanup/file-structure
**Last Updated:** January 1, 2026
