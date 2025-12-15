-- ============================================
-- SCRIPT PARA BORRAR TODA LA BASE DE DATOS
-- ============================================
-- ⚠️ ADVERTENCIA: Este script eliminará TODAS las tablas y datos
-- Ejecutar solo cuando necesites resetear completamente la base de datos
-- ============================================

-- Desactivar temporalmente las foreign keys y constraints
SET session_replication_role = 'replica';

-- Eliminar todas las tablas en orden (respetando dependencias)
DROP TABLE IF EXISTS product_features CASCADE;
DROP TABLE IF EXISTS team_members CASCADE;
DROP TABLE IF EXISTS testimonials CASCADE;
DROP TABLE IF EXISTS industries CASCADE;
DROP TABLE IF EXISTS partners CASCADE;
DROP TABLE IF EXISTS blog_posts CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;

-- Eliminar tipos personalizados si existen
DROP TYPE IF EXISTS user_role CASCADE;

-- Reactivar constraints
SET session_replication_role = 'origin';

-- Verificar que las tablas fueron eliminadas
DO $$
BEGIN
    RAISE NOTICE 'Base de datos eliminada exitosamente. Todas las tablas han sido borradas.';
END $$;

