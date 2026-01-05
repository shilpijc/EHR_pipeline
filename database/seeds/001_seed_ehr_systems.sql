-- Seed Data: EHR Systems
-- Description: Insert all supported EHR systems

INSERT INTO ehr_systems (system_code, system_name, is_active) VALUES
('ECW', 'eClinicalWorks', TRUE),
('AthenaOne', 'Athena One', TRUE),
('AthenaFlow', 'Athena Flow', TRUE),
('AdvancedMD', 'AdvancedMD', TRUE),
('Charm', 'Charm EHR', TRUE),
('DrChrono', 'DrChrono', TRUE),
('Greenway', 'Greenway Health', TRUE);

