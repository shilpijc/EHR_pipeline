# App Copy Inventory

This document contains all user-facing copy/text strings from the EHR Pipeline app, organized by category for easy review and refinement.

---

## 1. Page Headers and Titles

### Main Dashboard
| Copy | File | Context |
|------|------|---------|
| "Marvix Ops Dashboard" | `src/components/views/PageHeader.jsx` | Main page title |
| "Create summarizers and configure templates for healthcare providers" | `src/components/views/PageHeader.jsx` | Dashboard subtitle |

### Doctors List
| Copy | File | Context |
|------|------|---------|
| "Healthcare Providers" | `src/components/views/DoctorsView.jsx` | Section header |
| "Select a doctor to create summarizers or configure templates" | `src/components/views/DoctorsView.jsx` | Section description |

### Bulk Transfer Page
| Copy | File | Context |
|------|------|---------|
| "Bulk Transfer Operations" | `src/components/BulkTransferPage.jsx` | Page title |
| "Copy summarizers and configurations across multiple doctors" | `src/components/BulkTransferPage.jsx` | Page subtitle |

### Summarizers & Variables View
| Copy | File | Context |
|------|------|---------|
| "Available Summarizers" | `src/components/views/SummarizersVariablesView.jsx` | Section header |
| "Section / Subsection" | `src/components/views/SummarizersVariablesView.jsx` | Table header |

---

## 2. Navigation and Actions

### Button Labels
| Copy | File | Context |
|------|------|---------|
| "Bulk Transfer" | `src/components/views/PageHeader.jsx` | Header action button |
| "Add" | `src/components/views/DoctorCard.jsx` | Create dropdown trigger |
| "Configure" | `src/components/views/DoctorCard.jsx` | Doctor card action |
| "Back to Dashboard" | `src/components/BulkTransferPage.jsx` | Navigation back |
| "Back to Doctors" | `src/components/views/SummarizersVariablesView.jsx` | Navigation back |
| "Cancel" | Multiple files | Modal/form cancel action |
| "Save" | `src/components/views/SummarizersVariablesView.jsx` | Save action |
| "Delete" | `src/components/views/SummarizersVariablesView.jsx` | Delete confirmation |
| "Next" | `src/components/modals/AddSectionModal.jsx` | Multi-step wizard |
| "Back" | `src/components/modals/AddSectionModal.jsx` | Multi-step wizard |
| "Execute Copy" | `src/components/BulkTransfer/ReviewSection.jsx` | Execute bulk operation |
| "Copying..." | `src/components/BulkTransfer/ReviewSection.jsx` | Loading state |
| "Continue with Copy" | `src/components/BulkTransfer/ResourceMappingModal.jsx` | Confirm action |
| "Add New Section" | `src/components/views/SummarizersVariablesView.jsx` | Add section button |
| "Add another email" | `src/components/modals/CopyDoctorModal.jsx` | Add email field |
| "Add Section" | `src/components/modals/AddSectionModal.jsx` | Final submit |
| "Assign Summarizer" | `src/components/modals/PromptEditModal.jsx` | Assign action |
| "Delete Summarizer" | `src/components/views/SummarizersVariablesView.jsx` | Delete summarizer action |

### Tab/Mode Labels
| Copy | File | Context |
|------|------|---------|
| "Summarizers" | `src/components/views/SummarizersVariablesView.jsx` | Mode toggle |

---

## 3. Form Labels and Placeholders

### Search and Filter
| Copy | File | Context |
|------|------|---------|
| "Search doctors by name or email..." | `src/components/views/SearchFilters.jsx` | Search placeholder |
| "Search doctors..." | `src/components/BulkTransfer/DoctorSelectionPanel.jsx` | Search placeholder |
| "All Practices" | `src/components/views/SearchFilters.jsx` | Dropdown default |
| "All EHR Systems" | `src/components/BulkTransfer/DoctorSelectionPanel.jsx` | Dropdown default |

