-- Users Management Schema
-- PostgreSQL 15+

-- ============================================
-- DROP TABLE (para recreación limpia)
-- ============================================
DROP TABLE IF EXISTS users CASCADE;

-- ============================================
-- TABLA DE USUARIOS
-- ============================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    
    -- Identificación
    firebase_uid VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    
    -- Información personal
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    doc_id VARCHAR(20), -- Cédula o pasaporte
    phone VARCHAR(20),
    address TEXT,
    
    -- Sistema de puntos
    points INTEGER DEFAULT 0 CHECK (points >= 0),
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- ÍNDICES para mejor performance
-- ============================================
CREATE INDEX idx_users_firebase_uid ON users(firebase_uid);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_points ON users(points);

-- ============================================
-- TRIGGER para actualizar updated_at automáticamente
-- ============================================
CREATE OR REPLACE FUNCTION update_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at_trigger
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_users_updated_at();

-- ============================================
-- COMENTARIOS para documentación
-- ============================================
COMMENT ON TABLE users IS 'Tabla de usuarios del sistema';
COMMENT ON COLUMN users.firebase_uid IS 'UID de Firebase para autenticación';
COMMENT ON COLUMN users.doc_id IS 'Número de cédula o pasaporte';
COMMENT ON COLUMN users.points IS 'Puntos acumulados del usuario (nivel se calcula dinámicamente)';
