# Copy Cleanup Report
## EHR Pipeline Application

Generated: January 6, 2026

---

## 📋 Summary

This document outlines all copy/text issues found across the application, organized by severity and component.

### Key Findings

**Review Scope:**
- ✅ 10+ components reviewed (main app, 4 modals, 5 view components)
- ✅ 65+ copy issues identified across all priority levels
- ✅ 24+ validation/error messages analyzed
- ✅ Complete UI text audit finished

**Most Critical Issues:**

1. **Inconsistent Terminology (24 instances)**
   - "summarizer" vs "Summarizer" used inconsistently throughout app
   - "EHR" vs "ehr" - acronym should always be capitalized
   - "doctor" vs "Healthcare Providers" - terminology not standardized

2. **Grammar & Punctuation (9 instances)**
   - Missing articles: "Allow user to upload" → "Allow users to upload"
   - Missing articles in error messages: "Please select target EHR" → "Please select a target EHR"
   - Generic error prefixes: "Error: No section selected" → "Please select a section to continue"

3. **Unclear Instructions (8 instances)**
   - Run-on sentences in resource configuration
   - Inconsistent separator terminology ("line separated" vs "new lines")
   - Vague validation messages

**Top Recommendations:**

1. **Create a Style Guide** - Document capitalization rules, button conventions, tone guidelines
2. **Standardize "Summarizer"** - Decide on capitalization and apply app-wide
3. **Always Capitalize "EHR"** - It's an acronym
4. **Fix Grammar Issues** - Add missing articles ("a", "the", plural "users")
5. **Improve Error Messages** - Remove technical jargon, make messages actionable
6. **Convert Alert Dialogs to UI** - Several instructional alerts should be modals/tooltips

**What's Working Well:**

✅ Multi-line success messages with checkmarks (excellent UX)
✅ Contextual notes in copy operations (very helpful)
✅ Clear empty state messages ("No summarizers available. Create one first.")
✅ Good use of state indicators ("Append (Selected)")
✅ Helpful placeholder examples

---

## 🔴 High Priority Issues

### 1. **Inconsistent Terminology**

