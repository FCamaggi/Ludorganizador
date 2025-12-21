# Implementación de Tema Oscuro/Claro y Paleta de Colores Completa

## 🎨 Resumen

Se ha implementado un sistema completo de temas (oscuro y claro) con toggle en el header, y se ha aplicado **toda la paleta de colores** de forma coherente en todos los componentes de la aplicación.

---

## 📋 Cambios Realizados

### 1. Sistema de Temas

#### ThemeContext (`src/contexts/ThemeContext.tsx`) ✨ NUEVO

- Provider que maneja el estado del tema
- Persistencia en localStorage
- Hook `useTheme()` para acceder al tema en cualquier componente
- Toggle entre 'light' y 'dark'

#### theme.ts (`src/constants/theme.ts`) ✨ NUEVO

Definición completa de ambos temas:

**Tema Claro:**

```typescript
{
  primary: '#FFBC0A',      // Amber Flame
  secondary: '#EC7D10',    // Tiger Orange
  action: '#FC2F00',       // Scarlet Fire
  interaction: '#EC0868',  // Razzmatazz
  community: '#C200FB',    // Hyper Magenta

  bg: { primary: '#FFFFFF', secondary: '#F9FAFB', ... },
  text: { primary: '#111827', secondary: '#4B5563', ... },
  border: { light: '#E5E7EB', medium: '#D1D5DB', ... },
}
```

**Tema Oscuro:**

```typescript
{
  // Mismos colores de paleta (más vibrantes)
  bg: { primary: '#0F172A', secondary: '#1E293B', ... },  // slate
  text: { primary: '#F1F5F9', secondary: '#CBD5E1', ... },
  border: { light: '#334155', medium: '#475569', ... },
}
```

---

### 2. Aplicación de Paleta Completa

#### 🎴 GameTableCard

**ANTES:** Gradiente indigo-purple (colores antiguos)

```tsx
bg-gradient-to-r from-indigo-500 to-purple-600
```

**AHORA:** Tiger Orange → Razzmatazz ✅

```tsx
linear-gradient(135deg, ${theme.secondary} 0%, ${theme.interaction} 100%)
```

**Distribución de colores:**

