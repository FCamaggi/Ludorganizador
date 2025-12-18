# 🗺️ Mapa Visual de Arquitectura - Ludorganizador

## Vista General del Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                         USUARIO FINAL                            │
│                    (Navegador Web / Móvil)                       │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTP/HTTPS
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                      FRONTEND (React SPA)                        │
│                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │ Components  │  │   Hooks     │  │  Services   │             │
│  │    Layer    │◄─┤   Layer     │◄─┤    Layer    │             │
│  └─────────────┘  └─────────────┘  └──────┬──────┘             │
│         │                                  │                     │
│         │                                  │                     │
│    [UI Render]                       [API Calls]                │
│                                            │                     │
└────────────────────────────────────────────┼─────────────────────┘
                                             │
                                             │ REST API (JSON)
                                             │
┌────────────────────────────────────────────▼─────────────────────┐
│                    BACKEND (Express.js API)                      │
│                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │   Routes    │─►│ Middleware  │─►│ Controllers │             │
│  └─────────────┘  └─────────────┘  └──────┬──────┘             │
│                          │                 │                     │
│                   [Auth/Validation]   [Business Logic]          │
│                                            │                     │
│                                   ┌────────▼────────┐            │
│                                   │     Models      │            │
│                                   │   (Mongoose)    │            │
│                                   └────────┬────────┘            │
└────────────────────────────────────────────┼─────────────────────┘
                                             │
                                             │ MongoDB Protocol
                                             │
                                  ┌──────────▼──────────┐
                                  │      MongoDB        │
                                  │   (Base de Datos)   │
                                  └─────────────────────┘
```

---

## Arquitectura Frontend Detallada

```
src/
│
├─► components/
│   │
│   ├─► ui/ ─────────────┐
│   │   ├── Button       │ Componentes Base Reutilizables
│   │   └── Modal        │ (Presentación Pura)
│   │                    └─► Importados por componentes de dominio
│   │
│   ├─► auth/ ───────────┐
│   │   └── AuthForm     │ Componentes de Autenticación
│   │                    └─► Usa: useAuth hook
│   │
│   ├─► events/ ─────────┐
│   │   └── EventCard    │ Componentes de Eventos
│   │                    └─► Usa: useEvents hook
│   │
│   ├─► tables/ ─────────┐
│   │   └── TableCard    │ Componentes de Mesas
│   │                    └─► Usa: useTables hook
│   │
│   └─► admin/ ──────────┐
│       └── AdminPanel   │ Panel de Administración
│                        └─► Usa: múltiples hooks
│
├─► hooks/ ──────────────────────┐
│   ├── useAuth                  │
│   ├── useEvents                │ Custom Hooks
│   ├── useTables                │ (Lógica de Negocio)
│   └── useFreeGames             │
│                                └─► Llaman a: services/apiService
│
├─► services/ ───────────────────┐
│   └── apiService               │ Capa de Servicios
│                                │ (Comunicación con Backend)
│                                └─► Usa: constants/API_ROUTES
│
├─► types/ ──────────────────────┐
│   └── index.ts                 │ Definiciones TypeScript
│                                └─► Importado por todos los módulos
│
├─► utils/ ──────────────────────┐
│   ├── dateUtils                │ Funciones Utilitarias
│   └── validators               └─► Usadas donde se necesiten
│
├─► constants/ ──────────────────┐
│   └── index.ts                 │ Configuración y Constantes
│                                └─► Importado por services y components
│
└─► App.tsx ─────────────────────┐
    (Componente Raíz)            │ Punto de Entrada
                                 └─► Usa: hooks y components
```

---

## Flujo de Datos: Crear Evento

```
┌───────────────┐
│    Usuario    │
│ (llena form)  │
└───────┬───────┘
        │
        │ onClick
        ▼
┌────────────────────┐
│   CreateEventForm  │ ◄─── Componente
│   (Component)      │
└────────┬───────────┘
         │
         │ handleSubmit(data)
         ▼
┌────────────────────┐
│    useEvents()     │ ◄─── Hook
│  createEvent(data) │
└────────┬───────────┘
         │
         │ await api.saveEvent(data)
         ▼
┌─────────────────────┐
│   apiService.ts     │ ◄─── Service
│   saveEvent(data)   │
└────────┬────────────┘
         │
         │ POST /api/events
         │ { title, location, date... }
         ▼
┌─────────────────────┐
│  Backend Express    │
│  POST /api/events   │
└────────┬────────────┘
         │
         │ auth middleware
         ▼
┌─────────────────────┐
│  eventsController   │ ◄─── Controller
│   .create()         │
└────────┬────────────┘
         │
         │ Event.create()
         ▼
