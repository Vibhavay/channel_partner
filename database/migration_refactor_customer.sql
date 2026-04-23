-- Database Migration: Refactor Customer Module
-- Remove redundant date fields and consolidate call tracking
-- Date: April 22, 2026
-- This migration is optional as the database schema doesn't have these columns
-- It serves as reference for any legacy systems that might have these fields

-- ============================================================================
-- IMPORTANT: This migration is for cleanup purposes
-- The schema.sql already has the correct structure without these columns
-- ============================================================================

-- Step 1: Drop the old columns from customers table IF they exist
-- (This is safe and will only drop if columns exist)
ALTER TABLE customers DROP COLUMN IF EXISTS date_of_inquiry;
ALTER TABLE customers DROP COLUMN IF EXISTS follow_up_date;

-- Step 2: Verify call_logs table structure is correct
-- The call_logs table should have:
-- - id (PK)
-- - customer_id (FK -> customers.id)
-- - call_date_time (DATETIME NOT NULL)
-- - call_type (VARCHAR(50) NOT NULL) - "Incoming" or "Outgoing"
-- - call_status (VARCHAR(50) NOT NULL) - "Connected", "Not Answered", "Busy", "Wrong Number", "Follow-up Required"
-- - call_notes (TEXT)
-- - created_by (VARCHAR(100) NOT NULL)
-- - created_at (DATETIME NOT NULL)
-- - updated_at (DATETIME NOT NULL)

-- Step 3: Ensure indexes exist for performance optimization
CREATE INDEX IF NOT EXISTS idx_call_logs_customer_id ON call_logs(customer_id);
CREATE INDEX IF NOT EXISTS idx_call_logs_call_date ON call_logs(call_date_time);
CREATE INDEX IF NOT EXISTS idx_call_logs_status ON call_logs(call_status);
CREATE INDEX IF NOT EXISTS idx_call_logs_type ON call_logs(call_type);

-- Step 4: Verify foreign key constraint exists
-- The constraint should link call_logs.customer_id to customers.id
-- This is already in the schema.sql: FOREIGN KEY (customer_id) REFERENCES customers(id)

-- Step 5: Rollback Instructions (if needed)
-- If you need to add the columns back:
-- ALTER TABLE customers ADD COLUMN date_of_inquiry DATE;
-- ALTER TABLE customers ADD COLUMN follow_up_date DATE;

COMMIT;