### Copy Doctor Modal
| Copy | File | Context |
|------|------|---------|
| "Target EHR System *" | `src/components/modals/CopyDoctorModal.jsx` | Field label |
| "Select target EHR system..." | `src/components/modals/CopyDoctorModal.jsx` | Dropdown placeholder |
| "Target Doctor Email(s) * (Configuration will be copied to these doctors)" | `src/components/modals/CopyDoctorModal.jsx` | Field label |
| "doctor1@example.com" (dynamic: doctor${index + 1}@example.com) | `src/components/modals/CopyDoctorModal.jsx` | Email placeholder |

### Add Section Modal
| Copy | File | Context |
|------|------|---------|
| "Section Name *" | `src/components/modals/AddSectionModal.jsx` | Field label |
| "e.g., Review of Systems, Medication List" | `src/components/modals/AddSectionModal.jsx` | Input placeholder |
| "Enter a descriptive name for your new section" | `src/components/modals/AddSectionModal.jsx` | Helper text |
| "Position Type" | `src/components/modals/AddSectionModal.jsx` | Field label |
| "Before" | `src/components/modals/AddSectionModal.jsx` | Position option |
| "After" | `src/components/modals/AddSectionModal.jsx` | Position option |
| "First Child" | `src/components/modals/AddSectionModal.jsx` | Position option |
| "Choose a section..." | `src/components/modals/AddSectionModal.jsx` | Dropdown placeholder |
| "Choose a parent section..." | `src/components/modals/AddSectionModal.jsx` | Dropdown placeholder |
| "Select section to insert before" | `src/components/modals/AddSectionModal.jsx` | Dynamic label |
| "Select section to insert after" | `src/components/modals/AddSectionModal.jsx` | Dynamic label |
| "Select parent section" | `src/components/modals/AddSectionModal.jsx` | Dynamic label |
| "Template key: {template}" | `src/components/modals/AddSectionModal.jsx` | Template info |

### Bulk Transfer
| Copy | File | Context |
|------|------|---------|
| "Bulk Email Input (comma or line separated)" | `src/components/BulkTransferPage.jsx` | Field label |
| "Enter email addresses separated by commas or new lines..." | `src/components/BulkTransferPage.jsx` | Textarea placeholder |

### Prompt Edit Modal
| Copy | File | Context |
|------|------|---------|
| "Action Type *" | `src/components/modals/PromptEditModal.jsx` | Field label |
| "Custom Instructions (Optional)" | `src/components/modals/PromptEditModal.jsx` | Field label |
| "Add any specific instructions for how this summarizer should be used in this section..." | `src/components/modals/PromptEditModal.jsx` | Textarea placeholder |

### Inform Instructions
| Copy | File | Context |
|------|------|---------|
| "Inform Instructions (optional)" | `src/components/views/SummarizersVariablesView.jsx` | Field label |
| "Enter instructions for this inform action..." | `src/components/views/SummarizersVariablesView.jsx` | Textarea placeholder |

### Resource Mapping
| Copy | File | Context |
|------|------|---------|
| "Target Resource ({EHR}) *" | `src/components/BulkTransfer/ResourceMappingModal.jsx` | Field label |
| "Select resource..." | `src/components/BulkTransfer/ResourceMappingModal.jsx` | Dropdown placeholder |
| "Source Resource ({EHR}):" | `src/components/BulkTransfer/ResourceMappingModal.jsx` | Field label |

---

## 4. Modals and Dialogs

### Modal Titles
| Copy | File | Context |
|------|------|---------|
| "Copy Doctor Configuration" | `src/components/modals/CopyDoctorModal.jsx` | Modal title |
| "Add New Section" | `src/components/modals/AddSectionModal.jsx` | Modal title |
| "Step {n} of 3" | `src/components/modals/AddSectionModal.jsx` | Step indicator |
| "Choose Action Type" | `src/components/modals/ActionSelectionModal.jsx` | Modal title |
| "Assign Summarizer to Section" | `src/components/modals/PromptEditModal.jsx` | Modal title |
| "Resource Mapping Required" | `src/components/BulkTransfer/ResourceMappingModal.jsx` | Modal title |
| "Map EHR resources for cross-EHR copies" | `src/components/BulkTransfer/ResourceMappingModal.jsx` | Modal subtitle |
| "Create New" | `src/components/views/SummarizersVariablesView.jsx` | Modal title |
| "Delete Assignment?" | `src/components/views/SummarizersVariablesView.jsx` | Confirmation title |
| "Delete Summarizer?" | `src/components/views/SummarizersVariablesView.jsx` | Confirmation title |

