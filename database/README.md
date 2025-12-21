# Scripts de Base de Datos - Elevate AI Landing

Este directorio contiene los scripts SQL para configurar la base de datos completa del proyecto.

## 📋 Estructura de Scripts

### 1. `01_drop_database.sql`
**⚠️ ADVERTENCIA: Este script elimina TODAS las tablas y datos**

Ejecuta este script cuando necesites resetear completamente la base de datos.

```sql
-- Ejecutar en Supabase SQL Editor o tu cliente PostgreSQL
```

### 2. `02_create_tables.sql`
Crea todas las tablas necesarias:
- `admin_users` - Usuarios administradores
- `products` - Servicios/Productos
- `product_features` - Características de productos
- `blog_posts` - Posts del blog
- `partners` - Socios/Empresas asociadas
- `testimonials` - Testimonios de clientes
- `industries` - Industrias
- `team_members` - Miembros del equipo

Incluye:
- Constraints y foreign keys
- Índices para optimización
- Triggers para actualización automática de `updated_at`

### 3. `03_create_policies.sql`
Configura Row Level Security (RLS) para Supabase:
- Políticas de lectura pública para contenido
- Políticas de escritura solo para administradores
- Ajusta las políticas según tu sistema de autenticación

### 4. `04_insert_initial_data.sql`
Inserta datos iniciales:
- Usuario administrador (requiere hash de contraseña)
- Datos de ejemplo (opcional, comentados)

### 5. `05_create_storage_policies.sql`
Configura políticas de Storage para Supabase (imágenes, videos, etc.)

### 6. `06_migrate_products_table.sql` ⚠️ NUEVO
**Script de migración para agregar nuevos campos a la tabla products:**
- `type` - Tipo de producto (timeline/development)
- `image_url` - URL de imagen del producto
- `calendly_url` - URL de Calendly para reservas
- `media_url` - URL de imagen o video para área gráfica de timeline
- `media_type` - Tipo de media (image/video)

**Ejecuta este script si ya tienes la base de datos creada y necesitas agregar los nuevos campos.**

## 🚀 Orden de Ejecución

### Para una instalación nueva:
1. **Primero**: Ejecuta `01_drop_database.sql` (solo si necesitas resetear)
2. **Segundo**: Ejecuta `02_create_tables.sql`
3. **Tercero**: Ejecuta `03_create_policies.sql`
4. **Cuarto**: Ejecuta `04_insert_initial_data.sql` (ajusta la contraseña antes)
5. **Quinto**: Ejecuta `05_create_storage_policies.sql`
6. **Sexto**: Ejecuta `06_migrate_products_table.sql` (agrega campos nuevos)

### Para una base de datos existente:
Si ya tienes la base de datos creada, solo necesitas ejecutar:
- `06_migrate_products_table.sql` - Para agregar los nuevos campos a products

## 🔐 Configuración de Contraseña

### Para el Dashboard Admin:
La contraseña está definida en `components/admin/AdminDashboard.tsx`:
```typescript
const ADMIN_PASSWORD = 'Elevate2024!Secure';
```

**IMPORTANTE**: Cambia esta contraseña por una segura antes de desplegar a producción.

### Para la Base de Datos:
En `04_insert_initial_data.sql`, necesitas generar un hash bcrypt de tu contraseña:

1. Genera el hash en: https://bcrypt-generator.com/
2. Reemplaza el hash en el script:
```sql
INSERT INTO admin_users (username, password_hash, email, is_active)
VALUES (
    'admin',
    '$2a$10$TU_HASH_AQUI', -- ⚠️ REEMPLAZAR CON HASH REAL
    'admin@elevate.ai',
    true
);
```

## 📝 Notas Importantes

- **RLS Policies**: Las políticas actuales permiten acceso completo. Ajusta según tu sistema de autenticación.
- **UUIDs**: Todas las tablas usan UUID como ID primario.
- **Timestamps**: Todas las tablas tienen `created_at` y `updated_at` automáticos.
- **Foreign Keys**: Las relaciones están configuradas con `ON DELETE CASCADE` donde corresponde.

## 🔧 Compatibilidad

- **PostgreSQL 12+**
- **Supabase** (compatible)
- **Cualquier base de datos PostgreSQL**

## ⚠️ Seguridad

- Nunca commitees contraseñas en texto plano
- Usa variables de entorno para credenciales en producción
- Implementa autenticación adecuada antes de desplegar
- Revisa y ajusta las políticas RLS según tus necesidades

