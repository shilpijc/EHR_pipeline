-- Migration: Create EHR Systems Table
-- Purpose: Master catalog of supported EHR systems
-- Date: 2026-01-05

CREATE TABLE IF NOT EXISTS ehr_systems (
    id SERIAL PRIMARY KEY,
    system_code VARCHAR(50) UNIQUE NOT NULL,
    system_name VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    configuration JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create indices
CREATE INDEX idx_ehr_systems_system_code ON ehr_systems(system_code);
CREATE INDEX idx_ehr_systems_is_active ON ehr_systems(is_active);

-- Add comments
COMMENT ON TABLE ehr_systems IS 'Master catalog of all supported EHR systems';
COMMENT ON COLUMN ehr_systems.system_code IS 'Machine-readable code (e.g., ECW, AthenaOne)';
COMMENT ON COLUMN ehr_systems.system_name IS 'Human-readable name (e.g., eClinicalWorks)';
COMMENT ON COLUMN ehr_systems.configuration IS 'System-specific settings in JSON format';

-- Seed data
INSERT INTO ehr_systems (system_code, system_name, is_active) VALUES
('ECW', 'eClinicalWorks', true),
('AthenaOne', 'Athena One', true),
('AthenaFlow', 'Athena Flow', true),
('AdvancedMD', 'AdvancedMD', true),
('Charm', 'Charm EHR', true),
('DrChrono', 'DrChrono', true),
('Greenway', 'Greenway Health', true)
ON CONFLICT (system_code) DO NOTHING;