### Modal Descriptions
| Copy | File | Context |
|------|------|---------|
| "This action cannot be undone" | `src/components/views/SummarizersVariablesView.jsx` | Delete warning |
| "This will remove all assignments" | `src/components/views/SummarizersVariablesView.jsx` | Delete warning subtitle |
| "Are you sure you want to remove this summarizer assignment from this cell?" | `src/components/views/SummarizersVariablesView.jsx` | Delete confirmation |
| "Are you sure you want to delete {name}?" | `src/components/views/SummarizersVariablesView.jsx` | Delete summarizer confirmation |
| "This will permanently remove the summarizer and all its assignments from all template sections. This action cannot be undone." | `src/components/views/SummarizersVariablesView.jsx` | Delete warning detail |
| "Choose what you want to create for {doctor name}" | `src/components/views/SummarizersVariablesView.jsx` | Create type selection |
| "Choose the template where the new section should live" | `src/components/modals/AddSectionModal.jsx` | Step 1 instruction |
| "Adding a section to {template name}" | `src/components/modals/AddSectionModal.jsx` | Step 2 context |
| "Where should \"{section name}\" be placed?" | `src/components/modals/AddSectionModal.jsx` | Step 3 question |
| "Choose a position relative to an existing section" | `src/components/modals/AddSectionModal.jsx` | Step 3 instruction |
| "How should this summarizer be used? *" | `src/components/modals/ActionSelectionModal.jsx` | Action prompt |

### Dropdown Menu Items
| Copy | File | Context |
|------|------|---------|
| "Add Summarizer" | `src/components/views/DoctorCard.jsx` | Dropdown option |
| "Extract and summarize data from EHR" | `src/components/views/DoctorCard.jsx` | Option description |

---

## 5. Status and Feedback Messages

### Alert Messages
| Copy | File | Context |
|------|------|---------|
| "Successfully copied to {n} doctor(s)!" | `src/components/BulkTransferPage.jsx` | Success alert |
| "Error during copy operation: {message}" | `src/components/BulkTransferPage.jsx` | Error alert |
| "Please complete all resource mappings" | `src/components/BulkTransfer/ResourceMappingModal.jsx` | Validation alert |
| "Please enter at least one email address" | `src/App.jsx` | Validation alert |
| "Please select target EHR system" | `src/App.jsx` | Validation alert |
| "Configuration copied to {n} doctor(s) successfully!\n\n✓ Full configuration copied\n✓ Ready to use immediately" | `src/App.jsx` | Success alert |
| "Error: No section selected" | `src/App.jsx` | Error alert |
| "Please enter a section name" | `src/App.jsx` | Validation alert |
| "Please select a parent section" | `src/App.jsx` | Validation alert |
| "Please select both parent and child sections" | `src/App.jsx` | Validation alert |
| "Section created successfully!" | `src/App.jsx` | Success alert |
| "Please enter a file type" | `src/App.jsx` | Validation alert |
| "Please select at least one file type (Pull from EHR, Upload, or Paste Text)" | `src/App.jsx` | Validation alert |
| "Please select a resource" | `src/App.jsx` | Validation alert |
| "Please enter a summarization prompt" | `src/App.jsx` | Validation alert |
| "Please enter a prompt for EHR data" | `src/App.jsx` | Validation alert |
| "Please enter a prompt for PDF upload" | `src/App.jsx` | Validation alert |
| "Please enter a prompt for pasted text" | `src/App.jsx` | Validation alert |
| "Please select a primary model" | `src/App.jsx` | Validation alert |
| "Please select a fallback model" | `src/App.jsx` | Validation alert |
| "Summarizer {activated/deactivated} successfully!" | `src/App.jsx` | Status alert |
| "Configuration saved for {template} template!" | `src/App.jsx` | Save alert |
| "Patient Recap configuration saved!" | `src/App.jsx` | Save alert |

