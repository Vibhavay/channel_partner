-- Migration: Create Bookings Module
-- This script creates the bookings table for managing customer bookings/deals

-- 1. Create new bookings table
CREATE TABLE IF NOT EXISTS bookings (
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
    booking_date DATE NOT NULL,
    payment_plan TEXT,
    status VARCHAR(50),
    sales_executive_id BIGINT,
    notes TEXT,
    created_at DATE NOT NULL,
    updated_at DATE,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    INDEX idx_customer_id (customer_id),
    INDEX idx_status (status),
    INDEX idx_booking_date (booking_date),
    INDEX idx_project_name (project_name)
);

-- 2. Log migration status
SELECT CONCAT('Successfully created bookings table with ', COUNT(*), ' records') as migration_status
FROM bookings;
