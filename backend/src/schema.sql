-- Maitech Database Schema
-- PostgreSQL 15+

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;

-- Drop tables if they exist (for clean recreation)
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS conditions CASCADE;
DROP TABLE IF EXISTS brands CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- Categories table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Brands table
CREATE TABLE brands (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Conditions table
CREATE TABLE conditions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    image_url VARCHAR(500),
    category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    brand_id INTEGER NOT NULL REFERENCES brands(id) ON DELETE RESTRICT,
    condition_id INTEGER NOT NULL REFERENCES conditions(id) ON DELETE RESTRICT,
    stock INTEGER DEFAULT 0 CHECK (stock >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better query performance
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_brand ON products(brand_id);
CREATE INDEX idx_products_condition ON products(condition_id);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_name ON products(name);

-- Full-text search index (optional, for advanced search)
CREATE INDEX idx_products_name_trgm ON products USING gin(name gin_trgm_ops);

-- Comments for documentation
COMMENT ON TABLE categories IS 'Product categories (Computadoras, Celulares, etc.)';
COMMENT ON TABLE brands IS 'Product brands (Apple, Samsung, etc.)';
COMMENT ON TABLE conditions IS 'Product conditions (Nuevo, Usado, etc.)';
COMMENT ON TABLE products IS 'Main products table with all product information';
