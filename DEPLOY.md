# Guía de Despliegue - Ludorganizador

Esta guía te ayudará a desplegar Ludorganizador en Netlify (frontend) y Render (backend).

## 📋 Checklist Pre-Despliegue

- [ ] Tienes cuenta en GitHub y el código está en un repositorio
- [ ] Has probado la aplicación localmente
- [ ] Tienes cuenta en Netlify
- [ ] Tienes cuenta en Render

## 🚀 Paso 1: Desplegar Backend en Render

### 1.1 Crear Web Service en Render

1. Inicia sesión en [Render](https://render.com)
2. Click en **"New +"** → **"Web Service"**
3. Conecta tu repositorio de GitHub
4. Selecciona el repositorio de Ludorganizador

### 1.2 Configurar el Servicio

**Configuración básica:**
- **Name**: `ludorganizador-api` (o el nombre que prefieras)
- **Region**: Selecciona la más cercana a tus usuarios
- **Branch**: `main` (o tu rama principal)
- **Root Directory**: Déjalo vacío
- **Runtime**: Node
- **Build Command**: `cd server && npm install`
- **Start Command**: `cd server && npm start`

**Plan**: Selecciona el plan gratuito para empezar

### 1.3 Variables de Entorno

En la sección **Environment**, agrega:

| Variable | Valor |
|----------|-------|
| `NODE_ENV` | `production` |
| `JWT_SECRET` | Genera una clave aleatoria segura (ej: `openssl rand -base64 32`) |
| `PORT` | `10000` |

### 1.4 Desplegar

1. Click en **"Create Web Service"**
2. Espera a que termine el despliegue (5-10 minutos)
3. Copia la URL de tu servicio (ej: `https://ludorganizador-api.onrender.com`)

## 🌐 Paso 2: Desplegar Frontend en Netlify

### 2.1 Crear Nuevo Site en Netlify

1. Inicia sesión en [Netlify](https://netlify.com)
2. Click en **"Add new site"** → **"Import an existing project"**
3. Conecta con GitHub
4. Selecciona tu repositorio de Ludorganizador

### 2.2 Configurar el Build

**Configuración básica:**
- **Branch to deploy**: `main`
- **Build command**: `npm run build`
- **Publish directory**: `dist`

### 2.3 Variables de Entorno

En **Site settings** → **Environment variables**, agrega:

| Variable | Valor |
|----------|-------|
| `VITE_API_URL` | La URL de tu backend en Render + `/api` (ej: `https://ludorganizador-api.onrender.com/api`) |

### 2.4 Desplegar

1. Click en **"Deploy site"**
2. Espera a que termine el build (2-5 minutos)
3. Tu sitio estará disponible en una URL como `https://nombre-random-12345.netlify.app`

### 2.5 (Opcional) Dominio Personalizado

1. Ve a **Site settings** → **Domain management**
2. Click en **"Add custom domain"**
3. Sigue las instrucciones para configurar tu dominio

## ✅ Paso 3: Verificar el Despliegue

### 3.1 Probar el Backend

Abre en tu navegador:
```
https://tu-backend.onrender.com/api/health
```

Deberías ver:
```json
{"status":"ok","message":"Ludorganizador API funcionando"}
```

### 3.2 Probar el Frontend

1. Abre tu sitio en Netlify
2. Intenta registrar una cuenta
3. Crea un evento
4. Verifica que todo funcione correctamente

## 🔧 Solución de Problemas

### El backend no responde

- Verifica que las variables de entorno estén configuradas correctamente
- Revisa los logs en Render (sección **Logs**)
- Asegúrate de que el `PORT` esté configurado como `10000`

### El frontend no se conecta al backend

- Verifica que `VITE_API_URL` esté correctamente configurado en Netlify
- Asegúrate de incluir `/api` al final de la URL
- Revisa la consola del navegador para ver errores de CORS

### Error de CORS

Si ves errores de CORS, asegúrate de que el backend tenga configurado CORS correctamente (ya está incluido en el código).

### El backend se "duerme"

Render's free tier pone los servicios en "sleep" después de 15 minutos de inactividad. El primer request después de dormir puede tardar 30-60 segundos.

## 🔄 Actualizar el Despliegue

### Backend
Los cambios se despliegan automáticamente cuando haces push a tu rama principal en GitHub.

### Frontend
Los cambios se despliegan automáticamente cuando haces push a tu rama principal en GitHub.

## 📝 Próximos Pasos

- [ ] Configurar dominio personalizado
- [ ] Migrar a base de datos persistente (MongoDB Atlas o PostgreSQL)
- [ ] Configurar copias de seguridad
- [ ] Implementar monitoreo y alertas
- [ ] Considerar upgrade a plan de pago para mejor rendimiento

## 💡 Consejos de Producción

1. **Base de datos persistente**: El almacenamiento en memoria se reinicia con cada despliegue. Migra a MongoDB Atlas (gratis) o PostgreSQL.

2. **Seguridad del JWT_SECRET**: Nunca compartas tu `JWT_SECRET` y usa una clave fuerte y aleatoria.

3. **HTTPS**: Tanto Netlify como Render proporcionan HTTPS automáticamente.

4. **Monitoreo**: Configura alertas en Render para saber si tu backend tiene problemas.

5. **Backups**: Si migras a base de datos, configura backups automáticos.