### Progress Indicators
| Copy | File | Context |
|------|------|---------|
| "Copying configurations..." | `src/components/BulkTransfer/ExecutionProgress.jsx` | Progress label |
| "{current} / {total}" | `src/components/BulkTransfer/ExecutionProgress.jsx` | Progress count |

### Empty States
| Copy | File | Context |
|------|------|---------|
| "No summarizers available. Create one first." | `src/components/views/SummarizersVariablesView.jsx` | Empty dropdown |
| "No summarizers created yet" | `src/components/views/SummarizersVariablesView.jsx` | Empty summarizers bar |
| "No summarizers available for selected source doctors" | `src/components/BulkTransfer/SummarizerSelection.jsx` | Empty state |
| "No existing sections found in this template. Please add at least one section first." | `src/components/modals/AddSectionModal.jsx` | Empty state warning |
| "(no summarizers yet)" | `src/components/views/SummarizersVariablesView.jsx` | Ghost section indicator |

### Validation States
| Copy | File | Context |
|------|------|---------|
| "Please select a template before continuing" | `src/components/modals/AddSectionModal.jsx` | Validation warning |
| "Please select a section to determine the position" | `src/components/modals/AddSectionModal.jsx` | Validation warning |

---

## 6. Domain-Specific Copy

### Template Names
| Copy | Key | File | Context |
|------|-----|------|---------|
| "General Template" | general | `src/components/views/SummarizersVariablesView.jsx` | Template name |
| "Follow-up" | followup | `src/components/views/SummarizersVariablesView.jsx` | Template name |
| "Neurology" | neurology | `src/components/views/SummarizersVariablesView.jsx` | Template name |
| "Initial Consultation" | initial | `src/components/views/SummarizersVariablesView.jsx` | Template name |

### Template Abbreviations
| Copy | Key | File | Context |
|------|-----|------|---------|
| "GEN" | general | `src/components/views/SummarizersVariablesView.jsx` | Table header |
| "FU" | followup | `src/components/views/SummarizersVariablesView.jsx` | Table header |
| "NEURO" | neurology | `src/components/views/SummarizersVariablesView.jsx` | Table header |
| "IC" | initial | `src/components/views/SummarizersVariablesView.jsx` | Table header |

### Medical Section Names (from templateHierarchy.js)
| Copy | Key | Parent |
|------|-----|--------|
| "Chief Complaint" | cc | - |
| "Primary Concern" | cc-primary | cc |
| "Detailed Description" | cc-primary-description | cc-primary |
| "Location" | cc-primary-location | cc-primary |
| "Duration of Symptoms" | cc-duration | cc |
| "Severity Assessment" | cc-severity | cc |
| "Pain Scale" | cc-severity-scale | cc-severity |
| "Impact on Daily Life" | cc-severity-impact | cc-severity |
| "History of Present Illness" | hpi | - |
| "Symptom Onset" | hpi-onset | hpi |
| "Exact Timing" | hpi-onset-timing | hpi-onset |
| "Circumstances" | hpi-onset-circumstances | hpi-onset |
| "Disease Progression" | hpi-progression | hpi |
| "Associated Symptoms" | hpi-associated | hpi |
| "Systemic Symptoms" | hpi-associated-systemic | hpi-associated |
| "Local Symptoms" | hpi-associated-local | hpi-associated |
| "Aggravating Factors" | hpi-aggravating | hpi |
| "Relieving Factors" | hpi-relieving | hpi |
| "Physical Examination" | pe | - |
| "General Appearance" | pe-general | pe |
| "Neurological Exam" | pe-neurological | pe |
| "Cranial Nerves" | pe-neuro-cranial | pe-neurological |
| "Motor Function" | pe-neuro-motor | pe-neurological |
| "Sensory Function" | pe-neuro-sensory | pe-neurological |
| "Cardiovascular Exam" | pe-cardiovascular | pe |
| "Inspection" | pe-cardio-inspection | pe-cardiovascular |
| "Auscultation" | pe-cardio-auscultation | pe-cardiovascular |
| "Respiratory Exam" | pe-respiratory | pe |
| "Assessment & Plan" | ap | - |
| "Primary Diagnosis" | ap-diagnosis | ap |
| "Supporting Evidence" | ap-diagnosis-evidence | ap-diagnosis |
| "Severity Classification" | ap-diagnosis-severity | ap-diagnosis |
| "Differential Diagnosis" | ap-differential | ap |
| "Treatment Plan" | ap-treatment | ap |
| "Medications" | ap-treatment-medications | ap-treatment |
| "Procedures" | ap-treatment-procedures | ap-treatment |
| "Lifestyle Modifications" | ap-treatment-lifestyle | ap-treatment |
| "Follow-up Instructions" | ap-followup | ap |

