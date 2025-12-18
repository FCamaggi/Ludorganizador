# Documentación del Frontend - Ludorganizador

## Índice

- [Arquitectura](#arquitectura)
- [Estructura de Carpetas](#estructura-de-carpetas)
- [Tecnologías](#tecnologías)
- [Componentes](#componentes)
- [Hooks Personalizados](#hooks-personalizados)
- [Servicios](#servicios)
- [Estado y Flujo de Datos](#estado-y-flujo-de-datos)
- [Guía de Desarrollo](#guía-de-desarrollo)

---

## Arquitectura

El frontend sigue una arquitectura modular basada en React con TypeScript, utilizando:

- **Separation of Concerns**: Componentes, lógica y datos están separados
- **Custom Hooks**: Para encapsular lógica reutilizable
- **Service Layer**: Para comunicación con la API
- **Type Safety**: TypeScript en toda la aplicación

### Flujo de Datos

```
Usuario → Componente → Hook → Servicio API → Backend
                ↓
            Estado Local
                ↓
        Re-renderizado
```

---

## Estructura de Carpetas

```
src/
├── components/          # Componentes de UI
│   ├── ui/             # Componentes base reutilizables
│   │   ├── Button.tsx
│   │   └── Modal.tsx
│   ├── auth/           # Componentes de autenticación
│   │   └── AuthForm.tsx
│   ├── events/         # Componentes de eventos
│   │   └── EventCard.tsx
│   ├── tables/         # Componentes de mesas
│   │   └── GameTableCard.tsx
│   └── admin/          # Componentes de admin
│       └── AdminPanel.tsx
├── hooks/              # Hooks personalizados
│   ├── useAuth.ts
│   ├── useEvents.ts
│   ├── useTables.ts
│   └── useFreeGames.ts
├── services/           # Servicios de API
│   └── apiService.ts
├── types/              # Definiciones de TypeScript
│   └── index.ts
├── utils/              # Utilidades
│   ├── dateUtils.ts
│   └── validators.ts
├── constants/          # Constantes de la app
│   └── index.ts
└── App.tsx            # Componente principal
```

---

## Tecnologías

### Core

- **React 19.2.3**: Framework de UI
- **TypeScript 5.8.2**: Type safety
- **Vite 6.2.0**: Build tool y dev server

### Librerías

- **lucide-react**: Iconos
- **date-fns**: Manejo de fechas
- **uuid**: Generación de IDs únicos

### Estilos

- **Tailwind CSS**: Utility-first CSS framework

---

## Componentes

### Componentes UI Base

#### Button

Botón reutilizable con variantes y estados de carga.

**Props:**

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  isLoading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}
```

**Uso:**

```tsx
<Button variant="primary" onClick={handleClick}>
  Crear Evento
</Button>

<Button variant="danger" isLoading={deleting}>
  Eliminar
</Button>
```

**Variantes:**

- `primary`: Azul, para acciones principales
- `secondary`: Verde azulado, para acciones secundarias
- `outline`: Borde sin relleno
- `danger`: Rojo, para acciones destructivas

---

#### Modal

Modal reutilizable con cierre por ESC y backdrop.

**Props:**

```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}
```

**Uso:**

```tsx
<Modal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  title="Crear Evento"
  size="md"
>
  <EventForm onSubmit={handleSubmit} />
</Modal>
```

**Features:**

- Cierre con tecla ESC
- Click en backdrop para cerrar
- Bloqueo de scroll del body
- Tamaños configurables

---

### Componentes de Dominio

#### EventCard

Tarjeta que muestra información de un evento.

**Props:**

```typescript
interface EventCardProps {
  event: GameEvent;
  onClick: () => void;
}
```

**Features:**

- Muestra icono de candado para eventos privados
- Oculta detalles de eventos privados
- Formato de fecha en español
- Hover effect

**Uso:**

```tsx
<EventCard event={event} onClick={() => handleEventClick(event.id)} />
```

---

#### GameTableCard

Tarjeta que muestra información de una mesa de juego.

**Props:**

```typescript
interface GameTableCardProps {
  table: GameTable;
  currentUser: AuthUser;
  onJoin: () => void;
  onLeave: () => void;
  onDelete: () => void;
}
```

**Features:**

- Lista de jugadores registrados
- Espacios libres visualizados
- Botón de unirse/salir condicional
- Solo host o admin pueden eliminar
- Indicador de mesa llena

**Uso:**

```tsx
<GameTableCard
  table={table}
  currentUser={user}
  onJoin={() => handleJoin(table.id)}
  onLeave={() => handleLeave(table.id)}
  onDelete={() => handleDelete(table.id)}
/>
```

---

## Hooks Personalizados

### useAuth

Hook para manejar autenticación.

**API:**

```typescript
const {
  user, // Usuario actual o null
  loading, // Estado de carga inicial
  login, // Función de login
  register, // Función de registro
  logout, // Función de logout
  isAuthenticated, // Boolean de autenticación
  isAdmin, // Boolean de rol admin
} = useAuth();
```

**Ejemplo:**

```tsx
const MyComponent = () => {
  const { user, login, logout, isAdmin } = useAuth();

  const handleLogin = async () => {
    try {
      await login({
        email: 'user@example.com',
        password: 'password123',
      });
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div>
      {user ? (
        <>
          <p>Hola, {user.name}</p>
          <button onClick={logout}>Cerrar Sesión</button>
          {isAdmin && <AdminPanel />}
        </>
      ) : (
        <button onClick={handleLogin}>Iniciar Sesión</button>
      )}
    </div>
  );
};
```

---

### useEvents

Hook para manejar eventos.

**API:**

```typescript
const {
  events, // Lista de eventos
  loading, // Estado de carga
  error, // Error si existe
  loadEvents, // Recargar eventos
  createEvent, // Crear evento
  deleteEvent, // Eliminar evento
  verifyEventPassword, // Verificar contraseña
} = useEvents(user?.id);
```

**Ejemplo:**

```tsx
const EventsList = () => {
  const { events, loading, createEvent } = useEvents(user?.id);

  const handleCreate = async (data: CreateEventData) => {
    try {
      await createEvent(data);
      alert('Evento creado!');
    } catch (error) {
      alert('Error al crear evento');
    }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
};
```

---

### useTables

Hook para manejar mesas de juego.

**API:**

```typescript
const {
  tables, // Lista de mesas
  loading, // Estado de carga
  error, // Error si existe
  loadTables, // Recargar mesas
  createTable, // Crear mesa
  joinTable, // Unirse a mesa
  leaveTable, // Salir de mesa
  deleteTable, // Eliminar mesa
} = useTables(eventId);
```

**Ejemplo:**

```tsx
const TablesList = ({ eventId }) => {
  const { tables, joinTable, leaveTable } = useTables(eventId);

  const handleJoin = async (tableId: string) => {
    try {
      await joinTable(tableId);
      alert('Te has unido a la mesa!');
    } catch (error) {
      alert('Error al unirse');
    }
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      {tables.map((table) => (
        <GameTableCard
          key={table.id}
          table={table}
          onJoin={() => handleJoin(table.id)}
          onLeave={() => leaveTable(table.id)}
        />
      ))}
    </div>
  );
};
```

---

### useFreeGames

Hook para manejar juegos libres.

**API:**

```typescript
const {
  freeGames, // Lista de juegos
  loading, // Estado de carga
  error, // Error si existe
  loadFreeGames, // Recargar juegos
  createFreeGame, // Crear juego
  deleteFreeGame, // Eliminar juego
} = useFreeGames(eventId);
```

---

## Servicios

### apiService

Servicio centralizado para comunicación con la API.

**Métodos Principales:**

#### Autenticación

```typescript
// Registro
const user = await api.register(name, email, password);

// Login
const user = await api.login(email, password);

// Obtener usuario actual
const user = api.getCurrentUser();

// Logout
api.logout();
```

#### Eventos

```typescript
// Cargar eventos
const events = await api.loadEvents();

// Crear evento
const event = await api.saveEvent({
  title: 'Mi Evento',
  location: 'Lugar',
  date: new Date().toISOString(),
  description: 'Descripción',
  password: 'opcional',
});

// Verificar contraseña
const isValid = await api.verifyEventPassword(eventId, password);

// Eliminar evento
await api.deleteEvent(eventId);
```

#### Mesas

```typescript
// Cargar mesas
const tables = await api.loadTables(eventId);

// Crear mesa
const table = await api.saveTable({
  eventId,
  gameName: 'Catan',
  description: 'Partida amistosa',
  minPlayers: 3,
  maxPlayers: 4,
});

// Unirse/Salir
await api.joinTable(tableId);
await api.leaveTable(tableId);

// Eliminar
await api.deleteTable(tableId);
```

#### Juegos Libres

```typescript
// Cargar juegos
const games = await api.loadFreeGames(eventId);

// Crear juego
const game = await api.saveFreeGame({
  eventId,
  gameName: 'Dixit',
  note: 'Para 3-6 jugadores',
});

// Eliminar
await api.deleteFreeGame(gameId);
```

**Manejo de Errores:**

Todos los métodos lanzan `ApiError` en caso de fallo:

```typescript
try {
  await api.login(email, password);
} catch (error) {
  if (error instanceof ApiError) {
    console.error(error.message);
    console.error(error.statusCode);
  }
}
```

---

## Estado y Flujo de Datos

### Patrón de Componentes

```tsx
// 1. Componente usa hooks
const MyComponent = () => {
  const { user } = useAuth();
  const { events, createEvent } = useEvents(user?.id);

  // 2. Handlers llaman a funciones del hook
  const handleCreate = async (data) => {
    await createEvent(data);
  };

  // 3. UI renderiza basado en estado
  return (
    <div>
      {events.map((event) => (
        <EventCard event={event} />
      ))}
      <button onClick={handleCreate}>Crear</button>
    </div>
  );
};
```

### Flujo de Autenticación

```
Usuario ingresa credenciales
        ↓
  useAuth().login()
        ↓
  apiService.login()
        ↓
  POST /api/auth/login
        ↓
  Guardar token en localStorage
        ↓
  Actualizar estado user
        ↓
  UI se actualiza automáticamente
```

---

## Guía de Desarrollo

### Crear un Nuevo Componente

1. **Definir Props:**

```typescript
// types/index.ts
export interface MyComponentProps {
  title: string;
  onAction: () => void;
}
```

2. **Crear Componente:**

```tsx
// components/MyComponent.tsx
import React from 'react';
import { MyComponentProps } from '../types';

const MyComponent: React.FC<MyComponentProps> = ({ title, onAction }) => {
  return (
    <div>
      <h1>{title}</h1>
      <button onClick={onAction}>Action</button>
    </div>
  );
};

export default MyComponent;
```

3. **Usar Componente:**

```tsx
import MyComponent from './components/MyComponent';

<MyComponent title="Hello" onAction={() => console.log('clicked')} />;
```

---

### Crear un Nuevo Hook

```typescript
// hooks/useMyFeature.ts
import { useState, useEffect } from 'react';

export const useMyFeature = (param: string) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, [param]);

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await fetchData(param);
      setData(result);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, reload: loadData };
};
```

---

### Agregar un Nuevo Endpoint

1. **Actualizar constantes:**

```typescript
// constants/index.ts
export const API_ROUTES = {
  // ...
  MY_FEATURE: {
    BASE: '/my-feature',
    BY_ID: (id: string) => `/my-feature/${id}`,
  },
};
```

2. **Agregar servicio:**

```typescript
// services/apiService.ts
export const loadMyFeature = async (): Promise<MyType[]> => {
  const response = await fetch(
    `${API_CONFIG.BASE_URL}${API_ROUTES.MY_FEATURE.BASE}`,
    { headers: authHeaders() }
  );
  return handleResponse<MyType[]>(response);
};
```

3. **Crear hook:**

```typescript
// hooks/useMyFeature.ts
export const useMyFeature = () => {
  const [items, setItems] = useState<MyType[]>([]);

  const loadItems = async () => {
    const data = await api.loadMyFeature();
    setItems(data);
  };

  useEffect(() => {
    loadItems();
  }, []);

  return { items, reload: loadItems };
};
```

---

### Estilos y Tailwind

**Clases Comunes:**

```tsx
// Card
<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">

// Button Primary
<button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">

// Input
<input className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500" />

// Grid Layout
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
```

---

### Testing (Recomendado)

Para agregar tests, instalar:

```bash
npm install -D @testing-library/react @testing-library/jest-dom vitest
```

Ejemplo de test:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Button from './Button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<Button isLoading>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

---

## Mejores Prácticas

1. **Siempre tipar props y estado:**

```typescript
// ✅ Bien
const MyComponent: React.FC<Props> = ({ data }) => {};

// ❌ Mal
const MyComponent = ({ data }) => {};
```

2. **Usar hooks para lógica reutilizable:**

```typescript
// ✅ Bien
const { events, loading } = useEvents(userId);

// ❌ Mal
const [events, setEvents] = useState([]);
useEffect(() => {
  /* fetch logic */
}, []);
```

3. **Manejar errores apropiadamente:**

```typescript
// ✅ Bien
try {
  await api.createEvent(data);
} catch (error) {
  if (error instanceof ApiError) {
    alert(error.message);
  }
}

// ❌ Mal
await api.createEvent(data); // Sin manejo de errores
```

4. **Componentes pequeños y enfocados:**

```typescript
// ✅ Bien
<EventCard event={event} onClick={handleClick} />

// ❌ Mal
<div>{/* 500 líneas de JSX */}</div>
```

---

## Variables de Entorno

Crear archivo `.env` en la raíz:

```env
VITE_API_URL=http://localhost:3001/api
```

Acceder en código:

```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

---

## Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build de producción
npm run build

# Preview del build
npm run preview

# Lint
npm run lint
```

---

## Solución de Problemas Comunes

### Error: "Cannot find module"

```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### Error de CORS

Verificar que el backend tenga CORS habilitado y que la URL de la API sea correcta.

### Estado no se actualiza

Asegurarse de que los hooks se estén usando correctamente y que las dependencias de `useEffect` estén completas.

---

## Recursos Adicionales

- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)
