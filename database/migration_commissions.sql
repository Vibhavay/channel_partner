-- Migration: Create Commission Management Module
-- This script creates the commission_settings and commissions tables

-- 1. Create commission_settings table
CREATE TABLE IF NOT EXISTS commission_settings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT,
    builder_id BIGINT,
    commission_percentage DECIMAL(5, 2) NOT NULL,
    notes VARCHAR(500),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (builder_id) REFERENCES builders(id) ON DELETE CASCADE,
    INDEX idx_project_id (project_id),
    INDEX idx_builder_id (builder_id)
);

-- 2. Create commissions table
CREATE TABLE IF NOT EXISTS commissions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    sale_id BIGINT,
    booking_id BIGINT,
    customer_id BIGINT NOT NULL,
    expected_commission DECIMAL(15, 2) NOT NULL,
    received_commission DECIMAL(15, 2),
    pending_commission DECIMAL(15, 2) NOT NULL,
    payment_date DATE,
    status VARCHAR(50),
    notes VARCHAR(500),
    created_at DATE NOT NULL,
    updated_at DATE,
    FOREIGN KEY (sale_id) REFERENCES sales_details(id) ON DELETE CASCADE,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    INDEX idx_sale_id (sale_id),
    INDEX idx_booking_id (booking_id),
    INDEX idx_customer_id (customer_id),
    INDEX idx_status (status)
);

-- 3. Log migration status
SELECT CONCAT('Successfully created commission tables with settings: ', (SELECT COUNT(*) FROM commission_settings), ', commissions: ', (SELECT COUNT(*) FROM commissions)) as migration_status;