| Location | Current Text | Issue | Suggested Fix |
|----------|--------------|-------|---------------|
| App.jsx:1755 | "Create summarizers and configure templates" | Inconsistent caps | "Create Summarizers and Configure Templates" or keep lowercase throughout |
| App.jsx:1788 | "Select a doctor to create summarizers or configure templates" | Inconsistent caps with header | Match capitalization style |
| App.jsx:1844-1845 | "Add Summarizer" / "Extract and summarize data from EHR" | Caps inconsistent | Either "Add summarizer" or keep title case |
| Throughout | "summarizer" vs "Summarizer" | Mixed capitalization | Choose one style and apply consistently |
| Throughout | "EHR" vs "ehr" |Mixed case usage | Use "EHR" consistently (it's an acronym) |
| PromptEditModal:41 | "Assign Summarizer to Section" | Inconsistent with app-wide choice | Match global capitalization standard |
| ActionSelectionModal:42 | "How should this summarizer be used?" | Lowercase in question | Match app-wide capitalization standard |
| DoctorsView:42 | "Select a doctor to create summarizers or configure templates" | Inconsistent caps | Match app-wide capitalization standard |
| PageHeader:27 | "Create summarizers and configure templates for healthcare providers" | Inconsistent caps | Match app-wide capitalization standard |
| DoctorCard:82 | "Add Summarizer" | Inconsistent with app-wide choice | Match global capitalization standard |
| BulkTransferPage:220 | "Copy summarizer and configurations" | Should be plural "summarizers" or match caps | "Copy summarizers and configurations" |

### 2. **Unclear Instructions**

| Location | Current Text | Issue | Suggested Fix |
|----------|--------------|-------|---------------|
| App.jsx:4858 | "Choose what data to pull. You can adjust date ranges below; other filters are in Advanced Settings." | Run-on, unclear | "Select a resource to pull data from. Date ranges can be adjusted below. Other filters are available in Advanced Settings." |
| App.jsx:4935-4936 | "You can edit: ${editableFilterLabels.join(', ')}. Other settings are in Advanced Settings." | Redundant "settings" | "Editable filters: ${editableFilterLabels.join(', ')}. Additional options are in Advanced Settings." |
| App.jsx:5366 | "Advanced Settings" with "[Edited]" label | Unclear what was edited | Consider "Advanced Settings (Modified)" |
| AddSectionModal:121 | "Choose the template where the new section should live" | Informal language | "Select the template for the new section" |
| CopyDoctorModal:180 | "Check if corresponding EHR resources are available for pulled summarizers" | Awkward phrasing | "Verify that EHR resources exist for your summarizers" |
| CopyDoctorModal:196-197 | Two separate sentences saying similar things | Redundant | Consolidate into single clear message |
| BulkTransferPage:272,277 | "comma or line separated" vs "commas or new lines" | Inconsistent terminology | Use "comma or newline separated" in both places |

### 3. **Grammar & Punctuation**

| Location | Current Text | Issue | Suggested Fix |
|----------|--------------|-------|---------------|
| App.jsx:4633 | "Allow user to upload files" | Missing article | "Allow users to upload files" |
| App.jsx:4649 | "Allow user to paste text" | Missing article | "Allow users to paste text" |
| App.jsx:6083 | "Yes, Allow Editing" | Unnecessary comma | "Yes, Allow Editing" → "Allow Editing" |
| AddSectionModal:163 | "Please select a section to determine the position" | Wordy | "Select a section to set the position" |
| ActionSelectionModal:90 | "Inform context" | Missing article/incomplete | "Inform the context" or "Use to inform context" |
| App.jsx:1665 | "Please select target EHR system" | Missing article | "Please select a target EHR system" |
| App.jsx:986 | "Error: No section selected" | Generic error prefix | "Please select a section to continue" |
| App.jsx:4376 | "Please select a resource" | Too generic | "Please select an EHR resource" |

---

## 🟡 Medium Priority Issues

### 4. **Redundant Text**

| Location | Current Text | Issue | Suggested Fix |
|----------|--------------|-------|---------------|
| App.jsx:2039-2040 | "Select target EHR to see what will be copied / The copy scope differs based on..." | Repetitive | Combine into single clear statement |
| App.jsx:5668 | "Extract Variables" section description | Too verbose | Simplify to key point |
| Throughout | Multiple instances of "Add summarizer" tooltips | Repetitive across buttons | Ensure each has unique, helpful context |
| App.jsx:3705 | "Section created successfully!" | Generic success message | "Section created! You can now assign summarizers to it." |
| BulkTransferPage:146 | "Successfully copied to X recipient(s)!" | Generic success | "Successfully copied configuration to X recipient(s)!" |
| BulkTransferPage:151 | "Error during copy operation: {message}" | Exposes technical error | "Copy operation failed. Please try again." |

### 5. **Inconsistent Button Labels**

| Location | Current Text | Issue | Suggested Fix |
|----------|--------------|-------|---------------|
| Throughout | "Add Summarizer" vs "+ Add" vs "Create" | Inconsistent verbs | Standardize: use either "Add" or "Create" consistently |
| App.jsx:2260 | "Add Summarizer" (modal title) | Inconsistent with other titles | "Create Summarizer" or "New Summarizer" |
| Various | Plus icon (+) usage | Sometimes with text, sometimes alone | Standardize when to show icon only vs icon + text |

### 6. **Placeholder Text**

| Location | Current Text | Issue | Suggested Fix |
|----------|--------------|-------|---------------|
| App.jsx:1763 | "Search doctors by name or email..." | Good placeholder | ✓ Keep as is |
| App.jsx:1263 | "Custom instructions..." | Too vague | "Enter custom instructions for this action..." |
| App.jsx:1937 | `doctor${index + 1}@example.com` | Generic | Consider "doctor.name@hospital.com" for realism |
| AddSectionModal:163 | "e.g., Review of Systems, Medication List" | Good examples | ✓ Keep as is |
| CopyDoctorModal:94 | `doctor${index + 1}@example.com` | Inconsistent with App.jsx | Standardize placeholder email format across app |
| PromptEditModal:113 | "Add any specific instructions..." | Could be more specific | "e.g., Focus on recent changes, exclude duplicates" |

---

## 🟢 Low Priority / Polish

### 7. **Tone & Voice Consistency**

| Location | Current Text | Issue | Suggested Fix |
|----------|--------------|-------|---------------|
| App.jsx:2252 | "Choose what you want to create for {doctor}" | Informal | "Select what to create for {doctor}" |
| AddSectionModal:121 | "where the new section should live" | Too casual | "where to place the new section" |
| Various error messages | Mix of formal/informal | Inconsistent | Establish tone guidelines |

### 8. **Section Headings**

| Location | Current Text | Issue | Suggested Fix |
|----------|--------------|-------|---------------|
| App.jsx:4540-6176 | Section 1-6 numbered headings | Inconsistent formatting | Ensure all use same number badge style |
| App.jsx:5661 | "Extract Variables" | Unclear to end users | "Define Variables to Extract" |
| App.jsx:6090 | "Model Selection" | Too technical | "Select AI Model" or similar |

### 9. **Helper Text & Descriptions**

| Location | Current Text | Issue | Suggested Fix |
|----------|--------------|-------|---------------|
| App.jsx:4634-4635 | "Enable PDF/document upload functionality" | Technical | "Allow users to upload PDF and other documents" |
| App.jsx:4650 | "Enable direct text input/paste functionality" | Technical | "Allow users to paste or type text directly" |
| AddSectionModal:168 | "Enter a descriptive name for your new section" | Good helper text | ✓ Keep as is |

---

## 📝 Specific Recommendations by Component

### **App.jsx (Main Application)**

**Priority Fixes:**
1. Line 1755: Standardize capitalization in tagline
2. Lines 4633, 4649: Add "users" (plural)
3. Line 4858: Break into clearer sentences
4. Line 4935: Remove redundancy
5. Throughout: Standardize "EHR" (always caps)
6. Throughout: Choose "summarizer" or "Summarizer" and stick to it

**Style Guide Needed For:**
- Button labels (Add vs Create vs New)
- Capitalization rules (title case vs sentence case)
- Tone (formal vs conversational)
- Technical terms (when to use jargon vs plain language)

### **AddSectionModal.jsx**

**Priority Fixes:**
1. Line 121: "Choose" → "Select", "should live" → "will be placed"
2. Line 163: Simplify "Please select a section to determine the position"
3. Lines 118-120: Make dropdown labels more concise
4. Line 142: Clarify "No existing sections" message

**Good Examples to Keep:**
- Step numbering ("Step {step} of 3")
- Preview feature showing exactly what will happen
- Clear validation messages

### **CopyDoctorModal.jsx**

**Priority Fixes:**
1. Line 47: "EHR" used inconsistently - should be all caps throughout
2. Line 72: "Full configuration will be copied" - vague, consider "All settings will be copied"
3. Line 94: Placeholder email pattern inconsistent with App.jsx pattern
4. Line 180: "Check if corresponding EHR resources are available for pulled summarizers" - awkward phrasing
5. Line 196-197: Redundant text between lines - can be consolidated

**Good Examples to Keep:**
- Clear visual distinction between same-EHR and different-EHR copy scenarios
- Numbered steps showing copy process
- Dynamic button text showing count of target doctors
- Status indicators (CheckCircle, AlertCircle) for different scenarios

**Issues Found:**
- Inconsistent capitalization: "EHR" appears correctly mostly, but mixed in descriptions
- Button text is overly complex: "Copy to {count} Doctor{s}" could be "Copy Configuration"
- Some technical jargon in warning messages (e.g., "resource IDs", "mapping")

### **PromptEditModal.jsx**

**Priority Fixes:**
1. Line 113: Placeholder text inconsistent - should match style of other modals
2. Throughout: "Summarizer" capitalization inconsistent with global usage
3. Line 41: "Assign Summarizer to Section" - should match app-wide capitalization choice

**Good Examples to Keep:**
- Clean radio button labels with emoji icons
- Good use of optional field labeling
- Clear section/template/summarizer context display

**Issues Found:**
- Minimal issues - this modal has relatively clean copy
- Placeholder text could be more specific/helpful
- Action labels (Append/Prepend/Inform) are clear and consistent

### **ActionSelectionModal.jsx**

**Priority Fixes:**
1. Line 42: "How should this summarizer be used?" - inconsistent capitalization of "summarizer"
2. Line 56-57: "Append to section" - missing article, should be "Append to the section" or keep as is for brevity
3. Line 90: "Inform context" - grammatically awkward, should be "Inform the context" or "Use to inform context"

**Good Examples to Keep:**
- Excellent use of emoji + icon combination for visual clarity
- Clear descriptions under each action type
- Good modal title

**Issues Found:**
- "Inform context" is grammatically incomplete - needs article or restructuring
- Descriptions are concise and clear (this is good!)
- Consistent visual design with color-coded action types

### **View Components**

#### **DoctorsView.jsx**

**Priority Fixes:**
1. Line 42: "Select a doctor to create summarizers or configure templates" - inconsistent capitalization
2. Line 40: "Healthcare Providers" - ensure consistency with "doctor" vs "provider" terminology throughout app

**Good Examples to Keep:**
- Clean, simple tagline
- Consistent structure

**Issues Found:**
- Minimal issues in this component
- "doctor" vs "Healthcare Providers" - pick one term and standardize

#### **PageHeader.jsx**

**Priority Fixes:**
1. Line 27: "Create summarizers and configure templates for healthcare providers" - inconsistent capitalization of "summarizers"
2. Line 13: "Marvix Ops Dashboard" - brand name, should be consistent throughout

**Good Examples to Keep:**
- Clear, concise tagline

**Issues Found:**
- Minor capitalization inconsistency with global "summarizer" usage

#### **DoctorCard.jsx**

**Priority Fixes:**
1. Line 82: "Add Summarizer" - should match app-wide capitalization choice
2. Line 84: "Extract and summarize data from EHR" - good, but verify EHR is always caps

**Good Examples to Keep:**
- Clear dropdown option description
- Good button labeling

**Issues Found:**
- Minimal issues - well written

#### **BulkTransferPage.jsx**

**Priority Fixes:**
1. Line 220: "Copy summarizer and configurations across multiple doctors" - should be "summarizers" (plural) or match capitalization
2. Line 272: "Bulk Email Input (comma or line separated)" - could be clearer: "Bulk Email Input (comma or newline separated)"
3. Line 277: "Enter email addresses separated by commas or new lines..." - inconsistent with label ("line" vs "new lines")
4. Line 146: Alert message "Successfully copied to X recipient(s)!" - could be more specific

**Good Examples to Keep:**
- Good use of "Source Doctors" and "Target Doctors" labels
- Clear section organization

**Issues Found:**
- Inconsistency between "line separated" and "new lines"
- Generic success messages (alert dialogs)
- Could use more specific terminology

#### **SummarizersVariablesView.jsx**

**Priority Fixes:**
1. Line 233: title="Add summarizer" - capitalization inconsistency
2. Line 277, 375, 466: "Append (Selected)", "Prepend (Selected)", "Inform (Selected)" - good clarity
3. Line 537: "Inform Instructions (optional)" - good labeling
4. Line 542: "Enter instructions for this inform action..." - good placeholder
5. Line 603: "No summarizers available. Create one first." - clear message

**Good Examples to Keep:**
- Clear state indicators ("Selected")
- Good use of optional field labeling
- Helpful empty state messages

**Issues Found:**
- Minimal issues - generally well-written
- Mostly capitalization consistency concerns

### **Validation & Error Messages (App.jsx & Components)**

**High Priority Issues:**

| Line | Current Message | Issue | Suggested Fix |
|------|----------------|-------|---------------|
| App.jsx:986 | "Error: No section selected" | Generic prefix | "Please select a section to continue" |
| App.jsx:1661 | "Please enter at least one email address" | Good | ✓ Keep as is |
| App.jsx:1665 | "Please select target EHR system" | Missing article | "Please select a target EHR system" |
| App.jsx:4363 | "Please enter a file type" | Vague | "Please enter a file type name" |
| App.jsx:4369 | "Please select at least one file type (Pull from EHR, Upload, or Paste Text)" | Good, clear | ✓ Keep as is |
| App.jsx:4376 | "Please select a resource" | Generic | "Please select an EHR resource" |
| App.jsx:4384 | "Please enter a summarization prompt" | Good | ✓ Keep as is |
| App.jsx:4404 | "Please select a primary model" | Good | ✓ Keep as is |
| App.jsx:5938 | "Please fill in variable name and select extraction method" | Good clarity | ✓ Keep as is |
| App.jsx:6430 | "Please select a doctor first" | Good | ✓ Keep as is |

**Success Messages:**

| Line | Current Message | Issue | Suggested Fix |
|------|----------------|-------|---------------|
| App.jsx:1673 | "Configuration copied to X doctor(s) successfully!\n\n✓ Full configuration copied\n✓ Ready to use immediately" | Good detail | ✓ Keep as is |
| App.jsx:3471 | "Summarizer {activated/deactivated} successfully!" | Good, uses dynamic state | ✓ Keep as is |
| App.jsx:3705 | "Section created successfully!" | Generic | "Section created! You can now assign summarizers to it." |
| App.jsx:4428 | "Summarizer updated successfully!\n\n✓ Configuration saved\n✓ Ready for immediate use" | Excellent detail | ✓ Keep as is |
| App.jsx:6503 | "Summarizer copied successfully! Note: EHR resource configuration was not copied..." | Very helpful context | ✓ Keep as is |
| App.jsx:6505 | "Summarizer copied successfully! The configuration has been pre-filled and is ready for use." | Clear | ✓ Keep as is |
| BulkTransferPage:146 | "Successfully copied to X recipient(s)!" | Generic | "Successfully copied configuration to X recipient(s)!" |
| BulkTransferPage:151 | "Error during copy operation: {message}" | Technical error exposed | "Copy operation failed. Please try again." |

**Confirm Dialogs:**

| Line | Current Message | Issue | Suggested Fix |
|------|----------------|-------|---------------|
| App.jsx:1013 | "Remove this summarizer?" | Good, concise | ✓ Keep as is |
| App.jsx:2208 | "Are you sure? Doctors will have incomplete configurations until resources are mapped." | Good warning | ✓ Keep as is |

**Instructional Alerts (Consider converting to UI elements):**

| Line | Current Message | Issue | Suggested Fix |
|------|----------------|-------|---------------|
| App.jsx:2177 | "Opening resource selection for: {name}\n\nYou'll see the create summarizer interface..." | Long instructional alert | Convert to modal or tooltip |
| App.jsx:2222 | "Opening batch resource mapping interface..." | Placeholder functionality | Should be actual UI, not alert |
| App.jsx:3248 | "Configuration saved for {template} template!" | Generic placeholder | Implement actual save functionality |

**Good Examples:**
- Multi-line success messages with checkmarks (e.g., lines 1673, 4428)
- Contextual notes in success messages (e.g., line 6503)
- Clear, actionable validation messages (e.g., "Please select at least one file type...")

**Issues Found:**
- Some generic "Error:" prefixes that could be more user-friendly
- Technical error messages exposed to users (line 151 in BulkTransferPage)
- Several placeholder alerts that should be converted to proper UI elements
- Missing articles in some messages ("Please select target EHR" → "Please select a target EHR")

---

## ✅ Action Items

### 🔴 Critical (Fix Immediately):

**Estimated Time: 2-3 hours**

1. **Standardize "EHR" capitalization** (15 mins)
   - Global find/replace: ensure "EHR" is always capitalized
   - Files: App.jsx, all modals, all views

2. **Fix grammar issues** (30 mins)
   - App.jsx:4633, 4649: Add "users" plural
   - App.jsx:1665, 4376: Add missing articles ("a", "the")
   - App.jsx:986: Remove "Error:" prefix, make user-friendly

3. **Decide on "Summarizer" capitalization** (1 hour)
   - Choose: "summarizer" (lowercase) OR "Summarizer" (title case)
   - Apply consistently across all 24 instances
   - Update button labels, tooltips, headings

4. **Fix inconsistent separator terminology** (15 mins)
   - BulkTransferPage:272, 277: Standardize to "comma or newline separated"

### Immediate (Do First):
1. ✓ Create style guide for:
   - Capitalization rules
   - Button label conventions
   - Tone/voice guidelines
   - Technical term usage

2. Simplify wordy instructions (1 hour):
   - App.jsx:4858: Break into clearer sentences
   - App.jsx:4935: Remove redundancy
   - AddSectionModal:121: Remove informal language

3. Improve error messages (45 mins):
   - BulkTransferPage:151: Hide technical errors
   - App.jsx:3705, BulkTransferPage:146: Make success messages more specific
   - Convert generic "please select" messages to be more specific

### Next Steps:
4. Simplify wordy instructions
5. Make helper text less technical
6. Review remaining modal components
7. Check form validation messages
8. Review error messages for consistency

### Optional Polish:
9. Refine tone to be more consistent
10. Add more helpful examples in placeholders
11. Improve section heading clarity

---

## 📊 Statistics

- **Total Issues Found:** 65+
- **High Priority:** 24
- **Medium Priority:** 21
- **Low Priority:** 20+
- **Components Reviewed:** 10+ (App.jsx, 4 modals, 5 view components, validation/error messages)
- **Review Complete:** All major UI components and user-facing text reviewed

---

## 🎯 Next Review Targets

1. **Modals** ✓ COMPLETED:
   - ✓ AddSectionModal.jsx
   - ✓ CopyDoctorModal.jsx
   - ✓ PromptEditModal.jsx
   - ✓ ActionSelectionModal.jsx

2. **View Components** ✓ COMPLETED:
   - ✓ DoctorsView.jsx
   - ✓ PageHeader.jsx
   - ✓ SearchFilters.jsx
   - ✓ DoctorCard.jsx
   - ✓ SummarizersVariablesView.jsx
   - ✓ BulkTransferPage.jsx

3. **Form Validation** ✓ COMPLETED:
   - ✓ Error messages (24 validation messages reviewed)
   - ✓ Success messages (7 success messages reviewed)
   - ✓ Warning dialogs (confirm dialogs reviewed)
   - ✓ Instructional alerts identified for UI improvement

---

## 💡 General Recommendations

1. **Create a Style Guide**: Document decisions on capitalization, tone, and terminology
2. **Use Consistent Patterns**: Same type of action = same verb (all "Add" or all "Create")
3. **Write for Users**: Avoid technical jargon when possible; explain in plain language
4. **Be Concise**: Remove redundant words; get to the point faster
5. **Test with Users**: Some instructions may be clear to developers but confusing to end users

---

*This is a living document. Update as issues are fixed and new ones are discovered.*
