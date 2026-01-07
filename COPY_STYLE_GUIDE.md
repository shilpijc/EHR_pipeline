# UI Copy Style Guide

This document defines the nomenclature rules and copy standards for the Marvix Ops Dashboard. Follow these guidelines to maintain consistency across all UI elements.

---

## 1. Capitalization Rules

### Title Case (use for)
- Page headers and section titles
- Button labels
- Modal titles
- Field labels
- Tab names
- Resource/document type names

**Examples:**
- ✅ "EHR Pull Configuration"
- ✅ "Date Range"
- ✅ "Records to Pull"
- ✅ "Previous Notes"
- ❌ "Previous notes"
- ❌ "records to pull"

### Sentence case (use for)
- Help text and descriptions
- Placeholder text
- Error messages
- Tooltips

**Examples:**
- ✅ "Choose what data to pull."
- ✅ "Select document types to include"
- ❌ "Choose What Data To Pull."

---

## 2. Field Labels

### Format
```
[Label] [Required Indicator]
```

### Rules
- Use Title Case
- Keep labels short (2-4 words max)
- Use `*` for required fields, placed after label
- Avoid technical jargon

**Examples:**
- ✅ "Date Range *"
- ✅ "Records to Pull *"
- ✅ "Keyword Filter"
- ❌ "Retrieval Method *" (too technical)
- ❌ "How Far Back *" (vague)

### Standard Label Mappings
| Internal Term | User-Facing Label |
|---------------|-------------------|
| `howFarBack` | Date Range |
| `retrievalMethod` | Records to Pull |
| `documentCount` | Number of Records |
| `keywords` | Keyword Filter |
| `visitTypes` | Visit Types |
| `documentTypes` | Document Types |
| `sortingDirection` | Sort Order |

---

## 3. Help Text & Descriptions

### Rules
- Use sentence case
- Keep under 15 words when possible
- Be action-oriented (start with verb)
- Avoid parenthetical asides
- Don't explain the obvious

**Examples:**
- ✅ "Choose what data to pull."
- ✅ "Filter documents by specific keywords"
- ✅ "Select document types to include"
- ❌ "Select a resource. Options show resource name with available filters. Only the editable filters shown below (for example, date ranges) can be changed; other filters appear in Advanced Settings." (too long)
- ❌ "Customized according to need" (vague)

### Pattern for filter descriptions
```
[Action verb] + [what] + [optional: purpose/scope]
```

**Examples:**
- "Filter documents by specific keywords"
- "Organization IDs for this practice"
- "Note templates to include"
- "Order for combining notes"

---

## 4. Source/Resource Descriptions

### Format
```
[Document Type] [(Format/Detail)]
```

### Rules
- Use Title Case for document types
- Put format or additional details in parentheses
- Use consistent arrow notation: `→` (not `->`)

**Examples:**
- ✅ "Previous Notes"
- ✅ "Previous Notes (XML format, filtered by paragraph)"
- ✅ "Clinical Documents → Discharge Summary (filtered by: hospital, discharge)"
- ✅ "Previous Notes (CCDA format only)"
- ❌ "Previous notes - Single XML file (each paragraph is filtered)"
- ❌ "Clinical document(XML) → previous encounter"

---

## 5. Radio/Checkbox Options

### Rules
- Use sentence case
- Keep concise (3-5 words)
- Be specific about what happens

**Examples:**
- ✅ "Most recent only"
- ✅ "All within date range"
- ✅ "Specific number"
- ❌ "Latest note only" (slightly verbose)
- ❌ "latest" (too terse, not user-friendly)

---

## 6. Button Labels

### Rules
- Use Title Case
- Use action verbs
- Keep to 1-3 words
- Be specific about the action

### Standard Button Labels
| Action | Label |
|--------|-------|
| Create new item | Add / Create |
| Save changes | Save |
| Discard changes | Cancel |
| Remove item | Delete |
| Go back | Back |
| Proceed to next step | Next |
| Complete action | Done / Confirm |
| Execute bulk operation | Execute Copy |
| Configure settings | Configure |

**Examples:**
- ✅ "Add Summarizer"
- ✅ "Execute Copy"
- ✅ "Back to Dashboard"
- ❌ "Click here to add" (too verbose)
- ❌ "Submit" (vague)

---

## 7. Error & Validation Messages

### Rules
- Use sentence case
- Be specific about what's wrong
- Tell user how to fix it
- Don't blame the user

### Pattern
```
[What's wrong]. [How to fix it - optional]
```

**Examples:**
- ✅ "Please enter a section name"
- ✅ "Please select at least one document type"
- ✅ "Resource mapping required for cross-EHR copies"
- ❌ "Error: Invalid input"
- ❌ "You forgot to enter a name"

---

## 8. Success Messages

### Rules
- Be concise
- Confirm what happened
- Use past tense

**Examples:**
- ✅ "Configuration saved"
- ✅ "Summarizer created successfully"
- ✅ "Copied to 3 doctors"
- ❌ "Your configuration has been successfully saved to the system"

---

## 9. Placeholder Text

### Rules
- Use sentence case
- Provide example format when helpful
- Start with lowercase (browsers style this)

**Examples:**
- ✅ "e.g., Review of Systems, Medication List"
- ✅ "Search doctors..."
- ✅ "Enter keywords separated by commas"
- ❌ "Type here"
- ❌ "ENTER EMAIL ADDRESS"

---

## 10. Empty States

### Rules
- Explain what would appear here
- Suggest next action if applicable
- Keep friendly, not alarming

**Examples:**
- ✅ "No summarizers created yet"
- ✅ "No records found for this date range"
- ❌ "Error: Empty"
- ❌ "Nothing here!"

---

## 11. Tooltips

### Rules
- One sentence max
- Explain what the element does
- Use sentence case

**Examples:**
- ✅ "Add another summarizer"
- ✅ "Delete this assignment"
- ❌ "Click this button to add another summarizer to this section"

---

## 12. EHR-Specific Copy Patterns

### Date Range Style (ECW, AthenaFlow)
Use when EHR supports `howFarBack` filter:
- Label: "Date Range *"
- Sub-labels: "Years Back", "Months Back", "Days Back"
- Exclude field: "Exclude Recent Days"
- Helper: "Pulls records from X years ago, excluding the last Y days"

### Records to Pull Style (AthenaOne, AdvancedMD, Charm, DrChrono)
Use when EHR supports `retrievalMethod` filter:
- Label: "Records to Pull *"
- Options: "Most recent only", "All within date range", "Specific number"
- Show date pickers when "All within date range" selected
- Show count input when "Specific number" selected

---

## 13. Terminology Glossary

| Term | Definition | Usage |
|------|------------|-------|
| Summarizer | A configured data extraction unit | "Add Summarizer", "No summarizers yet" |
| Template | Document structure (General, Follow-up, etc.) | "General Template", "Select template" |
| Resource | Data source from EHR | "Select a resource", "Resource: Previous Notes" |
| Section | Part of a template | "Add New Section", "Append to section" |
| EHR | Electronic Health Record system | Always use abbreviation "EHR", not spelled out |

---

## Quick Reference Checklist

Before shipping copy, verify:

- [ ] Field labels are Title Case
- [ ] Help text is sentence case and under 15 words
- [ ] No technical jargon (retrievalMethod, howFarBack, etc.)
- [ ] Error messages tell user what to do
- [ ] Buttons use action verbs
- [ ] Source descriptions use consistent format
- [ ] All required fields marked with `*`
- [ ] No passive voice in help text
- [ ] Consistent terminology across similar features

---

*Last updated: January 2026*

