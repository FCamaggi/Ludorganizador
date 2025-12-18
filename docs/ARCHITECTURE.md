# Ludorganizador - Guía de Arquitectura y Refactorización

## Índice

1. [Visión General](#visión-general)
2. [Arquitectura del Proyecto](#arquitectura-del-proyecto)
3. [Estructura del Frontend](#estructura-del-frontend)
4. [Estructura del Backend](#estructura-del-backend)
5. [Patrones de Diseño](#patrones-de-diseño)
6. [Guía de Refactorización](#guía-de-refactorización)
7. [Flujos Principales](#flujos-principales)

---

## Visión General

Ludorganizador es una aplicación web para gestionar eventos de juegos de mesa. Permite a los usuarios crear eventos, organizar mesas de juego, registrar jugadores y compartir juegos disponibles.

### Stack Tecnológico

**Frontend:**

- React 19 + TypeScript
- Vite (build tool)
- Tailwind CSS
- date-fns, lucide-react

**Backend:**

- Node.js + Express
- MongoDB + Mongoose
- JWT para autenticación
- bcrypt para hashing

---

## Arquitectura del Proyecto

### Arquitectura General

```
┌─────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                    │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Components  │  │    Hooks     │  │   Services   │  │
│  │    (UI)      │◄─┤   (Logic)    │◄─┤    (API)     │  │
│  └──────────────┘  └──────────────┘  └──────┬───────┘  │
│                                              │          │
└──────────────────────────────────────────────┼──────────┘
                                               │ HTTP/REST
                                               │
┌──────────────────────────────────────────────┼──────────┐
│                      BACKEND (Express)       ▼          │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │    Routes    │  │  Middleware  │  │  Controllers │  │
│  │  (Endpoints) │─►│    (Auth)    │─►│   (Logic)    │  │
│  └──────────────┘  └──────────────┘  └──────┬───────┘  │
│                                              │          │
│                                              ▼          │
│                                     ┌──────────────┐    │
│                                     │   Models     │    │
│                                     │  (Mongoose)  │    │
│                                     └──────┬───────┘    │
└────────────────────────────────────────────┼────────────┘
                                             │
                                             ▼
                                     ┌──────────────┐
                                     │   MongoDB    │
                                     └──────────────┘
```

### Separación de Responsabilidades

| Capa                  | Responsabilidad                     | Ubicación         |
| --------------------- | ----------------------------------- | ----------------- |
| **Presentación**      | Renderizado UI, interacción usuario | `src/components/` |
| **Lógica de Negocio** | Estado, efectos, validaciones       | `src/hooks/`      |
| **Comunicación**      | HTTP requests, manejo de errores    | `src/services/`   |
| **Tipos**             | Definiciones TypeScript             | `src/types/`      |
| **Utilidades**        | Helpers, formateadores              | `src/utils/`      |
| **Configuración**     | Constantes, configuración           | `src/constants/`  |

---

## Estructura del Frontend

### Árbol de Directorios

```
src/
├── components/
│   ├── ui/                  # Componentes reutilizables base
│   │   ├── Button.tsx       # Botón con variantes
│   │   └── Modal.tsx        # Modal genérico
│   ├── auth/                # Componentes de autenticación
│   │   └── AuthForm.tsx     # Login/Register form
│   ├── events/              # Componentes de eventos
│   │   ├── EventCard.tsx    # Card de evento
│   │   ├── EventList.tsx    # Lista de eventos
│   │   └── CreateEventForm.tsx
│   ├── tables/              # Componentes de mesas
│   │   ├── GameTableCard.tsx
│   │   ├── TableList.tsx
│   │   └── CreateTableForm.tsx
│   └── admin/               # Componentes de administración
│       └── AdminPanel.tsx
├── hooks/                   # Custom hooks
│   ├── useAuth.ts          # Autenticación
│   ├── useEvents.ts        # Gestión de eventos
│   ├── useTables.ts        # Gestión de mesas
│   └── useFreeGames.ts     # Gestión de juegos libres
├── services/               # Servicios
│   └── apiService.ts       # Cliente API REST
├── types/                  # TypeScript types
│   └── index.ts            # Todas las interfaces
├── utils/                  # Utilidades
│   ├── dateUtils.ts        # Formateo de fechas
│   └── validators.ts       # Validaciones
├── constants/              # Constantes
│   └── index.ts            # Config, rutas, mensajes
└── App.tsx                 # Componente raíz
```

### Flujo de Datos en Frontend

```
Usuario Interactúa
       ↓
Componente (EventCard)
       ↓
Hook (useEvents)
       ↓
Service (apiService.loadEvents)
       ↓
API Request
       ↓
Estado Actualizado
       ↓
Re-render Componente
```

---

## Estructura del Backend

### Árbol de Directorios

```
server/
├── config/                 # Configuración
│   └── database.js         # Conexión MongoDB
├── controllers/            # Lógica de negocio
│   ├── authController.js
│   ├── eventsController.js
│   ├── tablesController.js
│   └── gamesController.js
├── middleware/             # Middlewares
│   ├── auth.js            # Verificación JWT
│   └── adminAuth.js       # Verificación admin
├── models/                # Modelos Mongoose
│   ├── User.js
│   ├── Event.js
│   ├── Table.js
│   └── FreeGame.js
├── routes/                # Definición de rutas
│   ├── auth.js
│   ├── events.js
│   ├── tables.js
│   ├── games.js
│   └── admin.js
├── utils/                 # Utilidades
│   ├── errorHandler.js
│   └── validators.js
└── index.js              # Punto de entrada
```

### Flujo de Request en Backend

```
Cliente HTTP Request
       ↓
Express Router (routes/events.js)
       ↓
Middleware (auth.js) → Verifica JWT
       ↓
Controller (eventsController.js) → Lógica
       ↓
Model (Event.js) → MongoDB Query
       ↓
Response al Cliente
```

---

## Patrones de Diseño

### 1. Custom Hooks Pattern

**Problema:** Lógica duplicada en múltiples componentes
**Solución:** Encapsular en hooks reutilizables

```typescript
// ❌ ANTES: Lógica duplicada
const Component1 = () => {
  const [events, setEvents] = useState([]);
  useEffect(() => {
    fetch('/api/events')
      .then((res) => res.json())
      .then(setEvents);
  }, []);
  // ...
};

const Component2 = () => {
  const [events, setEvents] = useState([]);
  useEffect(() => {
    fetch('/api/events')
      .then((res) => res.json())
      .then(setEvents);
  }, []);
  // ...
};

// ✅ DESPUÉS: Hook reutilizable
const useEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadEvents = async () => {
    setLoading(true);
    const data = await api.loadEvents();
    setEvents(data);
    setLoading(false);
  };

  useEffect(() => {
    loadEvents();
  }, []);

  return { events, loading, reload: loadEvents };
};

// Uso simple en componentes
const Component1 = () => {
  const { events, loading } = useEvents();
  // ...
};
```

**Beneficios:**

- ✅ Lógica centralizada
- ✅ Fácil de testear
- ✅ Reutilizable
- ✅ Mantenible

---

### 2. Service Layer Pattern

**Problema:** Llamadas API esparcidas en componentes
**Solución:** Capa de servicios centralizada

```typescript
// ❌ ANTES: Llamadas directas en componentes
const MyComponent = () => {
  const handleCreate = async () => {
    const res = await fetch('http://localhost:3001/api/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    const event = await res.json();
  };
};

// ✅ DESPUÉS: Servicio centralizado
// services/apiService.ts
export const createEvent = async (data: CreateEventData) => {
  const response = await fetch(`${API_URL}/events`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

// Uso en componente
const MyComponent = () => {
  const handleCreate = async () => {
    const event = await api.createEvent(data);
  };
};
```

**Beneficios:**

- ✅ URLs centralizadas
- ✅ Manejo de errores consistente
- ✅ Fácil de mockear para tests
- ✅ Cambios de API en un solo lugar

---

### 3. Composition Pattern

**Problema:** Componentes monolíticos difíciles de mantener
**Solución:** Componentes pequeños y componibles

```tsx
// ❌ ANTES: Componente monolítico
const EventDetail = () => {
  return (
    <div>
      {/* 500 líneas de código */}
      <div>{/* Header */}</div>
      <div>{/* Tables list */}</div>
      <div>{/* Free games list */}</div>
      <div>{/* Forms */}</div>
    </div>
  );
};

// ✅ DESPUÉS: Componentes componibles
const EventDetail = () => {
  return (
    <div>
      <EventHeader event={event} />
      <TabsContainer>
        <TablesTab eventId={eventId} />
        <FreeGamesTab eventId={eventId} />
      </TabsContainer>
    </div>
  );
};

const TablesTab = ({ eventId }) => {
  const { tables } = useTables(eventId);
  return <TableList tables={tables} />;
};
```

**Beneficios:**

- ✅ Componentes enfocados
- ✅ Fácil de entender
- ✅ Reutilizable
- ✅ Testeable

---

### 4. Container/Presentational Pattern

**Problema:** Mezcla de lógica y presentación
**Solución:** Separar componentes de lógica y presentación

```tsx
// ❌ ANTES: Lógica y UI mezcladas
const EventCard = ({ eventId }) => {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvent(eventId).then(setEvent);
  }, [eventId]);

  if (loading) return <Spinner />;

  return (
    <div>
      <h3>{event.title}</h3>
      <p>{event.description}</p>
    </div>
  );
};

// ✅ DESPUÉS: Separados

// Container (con lógica)
const EventCardContainer = ({ eventId }) => {
  const { event, loading } = useEvent(eventId);

  if (loading) return <Spinner />;

  return <EventCard event={event} />;
};

// Presentational (solo UI)
const EventCard = ({ event }) => {
  return (
    <div>
      <h3>{event.title}</h3>
      <p>{event.description}</p>
    </div>
  );
};
```

**Beneficios:**

- ✅ Componentes UI puros y testeables
- ✅ Lógica reutilizable
- ✅ Más fácil de razonar

---

## Guía de Refactorización

### Paso 1: Identificar Componentes Grandes

```bash
# Buscar componentes con muchas líneas
find src/components -name "*.tsx" -exec wc -l {} \; | sort -rn
```

Si un componente tiene >200 líneas, considerar dividirlo.

### Paso 2: Extraer Lógica a Hooks

**Antes:**

```tsx
const MyComponent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch('/api/data')
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, []);

  // ...render
};
```

**Después:**

```tsx
// hooks/useData.ts
export const useData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const result = await api.loadData();
    setData(result);
    setLoading(false);
  };

  return { data, loading, reload: loadData };
};

// Component
const MyComponent = () => {
  const { data, loading } = useData();
  // ...render
};
```

### Paso 3: Extraer Componentes UI

**Antes:**

```tsx
const EventList = () => {
  return (
    <div>
      {events.map((event) => (
        <div key={event.id} className="card">
          <h3>{event.title}</h3>
          <p>{event.description}</p>
          <button>Ver más</button>
        </div>
      ))}
    </div>
  );
};
```

**Después:**

```tsx
// components/EventCard.tsx
const EventCard = ({ event, onViewMore }) => (
  <div className="card">
    <h3>{event.title}</h3>
    <p>{event.description}</p>
    <button onClick={onViewMore}>Ver más</button>
  </div>
);

// components/EventList.tsx
const EventList = ({ events, onEventClick }) => (
  <div>
    {events.map((event) => (
      <EventCard
        key={event.id}
        event={event}
        onViewMore={() => onEventClick(event.id)}
      />
    ))}
  </div>
);
```

### Paso 4: Centralizar Llamadas API

**Antes:**

```tsx
// Esparcido en componentes
const res = await fetch('/api/events', {...});
```

**Después:**

```tsx
// services/apiService.ts
export const loadEvents = async () => {
  const res = await fetch(`${API_URL}/events`, {
    headers: authHeaders(),
  });
  return handleResponse(res);
};

// En componente
const events = await api.loadEvents();
```

### Paso 5: Tipar Todo

```typescript
// ❌ ANTES
const MyComponent = ({ data, onClick }) => {};

// ✅ DESPUÉS
interface MyComponentProps {
  data: EventData;
  onClick: (id: string) => void;
}

const MyComponent: React.FC<MyComponentProps> = ({ data, onClick }) => {};
```

---

## Flujos Principales

### Flujo de Autenticación

```
1. Usuario ingresa credenciales
   ↓
2. AuthForm.handleSubmit()
   ↓
3. useAuth().login(credentials)
   ↓
4. apiService.login()
   ↓
5. POST /api/auth/login
   ↓
6. authController.login()
   ↓
7. Verifica password con bcrypt
   ↓
8. Genera JWT token
   ↓
9. Retorna { user, token }
   ↓
10. Guarda en localStorage
   ↓
11. Actualiza estado user
   ↓
12. Redirect a eventos
```

### Flujo de Crear Evento

```
1. Usuario completa formulario
   ↓
2. CreateEventForm.onSubmit()
   ↓
3. useEvents().createEvent(data)
   ↓
4. apiService.saveEvent(data)
   ↓
5. POST /api/events
   ↓
6. auth middleware verifica token
   ↓
7. eventsController.create()
   ↓
8. Event.create() en MongoDB
   ↓
9. Retorna evento creado
   ↓
10. useEvents recarga lista
   ↓
11. UI muestra nuevo evento
```

### Flujo de Unirse a Mesa

```
1. Usuario click "Inscribirse"
   ↓
2. GameTableCard.onJoin()
   ↓
3. useTables().joinTable(tableId)
   ↓
4. apiService.joinTable(tableId)
   ↓
5. POST /api/tables/:id/join
   ↓
6. tablesController.join()
   ↓
7. Verifica mesa no llena
   ↓
8. Agrega usuario a registeredPlayers
   ↓
9. Table.save() en MongoDB
   ↓
10. Retorna mesa actualizada
   ↓
11. useTables recarga mesas
   ↓
12. UI muestra jugador agregado
```

---

## Checklist de Refactorización

### Frontend

- [x] Extraer componentes en carpetas por dominio
- [x] Crear hooks personalizados para lógica
- [x] Centralizar llamadas API en servicios
- [x] Separar tipos en archivos dedicados
- [x] Crear utilidades para funciones comunes
- [x] Definir constantes centralizadas
- [ ] Agregar tests unitarios
- [ ] Optimizar re-renders con React.memo
- [ ] Implementar lazy loading

### Backend

- [ ] Separar lógica en controllers
- [ ] Validar inputs con middleware
- [ ] Manejar errores centralizadamente
- [ ] Agregar logs estructurados
- [ ] Implementar rate limiting
- [ ] Agregar tests de integración
- [ ] Documentar con JSDoc
- [ ] Optimizar queries MongoDB

### General

- [x] Documentación de API
- [x] Documentación de Frontend
- [x] Guía de arquitectura
- [ ] Diagramas de flujo
- [ ] Scripts de deployment
- [ ] Variables de entorno documentadas
- [ ] README actualizado

---

## Próximos Pasos

1. **Implementar controllers en backend**
2. **Agregar validaciones robustas**
3. **Implementar tests (frontend y backend)**
4. **Optimizaciones de rendimiento**
5. **Deploy a producción**

---

## Conclusión

Esta refactorización transforma el proyecto de un monolito difícil de mantener a una arquitectura modular, escalable y mantenible. Cada capa tiene responsabilidades claras, el código es reutilizable y la adición de nuevas features es más sencilla.

### Beneficios Logrados

✅ **Separación de responsabilidades**  
✅ **Código reutilizable**  
✅ **Type safety completo**  
✅ **Fácil de testear**  
✅ **Documentación exhaustiva**  
✅ **Escalable y mantenible**
