-- ============================================
-- SCRIPT PARA INSERTAR DATOS INICIALES
-- ============================================
-- Este script inserta datos de ejemplo y el usuario administrador inicial
-- ============================================

-- ============================================
-- 1. CREAR USUARIO ADMINISTRADOR
-- ============================================
-- Contraseña: 'Elevate2024!Secure' (hash bcrypt)
-- NOTA: Debes generar el hash bcrypt de tu contraseña real
-- Puedes usar: https://bcrypt-generator.com/ o tu backend
-- 
-- Ejemplo de hash para 'Elevate2024!Secure': 
-- $2a$10$rK8X9Y2Z3A4B5C6D7E8F9G0H1I2J3K4L5M6N7O8P9Q0R1S2T3U4V5W6X7Y8Z
-- 
-- IMPORTANTE: Reemplaza el hash de abajo con el hash real de tu contraseña

INSERT INTO admin_users (username, password_hash, email, is_active)
VALUES (
    'admin',
    '$2a$10$rK8X9Y2Z3A4B5C6D7E8F9G0H1I2J3K4L5M6N7O8P9Q0R1S2T3U4V5W6X7Y8Z', -- ⚠️ REEMPLAZAR CON HASH REAL
    'admin@elevate.ai',
    true
)
ON CONFLICT (username) DO NOTHING;

-- ============================================
-- 2. INSERTAR PRODUCTOS INICIALES (Opcional)
-- ============================================
-- Descomenta y ajusta según necesites datos iniciales

/*
INSERT INTO products (id, title, description, price, display_order)
VALUES 
    (
        '550e8400-e29b-41d4-a716-446655440000',
        'Auditoría Estratégica',
        'El punto de entrada. Un análisis operativo profundo para mapear riesgos y oportunidades.',
        'USD 2,000 | 6 Horas',
        1
    ),
    (
        '550e8400-e29b-41d4-a716-446655440001',
        'Despliegue Embebido',
        'Equipos de ingeniería desplegados construyendo arquitectura personalizada dentro de su ecosistema.',
        'Precio Personalizado',
        2
    ),
    (
        '550e8400-e29b-41d4-a716-446655440002',
        'Gobernanza de IA',
        'Marcos de cumplimiento por diseño asegurando que su IA siga siendo un activo, no un pasivo.',
        'Modelo de Retención',
        3
    )
ON CONFLICT DO NOTHING;

-- Features para productos
INSERT INTO product_features (product_id, feature_text, display_order)
VALUES 
    ('550e8400-e29b-41d4-a716-446655440000', 'Mapeo de Procesos', 1),
    ('550e8400-e29b-41d4-a716-446655440000', 'Análisis de Riesgos', 2),
    ('550e8400-e29b-41d4-a716-446655440000', 'Hoja de Ruta IA', 3),
    ('550e8400-e29b-41d4-a716-446655440000', 'ROI de Caso de Negocio', 4),
    ('550e8400-e29b-41d4-a716-446655440001', 'Equipo Dedicado', 1),
    ('550e8400-e29b-41d4-a716-446655440001', 'Integración Legacy', 2),
    ('550e8400-e29b-41d4-a716-446655440001', 'Desarrollo Custom', 3),
    ('550e8400-e29b-41d4-a716-446655440001', 'Transferencia Tecnológica', 4),
    ('550e8400-e29b-41d4-a716-446655440002', 'Marco de Cumplimiento', 1),
    ('550e8400-e29b-41d4-a716-446655440002', 'Auditoría Continua', 2),
    ('550e8400-e29b-41d4-a716-446655440002', 'Ops de Políticas', 3),
    ('550e8400-e29b-41d4-a716-446655440002', 'Reportes Ejecutivos', 4)
ON CONFLICT DO NOTHING;
*/

-- ============================================
-- MENSAJE DE CONFIRMACIÓN
-- ============================================
DO $$
BEGIN
    RAISE NOTICE 'Datos iniciales insertados.';
    RAISE NOTICE 'IMPORTANTE: Asegúrate de generar y actualizar el hash de contraseña del admin.';
END $$;

