# 📚 Índice de Documentación - Ludorganizador

Bienvenido a la documentación completa de Ludorganizador. Esta guía te ayudará a navegar por toda la documentación disponible.

---

## 🚀 Para Empezar

### 1. README Principal

**Ubicación:** `docs/README_NUEVO.md`

**Contenido:**

- Descripción general del proyecto
- Características principales
- Instalación rápida
- Tecnologías utilizadas
- Scripts disponibles

**Ideal para:** Primeros pasos con el proyecto

---

### 2. Guía Rápida de Comandos

**Ubicación:** `docs/COMMANDS.md`

**Contenido:**

- Comandos de instalación
- Comandos de desarrollo
- Comandos de MongoDB
- Comandos de Git
- Scripts útiles

**Ideal para:** Referencia rápida de comandos

---

## 🏗️ Arquitectura y Diseño

### 3. Guía de Arquitectura

**Ubicación:** `docs/ARCHITECTURE.md`  
**Tamaño:** ~57 KB

**Contenido:**

- Visión general del sistema
- Estructura del proyecto
- Patrones de diseño implementados
- Separación de responsabilidades
- Flujos principales
- Guía de refactorización completa

**Ideal para:**

- Entender el diseño del sistema
- Aprender patrones de diseño aplicados
- Planificar nuevas features
- Onboarding de desarrolladores

---

### 4. Mapa Visual de Arquitectura

**Ubicación:** `docs/ARCHITECTURE_MAP.md`

**Contenido:**

- Diagramas de arquitectura
- Flujos de datos visuales
- Estructura de componentes
- Ciclo de vida de requests
- Mapa de dependencias

**Ideal para:**

- Visualizar el sistema completo
- Debuggear problemas
- Entender flujos de datos

---

## 💻 Desarrollo Frontend

### 5. Guía de Frontend

**Ubicación:** `docs/FRONTEND.md`  
**Tamaño:** ~52 KB

**Contenido:**

- Estructura de carpetas
- Componentes documentados
- Custom hooks con ejemplos
- Servicios de API
- Utilidades y helpers
- Guía de desarrollo
- Mejores prácticas
- Testing (recomendaciones)

**Ideal para:**

- Desarrollar nuevos componentes
- Usar hooks personalizados
- Integrar con la API
- Seguir estándares de código

**Secciones principales:**

1. Arquitectura del Frontend
2. Componentes UI Base
3. Custom Hooks (useAuth, useEvents, etc.)
4. Servicios (apiService)
5. Utilidades (dateUtils, validators)
6. Guía de desarrollo paso a paso

---

## 🔌 API Backend

### 6. Documentación de API

**Ubicación:** `docs/API.md`  
**Tamaño:** ~48 KB

**Contenido:**

- Descripción de todos los endpoints
- Autenticación con JWT
- Modelos de datos
- Ejemplos de requests/responses
- Códigos de error
- Flujos completos

**Ideal para:**

- Integrar con el backend
- Entender la API REST
- Debuggear problemas de API
- Implementar nuevos endpoints

**Endpoints documentados:**

- Auth (login, register)
- Events (CRUD completo)
- Tables (crear, unirse, salir)
- Games (juegos libres)
- Admin (panel de administración)

---

## 🔄 Migración y Refactorización

### 7. Guía de Migración

**Ubicación:** `docs/MIGRATION.md`

**Contenido:**

- Cambios en imports
- Actualización de rutas
- Migración de lógica a hooks
- Uso de constantes
- Checklist completo
- Solución de problemas

**Ideal para:**

- Migrar del código antiguo al nuevo
- Actualizar componentes existentes
- Resolver errores de migración

---

### 8. Resumen de Refactorización

**Ubicación:** `docs/REFACTORING_SUMMARY.md`

**Contenido:**

- Objetivo de la refactorización
- Cambios implementados
- Nueva estructura
- Componentes creados
- Documentación creada
- Métricas de mejora
- Próximos pasos

**Ideal para:**

