-- Sample data initialization for the Real Estate Channel Partner System
-- Users are created by DataInitializer.java with proper password hashing

-- Insert sample builder if it doesn't exist
-- INSERT IGNORE INTO builders (id, first_name, last_name, email, contact_number, address, city, state, office, pin, gst_no) VALUES
-- (3, 'Rajesh', 'Kumar', 'rajesh@primedevelopers.com', '9876543210', '789 Development Blvd', 'Tech City', 'Maharashtra', 'Prime Developers Office', '400001', 'GST123456789');

-- Insert sample project if it doesn't exist
-- INSERT IGNORE INTO projects (id, name, location, description, min_price, max_price, builder_id) VALUES
-- (3, 'Sky Tower Heights', 'Downtown Tech City', 'Premium high-rise residential towers with modern amenities', 7500000.00, 12500000.00, 3);

-- Insert sample customer if it doesn't exist
INSERT IGNORE INTO customers (id, first_name, last_name, email, phone, address, city, state, budget, date_of_inquiry, status, follow_up_date, project_id) VALUES
(3, 'Vikram', 'Patel', 'vikram.patel@email.com', '9123456789', '42 Oak Street, Riverside Apartments', 'Mumbai', 'Maharashtra', 15000000.00, '2026-04-05', 'Interested', '2026-04-05', 3);

-- Insert sample sale if it doesn't exist
INSERT IGNORE INTO sales (id, sale_date, amount, commission, status, customer_id) VALUES
(1, '2026-04-05', 10000000.00, 500000.00, 'Completed', 3);

-- Insert sample visit with confirmed status
INSERT IGNORE INTO visits (id, visit_date, status, notes, customer_id, project_id, flat_type, flat_size, visit_status) VALUES
(1, '2026-04-10', 'Completed', 'Customer confirmed booking', 3, 3, '3 BHK', 1500.0, 'confirmed');