┌─────────────────────┐
│   MongoDB           │ ◄─── Database
│   events collection │
└────────┬────────────┘
         │
         │ evento creado
         ▼
         (retorna por el mismo camino)
         │
         ▼
┌────────────────────┐
│   useEvents()      │
│ loadEvents()       │ ◄─── Hook actualiza estado
└────────┬───────────┘
         │
         │ setEvents(nuevaLista)
         ▼
┌────────────────────┐
│  EventsList        │ ◄─── Component re-renderiza
│  (muestra nuevo    │
│   evento)          │
└────────────────────┘
```

---

## Arquitectura Backend Detallada

```
server/
│
├─► index.js ────────────┐
│   (Entry Point)        │ Inicializa Express, conecta MongoDB
│                        └─► Registra routes
│
├─► config/ ─────────────┐
│   └── index.js         │ Configuración centralizada
│                        └─► Exporta: DB_CONFIG, JWT_CONFIG, etc.
│
├─► routes/ ─────────────┐
│   ├── auth.js          │ Definición de Rutas
│   ├── events.js        │ POST /api/events → eventsController.create
│   ├── tables.js        │ GET /api/tables → tablesController.getAll
│   └── games.js         └─► Mapeo URL → Controller
│
├─► middleware/ ─────────┐
│   ├── auth.js          │ Middlewares
│   │   ├── verifyToken  │ - Verificación JWT
│   │   └── protect      │ - Autenticación
│   └── adminAuth.js     │ - Autorización Admin
│       └── isAdmin      └─► Se ejecutan antes de controllers
│
├─► controllers/ ────────┐
│   ├── authController   │ Controladores (Lógica de Negocio)
│   ├── eventsController │ - Validan datos
│   ├── tablesController │ - Ejecutan lógica
│   └── gamesController  │ - Llaman a Models
│                        └─► Retornan responses
│
├─► models/ ─────────────┐
│   ├── User.js          │ Modelos Mongoose
│   ├── Event.js         │ - Schemas
│   ├── Table.js         │ - Validaciones
│   └── FreeGame.js      │ - Métodos del modelo
│                        └─► Interactúan con MongoDB
│
└─► utils/ ──────────────┐
    ├── errorHandler.js  │ Utilidades
    └── validators.js    └─► Funciones helper
```

---

## Flujo de Autenticación

```
┌──────────┐
│ Cliente  │
└────┬─────┘
     │ 1. POST /api/auth/login
     │    { email, password }
     ▼
┌─────────────────┐
│ authRoutes      │
│ router.post()   │
└────┬────────────┘
     │ 2. authController.login
     ▼
┌─────────────────────────┐
│ authController.login    │
│ - Busca usuario         │
│ - Verifica password     │
│ - Genera JWT            │
└────┬────────────────────┘
     │ 3. User.findOne({ email })
     ▼
┌─────────────────┐
│ MongoDB         │
│ users collection│
└────┬────────────┘
     │ 4. retorna user
     ▼
┌─────────────────────────┐
│ authController          │
│ - bcrypt.compare()      │
│ - jwt.sign()            │
└────┬────────────────────┘
     │ 5. return { user, token }
     ▼
┌─────────────────┐
│ Cliente recibe  │
│ { user, token } │
└────┬────────────┘
     │ 6. Guarda en localStorage
     ▼
┌─────────────────────────┐
│ Requests subsecuentes   │
│ Headers:                │
│ Authorization: Bearer   │
│ <token>                 │
└────┬────────────────────┘
     │ 7. auth middleware verifica
     ▼
┌─────────────────────────┐
│ auth.js middleware      │
│ - Extrae token          │
│ - Verifica con jwt      │
│ - Adjunta req.user      │
└─────────────────────────┘
```

---

## Ciclo de Vida de un Request

```
┌────────────────────────────────────────────────────────────┐
│                    Request Lifecycle                        │
└────────────────────────────────────────────────────────────┘

1. CLIENT
   └─► fetch('/api/events', { headers: { Authorization } })

2. EXPRESS ROUTER
   └─► routes/events.js
       └─► router.get('/', ...)

3. MIDDLEWARE CHAIN
   ├─► cors() ──────────────┐
   │                        │ Permite cross-origin
   │                        ▼
   ├─► express.json() ─────┐
   │                        │ Parsea JSON body
   │                        ▼
   ├─► auth.verify ────────┐
   │                        │ Verifica JWT token
   │                        │ Agrega req.user
   │                        ▼
   └─► adminAuth.isAdmin ──┐  (si aplica)
                            │ Verifica rol
                            ▼
4. CONTROLLER
   └─► eventsController.getAll(req, res)
       ├─► Valida parámetros
       ├─► Ejecuta lógica
       └─► Llama al modelo
           │
           ▼
