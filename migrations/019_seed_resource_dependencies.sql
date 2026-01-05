-- Migration: Seed Resource Dependencies
-- Purpose: Define which resources depend on others (e.g., Clinical Documents → Previous Notes)
-- Date: 2026-01-05

-- AthenaOne Dependencies (all depend on Previous Notes)
INSERT INTO resource_dependencies (resource_id, depends_on_resource_id, dependency_type, execution_order, description)
VALUES
-- Lab Results depends on Previous Notes
((SELECT id FROM ehr_resources WHERE resource_id = 'athenaone-lab-results-pdf'),
 (SELECT id FROM ehr_resources WHERE resource_id = 'athenaone-previous-notes-pdf'),
 'required', 1, 'Lab Results pipeline requires Previous Notes to be pulled first'),

-- Clinical Documents (PDF) depends on Previous Notes
((SELECT id FROM ehr_resources WHERE resource_id = 'athenaone-clinical-documents-pdf'),
 (SELECT id FROM ehr_resources WHERE resource_id = 'athenaone-previous-notes-pdf'),
 'required', 1, 'Clinical Documents (PDF) pipeline requires Previous Notes to be pulled first'),

-- Clinical Documents (XML) depends on Previous Notes
((SELECT id FROM ehr_resources WHERE resource_id = 'athenaone-clinical-documents-xml'),
 (SELECT id FROM ehr_resources WHERE resource_id = 'athenaone-previous-notes-pdf'),
 'required', 1, 'Clinical Documents (XML) pipeline requires Previous Notes to be pulled first'),

-- Imaging Results depends on Previous Notes
((SELECT id FROM ehr_resources WHERE resource_id = 'athenaone-imaging-results'),
 (SELECT id FROM ehr_resources WHERE resource_id = 'athenaone-previous-notes-pdf'),
 'required', 1, 'Imaging Results pipeline requires Previous Notes to be pulled first'),

-- Problems List depends on Previous Notes
((SELECT id FROM ehr_resources WHERE resource_id = 'athenaone-problems-list'),
 (SELECT id FROM ehr_resources WHERE resource_id = 'athenaone-previous-notes-pdf'),
 'required', 1, 'Problems List pipeline requires Previous Notes to be pulled first')
ON CONFLICT (resource_id, depends_on_resource_id) DO NOTHING;

-- AdvancedMD Dependencies
INSERT INTO resource_dependencies (resource_id, depends_on_resource_id, dependency_type, execution_order, description)
VALUES
-- Clinical Documents depends on Previous Notes
((SELECT id FROM ehr_resources WHERE resource_id = 'advancedmd-clinical-documents'),
 (SELECT id FROM ehr_resources WHERE resource_id = 'advancedmd-previous-notes'),
 'required', 1, 'Clinical Documents pipeline requires Previous Notes to be pulled first')
ON CONFLICT (resource_id, depends_on_resource_id) DO NOTHING;

-- Charm Dependencies
INSERT INTO resource_dependencies (resource_id, depends_on_resource_id, dependency_type, execution_order, description)
VALUES
-- Clinical Documents depends on Previous Notes
((SELECT id FROM ehr_resources WHERE resource_id = 'charm-clinical-documents-pdf'),
 (SELECT id FROM ehr_resources WHERE resource_id = 'charm-previous-notes'),
 'required', 1, 'Clinical Documents pipeline requires Previous Notes to be pulled first')
ON CONFLICT (resource_id, depends_on_resource_id) DO NOTHING;

