# ✅ Migración a MongoDB Atlas - Pasos Completados

## 📋 Resumen

La aplicación ha sido migrada de almacenamiento en memoria a **MongoDB Atlas** para tener persistencia real de datos.

---

## ✅ Lo que ya está hecho

### 1. ✅ Backend actualizado a Mongoose

Se crearon los modelos de datos:

- [server/models/User.js](server/models/User.js) - Usuarios con autenticación
- [server/models/Event.js](server/models/Event.js) - Eventos con contraseñas opcionales
- [server/models/Table.js](server/models/Table.js) - Mesas de juego
- [server/models/FreeGame.js](server/models/FreeGame.js) - Ludoteca compartida

### 2. ✅ Rutas actualizadas

Todas las rutas ahora usan Mongoose en lugar de memoria:

- [server/routes/auth.js](server/routes/auth.js) - Login y registro
- [server/routes/events.js](server/routes/events.js) - Gestión de eventos
- [server/routes/tables.js](server/routes/tables.js) - Gestión de mesas
- [server/routes/games.js](server/routes/games.js) - Ludoteca compartida

### 3. ✅ Configuración agregada

- [server/index.js](server/index.js) - Conexión a MongoDB configurada
- [server/package.json](server/package.json) - Mongoose 8.0.3 agregado
- [server/.env.example](server/.env.example) - Variable MONGODB_URI agregada
- [render.yaml](render.yaml) - Variable de entorno para producción

### 4. ✅ Documentación creada

- [MONGODB_SETUP.md](MONGODB_SETUP.md) - Guía completa de configuración
- [README.md](README.md) - Actualizado con referencias a MongoDB

---

## 🚀 Próximos Pasos (LO QUE DEBES HACER TÚ)

### Paso 1: Configurar MongoDB Atlas (GRATIS)

Sigue la guía completa: **[MONGODB_SETUP.md](MONGODB_SETUP.md)**

Resumen rápido:

1. Ir a https://www.mongodb.com/cloud/atlas/register
2. Registrarse (es gratis)
3. Crear un cluster M0 (FREE)
4. Crear usuario de base de datos
5. Configurar acceso de red (permitir 0.0.0.0/0 para desarrollo)
6. Copiar la connection string

---

### Paso 2: Configurar localmente

#### 2.1 Instalar dependencias

```powershell
cd server
npm install
```

Esto instalará Mongoose y todas las dependencias necesarias.

#### 2.2 Crear archivo .env

En la carpeta `server/`, crea un archivo `.env`:

```env
PORT=3001
JWT_SECRET=tu_clave_secreta_muy_segura_cambiala_en_produccion
NODE_ENV=development
MONGODB_URI=mongodb+srv://TU_USUARIO:TU_PASSWORD@cluster.xxxxx.mongodb.net/ludorganizador?retryWrites=true&w=majority
```

**IMPORTANTE**: Reemplaza `MONGODB_URI` con tu URI real de MongoDB Atlas (paso 1).

#### 2.3 Probar el servidor

```powershell
cd server
npm start
```

Deberías ver:

```
✅ Conectado a MongoDB
🚀 Servidor corriendo en puerto 3001
```

Si ves el ✅, ¡funcionó!

---

### Paso 3: Configurar en Render (Producción)

1. Ve a tu dashboard de Render
2. Selecciona tu servicio `ludorganizador-api`
3. Ve a **Environment** en el menú izquierdo
4. Haz clic en **Add Environment Variable**
5. Agrega:
   - **Key**: `MONGODB_URI`
   - **Value**: Tu URI de MongoDB Atlas (la misma que usaste localmente)
6. Haz clic en **Save Changes**
7. El servicio se redespliegará automáticamente

---

### Paso 4: Verificar que funciona

#### En local:

```powershell
# Terminal 1 - Backend
cd server
npm start

# Terminal 2 - Frontend
npm run dev
```

1. Abre http://localhost:5173
2. Registra un usuario
3. Crea un evento
4. Ve a MongoDB Atlas → Browse Collections
5. Verás tus datos guardados en:
   - `users`
   - `events`
   - `tables`
   - `freegames`

#### En producción:

1. Abre tu app en Netlify
2. Registra un usuario
3. Crea un evento
4. Ve a MongoDB Atlas → Browse Collections
5. Verás los datos guardados

---

## 🔍 Cambios Técnicos Realizados

### Antes (En memoria):

```javascript
// server/index.js
export const db = {
  users: [],
  events: [],
  tables: [],
  freeGames: []
};

// server/routes/events.js
const events = db.events.filter(...);
db.events.push(newEvent);
```

