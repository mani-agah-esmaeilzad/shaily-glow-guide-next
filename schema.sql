-- Database Schema for Shaily App
-- Updated to use mobile number instead of email

CREATE DATABASE IF NOT EXISTS shaily_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE shaily_db;

-- Drop the table if it exists (for clean restart)
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS routines;

-- Users table with mobile number
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    mobile VARCHAR(11) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    age VARCHAR(10),
    job VARCHAR(255),
    gender ENUM('male', 'female') DEFAULT 'female',
    skinType VARCHAR(50),
    skinConcerns JSON,
    hairType VARCHAR(50),
    hairConcerns JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Routines table to store user daily routines
CREATE TABLE routines (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36),
    tasks JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_users_mobile ON users(mobile);
CREATE INDEX idx_routines_user_id ON routines(user_id);

-- Insert some sample data for testing (optional)
-- INSERT INTO users (id, name, mobile, password, age, job, gender, skinType, skinConcerns, hairType, hairConcerns) 
-- VALUES (
--   'sample-user-id', 
--   'کاربر نمونه', 
--   '09123456789', 
--   '$2a$10$samplehashedpassword', 
--   '25', 
--   'مهندس', 
--   'female', 
--   'چرب', 
--   '["جوش", "منافذ باز"]', 
--   'صاف', 
--   '["ریزش"]'
-- );
