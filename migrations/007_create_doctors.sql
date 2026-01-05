-- Migration: Create Doctors Table
-- Purpose: Store doctor profiles and their EHR system information
-- Date: 2026-01-05

CREATE TABLE IF NOT EXISTS doctors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    ehr_system VARCHAR(50) NOT NULL,
    specialty VARCHAR(100),
    practice VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create indices
CREATE INDEX idx_doctors_email ON doctors(email);
CREATE INDEX idx_doctors_ehr_system ON doctors(ehr_system);
CREATE INDEX idx_doctors_practice ON doctors(practice);

-- Add comments
COMMENT ON TABLE doctors IS 'Doctor profiles with EHR system information';
COMMENT ON COLUMN doctors.email IS 'Unique email address for the doctor';
COMMENT ON COLUMN doctors.ehr_system IS 'Current EHR system the doctor uses';
COMMENT ON COLUMN doctors.specialty IS 'Medical specialty (e.g., Neurology, Cardiology)';
COMMENT ON COLUMN doctors.practice IS 'Practice name or group';

