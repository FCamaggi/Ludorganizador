# Ludorganizador - Organizador de Eventos de Juegos de Mesa

Aplicación web completa para organizar eventos de juegos de mesa con autenticación de usuarios, gestión de mesas y ludoteca compartida.

## 🏗️ Arquitectura

- **Frontend**: React + TypeScript + Vite (desplegado en Netlify)
- **Backend**: Node.js + Express (desplegado en Render)
- **Base de datos**: MongoDB Atlas (persistencia en la nube)
- **Autenticación**: JWT (JSON Web Tokens)
- **ODM**: Mongoose para interacción con MongoDB

## 🚀 Desarrollo Local

### Prerrequisitos

- Node.js 20+
- npm

### Instalación

1. **Instalar dependencias del frontend**:

   ```bash
   npm install
   ```

2. **Instalar dependencias del backend**:

   ```bash
   npm run server:install
   ```

3. **Configurar variables de entorno**:

   **Backend** (`server/.env`):

   ```bash
   cp server/.env.example server/.env
   ```

   Edita `server/.env` y configura:

   - `JWT_SECRET`: Una clave secreta segura para JWT
   - `PORT`: Puerto del servidor (por defecto 3001)
   - `MONGODB_URI`: URI de conexión a MongoDB (ver [MONGODB_SETUP.md](MONGODB_SETUP.md))

   **Frontend** (`.env.local`):

   ```bash
   cp .env.example .env.local
   ```

   Edita `.env.local`:

   - `VITE_API_URL`: URL de tu backend (desarrollo: http://localhost:3001/api)

### Configurar MongoDB Atlas

Sigue la guía completa en [MONGODB_SETUP.md](MONGODB_SETUP.md) para:

- Crear una cuenta gratuita en MongoDB Atlas
- Configurar tu cluster
- Obtener la URI de conexión
- Configurar seguridad

### Ejecutar en desarrollo

1. **Iniciar el backend**:

   ```bash
   npm run server:dev
   ```

   El servidor estará en http://localhost:3001

2. **Iniciar el frontend** (en otra terminal):
   ```bash
   npm run dev
   ```
   La aplicación estará en http://localhost:5173

## 📦 Despliegue en Producción

### Desplegar Backend en Render

1. Crea una cuenta en [Render](https://render.com)
2. Conecta tu repositorio de GitHub
3. Crea un nuevo **Web Service**
4. Configuración:
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Environment**: Node
5. Variables de entorno:
   - `JWT_SECRET`: Genera una clave segura
   - `NODE_ENV`: production
   - `PORT`: 10000 (o el que asigne Render)
   - `MONGODB_URI`: Tu URI de MongoDB Atlas (ver [MONGODB_SETUP.md](MONGODB_SETUP.md))

### Desplegar Frontend en Netlify

1. Crea una cuenta en [Netlify](https://netlify.com)
2. Conecta tu repositorio de GitHub
3. Configuración de build:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
4. Variables de entorno:
   - `VITE_API_URL`: URL de tu backend en Render (ej: https://tu-app.onrender.com/api)
5. Despliega

## 🔐 Características de Seguridad

- **Autenticación JWT**: Sistema completo de registro e inicio de sesión
- **Eventos privados**: Contraseñas para eventos con información protegida
- **Tokens con expiración**: Los tokens JWT expiran en 7 días
- **Validación de contraseñas**: Mínimo 6 caracteres

## 📝 API Endpoints

### Autenticación

- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener usuario actual

### Eventos

- `GET /api/events` - Listar eventos
- `POST /api/events` - Crear evento (requiere auth)
- `POST /api/events/:id/verify-password` - Verificar contraseña de evento

### Mesas

- `GET /api/tables/event/:eventId` - Obtener mesas de un evento
- `POST /api/tables` - Crear mesa (requiere auth)
- `POST /api/tables/:id/join` - Unirse a mesa (requiere auth)
- `POST /api/tables/:id/leave` - Salir de mesa (requiere auth)

### Juegos Libres

- `GET /api/games/event/:eventId` - Obtener juegos de un evento
- `POST /api/games` - Agregar juego (requiere auth)

## 🔄 Migración desde localStorage

La aplicación anteriormente usaba localStorage. Para migrar a producción:

1. Los usuarios existentes necesitarán crear una cuenta
2. Los eventos y mesas se cargarán desde el servidor
3. Los datos se comparten entre todos los usuarios autenticados

## 🛠️ Próximas Mejoras

- [ ] Base de datos persistente (MongoDB o PostgreSQL)
- [ ] Recuperación de contraseña
- [ ] Perfiles de usuario con avatar
- [ ] Notificaciones en tiempo real (WebSockets)
- [ ] Sistema de comentarios en eventos
- [ ] Calendario de eventos
- [ ] Filtros y búsqueda avanzada

## 📄 Licencia

MIT
