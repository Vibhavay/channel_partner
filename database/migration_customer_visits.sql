-- Migration: Create Customer Visits Module
-- This script migrates the existing visits table to a dedicated customer_visits table
-- with enhanced schema and proper timestamps

-- 1. Create new customer_visits table with enhanced schema
CREATE TABLE IF NOT EXISTS customer_visits (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    visit_date DATETIME NOT NULL,
    visit_type VARCHAR(50),
    status VARCHAR(50),
    notes TEXT,
    project_id BIGINT,
    flat_type VARCHAR(50),
    flat_size DOUBLE,
    visit_status VARCHAR(50),
    created_by VARCHAR(100),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES projects(id),
    INDEX idx_customer_id (customer_id),
    INDEX idx_visit_date (visit_date),
    INDEX idx_status (status),
    INDEX idx_visit_type (visit_type)
);

-- 2. Migrate data from old visits table to customer_visits table
-- This will preserve all existing visit data
INSERT INTO customer_visits (
    customer_id, visit_date, status, notes, project_id,
    flat_type, flat_size, visit_status, created_by, created_at, updated_at
)
SELECT
    customer_id, visit_date, status, notes, project_id,
    flat_type, flat_size, visit_status, 'System', NOW(), NOW()
FROM visits
WHERE visit_date IS NOT NULL
ON DUPLICATE KEY UPDATE
    updated_at = NOW();

-- 3. Log migration status
SELECT CONCAT('Successfully migrated ', COUNT(*), ' visit records') as migration_status
FROM customer_visits;

-- Note: The old visits table is kept for reference during testing
-- To drop it after verifying the migration: DROP TABLE visits;

