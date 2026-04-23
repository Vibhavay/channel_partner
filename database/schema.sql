-- Create database
CREATE DATABASE IF NOT EXISTS channel_partner_db;
USE channel_partner_db;

-- Users table for authentication
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    name VARCHAR(100)
);

-- Builders table
CREATE TABLE builders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(100),
    contact_number VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    office VARCHAR(255),
    pin VARCHAR(10),
    gst_no VARCHAR(20)
);

-- Projects table
CREATE TABLE projects (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(100),
    description TEXT,
    min_price DECIMAL(15,2),
    max_price DECIMAL(15,2),
    builder_id BIGINT NOT NULL,
    FOREIGN KEY (builder_id) REFERENCES builders(id)
);

-- Customers table
CREATE TABLE customers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    budget DECIMAL(15,2),
    status VARCHAR(50),
    project_id BIGINT NOT NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id)
);

-- Follow-ups table
CREATE TABLE follow_ups (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    follow_up_date DATE NOT NULL,
    notes TEXT,
    status VARCHAR(50),
    customer_id BIGINT NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- Visits table
CREATE TABLE visits (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    visit_date DATE NOT NULL,
    status VARCHAR(50),
    notes TEXT,
    customer_id BIGINT NOT NULL,
    project_id BIGINT,
    flat_type VARCHAR(50),
    flat_size DOUBLE,
    visit_status VARCHAR(50),
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (project_id) REFERENCES projects(id)
);


-- Call Logs table for customer call management
CREATE TABLE call_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    call_date_time DATETIME NOT NULL,
    call_type VARCHAR(50) NOT NULL,
    call_status VARCHAR(50) NOT NULL,
    call_notes TEXT,
    created_by VARCHAR(100) NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    INDEX idx_customer_id (customer_id),
    INDEX idx_call_date_time (call_date_time),
    INDEX idx_call_status (call_status),
    INDEX idx_call_type (call_type)
);

-- Bookings table for deal/booking management
CREATE TABLE bookings (
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

-- Commission Settings table
CREATE TABLE commission_settings (
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

-- Commissions table
CREATE TABLE commissions (
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

-- Users will be initialized by DataInitializer.java on application startup
-- This ensures proper password hashing using BCryptPasswordEncoder

-- Insert sample builders if needed (optional - can be added via UI)
-- INSERT INTO builders (name, contact_person, email, phone, address) VALUES
-- ('ABC Builders', 'John Doe', 'john@abc.com', '1234567890', '123 Builder St'),
-- ('XYZ Constructions', 'Jane Smith', 'jane@xyz.com', '0987654321', '456 Construct Ave');