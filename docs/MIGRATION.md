# Guía de Migración a la Nueva Estructura

Este documento explica cómo migrar del código actual a la nueva estructura refactorizada.

## Cambios en Imports

### Antes (estructura antigua)

```typescript
import Button from './components/Button';
import Modal from './components/Modal';
import { GameEvent } from './types';
import * as api from './services/apiService';
```

### Después (nueva estructura)

```typescript
import { Button, Modal } from './components/ui';
import { EventCard } from './components/events';
import { GameTableCard } from './components/tables';
import { GameEvent, AuthUser } from './types';
import * as api from './services/apiService';
import { useAuth, useEvents, useTables } from './hooks';
import { formatEventDate, isValidEmail } from './utils';
import { API_CONFIG, STORAGE_KEYS } from './constants';
```

## Actualización de rutas de archivos

### Componentes

- `./components/Button.tsx` → `./components/ui/Button.tsx`
- `./components/Modal.tsx` → `./components/ui/Modal.tsx`
- `./components/AuthForm.tsx` → `./components/auth/AuthForm.tsx`
- `./components/AdminPanel.tsx` → `./components/admin/AdminPanel.tsx`

### Tipos

- `./types.ts` → `./types/index.ts`

### Servicios

- `./services/apiService.ts` → `./services/apiService.ts` (refactorizado)
- `./services/storageService.ts` → (ya no se usa, funcionalidad integrada en hooks)

## Migración de lógica a Hooks

### Antes: Lógica en App.tsx

```typescript
const [events, setEvents] = useState<GameEvent[]>([]);

useEffect(() => {
  if (user) {
    loadEventsData();
  }
}, [user]);

const loadEventsData = async () => {
  try {
    const eventsData = await api.loadEvents();
    setEvents(eventsData);
  } catch (error) {
    console.error('Error loading events:', error);
  }
};
```

### Después: Usar Hook

```typescript
const { events, loading, error, loadEvents } = useEvents(user?.id);
```

## Pasos de Migración

### 1. Instalar dependencias actualizadas

```bash
npm install
```

### 2. Mover componentes grandes

Si tienes componentes en `App.tsx` que están definidos inline (como `EventCard`, `GameTableCard`), ahora están en archivos separados:

```typescript
// Antes en App.tsx
const EventCard: React.FC<{ event: GameEvent; onClick: () => void }> = ({
  event,
  onClick,
}) => {
  // ...
};

// Ahora importar
import { EventCard } from './components/events';
```

### 3. Reemplazar llamadas a API directas por hooks

```typescript
// Antes
const [tables, setTables] = useState([]);
const loadTables = async () => {
  const data = await api.loadTables(eventId);
  setTables(data);
};

// Después
const { tables, loadTables } = useTables(eventId);
```

### 4. Usar constantes en lugar de valores hardcodeados

```typescript
// Antes
const API_URL = 'http://localhost:3001/api';
localStorage.setItem('ludis_auth_user', JSON.stringify(user));

// Después
import { API_CONFIG, STORAGE_KEYS } from './constants';
const apiUrl = API_CONFIG.BASE_URL;
localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
```

### 5. Usar utilidades

```typescript
// Antes
const formattedDate = format(
  new Date(event.date),
  "d 'de' MMMM, yyyy - HH:mm",
  { locale: es }
);

// Después
import { formatEventDate } from './utils';
const formattedDate = formatEventDate(event.date);
```

## Estructura del nuevo App.tsx

El nuevo `App.tsx` debería ser mucho más simple:

```typescript
import React from 'react';
import { useAuth } from './hooks';
import AuthForm from './components/auth/AuthForm';
import EventsView from './components/events/EventsView';

const App: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return <AuthForm />;
  }

  return (
    <div>
      <Header user={user} onLogout={logout} />
      <EventsView userId={user.id} />
    </div>
  );
};

export default App;
```

## Checklist de Migración

- [ ] Actualizar imports de componentes
- [ ] Reemplazar lógica de estado por hooks personalizados
- [ ] Usar constantes en lugar de valores hardcodeados
- [ ] Reemplazar formateo de fechas por utilidades
- [ ] Simplificar App.tsx usando la nueva estructura
- [ ] Verificar que todas las funcionalidades siguen funcionando
- [ ] Ejecutar `npm run build` para verificar que no hay errores de TypeScript

## Solución de Problemas

### Error: "Cannot find module"

Asegúrate de actualizar todas las rutas de import según la nueva estructura.

### Error: "Property does not exist"

Verifica que estés usando los tipos correctos importados desde `./types`.

### Funcionalidad no funciona

Verifica que los hooks se estén usando con los parámetros correctos (por ejemplo, `useEvents(userId)` necesita el userId).

## Soporte

Si encuentras problemas durante la migración, revisa:

1. [Documentación de Frontend](./docs/FRONTEND.md)
2. [Guía de Arquitectura](./docs/ARCHITECTURE.md)
3. Los ejemplos en cada archivo de documentación
