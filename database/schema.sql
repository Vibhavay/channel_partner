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
    date_of_inquiry DATE,
    status VARCHAR(50),
    follow_up_date DATE,
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

-- Sales table
CREATE TABLE sales (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    sale_date DATE NOT NULL,
    amount DECIMAL(15,2),
    commission DECIMAL(15,2),
    status VARCHAR(50),
    customer_id BIGINT NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- Users will be initialized by DataInitializer.java on application startup
-- This ensures proper password hashing using BCryptPasswordEncoder

-- Insert sample builders if needed (optional - can be added via UI)
-- INSERT INTO builders (name, contact_person, email, phone, address) VALUES
-- ('ABC Builders', 'John Doe', 'john@abc.com', '1234567890', '123 Builder St'),
-- ('XYZ Constructions', 'Jane Smith', 'jane@xyz.com', '0987654321', '456 Construct Ave');