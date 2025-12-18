# 🎲 Ludorganizador

Sistema completo de gestión de eventos de juegos de mesa. Permite organizar eventos, crear mesas de juego, registrar jugadores y compartir ludotecas personales.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7+-47A248)](https://www.mongodb.com/)

---

## 📋 Índice

- [Características](#-características)
- [Demo](#-demo)
- [Instalación](#-instalación)
- [Uso](#-uso)
- [Arquitectura](#-arquitectura)
- [Documentación](#-documentación)
- [Scripts Disponibles](#-scripts-disponibles)
- [Tecnologías](#-tecnologías)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)

---

## ✨ Características

### Para Usuarios

- 🎯 **Crear y gestionar eventos** de juegos de mesa
- 🎲 **Organizar mesas de juego** con límites de jugadores
- 👥 **Registro de jugadores** en mesas específicas
- 📚 **Compartir ludoteca personal** en eventos
- 🔒 **Eventos privados** con contraseña
- 📱 **Interfaz responsive** para móviles y desktop

### Para Administradores

- 👨‍💼 **Panel de administración** completo
- 📊 **Estadísticas** de usuarios y eventos
- 🗑️ **Gestión de usuarios** y contenido
- 🔐 **Sistema de roles** (user/admin)

---

## 🎥 Demo

```bash
# URL de desarrollo
http://localhost:5173

# API
http://localhost:3001/api
```

### Capturas de Pantalla

_(Agregar capturas aquí)_

---

## 🚀 Instalación

### Prerequisitos

- Node.js 18 o superior
- MongoDB 7 o superior
- npm o yarn

### Clonar Repositorio

```bash
git clone https://github.com/FCamaggi/Ludorganizador.git
cd Ludorganizador
```

### Instalación del Frontend

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Iniciar en modo desarrollo
npm run dev
```

### Instalación del Backend

```bash
# Ir a carpeta del servidor
cd server

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Editar .env con tus credenciales
# MONGODB_URI=mongodb://localhost:27017/ludorganizador
# JWT_SECRET=tu_secreto_super_seguro
# PORT=3001

# Iniciar servidor
npm run dev
```

### Variables de Entorno

#### Frontend (`.env`)

```env
VITE_API_URL=http://localhost:3001/api
```

#### Backend (`server/.env`)

```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/ludorganizador
JWT_SECRET=tu_secreto_super_seguro_aqui
NODE_ENV=development
```

---

## 💻 Uso

### Iniciar Desarrollo

```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
cd server && npm run dev
```

Acceder a:

- Frontend: http://localhost:5173
- API: http://localhost:3001/api
- Health check: http://localhost:3001/api/health

### Crear Usuario Admin

```bash
cd server
node makeAdmin.js <email_del_usuario>
```

### Build para Producción

```bash
# Frontend
npm run build

# Los archivos se generan en /dist

# Backend ya está listo, solo configurar variables de entorno
```

---

## 🏗️ Arquitectura

### Estructura del Proyecto

```
Ludorganizador/
├── src/                      # Frontend refactorizado
│   ├── components/          # Componentes React
│   │   ├── ui/             # Componentes base (Button, Modal)
│   │   ├── auth/           # Autenticación
│   │   ├── events/         # Eventos
│   │   ├── tables/         # Mesas de juego
│   │   └── admin/          # Panel admin
│   ├── hooks/              # Custom hooks
│   ├── services/           # Servicios de API
│   ├── types/              # TypeScript types
│   ├── utils/              # Utilidades
│   ├── constants/          # Constantes
│   └── App.tsx            # Componente principal
├── server/                  # Backend
│   ├── config/            # Configuración
│   ├── controllers/       # Lógica de negocio
│   ├── middleware/        # Middlewares (auth, admin)
│   ├── models/            # Modelos Mongoose
│   ├── routes/            # Rutas de API
│   └── index.js          # Punto de entrada
├── docs/                   # Documentación
│   ├── API.md            # Documentación de API
│   ├── FRONTEND.md       # Documentación de Frontend
│   └── ARCHITECTURE.md   # Guía de arquitectura
└── public/                # Assets estáticos
```

### Patrones de Diseño

- **Custom Hooks**: Lógica de negocio reutilizable
- **Service Layer**: Capa de servicios para API
- **Component Composition**: Componentes pequeños y componibles
- **Container/Presentational**: Separación lógica/presentación

Ver [ARCHITECTURE.md](docs/ARCHITECTURE.md) para más detalles.

---

## 📚 Documentación

### Documentación Completa

- **[API Documentation](docs/API.md)** - Endpoints, autenticación, modelos
- **[Frontend Guide](docs/FRONTEND.md)** - Componentes, hooks, servicios
- **[Architecture Guide](docs/ARCHITECTURE.md)** - Patrones, flujos, refactorización

### Guías Rápidas

#### Crear un Componente

```tsx
// src/components/MyComponent.tsx
import React from 'react';
import { MyComponentProps } from '../types';

const MyComponent: React.FC<MyComponentProps> = ({ title }) => {
  return <div>{title}</div>;
};

export default MyComponent;
```

#### Usar un Hook

```tsx
import { useEvents } from './hooks';

const MyComponent = () => {
  const { events, loading, createEvent } = useEvents(userId);

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

#### Llamar a la API

```tsx
import * as api from './services/apiService';

const handleCreate = async () => {
  try {
    const event = await api.saveEvent({
      title: 'Mi Evento',
      location: 'Cafetería',
      date: new Date().toISOString(),
      description: 'Descripción',
    });
  } catch (error) {
    console.error('Error:', error);
  }
};
```

---

## 🛠️ Scripts Disponibles

### Frontend

```bash
npm run dev          # Inicia servidor de desarrollo
npm run build        # Build de producción
npm run preview      # Preview del build
npm run lint         # Ejecuta linter
```

### Backend

```bash
npm start            # Inicia servidor (producción)
npm run dev          # Inicia con watch mode (desarrollo)
node makeAdmin.js    # Convierte usuario en admin
```

---

## 🔧 Tecnologías

### Frontend

| Tecnología   | Versión | Uso              |
| ------------ | ------- | ---------------- |
| React        | 19.2.3  | Framework UI     |
| TypeScript   | 5.8.2   | Type safety      |
| Vite         | 6.2.0   | Build tool       |
| Tailwind CSS | Latest  | Estilos          |
| date-fns     | 4.1.0   | Manejo de fechas |
| lucide-react | 0.561.0 | Iconos           |

### Backend

| Tecnología | Versión | Uso               |
| ---------- | ------- | ----------------- |
| Node.js    | 18+     | Runtime           |
| Express    | 4.18.2  | Web framework     |
| MongoDB    | 7+      | Base de datos     |
| Mongoose   | 8.20.3  | ODM               |
| JWT        | 9.0.2   | Autenticación     |
| bcrypt     | 2.4.3   | Hashing passwords |

---

## 🤝 Contribuir

### Workflow

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Guías de Estilo

#### TypeScript

```typescript
// Siempre tipar props
interface Props {
  name: string;
  onClick: () => void;
}

// Usar const para componentes
const MyComponent: React.FC<Props> = ({ name, onClick }) => {
  return <button onClick={onClick}>{name}</button>;
};
```

#### Commits

Seguir [Conventional Commits](https://www.conventionalcommits.org/):

```bash
feat: Agregar panel de administración
fix: Corregir error en login
docs: Actualizar README
style: Formatear código
refactor: Refactorizar componentes de eventos
test: Agregar tests para useAuth
```

### Reportar Bugs

Abre un issue con:

- Descripción clara del bug
- Pasos para reproducir
- Comportamiento esperado vs actual
- Screenshots si aplica
- Versión del navegador/Node.js

---

## 📝 Roadmap

- [ ] Tests unitarios y de integración
- [ ] Sistema de notificaciones en tiempo real
- [ ] Upload de imágenes para eventos
- [ ] Filtros y búsqueda avanzada
- [ ] Sistema de ratings para eventos
- [ ] Integración con BoardGameGeek API
- [ ] PWA (Progressive Web App)
- [ ] Modo oscuro
- [ ] Internacionalización (i18n)
- [ ] Exportar eventos a calendario

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más información.

---

## 👨‍💻 Autor

**Fabrizio Camaggi**

- GitHub: [@FCamaggi](https://github.com/FCamaggi)
- Email: tu-email@example.com

---

## 🙏 Agradecimientos

- Comunidad de React y TypeScript
- Todos los jugadores de mesa que inspiraron este proyecto
- Contribuidores y testers

---

## 📞 Soporte

Si tienes preguntas o problemas:

1. Revisa la [documentación](docs/)
2. Busca en [Issues](https://github.com/FCamaggi/Ludorganizador/issues)
3. Abre un nuevo issue si no encuentras solución

---

## 🔗 Enlaces Útiles

- [Documentación de API](docs/API.md)
- [Guía de Frontend](docs/FRONTEND.md)
- [Guía de Arquitectura](docs/ARCHITECTURE.md)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [MongoDB Docs](https://docs.mongodb.com/)

---

<div align="center">

**⭐ Si te gusta este proyecto, dale una estrella en GitHub ⭐**

Hecho con ❤️ y 🎲

</div>
