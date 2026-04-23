-- Migration: Create Sales Details Module
-- This script creates the sales_details table for managing flat purchases

-- 1. Create new sales_details table
CREATE TABLE IF NOT EXISTS sales_details (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    project_name VARCHAR(100) NOT NULL,
    building_name VARCHAR(100),
    flat_no VARCHAR(50) NOT NULL,
    floor_no VARCHAR(20),
    flat_type VARCHAR(50),
    carpet_area DECIMAL(10, 2),
    agreement_value DECIMAL(15, 2) NOT NULL,
    booking_amount DECIMAL(15, 2) NOT NULL,
    remaining_amount DECIMAL(15, 2),
    payment_status VARCHAR(50),
    agreement_date DATE,
    possession_date DATE,
    sales_executive_id BIGINT,
    notes TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    INDEX idx_customer_id (customer_id),
    INDEX idx_payment_status (payment_status),
    INDEX idx_agreement_date (agreement_date),
    INDEX idx_possession_date (possession_date),
    INDEX idx_project_name (project_name)
);

-- 2. Log migration status
SELECT CONCAT('Successfully created sales_details table with ', COUNT(*), ' records') as migration_status
FROM sales_details;

-- Note: The old sales table is retained for reference
-- To keep both old and new data, migrate if needed:
-- INSERT INTO sales_details (customer_id, project_name, agreement_value, booking_amount, payment_status, created_at, updated_at)
-- SELECT customer_id, 'Migration', amount, 0, status, NOW(), NOW() FROM sales WHERE id IS NOT NULL;

