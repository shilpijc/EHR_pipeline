-- Migration: Create Bulk Transfer Jobs Table
-- Purpose: Track bulk copy operations
-- Date: 2026-01-05

CREATE TABLE IF NOT EXISTS bulk_transfer_jobs (
    id SERIAL PRIMARY KEY,
    initiated_by VARCHAR(255) NOT NULL,
    copy_type VARCHAR(20) NOT NULL CHECK (copy_type IN ('summarizers', 'full', 'templates')),
    source_doctor_ids JSONB DEFAULT '[]'::jsonb NOT NULL,
    target_doctor_ids JSONB DEFAULT '[]'::jsonb NOT NULL,
    target_emails JSONB DEFAULT '[]'::jsonb,
    selected_summarizer_ids JSONB DEFAULT '[]'::jsonb,
    resource_mappings JSONB,
    status VARCHAR(20) DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed', 'failed')),
    progress INTEGER DEFAULT 0 NOT NULL,
    total INTEGER DEFAULT 0 NOT NULL,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Create indices
CREATE INDEX idx_bulk_transfer_jobs_status ON bulk_transfer_jobs(status);
CREATE INDEX idx_bulk_transfer_jobs_initiated_by ON bulk_transfer_jobs(initiated_by);
CREATE INDEX idx_bulk_transfer_jobs_created_at ON bulk_transfer_jobs(created_at);

-- Add comments
COMMENT ON TABLE bulk_transfer_jobs IS 'Tracks bulk copy operations for transferring summarizers across doctors';
COMMENT ON COLUMN bulk_transfer_jobs.copy_type IS 'Type of copy: summarizers (specific), full (all), or templates (templates only)';
COMMENT ON COLUMN bulk_transfer_jobs.source_doctor_ids IS 'JSON array of source doctor IDs';
COMMENT ON COLUMN bulk_transfer_jobs.target_doctor_ids IS 'JSON array of target doctor IDs';
COMMENT ON COLUMN bulk_transfer_jobs.resource_mappings IS 'JSON object mapping resources for cross-EHR copies';

