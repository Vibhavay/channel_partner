-- Insert single sample entries for the Real Estate Channel Partner System
USE channel_partner_db;

-- Clear existing data (optional - uncomment if needed)
-- DELETE FROM sales;
-- DELETE FROM visits;
-- DELETE FROM follow_ups;
-- DELETE FROM customers;
-- DELETE FROM projects;
-- DELETE FROM builders;

-- Insert a single Builder
INSERT INTO builders (name, contact_person, email, phone, address)
VALUES ('Prime Developers', 'Rajesh Kumar', 'rajesh@primedevelopers.com', '9876543210', '789 Development Blvd, Tech City');

-- Insert a single Project
INSERT INTO projects (name, location, description, min_price, max_price, builder_id)
VALUES ('Sky Tower Heights', 'Downtown Tech City', 'Premium high-rise residential towers with modern amenities', 7500000.00, 12500000.00, 3);

-- Insert a single Customer
INSERT INTO customers (name, email, phone, address, date_of_inquiry, status, follow_up_date, project_id)
VALUES ('Vikram Patel', 'vikram.patel@email.com', '9123456789', '42 Oak Street, Riverside Apartments', '2026-04-05', 'Interested', '2026-04-10', 3);

-- Insert a single Sale
INSERT INTO sales (sale_date, amount, commission, status, customer_id)
VALUES ('2026-04-05', 10000000.00, 500000.00, 'Completed', 3);

-- Verify the inserted data
SELECT 'Builders' as Table_Name, COUNT(*) as Count FROM builders
UNION ALL
SELECT 'Projects', COUNT(*) FROM projects
UNION ALL
SELECT 'Customers', COUNT(*) FROM customers
UNION ALL
SELECT 'Sales', COUNT(*) FROM sales;
