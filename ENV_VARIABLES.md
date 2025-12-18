# Variables de Entorno - Vercel

## 📋 Variables a Configurar en Vercel

Para configurar las variables de entorno en Vercel:

1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Agrega las siguientes variables:

---

## 🔐 Variables Requeridas

### `VITE_ADMIN_PASSWORD`
**Descripción:** Contraseña para acceder al panel de administración (`/admin`)

**Valor recomendado:** Una contraseña segura y única

**Ejemplo:**
```
VITE_ADMIN_PASSWORD=TuContraseñaSegura2024!
```

**⚠️ IMPORTANTE:** 
- Cambia la contraseña por defecto antes de producción
- Usa una contraseña fuerte (mínimo 12 caracteres, mayúsculas, minúsculas, números, símbolos)
- No compartas esta contraseña públicamente

---

## 🗄️ Variables para Base de Datos (REQUERIDO para persistencia)

**IMPORTANTE:** Sin estas variables, los datos del admin dashboard NO se guardarán permanentemente. Se perderán al recargar la página.

### Para Supabase (Recomendado):
```
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

**Pasos para configurar Supabase:**
1. Crea un proyecto en [Supabase](https://supabase.com)
2. Ve a Settings → API
3. Copia la "Project URL" → `VITE_SUPABASE_URL`
4. Copia la "anon public" key → `VITE_SUPABASE_ANON_KEY`
5. Ejecuta los scripts SQL en `database/` para crear las tablas:
   - `01_drop_database.sql` (opcional, solo si necesitas resetear)
   - `02_create_tables.sql` (crea todas las tablas)
   - `03_create_policies.sql` (configura permisos)
   - `04_insert_initial_data.sql` (opcional, datos iniciales)
6. Crea un bucket de Storage llamado `images` en Supabase Storage
7. Configura políticas públicas de lectura para el bucket `images`

### Para PostgreSQL Directo:
```
DATABASE_URL=postgresql://usuario:password@host:puerto/database
```

---

## 📝 Configuración en Vercel

### Pasos:

1. **Ir a Settings:**
   - En tu proyecto de Vercel, ve a **Settings**
   - Click en **Environment Variables**

2. **Agregar Variable:**
   - Click en **Add New**
   - **Name:** `VITE_ADMIN_PASSWORD`
   - **Value:** Tu contraseña segura
   - **Environment:** Selecciona:
     - ✅ Production
     - ✅ Preview
     - ✅ Development (opcional)

3. **Guardar:**
   - Click en **Save**
   - Vercel redeployará automáticamente

---

## 🔄 Después de Agregar Variables

Después de agregar las variables:

1. Vercel redeployará automáticamente
2. O puedes hacer un redeploy manual desde el dashboard
3. Las variables estarán disponibles en el siguiente build

---

## ✅ Verificación

Para verificar que las variables están configuradas:

1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Deberías ver `VITE_ADMIN_PASSWORD` listada

---

## 🚨 Notas de Seguridad

- **NUNCA** commitees archivos `.env` al repositorio
- Las variables de entorno en Vercel están encriptadas
- Solo las variables que empiezan con `VITE_` son accesibles en el frontend
- Para variables sensibles del backend, usa variables sin el prefijo `VITE_`

---

## 📚 Referencias

- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