### Action Types
| Copy | Description | File |
|------|-------------|------|
| "Append" | "Add content at the end of the section" | `src/components/modals/ActionSelectionModal.jsx` |
| "Prepend" | "Add content at the beginning of the section" | `src/components/modals/ActionSelectionModal.jsx` |
| "Inform" | "Use as background information for the section" | `src/components/modals/ActionSelectionModal.jsx` |
| "Append (Selected)" | Selected state indicator | `src/components/views/SummarizersVariablesView.jsx` |
| "Prepend (Selected)" | Selected state indicator | `src/components/views/SummarizersVariablesView.jsx` |
| "Inform (Selected)" | Selected state indicator | `src/components/views/SummarizersVariablesView.jsx` |
| "Already Used" | Disabled state indicator | `src/components/views/SummarizersVariablesView.jsx` |

### Copy Types (Bulk Transfer)
| Copy | Description | File |
|------|-------------|------|
| "Copy Summarizers" | "Select specific summarizers to copy" | `src/components/BulkTransfer/CopyTypeSelector.jsx` |
| "Copy Full Configuration" | "All summarizers + templates" | `src/components/BulkTransfer/CopyTypeSelector.jsx` |
| "Copy Templates Only" | "Template configurations only" | `src/components/BulkTransfer/CopyTypeSelector.jsx` |
| "Selected Summarizers" | Display label | `src/components/BulkTransfer/ReviewSection.jsx` |
| "Full Configuration" | Display label | `src/components/BulkTransfer/ReviewSection.jsx` |
| "Templates Only" | Display label | `src/components/BulkTransfer/ReviewSection.jsx` |

### EHR Copy Info
| Copy | File | Context |
|------|------|---------|
| "Same EHR - Full configuration will be copied" | `src/components/modals/CopyDoctorModal.jsx` | Same EHR indicator |
| "Different EHR - Resource mapping required after copy" | `src/components/modals/CopyDoctorModal.jsx` | Different EHR warning |
| "Same EHR - Complete Copy" | `src/components/modals/CopyDoctorModal.jsx` | Info box title |
| "Different EHR - Partial Copy (Mapping Required)" | `src/components/modals/CopyDoctorModal.jsx` | Info box title |
| "Cross-EHR Copy Detected" | `src/components/BulkTransfer/ReviewSection.jsx` | Warning title |
| "Resource mapping will be required for summarizers that pull from EHR." | `src/components/BulkTransfer/ReviewSection.jsx` | Warning message |

### Copy Process Steps (Same EHR)
| Copy | File |
|------|------|
| "Copy of account created with new Doctor ID" | `src/components/modals/CopyDoctorModal.jsx` |
| "Doctor Name updated automatically from email" | `src/components/modals/CopyDoctorModal.jsx` |
| "All copied: Summarizer prompts, Templates, Template section → EHR mappings, Summarizer → Template mappings" | `src/components/modals/CopyDoctorModal.jsx` |
| "✓ Ready to use immediately - No additional configuration needed!" | `src/components/modals/CopyDoctorModal.jsx` |

### Copy Process Steps (Different EHR)
| Copy | File |
|------|------|
| "Copied: Summarizer prompts, Templates, Summarizer → Template mappings" | `src/components/modals/CopyDoctorModal.jsx` |
| "NOT copied: Template section → EHR mappings (different resource IDs)" | `src/components/modals/CopyDoctorModal.jsx` |
| "⚠️ Post-Copy Actions Required:" | `src/components/modals/CopyDoctorModal.jsx` |
| "• Check if corresponding EHR resources are available for pulled summarizers" | `src/components/modals/CopyDoctorModal.jsx` |
| "• Interface will be provided to update/map resources" | `src/components/modals/CopyDoctorModal.jsx` |
| "• Complete template section → EHR mappings" | `src/components/modals/CopyDoctorModal.jsx` |

