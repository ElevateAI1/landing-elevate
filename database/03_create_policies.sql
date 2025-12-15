-- ============================================
-- SCRIPT PARA CREAR POLÍTICAS DE SEGURIDAD (RLS)
-- ============================================
-- Este script configura Row Level Security (RLS) para Supabase
-- Si no usas Supabase, puedes adaptar estas políticas o desactivarlas
-- ============================================

-- ============================================
-- HABILITAR ROW LEVEL SECURITY
-- ============================================
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE industries ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLÍTICAS PARA admin_users
-- ============================================
-- Solo los administradores pueden ver y modificar usuarios
DROP POLICY IF EXISTS "Admin users can view all users" ON admin_users;
CREATE POLICY "Admin users can view all users" ON admin_users
    FOR SELECT
    USING (true); -- Ajustar según tu lógica de autenticación

DROP POLICY IF EXISTS "Admin users can insert users" ON admin_users;
CREATE POLICY "Admin users can insert users" ON admin_users
    FOR INSERT
    WITH CHECK (true); -- Ajustar según tu lógica de autenticación

DROP POLICY IF EXISTS "Admin users can update users" ON admin_users;
CREATE POLICY "Admin users can update users" ON admin_users
    FOR UPDATE
    USING (true); -- Ajustar según tu lógica de autenticación

DROP POLICY IF EXISTS "Admin users can delete users" ON admin_users;
CREATE POLICY "Admin users can delete users" ON admin_users
    FOR DELETE
    USING (true); -- Ajustar según tu lógica de autenticación

-- ============================================
-- POLÍTICAS PARA products
-- ============================================
-- Lectura pública, escritura solo para admins
DROP POLICY IF EXISTS "Public can view products" ON products;
CREATE POLICY "Public can view products" ON products
    FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Admins can insert products" ON products;
CREATE POLICY "Admins can insert products" ON products
    FOR INSERT
    WITH CHECK (true); -- Ajustar según tu lógica de autenticación

DROP POLICY IF EXISTS "Admins can update products" ON products;
CREATE POLICY "Admins can update products" ON products
    FOR UPDATE
    USING (true); -- Ajustar según tu lógica de autenticación

DROP POLICY IF EXISTS "Admins can delete products" ON products;
CREATE POLICY "Admins can delete products" ON products
    FOR DELETE
    USING (true); -- Ajustar según tu lógica de autenticación

-- ============================================
-- POLÍTICAS PARA product_features
-- ============================================
DROP POLICY IF EXISTS "Public can view product features" ON product_features;
CREATE POLICY "Public can view product features" ON product_features
    FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Admins can manage product features" ON product_features;
CREATE POLICY "Admins can manage product features" ON product_features
    FOR ALL
    USING (true); -- Ajustar según tu lógica de autenticación

-- ============================================
-- POLÍTICAS PARA blog_posts
-- ============================================
-- Solo posts publicados son visibles públicamente
DROP POLICY IF EXISTS "Public can view published blog posts" ON blog_posts;
CREATE POLICY "Public can view published blog posts" ON blog_posts
    FOR SELECT
    USING (published = true);

DROP POLICY IF EXISTS "Admins can view all blog posts" ON blog_posts;
CREATE POLICY "Admins can view all blog posts" ON blog_posts
    FOR SELECT
    USING (true); -- Ajustar según tu lógica de autenticación

DROP POLICY IF EXISTS "Admins can manage blog posts" ON blog_posts;
CREATE POLICY "Admins can manage blog posts" ON blog_posts
    FOR ALL
    USING (true); -- Ajustar según tu lógica de autenticación

-- ============================================
-- POLÍTICAS PARA partners
-- ============================================
DROP POLICY IF EXISTS "Public can view partners" ON partners;
CREATE POLICY "Public can view partners" ON partners
    FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Admins can manage partners" ON partners;
CREATE POLICY "Admins can manage partners" ON partners
    FOR ALL
    USING (true); -- Ajustar según tu lógica de autenticación

-- ============================================
-- POLÍTICAS PARA testimonials
-- ============================================
DROP POLICY IF EXISTS "Public can view testimonials" ON testimonials;
CREATE POLICY "Public can view testimonials" ON testimonials
    FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Admins can manage testimonials" ON testimonials;
CREATE POLICY "Admins can manage testimonials" ON testimonials
    FOR ALL
    USING (true); -- Ajustar según tu lógica de autenticación

-- ============================================
-- POLÍTICAS PARA industries
-- ============================================
DROP POLICY IF EXISTS "Public can view industries" ON industries;
CREATE POLICY "Public can view industries" ON industries
    FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Admins can manage industries" ON industries;
CREATE POLICY "Admins can manage industries" ON industries
    FOR ALL
    USING (true); -- Ajustar según tu lógica de autenticación

-- ============================================
-- POLÍTICAS PARA team_members
-- ============================================
DROP POLICY IF EXISTS "Public can view team members" ON team_members;
CREATE POLICY "Public can view team members" ON team_members
    FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Admins can manage team members" ON team_members;
CREATE POLICY "Admins can manage team members" ON team_members
    FOR ALL
    USING (true); -- Ajustar según tu lógica de autenticación

-- ============================================
-- MENSAJE DE CONFIRMACIÓN
-- ============================================
DO $$
BEGIN
    RAISE NOTICE 'Políticas de seguridad (RLS) configuradas exitosamente.';
    RAISE NOTICE 'NOTA: Ajusta las políticas según tu sistema de autenticación.';
    RAISE NOTICE 'Las políticas actuales permiten acceso completo - asegúrate de implementar autenticación adecuada.';
END $$;