- Entender qué cambió
- Ver el progreso general
- Planificar siguientes pasos

---

## 🤝 Contribución

### 9. Guía de Contribución

**Ubicación:** `CONTRIBUTING.md`

**Contenido:**

- Código de conducta
- Cómo contribuir
- Setup del entorno
- Guías de estilo
- Proceso de Pull Request
- Reportar bugs
- Templates de issues

**Ideal para:**

- Contribuidores nuevos
- Entender el workflow
- Estándares de código
- Reportar problemas

---

## 📋 Archivos de Configuración

### 10. Variables de Entorno

#### Frontend (`.env.example`)

```env
VITE_API_URL=http://localhost:3001/api
```

#### Backend (`server/.env.example`)

```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/ludorganizador
JWT_SECRET=tu_secreto_seguro
NODE_ENV=development
CORS_ORIGIN=*
```

---

## 🗂️ Estructura Completa de Documentación

```
docs/
├── README_NUEVO.md           # README principal actualizado
├── ARCHITECTURE.md           # Arquitectura completa
├── ARCHITECTURE_MAP.md       # Mapas visuales
├── API.md                    # Documentación de API
├── FRONTEND.md               # Guía de Frontend
├── MIGRATION.md              # Guía de migración
├── REFACTORING_SUMMARY.md    # Resumen de refactorización
├── COMMANDS.md               # Comandos útiles
└── INDEX.md                  # Este archivo
```

---

## 📖 Guías por Nivel

### 🌱 Principiante

**Empezar aquí:**

1. `README_NUEVO.md` - Descripción general
2. `COMMANDS.md` - Comandos básicos
3. `FRONTEND.md` (sección "Guía de Desarrollo")

**Objetivos:**

- Instalar y ejecutar el proyecto
- Entender la estructura básica
- Hacer tu primer cambio

---

### 🌿 Intermedio

**Leer después:**

1. `FRONTEND.md` (completo)
2. `API.md` (endpoints principales)
3. `ARCHITECTURE_MAP.md`

**Objetivos:**

- Crear nuevos componentes
- Usar hooks personalizados
- Integrar con la API
- Entender flujos de datos

---

### 🌳 Avanzado

**Profundizar en:**

1. `ARCHITECTURE.md` (completo)
2. `API.md` (completo)
3. `MIGRATION.md`
4. `REFACTORING_SUMMARY.md`

**Objetivos:**

- Refactorizar código existente
- Implementar nuevos patrones
- Optimizar rendimiento
- Contribuir mejoras arquitectónicas

---

## 🎯 Guías por Objetivo

### Quiero crear un componente nuevo

→ `FRONTEND.md` (sección "Crear un Nuevo Componente")  
→ `ARCHITECTURE.md` (sección "Component Composition")

### Quiero integrar con la API

→ `API.md` (endpoints relevantes)  
→ `FRONTEND.md` (sección "Servicios")

### Quiero entender el flujo de datos

→ `ARCHITECTURE_MAP.md` (diagramas de flujo)  
→ `ARCHITECTURE.md` (sección "Flujos Principales")

### Quiero migrar código antiguo

→ `MIGRATION.md` (guía completa)  
→ `REFACTORING_SUMMARY.md` (contexto)

### Quiero agregar un endpoint nuevo

→ `API.md` (ejemplos de endpoints)  
→ `FRONTEND.md` (sección "Agregar un Nuevo Endpoint")

### Quiero contribuir al proyecto

→ `CONTRIBUTING.md` (proceso completo)  
→ `ARCHITECTURE.md` (entender el diseño)

---

## 📚 Recursos Adicionales

### Documentación Externa

**React & TypeScript:**

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

**Backend:**

