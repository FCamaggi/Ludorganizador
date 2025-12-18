# 🎲 Ludorganizador

Sistema completo de gestión de eventos de juegos de mesa con arquitectura moderna y modular.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7+-47A248)](https://www.mongodb.com/)

> ⚠️ **IMPORTANTE:** Este proyecto ha sido completamente refactorizado. Ver [Resumen de Refactorización](docs/REFACTORING_SUMMARY.md) para detalles.

## 📚 Documentación Completa

Este proyecto cuenta con documentación exhaustiva:

- 📖 **[Índice de Documentación](docs/INDEX.md)** - Guía de toda la documentación
- 🏗️ **[Arquitectura](docs/ARCHITECTURE.md)** - Diseño y patrones del sistema
- 🗺️ **[Mapas Visuales](docs/ARCHITECTURE_MAP.md)** - Diagramas de arquitectura
- 💻 **[Frontend](docs/FRONTEND.md)** - Componentes, hooks y servicios
- 🔌 **[API](docs/API.md)** - Documentación completa de endpoints
- 🔄 **[Migración](docs/MIGRATION.md)** - Guía de migración a nueva estructura
- 📝 **[Comandos](docs/COMMANDS.md)** - Referencia rápida de comandos
- 🤝 **[Contribuir](CONTRIBUTING.md)** - Guía de contribución

## ✨ Características

### Para Usuarios

- 🎯 Crear y gestionar eventos de juegos de mesa
- 🎲 Organizar mesas con límites de jugadores
- 👥 Sistema de registro en mesas
- 📚 Compartir ludoteca personal
- 🔒 Eventos privados con contraseña
- 📱 Interfaz responsive

### Para Desarrolladores

- 🏗️ Arquitectura modular y escalable
- 🔧 Separación clara de responsabilidades
- 📦 Componentes reutilizables
- 🎣 Custom hooks para lógica de negocio
- 🔌 Capa de servicios para API
- 📘 TypeScript en todo el proyecto
- 📚 Documentación exhaustiva (200+ KB)

## 🏗️ Tecnologías

### Frontend

- React 19 + TypeScript 5.8
- Vite 6 (build tool)
- Tailwind CSS
- Custom Hooks Pattern
- Service Layer Pattern

### Backend

- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- bcrypt para hashing

## 🚀 Inicio Rápido

### Instalación

```bash
# Clonar repositorio
git clone https://github.com/FCamaggi/Ludorganizador.git
cd Ludorganizador

# Instalar dependencias
npm install
cd server && npm install && cd ..

# Configurar variables de entorno
cp .env.example .env
cp server/.env.example server/.env

# Editar archivos .env con tus configuraciones
```

### Desarrollo

```bash
# Terminal 1 - Frontend (puerto 5173)
npm run dev

# Terminal 2 - Backend (puerto 3001)
cd server && npm run dev
```

> 📖 Para más detalles, ver [Guía de Comandos](docs/COMMANDS.md)

## 📁 Estructura del Proyecto (Refactorizada)

```
Ludorganizador/
├── src/                      # Frontend (NUEVO)
│   ├── components/
│   │   ├── ui/              # Componentes base
│   │   ├── auth/            # Autenticación
│   │   ├── events/          # Eventos
│   │   ├── tables/          # Mesas
│   │   └── admin/           # Admin
│   ├── hooks/               # Custom hooks (NUEVO)
│   ├── services/            # API services (REFACTORIZADO)
│   ├── types/               # TypeScript types
│   ├── utils/               # Utilidades (NUEVO)
│   └── constants/           # Constantes (NUEVO)
├── server/                  # Backend
│   ├── config/              # Configuración (NUEVO)
│   ├── controllers/         # Controllers
│   ├── middleware/          # Auth, admin
│   ├── models/              # Mongoose models
│   └── routes/              # API routes
└── docs/                    # Documentación (NUEVO)
    ├── INDEX.md             # Índice de docs
    ├── ARCHITECTURE.md      # Arquitectura
    ├── API.md               # API docs
    └── FRONTEND.md          # Frontend guide
```

## 🔐 Seguridad

- ✅ Autenticación JWT
- ✅ Contraseñas hasheadas con bcrypt
- ✅ Eventos privados con contraseña
- ✅ Validación de inputs
- ✅ Autorización por roles (user/admin)

## 📝 Scripts Disponibles

```bash
# Frontend
npm run dev          # Desarrollo
npm run build        # Build producción
npm run preview      # Preview build

# Backend
cd server
npm run dev          # Desarrollo con watch
npm start            # Producción
node makeAdmin.js    # Hacer admin a usuario
```

## 🎯 Características Principales

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

Para la documentación completa de la API, consulta [docs/API.md](docs/API.md).

## 📚 Recursos Adicionales

- **[Documentación Completa](docs/INDEX.md)** - Índice de toda la documentación
- **[Guía de Migración](docs/MIGRATION.md)** - Pasos para migrar código antiguo
- **[Guía de Arquitectura](docs/ARCHITECTURE.md)** - Patrones y decisiones de diseño
- **[Referencia de Comandos](docs/COMMANDS.md)** - Comandos útiles para desarrollo

## 🤝 Contribuir

Lee [CONTRIBUTING.md](CONTRIBUTING.md) para conocer las guías de contribución, estándares de código y el proceso de pull requests.

## 📄 Licencia

MIT

---

**Nota**: Este proyecto ha sido completamente refactorizado para mejorar la modularidad, separación de responsabilidades y mantenibilidad. Consulta [docs/REFACTORING_SUMMARY.md](docs/REFACTORING_SUMMARY.md) para detalles sobre los cambios realizados.