- Header: Tiger Orange (#EC7D10) + Razzmatazz (#EC0868)
- Jugador activo: Razzmatazz (#EC0868) - punto de color
- Host: Tiger Orange (#EC7D10)
- Badges: Cada tipo usa un color de la paleta
  - Veterano: Hyper Magenta (#C200FB)
  - VIP: Amber Flame (#FFBC0A)
  - Organizador: Tiger Orange (#EC7D10)
  - Fundador: Razzmatazz (#EC0868)

#### 🎫 EventCard

**Mejoras realizadas:**

- Header con gradiente: Amber Flame → Tiger Orange
- Icono de calendario: Scarlet Fire (#FC2F00)
- Lock (privado): Amber Flame (#FFBC0A)
- Admin badge: Fundador color (Razzmatazz)
- Badges personalizados con toda la paleta
- Soporte completo para tema oscuro

#### 🖱️ Button

- Mantiene colores vibrantes de la paleta
- Variante `outline` ahora respeta el tema (texto del tema, no gris fijo)
- Primary: Scarlet Fire (#FC2F00)
- Secondary: Tiger Orange (#EC7D10)

#### 📦 Modal

- Fondo adaptativo según tema
- Bordes que respetan colores del tema
- Botón de cierre con hover states temáticos

#### 🔐 AuthForm

- Inputs con fondos temáticos
- Bordes que cambian según el tema
- Textos y labels adaptativos
- Placeholder y iconos con colores terciarios del tema

---

### 3. Toggle de Tema en Header

**Ubicación:** Entre el nombre de usuario y el botón de refresh

```tsx
<button
  onClick={toggleTheme}
  className="text-white/80 hover:text-white transition-colors"
  title={themeMode === 'dark' ? 'Modo claro' : 'Modo oscuro'}
>
  {themeMode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
</button>
```

**Iconos:**

- Modo claro actual → Muestra 🌙 (cambiar a oscuro)
- Modo oscuro actual → Muestra ☀️ (cambiar a claro)

---

### 4. Componente Principal (App.tsx)

**Cambios aplicados:**

- Fondo dinámico según tema
- Banner de "usuario nuevo" con colores temáticos
- Transiciones suaves (duration-200)
- Header mantiene gradiente llamativo (siempre visible)

---

## 🎨 Paleta de Colores - Uso Coherente

### Distribución Semántica

| Color | Hex     | Nombre        | Uso Principal                                           |
| ----- | ------- | ------------- | ------------------------------------------------------- |
| 🟡    | #FFBC0A | Amber Flame   | **Primary** - Acentos, highlights, eventos              |
| 🟠    | #EC7D10 | Tiger Orange  | **Secondary** - Botones secundarios, headers de mesas   |
| 🔴    | #FC2F00 | Scarlet Fire  | **Action** - Botones principales, acciones críticas     |
| 💗    | #EC0868 | Razzmatazz    | **Interaction** - Estados activos, jugadores conectados |
| 💜    | #C200FB | Hyper Magenta | **Community** - Admin badges, elementos comunitarios    |

### Antes vs Ahora

**ANTES:**

- ❌ Solo se veía Amber Flame (#FFBC0A)
- ❌ GameTableCard usaba indigo-purple (NO de la paleta)
- ❌ Colores grises y azules genéricos
- ❌ No había tema oscuro

**AHORA:**

- ✅ **Todos los 5 colores** de la paleta están presentes
- ✅ GameTableCard usa Tiger Orange + Razzmatazz
- ✅ EventCard usa Amber Flame + Tiger Orange + Scarlet Fire
- ✅ Badges usan TODA la paleta (cada tipo un color)
- ✅ Tema oscuro completo y funcional
- ✅ Toggle visible y accesible

---

## 🚀 Archivos Modificados

### Nuevos Archivos

1. ✨ `src/contexts/ThemeContext.tsx` - Context provider de tema
2. ✨ `src/constants/theme.ts` - Definición de temas light/dark

### Archivos Actualizados

3. ✏️ `index.tsx` - Envuelve App con ThemeProvider
4. ✏️ `src/App.tsx` - Toggle de tema, fondo temático
5. ✏️ `src/components/tables/GameTableCard.tsx` - Paleta completa + tema
6. ✏️ `src/components/events/EventCard.tsx` - Paleta completa + tema
7. ✏️ `src/components/ui/Button.tsx` - Soporte para tema
8. ✏️ `src/components/ui/Modal.tsx` - Soporte para tema
9. ✏️ `src/components/auth/AuthForm.tsx` - Soporte para tema
10. ✏️ `src/constants/index.ts` - Export de theme

---

## 🎯 Cómo Usar

### Para Usuarios

1. **Cambiar tema:** Click en el botón ☀️/🌙 en el header (al lado del nombre de usuario)
2. **Persistencia:** El tema seleccionado se guarda en localStorage
3. **Colores:** Ahora verás toda la paleta de colores en:
   - Mesas de juego (naranja + magenta)
   - Eventos (amarillo + naranja + rojo)
   - Badges (todos los colores)

### Para Desarrolladores

```tsx
import { useTheme } from '../contexts/ThemeContext';
import { getTheme } from '../constants';

function MiComponente() {
  const { theme: themeMode, toggleTheme } = useTheme();
  const theme = getTheme(themeMode === 'dark');

  return (
    <div style={{ backgroundColor: theme.bg.primary }}>
      <h1 style={{ color: theme.text.primary }}>Hola</h1>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  );
}
```

---

## 🎨 Ejemplos Visuales

### Tema Claro

- Fondo: Blanco (#FFFFFF)
- Texto: Gris oscuro (#111827)
- Cards: Blanco con bordes suaves
- Header mesas: Gradiente naranja → magenta
- Events: Acentos amarillos y rojos

### Tema Oscuro

- Fondo: Slate-900 (#0F172A)
- Texto: Blanco (#F1F5F9)
- Cards: Slate-800 con bordes slate-700
- Header mesas: Mismo gradiente (más vibrante)
- Events: Mismos acentos (más brillantes)

---

## ✅ Verificación

- [x] Sistema de temas funcional
- [x] Toggle visible y accesible
- [x] Persistencia en localStorage
- [x] Paleta completa aplicada (5 colores)
- [x] GameTableCard rediseñado
- [x] EventCard mejorado
- [x] Todos los badges usan la paleta
- [x] Modal temático
- [x] Button temático
- [x] AuthForm temático
- [x] App container temático
- [x] Sin errores de TypeScript
- [x] Transiciones suaves

---

## 🔮 Notas Técnicas

- **Transiciones:** `duration-200` para cambios suaves de tema
- **Persistencia:** localStorage con key `ludorganizador_theme`
- **Default:** Tema claro por defecto
- **Clase dark:** Se agrega `dark` al `documentElement` automáticamente
- **Accesibilidad:** Contraste verificado en ambos temas

---

## 🎉 Resultado Final

La aplicación ahora tiene:

1. ✨ **Modo oscuro completo** con toggle instantáneo
2. 🎨 **Toda la paleta de colores visible** y coherente
3. 🎴 **Mesas con Tiger Orange** (ya no indigo-purple)
4. 🏷️ **Badges coloridos** usando los 5 colores
5. 🌓 **Persistencia de preferencia** del usuario
6. 🚀 **Experiencia visual mejorada** significativamente

**Fecha:** 21 de diciembre de 2025  
**Estado:** ✅ Completado e implementado