---

## 7. Tooltips and Hints

### Button Tooltips
| Copy | File | Context |
|------|------|---------|
| "Add summarizer" | `src/components/views/SummarizersVariablesView.jsx` | Empty cell button |
| "Add another summarizer" | `src/components/views/SummarizersVariablesView.jsx` | Cell with summarizers |
| "Add summarizer to Patient Recap" | `src/App.jsx` | Patient recap cell |
| "Delete this assignment" | `src/components/views/SummarizersVariablesView.jsx` | Delete badge button |
| "Delete this summarizer and all its assignments" | `src/components/views/SummarizersVariablesView.jsx` | Delete card button |
| "Edit summarizer" | `src/App.jsx` | Edit summarizer button |
| "Remove email" | `src/components/modals/CopyDoctorModal.jsx` | Remove email field |

### Action Tooltips (Dynamic)
| Copy | File | Context |
|------|------|---------|
| "Append to section" | `src/components/views/SummarizersVariablesView.jsx` | Append button |
| "Prepend to section" | `src/components/views/SummarizersVariablesView.jsx` | Prepend button |
| "Inform context" | `src/components/views/SummarizersVariablesView.jsx` | Inform button |
| "Already appending to {section}" | `src/components/views/SummarizersVariablesView.jsx` | Disabled append |
| "Already prepending to {section}" | `src/components/views/SummarizersVariablesView.jsx` | Disabled prepend |
| "Already {action} in {section}" | `src/components/views/SummarizersVariablesView.jsx` | Cross-section usage |

### Info Box
| Copy | File | Context |
|------|------|---------|
| "Select target EHR to see what will be copied" | `src/components/modals/CopyDoctorModal.jsx` | Pre-selection info |
| "The copy scope differs based on whether the target doctors use the same EHR system as the source doctor." | `src/components/modals/CopyDoctorModal.jsx` | Explanation |

### Preview
| Copy | File | Context |
|------|------|---------|
| "Preview" | `src/components/modals/AddSectionModal.jsx` | Preview box title |
| "\"{name}\" will be inserted {position} \"{section}\"" | `src/components/modals/AddSectionModal.jsx` | Position preview |

---

## 8. Data Labels

### Section Headers
| Copy | File | Context |
|------|------|---------|
| "Source Doctors" | `src/components/BulkTransferPage.jsx` | Panel header |
| "Target Doctors" | `src/components/BulkTransferPage.jsx` | Panel header |
| "Copy Type" | `src/components/BulkTransfer/CopyTypeSelector.jsx` | Section header |
| "Select Summarizers" | `src/components/BulkTransfer/SummarizerSelection.jsx` | Section header |
| "Review & Execute" | `src/components/BulkTransfer/ReviewSection.jsx` | Section header |
| "Legend" | `src/components/views/SummarizersVariablesView.jsx` | Legend section |
| "Copying Configuration From:" | `src/components/modals/CopyDoctorModal.jsx` | Info box label |

### Table/List Labels
| Copy | File | Context |
|------|------|---------|
| "Selected ({count})" | `src/components/BulkTransfer/SelectedDoctorsList.jsx` | Selection count |
| "{count} selected" | `src/components/BulkTransfer/ReviewSection.jsx` | Review count |
| "{count} doctor(s) will receive this configuration" | `src/components/modals/CopyDoctorModal.jsx` | Email count |
| "Source Doctors" | `src/components/BulkTransfer/ReviewSection.jsx` | Review label |
| "Target Doctors" | `src/components/BulkTransfer/ReviewSection.jsx` | Review label |
| "Selected Summarizers" | `src/components/BulkTransfer/ReviewSection.jsx` | Review label |

### Modal Labels
| Copy | File | Context |
|------|------|---------|
| "Summarizer:" | `src/components/modals/ActionSelectionModal.jsx` | Field label |
| "Section:" | `src/components/modals/PromptEditModal.jsx` | Field label |
| "Template:" | `src/components/modals/PromptEditModal.jsx` | Field label |