5. MODEL
   └─► Event.find()
       └─► MongoDB query
           │
           ▼
6. DATABASE
   └─► MongoDB retorna datos
       │
       ▼
7. CONTROLLER
   └─► res.json({ events })
       │
       ▼
8. CLIENT
   └─► Recibe response
       └─► Hook actualiza estado
           └─► Component re-renderiza
```

---

## Estructura de un Componente Típico

```typescript
// 1. IMPORTS
import React from 'react';
import { MyType } from '../types';
import { Button } from './ui';
import { useMyHook } from '../hooks';

// 2. INTERFACE (Props)
interface MyComponentProps {
  title: string;
  onAction: () => void;
}

// 3. COMPONENT
const MyComponent: React.FC<MyComponentProps> = ({ title, onAction }) => {
  // 4. HOOKS
  const { data, loading } = useMyHook();

  // 5. HANDLERS
  const handleClick = () => {
    onAction();
  };

  // 6. RENDER
  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>{title}</h1>
      <Button onClick={handleClick}>Click me</Button>
    </div>
  );
};

// 7. EXPORT
export default MyComponent;
```

---

## Estructura de un Hook Típico

```typescript
// 1. IMPORTS
import { useState, useEffect } from 'react';
import * as api from '../services/apiService';
import { MyType } from '../types';

// 2. HOOK FUNCTION
export const useMyFeature = (param: string) => {
  // 3. STATE
  const [data, setData] = useState<MyType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 4. EFFECTS
  useEffect(() => {
    loadData();
  }, [param]);

  // 5. FUNCTIONS
  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.loadMyData(param);
      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 6. RETURN
  return {
    data,
    loading,
    error,
    reload: loadData,
  };
};
```

---

## Mapa de Dependencias

```
App.tsx
├─► useAuth() ──────────────► apiService.login()
│                              apiService.register()
│
├─► EventsView
│   ├─► useEvents() ────────► apiService.loadEvents()
│   │                         apiService.saveEvent()
│   │
│   ├─► EventCard ──────────► (presentational)
│   │   └─► formatEventDate() ◄─ utils/dateUtils
│   │
│   └─► CreateEventForm
│       └─► isValidEmail() ◄─── utils/validators
│
└─► EventDetailView
    ├─► useTables() ────────► apiService.loadTables()
    │                         apiService.joinTable()
    │
    ├─► useFreeGames() ─────► apiService.loadFreeGames()
    │
    ├─► GameTableCard ──────► (presentational)
    │
    └─► AdminPanel (si admin)
        └─► admin API calls
```

---

## Stack Tecnológico Visual

```
┌─────────────────────────────────────────┐
│           PRESENTATION LAYER            │
│                                         │
│  ┌─────────┐  ┌──────────┐            │
│  │  React  │  │Tailwind  │            │
│  │  19.2   │  │   CSS    │            │
│  └─────────┘  └──────────┘            │
│                                         │
└─────────────────────────────────────────┘
                    │
                    │ TypeScript 5.8
                    │
┌─────────────────────────────────────────┐
│          APPLICATION LAYER              │
│                                         │
│  ┌─────────┐  ┌──────────┐            │
│  │  Hooks  │  │ Services │            │
│  │ Custom  │  │   API    │            │
│  └─────────┘  └──────────┘            │
│                                         │
└─────────────────────────────────────────┘
                    │
                    │ HTTP/REST
                    │
┌─────────────────────────────────────────┐
│            BACKEND LAYER                │
│                                         │
│  ┌─────────┐  ┌──────────┐            │
│  │ Express │  │   JWT    │            │
│  │  4.18   │  │  Auth    │            │
│  └─────────┘  └──────────┘            │
│                                         │
└─────────────────────────────────────────┘
                    │
                    │ Mongoose ODM
                    │
┌─────────────────────────────────────────┐
│          DATABASE LAYER                 │
│                                         │
│  ┌─────────────────────────┐            │
│  │      MongoDB 7.0+       │            │
│  │                         │            │
│  │  ┌──────┐  ┌──────┐   │            │
│  │  │Users │  │Events│   │            │
│  │  └──────┘  └──────┘   │            │
│  │  ┌──────┐  ┌──────┐   │            │
│  │  │Tables│  │Games │   │            │
│  │  └──────┘  └──────┘   │            │
│  └─────────────────────────┘            │
│                                         │
└─────────────────────────────────────────┘
```

---

Este mapa visual te ayudará a:

1. ✅ Entender el flujo completo de datos
2. ✅ Visualizar la separación de responsabilidades
3. ✅ Identificar dónde implementar nuevas features
4. ✅ Debuggear problemas siguiendo el flujo
5. ✅ Onboarding rápido de nuevos desarrolladores
