-- ============================================
-- SCRIPT PARA CREAR LA BASE DE DATOS COMPLETA
-- ============================================
-- Este script crea todas las tablas necesarias para la aplicación
-- con sus respectivas constraints, índices y políticas de seguridad
-- ============================================

-- ============================================
-- 1. TABLA: admin_users
-- ============================================
-- Almacena usuarios administradores para el dashboard
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE
);

-- Índices para admin_users
CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);

-- ============================================
-- 2. TABLA: products (servicios)
-- ============================================
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price VARCHAR(100) NOT NULL,
    type VARCHAR(20) DEFAULT 'timeline' CHECK (type IS NULL OR type IN ('timeline', 'development')),
    image_url VARCHAR(500),
    calendly_url VARCHAR(500),
    media_url VARCHAR(500),
    media_type VARCHAR(20) CHECK (media_type IS NULL OR media_type IN ('image', 'video')),
    icon_name VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    display_order INTEGER DEFAULT 0
);

-- Tabla para features (características) de productos
CREATE TABLE IF NOT EXISTS product_features (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    feature_text TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para products
CREATE INDEX IF NOT EXISTS idx_products_title ON products(title);
CREATE INDEX IF NOT EXISTS idx_products_display_order ON products(display_order);
CREATE INDEX IF NOT EXISTS idx_products_type ON products(type);
CREATE INDEX IF NOT EXISTS idx_products_media_type ON products(media_type);
CREATE INDEX IF NOT EXISTS idx_product_features_product_id ON product_features(product_id);

-- ============================================
-- 3. TABLA: blog_posts
-- ============================================
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    excerpt TEXT NOT NULL,
    image VARCHAR(500),
    date VARCHAR(50),
    read_time VARCHAR(50),
    category VARCHAR(100),
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    published BOOLEAN DEFAULT TRUE
);

-- Índices para blog_posts
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON blog_posts(created_at DESC);

-- ============================================
-- 4. TABLA: partners
-- ============================================
CREATE TABLE IF NOT EXISTS partners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    logo_url VARCHAR(500),
    website_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    display_order INTEGER DEFAULT 0
);

-- Índices para partners
CREATE INDEX IF NOT EXISTS idx_partners_name ON partners(name);
CREATE INDEX IF NOT EXISTS idx_partners_display_order ON partners(display_order);

-- ============================================
-- 5. TABLA: testimonials
-- ============================================
CREATE TABLE IF NOT EXISTS testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quote TEXT NOT NULL,
    author VARCHAR(255) NOT NULL,
    role VARCHAR(100),
    company VARCHAR(255),
    industry VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    display_order INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE
);

-- Índices para testimonials
CREATE INDEX IF NOT EXISTS idx_testimonials_author ON testimonials(author);
CREATE INDEX IF NOT EXISTS idx_testimonials_company ON testimonials(company);
CREATE INDEX IF NOT EXISTS idx_testimonials_industry ON testimonials(industry);
CREATE INDEX IF NOT EXISTS idx_testimonials_is_featured ON testimonials(is_featured);
CREATE INDEX IF NOT EXISTS idx_testimonials_display_order ON testimonials(display_order);

-- ============================================
-- 6. TABLA: industries
-- ============================================
CREATE TABLE IF NOT EXISTS industries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    display_order INTEGER DEFAULT 0
);

-- Índices para industries
CREATE INDEX IF NOT EXISTS idx_industries_name ON industries(name);
CREATE INDEX IF NOT EXISTS idx_industries_display_order ON industries(display_order);

-- ============================================
-- 7. TABLA: team_members
-- ============================================
CREATE TABLE IF NOT EXISTS team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    bio TEXT NOT NULL,
    is_founder BOOLEAN DEFAULT FALSE,
    image_url VARCHAR(500),
    linkedin_url VARCHAR(500),
    email VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    display_order INTEGER DEFAULT 0
);

-- Índices para team_members
CREATE INDEX IF NOT EXISTS idx_team_members_name ON team_members(name);
CREATE INDEX IF NOT EXISTS idx_team_members_is_founder ON team_members(is_founder);
CREATE INDEX IF NOT EXISTS idx_team_members_display_order ON team_members(display_order);

-- ============================================
-- FUNCIONES DE ACTUALIZACIÓN AUTOMÁTICA
-- ============================================
-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_partners_updated_at ON partners;
CREATE TRIGGER update_partners_updated_at BEFORE UPDATE ON partners
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_testimonials_updated_at ON testimonials;
CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON testimonials
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_industries_updated_at ON industries;
CREATE TRIGGER update_industries_updated_at BEFORE UPDATE ON industries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_team_members_updated_at ON team_members;
CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON team_members
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_admin_users_updated_at ON admin_users;
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- MENSAJE DE CONFIRMACIÓN
-- ============================================
DO $$
BEGIN
    RAISE NOTICE 'Base de datos creada exitosamente. Todas las tablas, índices y triggers han sido configurados.';
END $$;

