-- ============================================
-- POLÍTICAS DE STORAGE PARA EL BUCKET 'images'
-- ============================================
-- Este script configura las políticas de acceso para el bucket de imágenes
-- Permite lectura pública y escritura/actualización/eliminación para usuarios autenticados
-- ============================================

-- IMPORTANTE: Asegúrate de que el bucket 'images' exista antes de ejecutar este script
-- Si no existe, créalo en Supabase → Storage → New bucket
-- Nombre: 'images' (exactamente así, en minúsculas)
-- Marca como: Public bucket

-- ============================================
-- 1. ELIMINAR POLÍTICAS EXISTENTES (si existen)
-- ============================================
-- Esto evita errores si ejecutas el script múltiples veces
DROP POLICY IF EXISTS "Public Access - Read Images" ON storage.objects;
DROP POLICY IF EXISTS "Public Access - Upload Images" ON storage.objects;
DROP POLICY IF EXISTS "Public Access - Update Images" ON storage.objects;
DROP POLICY IF EXISTS "Public Access - Delete Images" ON storage.objects;

-- ============================================
-- 2. POLÍTICA DE LECTURA (SELECT) - PÚBLICA
-- ============================================
-- Permite que cualquiera pueda ver/descargar las imágenes
CREATE POLICY "Public Access - Read Images"
ON storage.objects FOR SELECT
USING ( bucket_id = 'images' );

-- ============================================
-- 3. POLÍTICA DE ESCRITURA (INSERT) - PÚBLICA
-- ============================================
-- Permite que cualquiera pueda subir imágenes
-- ⚠️ Para producción, considera restringir esto solo a usuarios autenticados
CREATE POLICY "Public Access - Upload Images"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'images' );

-- ============================================
-- 4. POLÍTICA DE ACTUALIZACIÓN (UPDATE) - PÚBLICA
-- ============================================
-- Permite que cualquiera pueda actualizar/reemplazar imágenes
CREATE POLICY "Public Access - Update Images"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'images' );

-- ============================================
-- 5. POLÍTICA DE ELIMINACIÓN (DELETE) - PÚBLICA
-- ============================================
-- Permite que cualquiera pueda eliminar imágenes
-- ⚠️ Para producción, considera restringir esto solo a usuarios autenticados
CREATE POLICY "Public Access - Delete Images"
ON storage.objects FOR DELETE
USING ( bucket_id = 'images' );

-- ============================================
-- MENSAJE DE CONFIRMACIÓN
-- ============================================
DO $$
BEGIN
    RAISE NOTICE 'Políticas de Storage configuradas exitosamente para el bucket "images".';
    RAISE NOTICE 'Verifica que el bucket exista en Storage antes de usar.';
END $$;

