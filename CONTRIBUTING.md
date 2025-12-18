# Contribuir a Ludorganizador

¡Gracias por tu interés en contribuir a Ludorganizador! Este documento proporciona guías para contribuir al proyecto.

## 📋 Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [¿Cómo puedo contribuir?](#cómo-puedo-contribuir)
- [Configuración del Entorno de Desarrollo](#configuración-del-entorno-de-desarrollo)
- [Guías de Estilo](#guías-de-estilo)
- [Proceso de Pull Request](#proceso-de-pull-request)
- [Reportar Bugs](#reportar-bugs)
- [Sugerir Mejoras](#sugerir-mejoras)

---

## Código de Conducta

Este proyecto se adhiere a un código de conducta. Al participar, se espera que mantengas un comportamiento respetuoso.

### Nuestros Estándares

**Comportamientos que contribuyen a crear un ambiente positivo:**

- Uso de lenguaje acogedor e inclusivo
- Respeto a diferentes puntos de vista y experiencias
- Aceptación de críticas constructivas
- Enfoque en lo mejor para la comunidad

**Comportamientos inaceptables:**

- Uso de lenguaje o imágenes sexualizadas
- Trolling, comentarios insultantes o ataques personales
- Acoso público o privado
- Publicar información privada de otros sin permiso

---

## ¿Cómo puedo contribuir?

### Reportar Bugs

Los bugs se rastrean como [GitHub issues](https://github.com/FCamaggi/Ludorganizador/issues). Crea un issue y proporciona la siguiente información:

- **Título claro y descriptivo**
- **Pasos para reproducir** el problema
- **Comportamiento esperado** vs **comportamiento actual**
- **Screenshots** si es posible
- **Versión** del navegador/Node.js
- **Contexto adicional** que pueda ser útil

### Sugerir Mejoras

Las sugerencias de mejora también se rastrean como issues. Cuando crees un issue para una mejora:

- **Usa un título claro y descriptivo**
- **Proporciona una descripción detallada** de la mejora sugerida
- **Explica por qué esta mejora sería útil**
- **Lista ejemplos** de cómo funcionaría

### Tu Primera Contribución de Código

¿No sabes por dónde empezar? Busca issues etiquetados como:

- `good first issue` - Issues apropiados para principiantes
- `help wanted` - Issues donde se necesita ayuda

---

## Configuración del Entorno de Desarrollo

### Prerequisitos

- Node.js 18+
- MongoDB 7+
- Git

### Setup

1. **Fork el repositorio**

2. **Clona tu fork**

   ```bash
   git clone https://github.com/TU_USUARIO/Ludorganizador.git
   cd Ludorganizador
   ```

3. **Configura el remote upstream**

   ```bash
   git remote add upstream https://github.com/FCamaggi/Ludorganizador.git
   ```

4. **Instala dependencias**

   ```bash
   # Frontend
   npm install

   # Backend
   cd server
   npm install
   cd ..
   ```

5. **Configura variables de entorno**

   ```bash
   cp .env.example .env
   cp server/.env.example server/.env
   # Edita los archivos .env con tus configuraciones
   ```

6. **Inicia MongoDB**

   ```bash
   # En macOS con Homebrew
   brew services start mongodb-community

   # En Linux
   sudo systemctl start mongod

   # O usa MongoDB Atlas
   ```

7. **Inicia el proyecto**

   ```bash
   # Terminal 1 - Frontend
   npm run dev

   # Terminal 2 - Backend
   cd server && npm run dev
   ```

---

## Guías de Estilo

### Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```
<tipo>[alcance opcional]: <descripción>

[cuerpo opcional]

[footer opcional]
```

**Tipos:**

- `feat`: Nueva característica
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `style`: Cambios de formato (no afectan el código)
- `refactor`: Refactorización de código
- `test`: Agregar o modificar tests
- `chore`: Tareas de mantenimiento

**Ejemplos:**

```bash
feat: agregar filtro de búsqueda de eventos
fix: corregir error en login cuando password es incorrecto
docs: actualizar README con instrucciones de instalación
refactor: extraer lógica de autenticación a hook personalizado
```

### Código TypeScript/JavaScript

```typescript
// ✅ Bueno
interface UserProps {
  name: string;
  email: string;
  onUpdate: (user: User) => void;
}

const UserCard: React.FC<UserProps> = ({ name, email, onUpdate }) => {
  return (
    <div className="user-card">
      <h3>{name}</h3>
      <p>{email}</p>
    </div>
  );
};

export default UserCard;
```

**Reglas:**

- Siempre usar TypeScript
- Tipar todas las props e interfaces
- Usar `const` para componentes
- Nombres descriptivos en camelCase
- Componentes en PascalCase
- Un componente por archivo
- Exportar como default al final

### Estilos (Tailwind CSS)

```tsx
// ✅ Bueno - Clases ordenadas y agrupadas
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">

// ❌ Malo - Desordenado
<div className="p-4 flex shadow-md bg-white rounded-lg justify-between items-center">
```

**Orden sugerido:**

1. Layout (flex, grid, block)
2. Posicionamiento (relative, absolute)
3. Tamaño (w-, h-, max-, min-)
4. Espaciado (p-, m-)
5. Tipografía (text-, font-)
6. Visual (bg-, border-, shadow-)
7. Interactividad (hover:, focus:, transition-)

### Estructura de Carpetas

```
src/
├── components/
│   ├── [dominio]/
│   │   ├── Component.tsx      # Componente
│   │   ├── Component.test.tsx # Tests (si aplica)
│   │   └── index.ts           # Barrel export
```

---

## Proceso de Pull Request

1. **Crea una rama desde main**

   ```bash
   git checkout -b feature/mi-nueva-caracteristica
   ```

2. **Haz tus cambios**

   - Escribe código limpio y bien documentado
   - Sigue las guías de estilo
   - Agrega tests si es posible

3. **Commit tus cambios**

   ```bash
   git add .
   git commit -m "feat: agregar nueva característica X"
   ```

4. **Sincroniza con upstream**

   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

5. **Push a tu fork**

   ```bash
   git push origin feature/mi-nueva-caracteristica
   ```

6. **Abre un Pull Request**
   - Usa un título claro y descriptivo
   - Describe los cambios realizados
   - Referencia issues relacionados (#123)
   - Incluye screenshots si hay cambios visuales

### Template de Pull Request

```markdown
## Descripción

[Describe brevemente los cambios]

## Tipo de cambio

- [ ] Bug fix
- [ ] Nueva característica
- [ ] Breaking change
- [ ] Documentación

## ¿Cómo se ha probado?

[Describe las pruebas realizadas]

## Checklist

- [ ] Mi código sigue las guías de estilo del proyecto
- [ ] He realizado una auto-revisión de mi código
- [ ] He comentado mi código, especialmente en áreas complejas
- [ ] He actualizado la documentación correspondiente
- [ ] Mis cambios no generan nuevas advertencias
- [ ] He agregado tests que prueban que mi fix es efectivo o que mi característica funciona

## Screenshots (si aplica)

[Agrega screenshots]

## Issues relacionados

Fixes #[número_de_issue]
```

---

## Reportar Bugs

### Antes de reportar

1. **Verifica que el bug no haya sido reportado** buscando en issues
2. **Asegúrate de estar usando la última versión**
3. **Determina si es realmente un bug** y no un error de configuración

### Template de Bug Report

```markdown
## Descripción del Bug

[Descripción clara y concisa]

## Pasos para Reproducir

1. Ve a '...'
2. Haz click en '...'
3. Scroll hasta '...'
4. Ver error

## Comportamiento Esperado

[Qué esperabas que pasara]

## Comportamiento Actual

[Qué pasó realmente]

## Screenshots

[Si aplica]

## Entorno

- OS: [e.g. Windows 11, macOS 14]
- Navegador: [e.g. Chrome 120, Firefox 121]
- Node.js: [e.g. 18.17.0]
- Versión del proyecto: [e.g. 1.0.0]

## Información Adicional

[Cualquier otro contexto sobre el problema]

## Logs de error
```

[Pega logs relevantes aquí]

```

```

---

## Sugerir Mejoras

### Template de Feature Request

```markdown
## ¿Tu feature request está relacionado a un problema?

[Descripción clara del problema]

## Describe la solución que te gustaría

[Descripción clara y concisa de lo que quieres que pase]

## Describe alternativas que has considerado

[Descripción de soluciones o features alternativas]

## Contexto adicional

[Agrega cualquier contexto o screenshots sobre el feature request]

## Beneficios

[Cómo beneficiaría esto al proyecto]
```

---

## Áreas donde se necesita ayuda

### Frontend

- [ ] Implementar tests con Vitest
- [ ] Mejorar accesibilidad (a11y)
- [ ] Optimizar rendimiento
- [ ] Implementar PWA
- [ ] Agregar modo oscuro

### Backend

- [ ] Implementar tests de integración
- [ ] Agregar rate limiting
- [ ] Implementar caché
- [ ] Mejorar logs y monitoring
- [ ] Documentar endpoints con Swagger

### Documentación

- [ ] Agregar más ejemplos de código
- [ ] Crear videos tutoriales
- [ ] Traducir documentación
- [ ] Mejorar diagramas

### DevOps

- [ ] Configurar CI/CD
- [ ] Dockerización
- [ ] Scripts de deployment
- [ ] Monitoring y alertas

---

## Recursos

- [Documentación de React](https://react.dev)
- [Documentación de TypeScript](https://www.typescriptlang.org/docs/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://docs.mongodb.com/)

---

## Preguntas

Si tienes preguntas, puedes:

1. Abrir un issue con la etiqueta `question`
2. Revisar issues cerrados que puedan responder tu pregunta
3. Contactar a los maintainers

---

## Reconocimientos

Los contribuidores son reconocidos en:

- Lista de contributors en GitHub
- CONTRIBUTORS.md (si existe)
- Release notes cuando aplique

---

¡Gracias por contribuir a Ludorganizador! 🎲
