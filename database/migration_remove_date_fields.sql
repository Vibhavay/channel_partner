-- Migration: Remove dateOfInquiry and followUpDate from customers table
-- This script consolidates all call/follow-up tracking in the call_logs table
-- Date: April 22, 2026

-- Step 1: Drop the old columns from customers table
ALTER TABLE customers DROP COLUMN IF EXISTS date_of_inquiry;
ALTER TABLE customers DROP COLUMN IF EXISTS follow_up_date;

-- Step 2: Verify call_logs table structure
-- The call_logs table should have:
-- - id (PK)
-- - customer_id (FK -> customers.id)
-- - call_date_time
-- - call_type
-- - call_status
-- - call_notes
-- - created_by
-- - created_at
-- - updated_at

-- Step 3: Ensure indexes exist for performance
-- These should already exist from initial setup
CREATE INDEX IF NOT EXISTS idx_call_logs_customer_id ON call_logs(customer_id);
CREATE INDEX IF NOT EXISTS idx_call_logs_call_date ON call_logs(call_date_time);
CREATE INDEX IF NOT EXISTS idx_call_logs_status ON call_logs(call_status);

-- Step 4: Verify foreign key constraint exists
-- The constraint should link call_logs.customer_id to customers.id
-- If not already present, it should have been created in initial setup

-- Step 5: Update any procedures or views that reference the old columns
-- (If any exist in your system)

COMMIT;