### Badge/Status Text
| Copy | File | Context |
|------|------|---------|
| "Active" | `src/components/views/SummarizersVariablesView.jsx` | Status badge |
| "Inactive" | `src/components/views/SummarizersVariablesView.jsx` | Status badge |
| "(child)" | `src/components/modals/AddSectionModal.jsx` | Section level indicator |
| "EHR" | `src/components/views/SummarizersVariablesView.jsx` | EHR suffix display |

### Legend Items
| Copy | Description | File |
|------|-------------|------|
| "➕ Append to section" | Legend item | `src/components/views/SummarizersVariablesView.jsx` |
| "⬆️ Prepend to section" | Legend item | `src/components/views/SummarizersVariablesView.jsx` |
| "💡 Inform context" | Legend item | `src/components/views/SummarizersVariablesView.jsx` |
| "— No configuration" | Legend item | `src/components/views/SummarizersVariablesView.jsx` |

---

## 9. Default Prompts (from constants/defaultPrompts.js)

### Document Type Prompts
| Document Type | Prompt |
|---------------|--------|
| "Previous Notes" | "Summarize the key findings, diagnoses, and treatment plans from the previous clinical notes. Include relevant dates and any changes in patient condition." |
| "Lab Results" | "Extract and summarize the key laboratory values, highlighting any abnormal results and trends. Include reference ranges where applicable." |
| "Clinical Documents" | "Summarize the clinical document, focusing on the main findings, diagnoses, and recommendations. Include relevant dates and context." |
| "Imaging Results" | "Summarize the imaging findings, including any abnormalities, measurements, and clinical significance. Reference the imaging modality and date." |
| "Problems List" | "Extract and summarize the patient's active and resolved problems, including diagnoses and their current status." |

### Background Prompts
| Type | Prompt |
|------|--------|
| "lab" | "The doctor has provided a Lab Reports Summary: {summary_content}\n\nUse this information to inform relevant sections, noting dates and key findings." |
| "notes" | "The doctor has provided a Previous Clinical Notes Summary: {summary_content}\n\nUse this to provide context from prior visits." |
| "imaging" | "The doctor has provided an Imaging Reports Summary: {summary_content}\n\nUse this to correlate imaging findings with clinical presentation." |
| "medication" | "The doctor has provided a Medication Summary: {summary_content}\n\nUse this for medication reconciliation and treatment planning." |

---

## 10. Action Descriptions (Radio Options)

### Action Selection Modal
| Action | Title | Description | Emoji |
|--------|-------|-------------|-------|
| append | "Append to section" | "Add content at the end of the section" | ➕ |
| prepend | "Prepend to section" | "Add content at the beginning of the section" | ⬆️ |
| inform | "Inform context" | "Use as background information for the section" | 💡 |

### Prompt Edit Modal (Radio Labels)
| Copy | File |
|------|------|
| "➕ Append to section" | `src/components/modals/PromptEditModal.jsx` |
| "⬆️ Prepend to section" | `src/components/modals/PromptEditModal.jsx` |
| "💡 Inform context" | `src/components/modals/PromptEditModal.jsx` |

---

## 11. Create Type Options

### Create Type Modal
| Type | Title | Description | Emoji |
|------|-------|-------------|-------|
| summarizer | "Add Summarizer" | "Add a new summarizer to extract and summarize data from EHR" | 📊 |

---

## Notes for Refinement

### Potential Improvements
1. **Consistency**: Some buttons use "Add" while others use "Create" - standardize terminology
2. **Verbosity**: Some alert messages are very detailed - consider simplifying
3. **Technical Terms**: Terms like "EHR", "summarizer", "prepend" may need user-friendly alternatives or tooltips
4. **Dynamic Text**: Many strings include dynamic values - ensure they read naturally with all possible values
5. **Action Verbs**: Standardize between "Copy", "Execute", "Save" for similar actions
6. **Error Messages**: Make error messages more actionable and user-friendly

### Copy Categories by Priority for Review
1. **High Priority**: Page titles, button labels, error messages (users see these most)
2. **Medium Priority**: Form labels, tooltips, status messages
3. **Lower Priority**: Technical descriptions, advanced feature copy

---

*Last updated: Generated from codebase analysis*

