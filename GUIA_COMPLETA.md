# 📘 Guía Completa de Configuración y Despliegue - Ludorganizador

Esta guía te llevará paso a paso desde cero hasta tener tu aplicación funcionando en local y desplegada en producción.

---

## 📑 Tabla de Contenidos

1. [Configuración Local](#1-configuración-local)
2. [Despliegue del Backend en Render](#2-despliegue-del-backend-en-render)
3. [Despliegue del Frontend en Netlify](#3-despliegue-del-frontend-en-netlify)
4. [Verificación Final](#4-verificación-final)
5. [Solución de Problemas](#5-solución-de-problemas)

---

## 1. Configuración Local

### 1.1 Verificar Prerrequisitos

Abre PowerShell y verifica que tienes instalado:

```powershell
# Verificar Node.js (debe ser versión 20 o superior)
node --version

# Verificar npm
npm --version
```

Si no tienes Node.js, descárgalo de: https://nodejs.org/

### 1.2 Instalar Dependencias

**Paso 1: Instalar dependencias del frontend**

```powershell
# En la raíz del proyecto
npm install
```

Espera a que termine (1-2 minutos).

**Paso 2: Instalar dependencias del backend**

```powershell
# Desde la raíz del proyecto
npm run server:install
```

Espera a que termine (1-2 minutos).

### 1.3 Configurar Variables de Entorno

**Paso 3: Configurar el Backend**

```powershell
# Copiar el archivo de ejemplo
Copy-Item server\.env.example server\.env
```

Abre el archivo `server\.env` y edítalo:

```env
PORT=3001
JWT_SECRET=tu_clave_secreta_muy_larga_y_segura_cambiala_ahora_12345
NODE_ENV=development
```

**IMPORTANTE**: Cambia `JWT_SECRET` por una clave aleatoria y segura. Puedes generar una con:

```powershell
# Opción 1: Generar una clave aleatoria
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})

# Opción 2: Usar una frase larga y única
# Ejemplo: "miProyectoLudorganizador2025_ClaveSegura!@#"
```

**Paso 4: Configurar el Frontend**

```powershell
# Copiar el archivo de ejemplo
Copy-Item .env.example .env.local
```

Abre el archivo `.env.local` y edítalo:

```env
VITE_API_URL=http://localhost:3001/api
```

### 1.4 Probar la Aplicación Localmente

**Paso 5: Iniciar el Backend**

Abre una terminal PowerShell y ejecuta:

```powershell
npm run server:dev
```

Deberías ver:
```
🚀 Servidor corriendo en puerto 3001
```

**¡NO CIERRES ESTA TERMINAL!** Déjala corriendo.

**Paso 6: Iniciar el Frontend**

Abre UNA SEGUNDA terminal PowerShell (nueva ventana) y ejecuta:

```powershell
npm run dev
```

Deberías ver algo como:
```
  VITE v6.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

**Paso 7: Probar la Aplicación**

1. Abre tu navegador en: http://localhost:5173/
2. Deberías ver la pantalla de Login/Registro
3. Registra una cuenta nueva:
   - Nombre: Tu Nombre
   - Email: tu@email.com
   - Contraseña: (mínimo 6 caracteres)
4. Haz clic en "Crear Cuenta"
5. Deberías entrar a la aplicación
6. Intenta crear un evento para verificar que todo funciona

**✅ Si todo funciona localmente, continúa al paso 2.**

Para detener los servidores: Presiona `Ctrl + C` en cada terminal.

---

## 2. Despliegue del Backend en Render

### 2.1 Preparar el Repositorio en GitHub

**Paso 1: Crear repositorio en GitHub** (si no lo has hecho)

1. Ve a https://github.com/new
2. Nombre: `ludorganizador`
3. Descripción: "Organizador de eventos de juegos de mesa"
4. Público o Privado (tu elección)
5. Haz clic en "Create repository"

**Paso 2: Subir tu código a GitHub**

```powershell
# Inicializar git (si no lo has hecho)
git init

# Agregar todos los archivos
git add .

# Hacer commit
git commit -m "Preparar para despliegue en Render y Netlify"

# Conectar con GitHub (reemplaza TU_USUARIO y TU_REPO)
git remote add origin https://github.com/TU_USUARIO/ludorganizador.git

# Subir el código
git branch -M main
git push -u origin main
```

### 2.2 Crear Cuenta en Render

**Paso 3: Registrarse en Render**

1. Ve a https://render.com/
2. Haz clic en "Get Started"
3. Regístrate con GitHub (recomendado)
4. Autoriza a Render a acceder a tu cuenta de GitHub

### 2.3 Crear Web Service para el Backend

**Paso 4: Crear nuevo servicio**

1. En el dashboard de Render, haz clic en "New +" (arriba a la derecha)
2. Selecciona "Web Service"

**Paso 5: Conectar repositorio**

1. Busca y selecciona tu repositorio `ludorganizador`
2. Haz clic en "Connect"

**Paso 6: Configurar el servicio**

Completa el formulario con estos datos EXACTOS:

| Campo | Valor |
|-------|-------|
| **Name** | `ludorganizador-api` |
| **Region** | `Frankfurt (EU Central)` o el más cercano |
| **Branch** | `main` |
| **Root Directory** | (déjalo VACÍO) |
| **Runtime** | `Node` |
| **Build Command** | `cd server && npm install` |
| **Start Command** | `cd server && npm start` |
| **Instance Type** | `Free` |

**Paso 7: Agregar Variables de Entorno**

Scroll hacia abajo hasta "Environment Variables" y agrega estas 3 variables:

1. **Primera variable:**
   - Key: `NODE_ENV`
   - Value: `production`

2. **Segunda variable:**
   - Key: `JWT_SECRET`
   - Value: (Genera una clave NUEVA y DIFERENTE a la de desarrollo)
   
   Puedes usar este generador: https://randomkeygen.com/
   O copia una de estas (pero cámbiala):
   ```
   7a9f2e6b8c4d1a3e5f7g9h2i4j6k8l0m
   ```

3. **Tercera variable:**
   - Key: `PORT`
   - Value: `10000`

**Paso 8: Desplegar**

1. Scroll hasta abajo
2. Haz clic en "Create Web Service"
3. **ESPERA** - El despliegue tomará 5-10 minutos
4. Verás logs en tiempo real - espera a que diga "Deploy successful"

**Paso 9: Obtener la URL del Backend**

Una vez desplegado:
1. En la parte superior verás la URL, algo como:
   ```
   https://ludorganizador-api.onrender.com
   ```
2. **COPIA ESTA URL** - la necesitarás para Netlify
3. Prueba que funciona abriendo en tu navegador:
   ```
   https://TU-URL.onrender.com/api/health
   ```
   Deberías ver: `{"status":"ok","message":"Ludorganizador API funcionando"}`

**✅ Backend desplegado exitosamente. Continúa al paso 3.**

---

## 3. Despliegue del Frontend en Netlify

### 3.1 Crear Cuenta en Netlify

**Paso 1: Registrarse en Netlify**

1. Ve a https://www.netlify.com/
2. Haz clic en "Sign up"
3. Regístrate con GitHub (recomendado)
4. Autoriza a Netlify a acceder a tu cuenta de GitHub

### 3.2 Crear Nuevo Site

**Paso 2: Importar proyecto**

1. En el dashboard de Netlify, haz clic en "Add new site"
2. Selecciona "Import an existing project"
3. Haz clic en "Deploy with GitHub"
4. Busca y selecciona tu repositorio `ludorganizador`
5. Haz clic en el repositorio para continuar

### 3.3 Configurar el Build

**Paso 3: Configuración del build**

Completa el formulario con estos datos EXACTOS:

| Campo | Valor |
|-------|-------|
| **Branch to deploy** | `main` |
| **Build command** | `npm run build` |
| **Publish directory** | `dist` |

**NO HAGAS CLIC EN DEPLOY TODAVÍA**

### 3.4 Agregar Variables de Entorno

**Paso 4: Configurar variable de entorno**

1. Haz clic en "Show advanced"
2. Haz clic en "New variable"
3. Agrega esta variable:
   - **Key**: `VITE_API_URL`
   - **Value**: La URL de tu backend de Render + `/api`
   
   Ejemplo completo:
   ```
   https://ludorganizador-api.onrender.com/api
   ```
   
   **IMPORTANTE**: 
   - Debe ser HTTPS (no HTTP)
   - Debe terminar en `/api`
   - NO debe tener barra al final después de api

### 3.5 Desplegar

**Paso 5: Deploy**

1. Haz clic en "Deploy ludorganizador" (botón azul grande)
2. **ESPERA** - El despliegue tomará 2-5 minutos
3. Verás logs en tiempo real
4. Espera a que diga "Site is live"

**Paso 6: Obtener la URL del Frontend**

Una vez desplegado:
1. Verás una URL aleatoria como:
   ```
   https://clever-name-123456.netlify.app
   ```
2. Haz clic en esa URL para abrir tu aplicación

**Paso 7 (Opcional): Cambiar el nombre del sitio**

1. Ve a "Site settings" (botón arriba)
2. En "General" → "Site details" → "Site name"
3. Haz clic en "Change site name"
4. Elige un nombre único (ej: `ludorganizador-tuapellido`)
5. Tu nueva URL será: `https://ludorganizador-tuapellido.netlify.app`

**✅ Frontend desplegado exitosamente. Continúa al paso 4.**

---

## 4. Verificación Final

### 4.1 Probar el Backend

**Paso 1: Health Check**

Abre en tu navegador:
```
https://TU-BACKEND.onrender.com/api/health
```

Deberías ver:
```json
{"status":"ok","message":"Ludorganizador API funcionando"}
```

✅ Si lo ves, el backend funciona correctamente.

### 4.2 Probar el Frontend Completo

**Paso 2: Registrar usuario**

1. Abre tu aplicación en Netlify
2. Verás la pantalla de Login
3. Haz clic en "¿No tienes cuenta? Regístrate"
4. Completa el formulario:
   - Nombre: Tu Nombre
   - Email: tu@email.com
   - Contraseña: (mínimo 6 caracteres)
5. Haz clic en "Crear Cuenta"
6. Deberías entrar automáticamente

**Paso 3: Crear un evento**

1. Haz clic en "Nuevo Evento"
2. Completa:
   - Nombre: "Prueba de Despliegue"
   - Lugar: "Mi Casa"
   - Fecha y Hora: Selecciona cualquier fecha futura
   - Contraseña: (deja en blanco o ponle una)
3. Haz clic en "Crear Evento"
4. Deberías ver tu evento en la lista

**Paso 4: Crear una mesa**

1. Haz clic en tu evento
2. Haz clic en "Nueva Mesa"
3. Completa:
   - Nombre del juego: "Catan"
   - Min jugadores: 3
   - Max jugadores: 4
   - Descripción: "Probando el sistema"
4. Haz clic en "Publicar Mesa"
5. Deberías ver tu mesa creada

**Paso 5: Probar desde otro dispositivo**

1. Abre la URL de tu aplicación en tu teléfono o en modo incógnito
2. Crea OTRA cuenta (diferente email)
3. Deberías ver el mismo evento que creaste antes
4. Intenta unirte a la mesa

**✅ Si todo funciona, ¡FELICITACIONES! Tu aplicación está 100% funcional.**

---

## 5. Solución de Problemas

### ❌ Problema: "Token no proporcionado" o "Token inválido"

**Solución:**
1. Cierra sesión
2. Vuelve a iniciar sesión
3. Si persiste, verifica que `JWT_SECRET` esté configurado en Render

### ❌ Problema: El frontend no se conecta al backend

**Solución:**
1. Abre la consola del navegador (F12)
2. Ve a la pestaña "Console"
3. Si ves errores de CORS o "Failed to fetch":
   - Verifica que `VITE_API_URL` en Netlify termine en `/api`
   - Verifica que uses HTTPS (no HTTP)
   - Ve a Netlify → Site settings → Environment variables
   - Edita `VITE_API_URL` con la URL correcta
   - Haz redeploy: Deploys → Trigger deploy → Deploy site

### ❌ Problema: El backend está "dormido" (tarda mucho)

**Explicación:**
El plan gratuito de Render pone tu servicio en "sleep" después de 15 minutos sin uso.

**Solución:**
- Es normal en el plan gratuito
- La primera petición después de dormir tarda 30-60 segundos
- Considera upgrade a plan de pago ($7/mes) para servicio 24/7

### ❌ Problema: Los datos desaparecen al actualizar

**Explicación:**
El backend usa almacenamiento en memoria. Los datos se pierden cuando Render reinicia el servicio.

**Solución a largo plazo:**
Migrar a base de datos persistente (MongoDB Atlas es gratis):
1. Crear cuenta en https://www.mongodb.com/cloud/atlas
2. Crear cluster gratuito
3. Modificar el backend para usar MongoDB
4. Agregar `MONGODB_URI` a las variables de entorno

### ❌ Problema: Build falla en Netlify

**Solución:**
1. Ve a Netlify → Deploys
2. Haz clic en el deploy fallido
3. Revisa el log de errores
4. Común: falta agregar `VITE_API_URL` en Environment variables
5. Agrega la variable y haz "Trigger deploy"

### ❌ Problema: Build falla en Render

**Solución:**
1. Ve a Render → tu servicio → Logs
2. Busca el error
3. Común: comandos de build incorrectos
4. Verifica que:
   - Build Command: `cd server && npm install`
   - Start Command: `cd server && npm start`

---

## 📝 URLs Importantes

Guarda estas URLs para referencia:

| Servicio | URL | Propósito |
|----------|-----|-----------|
| **Frontend (Netlify)** | `https://tu-sitio.netlify.app` | Tu aplicación web |
| **Backend (Render)** | `https://tu-api.onrender.com` | Tu API |
| **Backend Health** | `https://tu-api.onrender.com/api/health` | Verificar que funcione |
| **Dashboard Netlify** | https://app.netlify.com/ | Administrar frontend |
| **Dashboard Render** | https://dashboard.render.com/ | Administrar backend |

---

## 🎉 ¡Listo!

Tu aplicación Ludorganizador está completamente desplegada y funcionando.

### Próximos pasos recomendados:

1. **Compartir con amigos**: Envíales la URL de tu aplicación
2. **Configurar dominio propio** (opcional):
   - Compra un dominio en Namecheap, GoDaddy, etc.
   - Configúralo en Netlify (Settings → Domain management)
3. **Migrar a base de datos** para persistencia real
4. **Monitorear**: Revisa regularmente los logs en Render y Netlify
5. **Backups**: Si migras a DB, configura backups automáticos

### Recursos adicionales:

- **Documentación Render**: https://render.com/docs
- **Documentación Netlify**: https://docs.netlify.com/
- **Ayuda**: Si tienes problemas, revisa los logs en ambas plataformas

---

**¿Preguntas o problemas?** Revisa la sección "Solución de Problemas" arriba.
