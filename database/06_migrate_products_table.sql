-- ============================================
-- MIGRACIÓN: Agregar nuevos campos a products
-- ============================================
-- Este script agrega los campos necesarios para:
-- - type: timeline o development
-- - image_url: URL de imagen del producto
-- - calendly_url: URL de Calendly para reservas
-- - media_url: URL de imagen o video para timeline
-- - media_type: tipo de media (image o video)
-- - icon_name: nombre del icono de lucide-react
-- ============================================

-- Agregar columna type si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'type'
    ) THEN
        ALTER TABLE products ADD COLUMN type VARCHAR(20) DEFAULT 'timeline';
        RAISE NOTICE 'Columna "type" agregada a products';
    ELSE
        RAISE NOTICE 'Columna "type" ya existe en products';
    END IF;
END $$;

-- Agregar columna image_url si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'image_url'
    ) THEN
        ALTER TABLE products ADD COLUMN image_url VARCHAR(500);
        RAISE NOTICE 'Columna "image_url" agregada a products';
    ELSE
        RAISE NOTICE 'Columna "image_url" ya existe en products';
    END IF;
END $$;

-- Agregar columna calendly_url si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'calendly_url'
    ) THEN
        ALTER TABLE products ADD COLUMN calendly_url VARCHAR(500);
        RAISE NOTICE 'Columna "calendly_url" agregada a products';
    ELSE
        RAISE NOTICE 'Columna "calendly_url" ya existe en products';
    END IF;
END $$;

-- Agregar columna media_url si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'media_url'
    ) THEN
        ALTER TABLE products ADD COLUMN media_url VARCHAR(500);
        RAISE NOTICE 'Columna "media_url" agregada a products';
    ELSE
        RAISE NOTICE 'Columna "media_url" ya existe en products';
    END IF;
END $$;

-- Agregar columna media_type si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'media_type'
    ) THEN
        ALTER TABLE products ADD COLUMN media_type VARCHAR(20);
        RAISE NOTICE 'Columna "media_type" agregada a products';
    ELSE
        RAISE NOTICE 'Columna "media_type" ya existe en products';
    END IF;
END $$;

-- Agregar constraint para type si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'products' 
        AND constraint_name = 'products_type_check'
    ) THEN
        ALTER TABLE products ADD CONSTRAINT products_type_check 
        CHECK (type IS NULL OR type IN ('timeline', 'development'));
        RAISE NOTICE 'Constraint "products_type_check" agregado';
    ELSE
        RAISE NOTICE 'Constraint "products_type_check" ya existe';
    END IF;
END $$;

-- Agregar constraint para media_type si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'products' 
        AND constraint_name = 'products_media_type_check'
    ) THEN
        ALTER TABLE products ADD CONSTRAINT products_media_type_check 
        CHECK (media_type IS NULL OR media_type IN ('image', 'video'));
        RAISE NOTICE 'Constraint "products_media_type_check" agregado';
    ELSE
        RAISE NOTICE 'Constraint "products_media_type_check" ya existe';
    END IF;
END $$;

-- Agregar columna icon_name si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'icon_name'
    ) THEN
        ALTER TABLE products ADD COLUMN icon_name VARCHAR(100);
        RAISE NOTICE 'Columna "icon_name" agregada a products';
    ELSE
        RAISE NOTICE 'Columna "icon_name" ya existe en products';
    END IF;
END $$;

-- Crear índices para mejorar performance
CREATE INDEX IF NOT EXISTS idx_products_type ON products(type);
CREATE INDEX IF NOT EXISTS idx_products_media_type ON products(media_type);

-- Actualizar productos existentes para que tengan type = 'timeline' por defecto
UPDATE products SET type = 'timeline' WHERE type IS NULL;

-- ============================================
-- MENSAJE DE CONFIRMACIÓN
-- ============================================
DO $$
BEGIN
    RAISE NOTICE '============================================';
    RAISE NOTICE 'Migración completada exitosamente.';
    RAISE NOTICE 'Campos agregados a la tabla products:';
    RAISE NOTICE '  - type (timeline/development)';
    RAISE NOTICE '  - image_url';
    RAISE NOTICE '  - calendly_url';
    RAISE NOTICE '  - media_url';
    RAISE NOTICE '  - media_type (image/video)';
    RAISE NOTICE '  - icon_name (nombre del icono)';
    RAISE NOTICE '============================================';
END $$;