### Ahora (MongoDB):

```javascript
// server/index.js
import mongoose from 'mongoose';
await mongoose.connect(process.env.MONGODB_URI);

// server/routes/events.js
import Event from '../models/Event.js';
const events = await Event.find({ ... });
await Event.create(newEvent);
```

---

## 🎯 Beneficios de MongoDB Atlas

✅ **Persistencia real**: Los datos NO se pierden cuando el servidor se reinicia
✅ **Compartido**: Todos los usuarios ven los mismos datos
✅ **Escalable**: Puede crecer con tu aplicación
✅ **Gratis**: Plan M0 incluye 512MB de almacenamiento
✅ **Backups automáticos**: MongoDB hace copias de seguridad
✅ **Seguro**: Datos encriptados en tránsito y en reposo

---

## 🆘 Problemas Comunes

### Error: "Cannot find module 'mongoose'"

**Solución:**

```powershell
cd server
npm install
```

### Error: "MongoServerError: Authentication failed"

**Solución:**

- Verifica que el usuario y contraseña en MONGODB_URI sean correctos
- Verifica que el usuario existe en Atlas → Database Access

### Error: "Connection timeout"

**Solución:**

- Verifica que agregaste `0.0.0.0/0` en Atlas → Network Access
- O agrega las IPs específicas de Render

### Los datos no aparecen en Atlas

**Solución:**

1. Verifica que el servidor esté corriendo sin errores
2. Revisa los logs: debe decir "✅ Conectado a MongoDB"
3. Refresca la página de Atlas → Browse Collections
4. MongoDB crea las colecciones automáticamente al insertar datos

---

## 📊 Estructura de Datos en MongoDB

### Colección `users`

```javascript
{
  _id: ObjectId("..."),
  name: "Juan Pérez",
  email: "juan@example.com",
  password: "$2a$10$...", // Hash bcrypt
  createdAt: ISODate("2024-01-15T10:30:00.000Z")
}
```

### Colección `events`

```javascript
{
  _id: ObjectId("..."),
  title: "Noche de Juegos",
  location: "Casa de María",
  date: ISODate("2024-02-20T19:00:00.000Z"),
  description: "Traer snacks",
  password: "$2a$10$...", // Hash bcrypt (opcional)
  creatorId: ObjectId("..."), // Referencia a users
  createdAt: ISODate("2024-01-15T10:30:00.000Z")
}
```

### Colección `tables`

```javascript
{
  _id: ObjectId("..."),
  eventId: ObjectId("..."), // Referencia a events
  hostId: ObjectId("..."), // Referencia a users
  gameName: "Catan",
  minPlayers: 3,
  maxPlayers: 4,
  registeredPlayers: [
    {
      userId: ObjectId("..."),
      userName: "Juan Pérez",
      _id: ObjectId("...")
    }
  ],
  createdAt: ISODate("2024-01-15T10:30:00.000Z")
}
```

### Colección `freegames`

```javascript
{
  _id: ObjectId("..."),
  eventId: ObjectId("..."), // Referencia a events
  ownerId: ObjectId("..."), // Referencia a users
  gameName: "Ticket to Ride",
  note: "Expansión Europa incluida",
  createdAt: ISODate("2024-01-15T10:30:00.000Z")
}
```

---

## 🔐 Seguridad

### Indexación para Performance

Todos los modelos tienen índices para consultas rápidas:

```javascript
// User.js
schema.index({ email: 1 }); // Búsqueda rápida por email

// Event.js
schema.index({ date: 1 }); // Ordenar eventos por fecha
schema.index({ creatorId: 1 }); // Eventos de un usuario

// Table.js
schema.index({ eventId: 1 }); // Mesas de un evento
schema.index({ hostId: 1 }); // Mesas de un anfitrión

// FreeGame.js
schema.index({ eventId: 1 }); // Juegos de un evento
```

### Validación de Datos

Los modelos Mongoose validan automáticamente:

- Campos requeridos
- Tipos de datos
- Unicidad (email de usuario)
- Referencias válidas entre colecciones

---

## 📚 Recursos

- **Guía MongoDB**: [MONGODB_SETUP.md](MONGODB_SETUP.md)
- **README**: [README.md](README.md)
- **MongoDB Atlas**: https://cloud.mongodb.com
- **Mongoose Docs**: https://mongoosejs.com/docs/

---

¿Listo para empezar? Ve a **[MONGODB_SETUP.md](MONGODB_SETUP.md)** y sigue los pasos.
