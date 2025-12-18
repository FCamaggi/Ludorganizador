# Documentación de la API - Ludorganizador

## Índice

- [Descripción General](#descripción-general)
- [Configuración](#configuración)
- [Autenticación](#autenticación)
- [Endpoints](#endpoints)
  - [Auth](#auth)
  - [Events](#events)
  - [Tables](#tables)
  - [Games](#games)
  - [Admin](#admin)
- [Modelos de Datos](#modelos-de-datos)
- [Manejo de Errores](#manejo-de-errores)

---

## Descripción General

API RESTful para la gestión de eventos de juegos de mesa. Permite crear eventos, mesas de juego, registrar jugadores y gestionar juegos libres para préstamo.

**Base URL:** `http://localhost:3001/api` (desarrollo)

**Versión:** 1.0.0

---

## Configuración

### Variables de Entorno

Crear un archivo `.env` en el directorio `server/`:

```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/ludorganizador
JWT_SECRET=tu_secreto_super_seguro_aqui
NODE_ENV=development
```

### Instalación

```bash
cd server
npm install
npm run dev
```

---

## Autenticación

La API utiliza JWT (JSON Web Tokens) para autenticación.

### Headers Requeridos

Para endpoints protegidos, incluir:

```
Authorization: Bearer <token>
Content-Type: application/json
```

### Obtener Token

Al hacer login o registro exitoso, recibirás un objeto con:

```json
{
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "user" | "admin"
  },
  "token": "jwt_token_string"
}
```

---

## Endpoints

### Auth

#### POST `/api/auth/register`

Registra un nuevo usuario.

**Body:**

```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "contraseña123"
}
```

**Response (201):**

```json
{
  "user": {
    "id": "user_id",
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errores:**

- `400`: Email ya registrado
- `400`: Datos inválidos

---

#### POST `/api/auth/login`

Inicia sesión.

**Body:**

```json
{
  "email": "juan@example.com",
  "password": "contraseña123"
}
```

**Response (200):**

```json
{
  "user": {
    "id": "user_id",
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errores:**

- `401`: Credenciales inválidas

---

### Events

#### GET `/api/events`

Obtiene todos los eventos.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**

```json
[
  {
    "id": "evt_123",
    "title": "Noche de Juegos",
    "location": "Cafetería El Dado",
    "date": "2025-12-20T19:00:00.000Z",
    "description": "Reunión mensual de jugadores",
    "password": "opcional"
  }
]
```

---

#### POST `/api/events`

Crea un nuevo evento.

**Headers:** `Authorization: Bearer <token>`

**Body:**

```json
{
  "title": "Noche de Juegos",
  "location": "Cafetería El Dado",
  "date": "2025-12-20T19:00:00.000Z",
  "description": "Reunión mensual de jugadores",
  "password": "secreto123" // Opcional para eventos privados
}
```

**Response (201):**

```json
{
  "id": "evt_123",
  "title": "Noche de Juegos",
  "location": "Cafetería El Dado",
  "date": "2025-12-20T19:00:00.000Z",
  "description": "Reunión mensual de jugadores",
  "hasPassword": true
}
```

**Errores:**

- `400`: Datos inválidos
- `401`: No autenticado

---

#### POST `/api/events/:id/verify-password`

Verifica la contraseña de un evento privado.

**Body:**

```json
{
  "password": "secreto123"
}
```

**Response (200):**

```json
{
  "success": true,
  "event": {
    "id": "evt_123",
    "title": "Noche de Juegos",
    "location": "Cafetería El Dado",
    "date": "2025-12-20T19:00:00.000Z",
    "description": "Reunión mensual de jugadores"
  }
}
```

**Errores:**

- `401`: Contraseña incorrecta
- `404`: Evento no encontrado

---

#### DELETE `/api/events/:id`

Elimina un evento.

**Headers:** `Authorization: Bearer <token>` (requiere admin)

**Response (200):**

```json
{
  "message": "Evento eliminado"
}
```

**Errores:**

- `403`: No autorizado
- `404`: Evento no encontrado

---

### Tables

#### GET `/api/tables/event/:eventId`

Obtiene todas las mesas de un evento.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**

```json
[
  {
    "id": "table_123",
    "eventId": "evt_123",
    "hostId": "user_456",
    "hostName": "María García",
    "gameName": "Catan",
    "description": "Partida amistosa de Catan",
    "minPlayers": 3,
    "maxPlayers": 4,
    "registeredPlayers": [
      {
        "id": "user_456",
        "name": "María García"
      },
      {
        "id": "user_789",
        "name": "Pedro López"
      }
    ]
  }
]
```

---

#### POST `/api/tables`

Crea una nueva mesa.

**Headers:** `Authorization: Bearer <token>`

**Body:**

```json
{
  "eventId": "evt_123",
  "gameName": "Catan",
  "description": "Partida amistosa de Catan",
  "minPlayers": 3,
  "maxPlayers": 4
}
```

**Response (201):**

```json
{
  "id": "table_123",
  "eventId": "evt_123",
  "hostId": "user_456",
  "hostName": "María García",
  "gameName": "Catan",
  "description": "Partida amistosa de Catan",
  "minPlayers": 3,
  "maxPlayers": 4,
  "registeredPlayers": [
    {
      "id": "user_456",
      "name": "María García"
    }
  ]
}
```

**Errores:**

- `400`: Datos inválidos
- `401`: No autenticado

---

#### POST `/api/tables/:id/join`

Une al usuario a una mesa.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**

```json
{
  "id": "table_123",
  "registeredPlayers": [
    { "id": "user_456", "name": "María García" },
    { "id": "user_current", "name": "Tu Nombre" }
  ]
}
```

**Errores:**

- `400`: Mesa llena
- `400`: Ya estás en esta mesa
- `404`: Mesa no encontrada

---

#### POST `/api/tables/:id/leave`

Retira al usuario de una mesa.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**

```json
{
  "id": "table_123",
  "registeredPlayers": [{ "id": "user_456", "name": "María García" }]
}
```

**Errores:**

- `400`: No estás en esta mesa
- `404`: Mesa no encontrada

---

#### DELETE `/api/tables/:id`

Elimina una mesa.

**Headers:** `Authorization: Bearer <token>` (requiere ser host o admin)

**Response (200):**

```json
{
  "message": "Mesa eliminada"
}
```

**Errores:**

- `403`: No autorizado (solo host o admin)
- `404`: Mesa no encontrada

---

### Games

#### GET `/api/games/event/:eventId`

Obtiene todos los juegos libres de un evento.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**

```json
[
  {
    "id": "game_123",
    "eventId": "evt_123",
    "ownerId": "user_456",
    "ownerName": "María García",
    "gameName": "Dixit",
    "note": "Para 3-6 jugadores"
  }
]
```

---

#### POST `/api/games`

Agrega un juego libre.

**Headers:** `Authorization: Bearer <token>`

**Body:**

```json
{
  "eventId": "evt_123",
  "gameName": "Dixit",
  "note": "Para 3-6 jugadores"
}
```

**Response (201):**

```json
{
  "id": "game_123",
  "eventId": "evt_123",
  "ownerId": "user_456",
  "ownerName": "María García",
  "gameName": "Dixit",
  "note": "Para 3-6 jugadores"
}
```

**Errores:**

- `400`: Datos inválidos
- `401`: No autenticado

---

#### DELETE `/api/games/:id`

Elimina un juego libre.

**Headers:** `Authorization: Bearer <token>` (requiere ser owner o admin)

**Response (200):**

```json
{
  "message": "Juego eliminado"
}
```

**Errores:**

- `403`: No autorizado
- `404`: Juego no encontrado

---

### Admin

#### GET `/api/admin/users`

Obtiene todos los usuarios.

**Headers:** `Authorization: Bearer <token>` (requiere admin)

**Response (200):**

```json
[
  {
    "_id": "user_123",
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "role": "user",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
]
```

---

#### GET `/api/admin/events`

Obtiene todos los eventos (incluye privados).

**Headers:** `Authorization: Bearer <token>` (requiere admin)

**Response (200):**

```json
[
  {
    "_id": "evt_123",
    "title": "Noche de Juegos",
    "location": "Cafetería El Dado",
    "date": "2025-12-20T19:00:00.000Z",
    "description": "Reunión mensual",
    "hasPassword": true
  }
]
```

---

#### GET `/api/admin/stats`

Obtiene estadísticas generales.

**Headers:** `Authorization: Bearer <token>` (requiere admin)

**Response (200):**

```json
{
  "users": 150,
  "events": 25,
  "tables": 80,
  "freeGames": 200
}
```

---

#### POST `/api/admin/make-admin`

Convierte un usuario en administrador.

**Headers:** `Authorization: Bearer <token>` (requiere admin)

**Body:**

```json
{
  "userId": "user_123"
}
```

**Response (200):**

```json
{
  "message": "Usuario promovido a admin",
  "user": {
    "id": "user_123",
    "role": "admin"
  }
}
```

---

#### DELETE `/api/admin/users/:id`

Elimina un usuario.

**Headers:** `Authorization: Bearer <token>` (requiere admin)

**Response (200):**

```json
{
  "message": "Usuario eliminado"
}
```

---

#### DELETE `/api/admin/events/:id`

Elimina un evento (admin).

**Headers:** `Authorization: Bearer <token>` (requiere admin)

**Response (200):**

```json
{
  "message": "Evento eliminado"
}
```

---

## Modelos de Datos

### User

```typescript
{
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  password: string; // Hasheado con bcrypt
  createdAt: Date;
}
```

### GameEvent

```typescript
{
  id: string;
  title: string;
  location: string;
  date: string; // ISO DateTime
  description: string;
  password?: string; // Opcional, hasheado
  createdAt: Date;
}
```

### GameTable

```typescript
{
  id: string;
  eventId: string;
  hostId: string;
  hostName: string;
  gameName: string;
  description: string;
  minPlayers: number;
  maxPlayers: number;
  registeredPlayers: Array<{
    id: string;
    name: string;
  }>;
  createdAt: Date;
}
```

### FreeGame

```typescript
{
  id: string;
  eventId: string;
  ownerId: string;
  ownerName: string;
  gameName: string;
  note?: string;
  createdAt: Date;
}
```

---

## Manejo de Errores

Todos los errores siguen este formato:

```json
{
  "error": "Mensaje descriptivo del error"
}
```

### Códigos de Estado HTTP

- `200`: OK - Solicitud exitosa
- `201`: Created - Recurso creado exitosamente
- `400`: Bad Request - Datos inválidos
- `401`: Unauthorized - No autenticado o credenciales inválidas
- `403`: Forbidden - No autorizado (permisos insuficientes)
- `404`: Not Found - Recurso no encontrado
- `500`: Internal Server Error - Error del servidor

---

## Ejemplos de Uso

### Flujo Completo

```javascript
// 1. Registro
const registerResponse = await fetch(
  'http://localhost:3001/api/auth/register',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Juan Pérez',
      email: 'juan@example.com',
      password: 'password123',
    }),
  }
);
const { token } = await registerResponse.json();

// 2. Crear evento
const eventResponse = await fetch('http://localhost:3001/api/events', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    title: 'Noche de Juegos',
    location: 'Mi Casa',
    date: new Date('2025-12-20T19:00:00').toISOString(),
    description: 'Evento de juegos',
  }),
});
const event = await eventResponse.json();

// 3. Crear mesa
const tableResponse = await fetch('http://localhost:3001/api/tables', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    eventId: event.id,
    gameName: 'Catan',
    description: 'Partida amistosa',
    minPlayers: 3,
    maxPlayers: 4,
  }),
});
const table = await tableResponse.json();
```

---

## Notas de Seguridad

1. **Contraseñas**: Todas las contraseñas se hashean con bcrypt (salt rounds: 10)
2. **JWT**: Los tokens expiran según configuración (por defecto no expiran, considerar implementar expiración)
3. **CORS**: Configurado para permitir todas las origins en desarrollo
4. **Validación**: Todos los inputs son validados antes de procesarse
5. **Autorización**: Endpoints protegidos verifican el token JWT

---

## Mejoras Futuras

- [ ] Paginación para listas largas
- [ ] Filtros y búsqueda avanzada
- [ ] Rate limiting
- [ ] Refresh tokens
- [ ] Logs de auditoría
- [ ] Notificaciones en tiempo real (WebSockets)
- [ ] Upload de imágenes para eventos y juegos
- [ ] Sistema de ratings y comentarios