- [Express.js Guide](https://expressjs.com/)
- [MongoDB Manual](https://docs.mongodb.com/)
- [Mongoose Docs](https://mongoosejs.com/docs/)

**Herramientas:**

- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

---

## 🔍 Índice Temático

### Autenticación

- API.md → "Auth" section
- FRONTEND.md → "useAuth hook"
- ARCHITECTURE_MAP.md → "Flujo de Autenticación"

### Eventos

- API.md → "Events" section
- FRONTEND.md → "useEvents hook"
- FRONTEND.md → "EventCard component"

### Mesas de Juego

- API.md → "Tables" section
- FRONTEND.md → "useTables hook"
- FRONTEND.md → "GameTableCard component"

### Componentes UI

- FRONTEND.md → "Componentes UI Base"
- ARCHITECTURE.md → "Component Composition Pattern"

### Hooks Personalizados

- FRONTEND.md → "Hooks Personalizados" (completo)
- ARCHITECTURE.md → "Custom Hooks Pattern"

### Servicios de API

- FRONTEND.md → "Servicios" section
- API.md → todos los endpoints
- ARCHITECTURE.md → "Service Layer Pattern"

### Patrones de Diseño

- ARCHITECTURE.md → "Patrones de Diseño" (completo)
- FRONTEND.md → "Mejores Prácticas"

---

## ✅ Checklist de Lectura

Para un onboarding completo, te recomendamos leer en este orden:

### Día 1: Fundamentos

- [ ] README_NUEVO.md
- [ ] COMMANDS.md (referencia)
- [ ] Instalar y ejecutar el proyecto

### Día 2-3: Frontend

- [ ] FRONTEND.md (completo)
- [ ] ARCHITECTURE_MAP.md (diagramas)
- [ ] Crear un componente de prueba

### Día 4-5: Backend & API

- [ ] API.md (endpoints principales)
- [ ] Hacer requests de prueba
- [ ] Crear un hook personalizado

### Día 6-7: Arquitectura

- [ ] ARCHITECTURE.md (completo)
- [ ] REFACTORING_SUMMARY.md
- [ ] Refactorizar un componente

### Día 8+: Contribución

- [ ] CONTRIBUTING.md
- [ ] MIGRATION.md (si aplica)
- [ ] Hacer tu primera contribución

---

## 🆘 Necesito Ayuda Con...

### "No entiendo cómo funciona X"

1. Busca en el índice temático arriba
2. Lee la sección relevante
3. Revisa los ejemplos de código
4. Consulta ARCHITECTURE_MAP.md para visualizar

### "Quiero implementar Y"

1. Busca "Quiero..." en "Guías por Objetivo"
2. Sigue la documentación paso a paso
3. Revisa ejemplos similares en el código
4. Consulta CONTRIBUTING.md si vas a hacer PR

### "Encontré un error"

1. Revisa COMMANDS.md (Solución de Problemas)
2. Consulta MIGRATION.md (si migraste código)
3. Abre un issue según CONTRIBUTING.md

---

## 📞 Contacto y Soporte

- **Issues:** [GitHub Issues](https://github.com/FCamaggi/Ludorganizador/issues)
- **Discusiones:** [GitHub Discussions](https://github.com/FCamaggi/Ludorganizador/discussions)
- **Email:** [tu-email@example.com](mailto:tu-email@example.com)

---

## 🎓 Tips de Navegación

### Búsqueda Rápida

```bash
# Buscar en toda la documentación
grep -r "término" docs/

# Buscar solo en títulos
grep -r "^#" docs/ | grep "término"
```

### Lectura en VS Code

1. Abre la carpeta `docs/` en VS Code
2. Usa Cmd+P / Ctrl+P para buscar archivos
3. Usa Cmd+Shift+F / Ctrl+Shift+F para buscar en archivos

### Lectura en GitHub

- Navega a la carpeta `docs/`
- GitHub renderiza Markdown automáticamente
- Usa la búsqueda de GitHub para encontrar contenido

---

## 📊 Estadísticas de Documentación

- **Archivos de documentación:** 9
- **Tamaño total:** ~200 KB
- **Páginas equivalentes:** ~150
- **Ejemplos de código:** 100+
- **Diagramas:** 10+

---

¡Feliz lectura y desarrollo! 🎲

_Última actualización: Diciembre 2025_
