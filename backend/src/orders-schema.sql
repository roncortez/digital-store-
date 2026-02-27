-- Orders Management Schema
-- PostgreSQL 15+
-- Sistema completo de gestión de órdenes

-- ============================================
-- DROP TABLES (para recreación limpia)
-- ============================================
DROP TABLE IF EXISTS order_status_history CASCADE;
DROP TABLE IF EXISTS payment_transactions CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;

-- ============================================
-- 1. TABLA DE ÓRDENES PRINCIPAL
-- ============================================
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    
    -- Identificación
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    
    -- Estados
    status VARCHAR(20) NOT NULL DEFAULT 'pending' 
        CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
    payment_status VARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
    
    -- Métodos
    payment_method VARCHAR(50),
    delivery_method VARCHAR(20) NOT NULL
        CHECK (delivery_method IN ('pickup', 'delivery')),
    
    -- Importes
    subtotal DECIMAL(10, 2) NOT NULL CHECK (subtotal >= 0),
    discount DECIMAL(10, 2) DEFAULT 0 CHECK (discount >= 0),
    shipping_cost DECIMAL(10, 2) DEFAULT 0 CHECK (shipping_cost >= 0),
    total DECIMAL(10, 2) NOT NULL CHECK (total >= 0),
    
    -- Información adicional (JSON para flexibilidad)
    delivery_address JSONB, -- {street, city, province, zip, phone, notes}
    billing_info JSONB,     -- {name, id_number, address, phone, email}
    
    -- Tracking
    tracking_number VARCHAR(100),
    notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    shipped_at TIMESTAMP,
    delivered_at TIMESTAMP,
    cancelled_at TIMESTAMP
);

-- ============================================
-- 2. TABLA DE ITEMS DE ORDEN
-- ============================================
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    
    -- Relaciones
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    
    -- Snapshot del producto (en caso de que el producto cambie después)
    product_name VARCHAR(255) NOT NULL,
    product_price DECIMAL(10, 2) NOT NULL CHECK (product_price >= 0),
    product_image_url VARCHAR(500),
    
    -- Cantidad y subtotal
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    subtotal DECIMAL(10, 2) NOT NULL CHECK (subtotal >= 0),
    
    -- Timestamp
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 3. TABLA DE TRANSACCIONES DE PAGO
-- ============================================
CREATE TABLE payment_transactions (
    id SERIAL PRIMARY KEY,
    
    -- Relación con orden
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    
    -- Información de la transacción
    transaction_id VARCHAR(255) UNIQUE, -- ID de Payphone u otro gateway
    amount DECIMAL(10, 2) NOT NULL CHECK (amount >= 0),
    currency VARCHAR(3) DEFAULT 'USD',
    
    -- Estado y método
    status VARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    payment_method VARCHAR(50) NOT NULL,
    
    -- Datos completos del gateway (para debugging y auditoría)
    gateway_response JSONB,
    
    -- Información adicional
    error_message TEXT,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    failed_at TIMESTAMP
);

-- ============================================
-- 4. TABLA DE HISTORIAL DE ESTADOS
-- ============================================
CREATE TABLE order_status_history (
    id SERIAL PRIMARY KEY,
    
    -- Relación
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    
    -- Estado
    previous_status VARCHAR(20),
    new_status VARCHAR(20) NOT NULL,
    
    -- Quién y cuándo
    changed_by VARCHAR(255), -- user_id o 'system'
    notes TEXT,
    
    -- Timestamp
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- ÍNDICES para mejor performance
-- ============================================

-- Índices en orders
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- Índices en order_items
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

-- Índices en payment_transactions
CREATE INDEX idx_payment_transactions_order_id ON payment_transactions(order_id);
CREATE INDEX idx_payment_transactions_transaction_id ON payment_transactions(transaction_id);
CREATE INDEX idx_payment_transactions_status ON payment_transactions(status);

-- Índices en order_status_history
CREATE INDEX idx_order_status_history_order_id ON order_status_history(order_id);

-- ============================================
-- FUNCIÓN para generar número de orden único
-- ============================================
CREATE OR REPLACE FUNCTION generate_order_number() 
RETURNS VARCHAR AS $$
DECLARE
    new_order_number VARCHAR;
    counter INTEGER := 0;
BEGIN
    LOOP
        -- Formato: ORD-YYYYMMDD-XXXXX
        new_order_number := 'ORD-' || 
                           TO_CHAR(CURRENT_TIMESTAMP, 'YYYYMMDD') || '-' || 
                           LPAD(FLOOR(RANDOM() * 99999)::TEXT, 5, '0');
        
        -- Verificar si ya existe
        IF NOT EXISTS (SELECT 1 FROM orders WHERE order_number = new_order_number) THEN
            RETURN new_order_number;
        END IF;
        
        counter := counter + 1;
        IF counter > 100 THEN
            RAISE EXCEPTION 'No se pudo generar un número de orden único después de 100 intentos';
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGER para actualizar updated_at automáticamente
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_orders_updated_at 
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- TRIGGER para registrar cambios de estado
-- ============================================
CREATE OR REPLACE FUNCTION log_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO order_status_history (order_id, previous_status, new_status, changed_by, notes)
        VALUES (NEW.id, OLD.status, NEW.status, 'system', 'Estado actualizado automáticamente');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER log_order_status_changes
    AFTER UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION log_order_status_change();

-- ============================================
-- COMENTARIOS para documentación
-- ============================================
COMMENT ON TABLE orders IS 'Tabla principal de órdenes de compra';
COMMENT ON TABLE order_items IS 'Items individuales de cada orden';
COMMENT ON TABLE payment_transactions IS 'Registro de todas las transacciones de pago';
COMMENT ON TABLE order_status_history IS 'Historial de cambios de estado de órdenes';

COMMENT ON COLUMN orders.user_id IS 'Firebase UID del usuario que realizó la orden';
COMMENT ON COLUMN orders.order_number IS 'Número único de orden generado automáticamente';
COMMENT ON COLUMN orders.delivery_address IS 'JSON con dirección de entrega completa';
COMMENT ON COLUMN orders.billing_info IS 'JSON con información de facturación';

COMMENT ON FUNCTION generate_order_number() IS 'Genera un número de orden único en formato ORD-YYYYMMDD-XXXXX';
