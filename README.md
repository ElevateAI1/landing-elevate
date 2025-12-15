# Elevate AI - Neo-Brutalist Landing Page

Una experiencia web cinematográfica de alto rendimiento diseñada con React, TypeScript y Framer Motion. Este proyecto presenta efectos avanzados de paralaje, animaciones 3D e interfaces de usuario inmersivas.

## 🛠 Tech Stack

- **Framework:** React 18
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS (vía CDN para prototipado rápido o PostCSS local)
- **Animaciones:** Framer Motion
- **Iconos:** Lucide React
- **Build Tool:** Vite

## 🚀 Instalación y Ejecución Local

Sigue estos pasos para levantar el proyecto en tu entorno local.

### Prerrequisitos
Asegúrate de tener instalado [Node.js](https://nodejs.org/) (versión 18 o superior).

### 1. Instalación de Dependencias

Abre tu terminal en la carpeta raíz del proyecto y ejecuta:

```bash
npm install
```

### 2. Iniciar Servidor de Desarrollo

Una vez instaladas las dependencias, inicia el servidor local:

```bash
npm run dev
```

La aplicación estará disponible generalmente en `http://localhost:5173`.

### 3. Build para Producción

Para generar los archivos estáticos optimizados para producción:

```bash
npm run build
```

## 📂 Estructura del Proyecto

- `components/`: Componentes modulares de la UI (Hero, Navegación, Efectos).
- `contexts/`: Gestión de estado global (Idiomas).
- `index.tsx`: Punto de entrada de la aplicación.
- `App.tsx`: Orquestador principal de vistas y transiciones.
- `vite.config.ts`: Configuración del bundler.

---

**Nota:** Este proyecto utiliza efectos visuales intensivos (Blur, 3D Transforms). Asegúrate de tener la aceleración por hardware habilitada en tu navegador para la mejor experiencia.
