-- Migration: Drop old sales table
-- Since we have created a separate sales_details module, remove the old sales table

DROP TABLE IF EXISTS sales;

-- Log migration
SELECT 'Successfully dropped old sales table' as migration_status;
