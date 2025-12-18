# 🚀 Guía de Configuración de Supabase

Esta guía te ayudará a configurar Supabase para que el admin dashboard funcione correctamente con persistencia de datos y subida de imágenes.

## 📋 Pasos Requeridos

### 1. Crear Proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) y crea una cuenta
2. Crea un nuevo proyecto
3. Espera a que se complete la configuración (2-3 minutos)

### 2. Obtener Credenciales

1. En tu proyecto de Supabase, ve a **Settings** → **API**
2. Copia estos valores:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`

### 3. Configurar Variables en Vercel

1. Ve a tu proyecto en Vercel
2. **Settings** → **Environment Variables**
3. Agrega estas dos variables:
   ```
   VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
   VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
   ```
4. Selecciona todos los ambientes (Production, Preview, Development)
5. **Save** y haz un redeploy

### 4. Crear Tablas en Supabase

1. En Supabase, ve a **SQL Editor** (menú lateral)
2. Ejecuta estos scripts en orden:

   **a) Crear tablas:**
   - Abre `database/02_create_tables.sql`
   - Copia todo el contenido
   - Pégalo en el SQL Editor
   - Click en **Run**

   **b) Configurar políticas:**
   - Abre `database/03_create_policies.sql`
   - Copia todo el contenido
   - Pégalo en el SQL Editor
   - Click en **Run**

### 5. Crear Bucket de Storage para Imágenes ⚠️ IMPORTANTE

**Este paso es CRÍTICO para que funcione la subida de imágenes:**

1. En Supabase, ve a **Storage** (menú lateral)
2. Click en **New bucket**
3. Configuración:
   - **Name:** `images` (exactamente así, en minúsculas)
   - **Public bucket:** ✅ **SÍ** (marca esta opción)
   - **File size limit:** 5 MB (o el que prefieras)
   - **Allowed MIME types:** `image/*` (o déjalo vacío para permitir todo)
4. Click en **Create bucket**

### 6. Configurar Políticas de Storage

Después de crear el bucket `images`:

1. Click en el bucket `images`
2. Ve a la pestaña **Policies**
3. Click en **New Policy** → **For full customization**

**Política de Lectura (SELECT):**
```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'images' );
```

**Política de Escritura (INSERT):**
```sql
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'images' );
```

O si quieres que cualquiera pueda subir (menos seguro pero más fácil para testing):
```sql
CREATE POLICY "Anyone can upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'images' );
```

**Política de Actualización (UPDATE):**
```sql
CREATE POLICY "Authenticated users can update"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'images' );
```

**Política de Eliminación (DELETE):**
```sql
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
USING ( bucket_id = 'images' );
```

### 7. Verificar Configuración

1. Recarga tu aplicación en Vercel
2. Ve al admin dashboard (`/admin`)
3. Intenta agregar un blog, partner o team member
4. Intenta subir una imagen

## ✅ Checklist

- [ ] Proyecto creado en Supabase
- [ ] Variables `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` configuradas en Vercel
- [ ] Script `02_create_tables.sql` ejecutado
- [ ] Script `03_create_policies.sql` ejecutado
- [ ] Bucket `images` creado en Storage
- [ ] Bucket `images` marcado como público
- [ ] Políticas de Storage configuradas
- [ ] Redeploy en Vercel realizado

## 🐛 Solución de Problemas

### Error: "Bucket not found"
- ✅ Verifica que el bucket se llame exactamente `images` (minúsculas)
- ✅ Verifica que el bucket esté creado en Storage

### Error: "Data will not persist"
- ✅ Verifica que las variables de entorno estén en Vercel
- ✅ Verifica que hayas hecho redeploy después de agregar las variables
- ✅ Abre la consola del navegador y busca el warning "Supabase credentials not found"

### Los datos desaparecen al refrescar
- ✅ Verifica que las tablas existan (ve a Table Editor en Supabase)
- ✅ Verifica que las políticas RLS estén configuradas (ve a Authentication → Policies)
- ✅ Verifica que puedas ver datos en Table Editor de Supabase

### No puedo subir imágenes
- ✅ Verifica que el bucket `images` exista
- ✅ Verifica que el bucket sea público
- ✅ Verifica que las políticas de Storage estén configuradas
- ✅ Verifica el tamaño del archivo (máximo 5MB por defecto)

## 📝 Notas Importantes

- **Seguridad:** Las políticas actuales permiten acceso público. Para producción, considera restringir el acceso.
- **Variables de entorno:** Solo las variables que empiezan con `VITE_` son accesibles en el frontend.
- **Storage:** El bucket debe llamarse exactamente `images` (el código busca ese nombre específico).

