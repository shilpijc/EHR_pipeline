-- Migration: Create Bulk Transfer Logs Table
-- Purpose: Detailed logs for bulk operations
-- Date: 2026-01-05

CREATE TABLE IF NOT EXISTS bulk_transfer_logs (
    id SERIAL PRIMARY KEY,
    job_id INTEGER NOT NULL,
    source_doctor_id INTEGER,
    target_doctor_id INTEGER,
    summarizer_id INTEGER,
    status VARCHAR(20) NOT NULL CHECK (status IN ('success', 'failed')),
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    -- Foreign Keys
    CONSTRAINT fk_bulk_transfer_logs_job 
        FOREIGN KEY (job_id) 
        REFERENCES bulk_transfer_jobs(id) 
        ON DELETE CASCADE
);

-- Create indices
CREATE INDEX idx_bulk_transfer_logs_job_id ON bulk_transfer_logs(job_id);
CREATE INDEX idx_bulk_transfer_logs_status ON bulk_transfer_logs(status);
CREATE INDEX idx_bulk_transfer_logs_created_at ON bulk_transfer_logs(created_at);

-- Add comments
COMMENT ON TABLE bulk_transfer_logs IS 'Detailed logs for each operation within a bulk transfer job';
COMMENT ON COLUMN bulk_transfer_logs.source_doctor_id IS 'Source doctor for this specific operation';
COMMENT ON COLUMN bulk_transfer_logs.target_doctor_id IS 'Target doctor for this specific operation';
COMMENT ON COLUMN bulk_transfer_logs.summarizer_id IS 'Summarizer being copied';
COMMENT ON COLUMN bulk_transfer_logs.details IS 'JSON object with operation details and error info';

