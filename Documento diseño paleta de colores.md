# Estrategia de Diseño: Comunidad de Juegos de Mesa

## 1. Definición de la Paleta y Roles

Aunque tu imagen tiene 5 colores, para una web los organizaremos por jerarquía:

| **Color**      | **Hex**   | **Nombre**    | **Función Sugerida**                                        |
| -------------- | --------- | ------------- | ----------------------------------------------------------- |
| **Primario**   | `#FFBC0A` | Amber Flame   | **Identidad:**Logos, íconos principales, bordes de cartas.  |
| **Secundario** | `#EC7D10` | Tiger Orange  | **Navegación:**Fondos de cabeceras o secciones secundarias. |
| **Acento A**   | `#FC2F00` | Scarlet Fire  | **Acción:**Botones de "Unirse", "Comprar" o "Jugar".        |
| **Acento B**   | `#EC0868` | Razzmatazz    | **Interacción:**Hover de botones o indicadores de "Nuevo".  |
| **Destacado**  | `#C200FB` | Hyper Magenta | **Comunidad:**Roles de usuario, chats o eventos especiales. |

---

## 2. Distribución de Espacio (%)

Para que los colores "respiren", necesitamos un color base neutro (Blanco roto o Gris muy oscuro).

- **60% Base Neutra:** Fondo de la página y áreas de lectura (recomiendo un **Blanco Hueso** o **Gris Oscuro #1A1A1A** para modo noche).
- **20% Tiger Orange & Amber Flame:** Bloques de contenido, sidebars y headers.
- **10% Scarlet Fire:** Llamados a la acción (CTAs) y botones críticos.
- **10% Razzmatazz & Hyper Magenta:** Detalles, insignias de nivel, notificaciones y elementos de "gamificación".

---

## 3. Guía de Elementos UI

### A. Botones y CTAs

- **Botón Principal (Primario):** Fondo `#FC2F00` (Scarlet Fire) con texto blanco. Al pasar el mouse (hover), cambiar a `#EC0868` (Razzmatazz).
- **Botón Secundario:** Fondo transparente con borde de 2px en `#FFBC0A` (Amber Flame).

### B. Navegación (Header)

- **Fondo:** `#EC7D10` (Tiger Orange).
- **Links:** Texto en Blanco.
- **Link Activo:** Subrayado grueso en `#C200FB` (Hyper Magenta).

### C. Tarjetas de Juego (Cards)

- **Borde superior:** Una línea de 4px con el color del tipo de juego (ej: Magenta para "Estrategia", Naranja para "Party Games").
- **Sombra:** Usar una sombra muy suave con un toque de `#EC7D10` para dar profundidad sin ensuciar.

### D. Tipografía

- **Títulos (H1, H2):** Usar `#FC2F00` para títulos cortos y potentes.
- **Cuerpo de texto:** Siempre Negro o Gris muy oscuro sobre fondo claro para legibilidad. **Nunca** uses estos colores vibrantes para párrafos largos.

---

## 4. Aplicación Temática (Gamificación)

Como es una comunidad de juegos de mesa, puedes usar los colores para categorizar:

- **Noticias/Blog:** Usar la gama de los **Naranjas** .
- **Foro/Discusión:** Usar el **Magenta** (Hyper Magenta).
- **Torneos/Eventos:** Usar el **Rojo** (Scarlet Fire).

---

## 5. Consideraciones de Accesibilidad

- **Contraste:** Los colores naranja y amarillo (`#FFBC0A`) tienen poco contraste con el blanco. **No uses texto blanco sobre amarillo.** Usa texto negro o un color muy oscuro para que sea legible.
- **Descanso Visual:** Asegúrate de dejar mucho "espacio en blanco" entre secciones. Esta paleta es "caliente", por lo que demasiado color junto puede cansar al usuario tras 10 minutos de lectura.

---
