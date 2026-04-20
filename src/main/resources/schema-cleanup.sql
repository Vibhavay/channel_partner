-- Clean up old user records
DELETE FROM users WHERE username IN ('admin', 'partner');

-- Drop and recreate builders table to match new schema
DROP TABLE IF EXISTS builders;

-- Drop and recreate customers table to match new schema
DROP TABLE IF EXISTS customers;
