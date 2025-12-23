# 🎲 Guía de Usuario de Ludorganizador

Bienvenido a **Ludorganizador**, tu plataforma para organizar y participar en eventos de juegos de mesa. Esta guía te ayudará a entender todo lo que puedes hacer en la aplicación.

## 📑 Índice

- [¿Qué es Ludorganizador?](#qué-es-ludorganizador)
- [Tipos de Usuarios](#tipos-de-usuarios)
- [Primeros Pasos](#primeros-pasos)
- [Vista Principal: Eventos](#vista-principal-eventos)
- [Vista de Detalle de Evento](#vista-de-detalle-de-evento)
- [Crear un Nuevo Evento](#crear-un-nuevo-evento)
- [Mesas de Juego](#mesas-de-juego)
- [Juegos Libres (Ludoteca)](#juegos-libres-ludoteca)
- [Panel de Administración](#panel-de-administración)
- [Características Especiales](#características-especiales)

---

## ¿Qué es Ludorganizador?

Ludorganizador es una aplicación web diseñada para facilitar la organización de eventos de juegos de mesa. Con ella puedes:

- 📅 **Crear eventos** en una fecha y lugar específicos
- 🎲 **Organizar mesas de juego** con juegos específicos
- 📚 **Compartir tu ludoteca** para partidas espontáneas
- 👥 **Registrarte en mesas** y conocer a otros jugadores
- 🔒 **Crear eventos privados** con contraseña

---

## Tipos de Usuarios

### 👤 Usuario Regular

Es el tipo de usuario estándar. Puedes:

- Ver todos los eventos públicos
- Crear tus propios eventos
- Crear mesas de juego
- Unirte a mesas
- Compartir tu ludoteca
- Editar o eliminar solo tu propio contenido

### 👑 Administrador

Tiene permisos especiales para:

- Eliminar cualquier evento, mesa o juego libre
- Acceder al Panel de Administración
- Ver estadísticas de la plataforma
- Gestionar usuarios y eventos archivados
- Se identifica con una insignia de **Admin** en sus contenidos

### 🏆 Usuarios con Insignias

Los usuarios pueden tener insignias especiales que se muestran junto a su nombre:

- **Veterano** 🎖️ - Jugador experimentado (color morado)
- **VIP** ⭐ - Usuario destacado (color amarillo)
- **Organizador** 📋 - Organizador de eventos (color naranja)
- **Fundador** 🏅 - Miembro fundador (color rosa)

---

## Primeros Pasos

### Pantalla de Inicio de Sesión

Al abrir la aplicación por primera vez, verás la pantalla de autenticación:

![Pantalla de Login](https://via.placeholder.com/800x500?text=Pantalla+de+Login)

#### Elementos de la Pantalla:

1. **Logo de Ludorganizador** 🎲

   - Un dado naranja en la parte superior

2. **Toggle de Tema** 🌙☀️

   - Botón en la esquina superior derecha
   - Cambia entre modo oscuro y modo claro
   - El modo que elijas se guardará para tus próximas visitas

3. **Iniciar Sesión** (pestaña por defecto)

   - **Usuario**: Tu nombre de usuario
   - **Contraseña**: Tu contraseña
   - **Botón "Entrar"**: Accede a la aplicación

4. **Crear Cuenta**
   - Haz clic en el enlace debajo del formulario
   - **Nombre completo**: Tu nombre real
   - **Usuario**: Elige un nombre de usuario único
   - **Contraseña**: Al menos 6 caracteres
   - **Confirmar contraseña**: Escribe la misma contraseña
   - **Botón "Crear Cuenta"**: Registra tu cuenta

**💡 Consejo**: Tu nombre de usuario será visible para otros usuarios, ¡elige uno que te represente!

---

## Vista Principal: Eventos

Una vez que inicies sesión, verás la pantalla principal con todos los eventos disponibles.

![Vista de Eventos](https://via.placeholder.com/800x500?text=Vista+de+Eventos)

### Elementos de la Pantalla:

#### 1. Encabezado

- **Título**: "Próximos Eventos"
- **ℹ️ Ícono de información**: Al pasar el mouse, explica qué es un evento
- **Descripción**: "Encuentra una reunión y únete a una mesa"

#### 2. Botones de Acción (Esquina Superior Derecha)

**🔄 Botón de Actualizar**

- Ícono de flechas circulares
- Recarga la lista de eventos
- Útil para ver si hay nuevos eventos
- Se anima (gira) mientras carga

**➕ Botón "Nuevo Evento"**

- Color naranja brillante
- Abre el formulario para crear un evento
- Solo visible si has iniciado sesión

#### 3. Tarjetas de Eventos

Cada evento se muestra en una tarjeta con la siguiente información:

**Parte Superior:**

- **Título del evento** en grande y negrita
- **🔒 Candado** (si el evento es privado)
- **Descripción breve** (solo en eventos públicos)

**Información del Evento:**

- **📍 Ubicación**: Dónde se realizará el evento
- **📅 Fecha y Hora**: Cuándo será el evento
  - Ejemplo: "Lunes 23 de diciembre, 19:00"

**Creador del Evento:**

- **"Creado por"** seguido del nombre del organizador
- **Insignias** del creador (si tiene)
  - Admin, Veterano, VIP, etc.

**Interacción:**

- Haz clic en cualquier parte de la tarjeta
- Te llevará al detalle del evento

**Estados Visuales:**

- La tarjeta se eleva ligeramente al pasar el mouse
- El título cambia a color naranja al hacer hover

#### 4. Mensajes Especiales

**Sin Eventos:**

- Ícono de calendario grande y transparente
- Mensaje: "No hay eventos programados aún"

**Cargando:**

- Animación de carga circular
- Mensaje: "Cargando eventos..."

---

## Vista de Detalle de Evento

Al hacer clic en un evento, verás todos sus detalles y podrás interactuar con él.

![Detalle de Evento](https://via.placeholder.com/800x500?text=Detalle+de+Evento)

### Elementos de la Pantalla:

#### 1. Navegación

**← Volver a Eventos**

- Enlace naranja en la parte superior
- Regresa a la lista de eventos

#### 2. Banner del Evento

Es el encabezado grande con degradado naranja-rojo que contiene:

**Información Principal:**

- **Título del evento** en grande
- **Descripción completa** del evento
- **📍 Ubicación**: Dirección del evento
- **📅 Fecha**: Fecha y hora completas

**Botones de Acción** (solo para creadores o admins):

- **📦 Archivar**: Guarda el evento en el historial
  - Fondo amarillo
  - Útil para eventos pasados
- **🗑️ Eliminar**: Borra el evento permanentemente
  - Fondo rojo
  - Pide confirmación antes de borrar

#### 3. Mapa de Ubicación

Debajo del banner, verás un mapa interactivo que muestra:

- La ubicación del evento
- Puedes hacer zoom y explorarlo
- Generado automáticamente desde la dirección

#### 4. Pestañas de Contenido

##### Pestaña "Mesas" (activa por defecto)

Muestra todas las mesas de juego creadas para este evento.

**Encabezado de Mesas:**

- **"Mesas de Juego"** con contador: "Mesas (5)"
- **ℹ️ Información**: Explica qué es una mesa de juego
- **🔄 Actualizar**: Recarga las mesas
- **➕ Nueva Mesa**: Crea una nueva mesa

**Vista de Mesas Vacía:**

- Ícono de caja vacía
- "No hay mesas creadas aún"
- "¡Sé el primero en crear una!"

##### Pestaña "Juegos Libres"

Muestra las ludotecas compartidas por los asistentes.

**Encabezado de Juegos Libres:**

- **"Juegos Libres"** con contador: "Juegos Libres (3)"
- **ℹ️ Información**: Explica qué es una ludoteca
- **🔄 Actualizar**: Recarga las ludotecas
- **➕ Compartir Ludoteca**: Añade tus juegos

---

## Crear un Nuevo Evento

Al hacer clic en "Nuevo Evento", se abre un formulario modal.

![Formulario de Evento](https://via.placeholder.com/800x500?text=Formulario+de+Evento)

### Campos del Formulario:

#### 1. Plantillas (Opcional)

**Selector Desplegable:**

- Aparece si ya has creado eventos antes
- Permite reutilizar información de eventos anteriores
- Al seleccionar uno, se copian:
  - Título
  - Ubicación
  - Descripción
- **No se copian**: Fecha ni contraseña (por seguridad)

#### 2. Información Básica

**📝 Título del Evento\*** (obligatorio)

- Mínimo 3 caracteres
- Ejemplo: "Noche de Juegos - Diciembre"
- Se muestra en la tarjeta del evento

**📍 Ubicación\*** (obligatorio)

- Dirección completa del evento
- Ejemplo: "Café Central, Calle Principal 123"
- Se usa para generar el mapa
- **💡 Consejo**: Sé específico para que el mapa sea preciso

**📅 Fecha y Hora\*** (obligatorio)

- Selector de fecha y hora
- No puedes seleccionar fechas pasadas
- Formato: DD/MM/AAAA HH:MM

**📄 Descripción** (opcional)

- Mínimo 10 caracteres si se incluye
- Espacio para detalles adicionales
- Ejemplo: "Trae tus juegos favoritos. Habrá pizza y bebidas."

#### 3. Opciones de Privacidad

**🔒 Evento Privado** (checkbox)

- Si está **desmarcado**: Evento público (todos lo ven)
- Si está **marcado**: Aparecen campos de contraseña

**Campos de Contraseña** (solo eventos privados):

- **Contraseña**: Crea una contraseña para el evento
- **Confirmar Contraseña**: Escribe la misma contraseña
- **💡 Nota**: Las contraseñas deben coincidir
- **🔗 Botón "Copiar"**: Copia la contraseña al portapapeles

**¿Qué pasa con eventos privados?**

- Solo aparecen con el título y candado 🔒
- No muestran descripción ni detalles
- Para ver el contenido, los usuarios deben ingresar la contraseña

#### 4. Opciones del Mapa

**Previsualización del Mapa**

- Aparece al escribir una ubicación válida
- **Botón "Ver Mapa"**: Muestra una previsualización
- **✓ Confirmar Ubicación**: Valida que el mapa es correcto
- **🔄 Reintentar**: Si el mapa no es correcto

**Mostrar Mapa en el Evento** (checkbox)

- Marcado por defecto
- Si lo desmarcas, el mapa no aparecerá en el evento

#### 5. Botones de Acción

**Guardar Evento**

- Color naranja
- Crea el evento
- Valida todos los campos antes

**Cancelar**

- Color gris
- Cierra el formulario sin guardar
- Se pierde toda la información ingresada

### Mensajes de Error

El formulario valida automáticamente:

- ❌ "El título debe tener al menos 3 caracteres"
- ❌ "La ubicación es requerida"
- ❌ "La descripción debe tener al menos 10 caracteres"
- ❌ "Las contraseñas no coinciden"

---

## Mesas de Juego

Las mesas de juego son el corazón de Ludorganizador.

![Tarjeta de Mesa](https://via.placeholder.com/800x500?text=Tarjeta+de+Mesa)

### Crear una Mesa

Al hacer clic en "Nueva Mesa" en un evento, se abre el formulario:

#### Campos del Formulario:

**🎲 Nombre del Juego\*** (obligatorio)

- Mínimo 3 caracteres
- Ejemplo: "Catan", "Terraforming Mars"
- Aparece como título de la mesa

**📝 Descripción\*** (obligatorio)

- Mínimo 10 caracteres
- Describe el juego y qué esperar
- Ejemplo: "Partida para principiantes. Explicaré las reglas."

**👥 Jugadores Mínimos\*** (obligatorio)

- Número mínimo de 2
- Jugadores necesarios para empezar

**👥 Jugadores Máximos\*** (obligatorio)

- Debe ser mayor o igual al mínimo
- Límite de jugadores en la mesa

**💡 Consejos para Mesas:**

- Sé claro sobre el nivel de experiencia requerido
- Indica la duración aproximada
- Menciona si traes el juego o si alguien debe traerlo

### Tarjeta de Mesa

Cada mesa se muestra en una tarjeta con:

#### Encabezado (Degradado Naranja-Rosa)

- **Título**: Nombre del juego
- **Rango de Jugadores**: "2-4 Jug."
- **Host**: Nombre del anfitrión
- **Insignias del Host**: Admin, badges especiales

#### Cuerpo de la Tarjeta

- **Descripción**: Entre comillas, cursiva
- **Lista de Jugadores**:
  - Muestra todos los registrados
  - Tu nombre aparece destacado (si estás registrado)
  - Scroll si hay muchos jugadores

#### Pie de la Tarjeta

**Indicadores de Estado:**

- **"X lugares disponibles"** (verde)
- **"Mesa Llena"** (rojo)

**Botones de Acción:**

Si **NO estás en la mesa**:

- **"Unirse"** (verde)
  - Te registra en la mesa
  - Aparecerás en la lista de jugadores
  - Deshabilitado si la mesa está llena

Si **YA estás en la mesa**:

- **"Salir"** (rosa/rojo)
  - Te quita de la mesa
  - Libera un lugar para otro jugador

Si **eres el anfitrión o admin**:

- **🗑️ Botón de Eliminar** (esquina superior)
  - Borra la mesa completamente
  - Pide confirmación

### Estados de la Mesa

**Mesa Abierta** 🟢

- Tiene lugares disponibles
- Botón "Unirse" activo
- Color verde en el contador

**Mesa Llena** 🔴

- Ha alcanzado el máximo de jugadores
- Botón "Unirse" deshabilitado
- Texto "Mesa Llena" visible

**Tu Mesa** 🎯

- Eres el anfitrión
- Puedes eliminarla
- Tu nombre aparece como "Host"

---

## Juegos Libres (Ludoteca)

La sección de juegos libres permite compartir qué juegos traes al evento.

![Ludoteca](https://via.placeholder.com/800x500?text=Ludoteca)

### Compartir tu Ludoteca

Al hacer clic en "Compartir Ludoteca", se abre un formulario especial:

#### Formulario de Juegos Libres

**Encabezado:**

- "Juegos que traes al evento"
- Contador de juegos agregados

**Campos por Juego:**

Cada juego tiene dos campos:

1. **📦 Nombre del Juego\*** (obligatorio)

   - Mínimo 3 caracteres
   - Ejemplo: "Dixit"

2. **💬 Nota** (opcional)
   - Información adicional
   - Ejemplo: "Expansión Odyssey incluida"

**Botones de Gestión:**

- **➕ Agregar Otro Juego** (verde)
  - Añade una nueva fila para otro juego
  - Puedes agregar tantos como quieras
- **🗑️ Eliminar** (rojo, en cada juego)
  - Quita ese juego de la lista
  - Debe haber al menos un juego

**Botones del Formulario:**

- **Compartir Ludoteca**: Guarda todos los juegos
- **Cancelar**: Cierra sin guardar

**💡 Consejos:**

- Agrupa juegos similares en una sola entrada
- Usa las notas para indicar expansiones
- Menciona el estado de los juegos

### Tarjeta de Ludoteca

Cada ludoteca compartida se muestra como:

#### Encabezado

- **👤 Nombre del Propietario**
- **Insignias** (Admin, badges)
- **📦 Ícono de caja** (indica que es una ludoteca)

#### Lista de Juegos

Para cada juego:

- **Nombre del Juego** en negrita
- **Nota** (si existe) en texto gris
- **🗑️ Botón Eliminar** (solo para el propietario o admin)
  - Elimina solo ese juego específico
  - Pide confirmación

#### Botones de Acción

Si eres el propietario o admin:

- **Eliminar toda la ludoteca**
  - Borra todos tus juegos de una vez
  - Pide confirmación

### ¿Por qué compartir juegos libres?

- Otros pueden ver qué juegos hay disponibles
- Facilita partidas espontáneas
- Ayuda a planificar qué juegos se necesitan
- Crea un ambiente de comunidad

---

## Panel de Administración

Solo disponible para usuarios **Administradores**.

![Panel Admin](https://via.placeholder.com/800x500?text=Panel+Admin)

### Acceso al Panel

**Cómo acceder:**

- Icono de escudo 🛡️ en la barra superior
- Solo visible para administradores
- Se abre en una ventana modal grande con diseño profesional

### Diseño del Panel

El panel de administración presenta un diseño moderno con dos áreas principales:

**Menú Lateral Izquierdo** (Fondo oscuro)
- Navegación clara entre secciones
- Íconos y texto descriptivo
- Sección activa destacada en color naranja

**Área Principal** (Fondo claro)
- Contenido de la sección seleccionada
- Gráficos y estadísticas visuales
- Feed de actividad en tiempo real

### Secciones del Panel

#### 1. 📊 Estadísticas (Sección por Defecto)

Vista general del estado de la plataforma con tarjetas informativas:

**Tarjetas de Métricas:**

Cada tarjeta muestra:
- **Ícono representativo** en la esquina superior derecha
- **Título descriptivo** (ej: "Usuarios Registrados")
- **Número grande** con la cantidad actual
- **Indicador de crecimiento** (porcentaje con flecha ↑ o ↓)
- **Gráfico de tendencia** mostrando evolución en el tiempo

**Tarjeta 1: 👥 Usuarios Registrados** (Color azul)
- Cantidad total de usuarios en la plataforma
- Porcentaje de crecimiento desde último período
- Mini gráfico de línea con tendencia
- Ejemplo: "2,547" con "+15%" de crecimiento

**Tarjeta 2: 📅 Eventos Activos** (Color verde)
- Eventos actuales no archivados
- Crecimiento en eventos creados
- Gráfico de tendencia
- Ejemplo: "124" con "+8%" de crecimiento

**Tarjeta 3: 📦 Eventos Archivados** (Color naranja)
- Total de eventos en historial
- Porcentaje de archivo
- Gráfico de evolución
- Ejemplo: "530" con "+2%" de crecimiento

**Feed de Actividad Reciente:**

Debajo de las tarjetas, un registro en tiempo real de las últimas acciones:

- **Iconos de color** según el tipo de actividad:
  - 🔵 Azul: Nuevos usuarios
  - 🟠 Naranja: Eventos archivados
  - 🟡 Amarillo: Badges editados
  
- **Descripción de la acción** con nombre del usuario o evento
  - Ejemplo: "Nuevo Usuario Registrado: AnaLi"
  - Ejemplo: "Evento Archivado: Noche de Juegos"
  - Ejemplo: "Badge Editado: Carlos_Host"

- **Marca de tiempo** relativa
  - "13 minutes ago"
  - "31 minutes ago"

**💡 Utilidad de Estadísticas:**
- Monitorea el crecimiento de la plataforma
- Detecta tendencias y patrones
- Toma decisiones informadas
- Identifica picos de actividad

#### 2. 👥 Gestionar Usuarios

Accede desde el menú lateral haciendo clic en "Gestionar Usuarios".

Vista completa de todos los usuarios registrados en formato de tabla:

**Información Mostrada por Usuario:**

- **Nombre completo** del usuario
- **Email** de contacto
- **Rol** (Usuario/Admin) con indicador visual
- **Badges** (insignias) asignadas con colores
- **Fecha de registro**

**Acciones Disponibles:**

**✏️ Editar Badges**

Proceso paso a paso:
1. Click en el botón "Editar Badges" junto al usuario
2. Se abre un campo de edición in-line
3. Muestra badges actuales como chips de colores
4. Campo de texto para agregar nuevos
5. Escribe el nombre del badge y presiona Enter
   - Opciones válidas: `veterano`, `vip`, `organizador`, `fundador`
6. Los badges se colorean automáticamente
7. Click fuera del campo o botón "Guardar" para confirmar
8. Aparece confirmación de éxito
9. Los cambios se reflejan inmediatamente en toda la plataforma

**🗑️ Eliminar Usuario**

- Botón rojo con ícono de basura
- Click abre modal de confirmación
- Muestra advertencia sobre acción irreversible
- Debes confirmar escribiendo el nombre del usuario
- No puedes eliminarte a ti mismo (protección)
- Borra permanentemente al usuario y todo su contenido
Accede desde el menú lateral haciendo clic en "Gestionar Eventos".

Vista de tabla con todos los eventos activos de la plataforma:

**Información Mostrada por Evento:**

- **Título del evento** (clickeable para ver detalles)
- **Fecha y hora** programadas
- **Ubicación** del evento
- **Creador** del evento (nombre y badges)
- **Estado** (Público/Privado con indicador 🔒)
- **Métricas**:
  - 🎲 Número de mesas creadas
  - 📚 Número de ludotecas compartidas
  - 👥 Total de participantes registrados

**Acciones Disponibles:**

**📦 Archivar Evento**
- Botón amarillo con ícono de archivo
- Mueve el evento al historial
- No elimina datos, solo oculta de vista principal
- Útil para eventos pasados
- Modal de confirmación antes de archivar
- Puede restaurarse desde "Eventos Archivados"

**🗑️ Eliminar Evento**
- Botón rojo con ícono de basura
- Borra permanentemente el evento
- Elimina todo el contenido asociado:
  - Todas las mesas del evento
  - Todas las ludotecas compartidas
  - Registros de participantes
- Modal de confirmación con advertencia
- Acción irreversible

**🔍 Herramientas de Gestión:**

- **Búsqueda**: Por título, ubicación o creador
Accede desde el menú lateral haciendo clic en "Eventos Archivados".

Historial completo de eventos archivados con opciones de gestión:

**Información Mostrada por Evento:**

- **Título del evento** original
- **Fecha original** en que se programó
- **Fecha de archivado** (cuándo se movió al historial)
- **Archivado por**: Nombre del admin o creador
- **Motivo** (si se especificó): "Evento finalizado", "Cancelado", etc.
- **Estadísticas finales**:
  - Total de mesas que tuvo
  - Total de participantes
  - Total de ludotecas compartidas

**Acciones Disponibles:**

**♻️ Restaurar Evento**
- B Elementos de Navegación del Panel

**Menú Lateral** (Siempre visible)

Barra de navegación oscura con las siguientes secciones:

- **📊 Estadísticas** - Métricas generales (sección por defecto)
- **👥 Gestionar Usuarios** - Lista y edición de usuarios
- **📅 Gestionar Eventos** - Eventos activos
- **📦 Eventos Archivados** - Historial de eventos

La sección activa se destaca con:
- Fondo naranja brillante
- Texto en blanco
- Icono resaltado

**Encabezado del Panel**

- **Título**: "Admin Panel" en grande
- **🔔 Notificaciones**: Campana con contador de alertas
- **Cierre (X)**: Esquina superior derecha
  - Cierra el panel
  - Vuelve a la vista normal de la aplicación
  - No pierde cambios guardados

**Controles de Cada Sección**

En la parte superior de cada sección encontrarás:

- **🔄 Actualizar**: Recarga los datos en tiempo real
- **🔍 Buscar**: Campo de búsqueda contextual
- **⚙️ Filtros**: Opciones de filtrado específicas
- **📥 Exportar**: Descargar datos (donde aplique)

### Características Especiales del Panel

**🔔 Sistema de Notificaciones**

El ícono de campana en el encabezado muestra:
- **Contador rojo**: Número de notificaciones sin leer
- Click para ver lista desplegable de alertas:
  - Nuevos usuarios registrados
  - Eventos que necesitan atención
  - Reportes de usuarios
  - Actividad sospechosa
  - Badges editados recientemente

**📊 Gráficos Interactivos**

En la sección de Estadísticas:
- **Hover sobre gráficos**: Muestra valor exacto del punto
- **Click en porcentajes**: Expande vista detallada
- **Periodo ajustable**: Última semana, mes o año
- **Comparativas**: Compara con periodos anteriores

**⚡ Actualización en Tiempo Real**

Elementos que se actualizan automáticamente:
- Feed de actividad reciente (cada 30 segundos)
- Contadores de estadísticas (cada minuto)
- Notificaciones nuevas (en tiempo real)
- Indicador visual de última actualización

**🎨 Diseño Profesional**

Características visuales:
- **Contraste moderno**: Sidebar oscuro + área principal clara
- **Colores significativos**: Cada métrica con su color identificativo
- **Espaciado generoso**: Fácil lectura y navegación
- **Responsive**: Se adapta a diferentes tamaños de pantalla
- **Iconografía clara**: Cada elemento con su ícono representativo

**🔐 Seguridad y Auditoría**

El panel registra:
- Todas las acciones administrativas
- Quién hizo cada cambio
- Fecha y hora exactas
- Cambios en usuarios y eventos
- Log de acceso al panel (visible en ajustes)

**💡 Consejos para Administradores:**

1. **Revisa diariamente** la sección de Estadísticas
2. **Monitorea el feed** de actividad reciente para detectar anomalías
3. **Archiva eventos pasados** semanalmente para mantener orden
4. **Usa badges con criterio** para reconocer contribuciones reales
5. **Exporta datos** regularmente como respaldo
6. **Responde rápido** a las notificaciones importantes
7. **Documenta** las razones al eliminar contenidos antiguos en lote
  - Selecciona múltiples eventos
  - Acción masiva con confirmación

**💡 Utilidad del Archivo:**

- Mantiene un historial organizado
- Permite análisis de eventos pasados
- Recupera información si es necesario
- Limpia la vista principal sin perder datos
- Referencia para planificar futuros eventos

- Título del evento
- Fecha
- Ubicación
- Creador
- Número de mesas
- Número de ludotecas

**Acciones:**

- **📦 Archivar**: Mueve a archivados
- **🗑️ Eliminar**: Borra permanentemente
- Cada acción pide confirmación

#### 4. 📦 Eventos Archivados

Muestra eventos que ya pasaron o fueron archivados:

**Información Mostrada:**

- Título
- Fecha original
- Fecha de archivado

**Acciones:**

- **♻️ Restaurar**: Vuelve a activar el evento
- **🗑️ Eliminar**: Borra definitivamente

**💡 Utilidad:**

- Mantiene un historial
- Permite recuperar eventos
- Limpia la vista principal

#### 5. ⏳ Usuarios Pendientes

Usuarios nuevos esperando aprobación:

**Información:**

- Nombre
- Email
- Fecha de registro

**Acciones:**

- **✓ Aprobar**: Activa la cuenta
- **✗ Rechazar**: Elimina el registro

**Nota:** Esta funcionalidad depende de la configuración del servidor.

### Botones Generales del Panel

**Cerrar (X)**

- Esquina superior derecha
- Cierra el panel
- Vuelve a la vista normal

**🔄 Actualizar**

- En cada pestaña
- Recarga los datos
- Útil para ver cambios en tiempo real

---

## Características Especiales

### 🎨 Modo Oscuro / Claro

**Cambiar de Tema:**

- Botón 🌙☀️ en la esquina superior (login)
- Icono de sol/luna en la barra superior (dentro de la app)
- Se guarda tu preferencia
- Afecta toda la aplicación

**Tema Claro** ☀️

- Fondos blancos y grises claros
- Textos oscuros
- Mejor para ambientes iluminados

**Tema Oscuro** 🌙

- Fondos negros y grises oscuros
- Textos claros
- Reduce fatiga visual en la noche

### 🔔 Notificaciones

La aplicación muestra mensajes temporales (toasts) para:

**Éxito** ✅ (Verde)

- "Evento creado correctamente"
- "Te has unido a la mesa"
- "Ludoteca compartida"

**Error** ❌ (Rojo)

- "La contraseña es incorrecta"
- "La mesa está llena"
- "Error al cargar eventos"

**Información** ℹ️ (Azul)

- "Actualizando datos..."
- "Cargando..."

**Ubicación:**

- Esquina superior derecha
- Desaparecen automáticamente
- Puedes cerrarlas con ✖️

### 🔄 Actualización Automática

**Botones de Actualizar:**

- Disponibles en:
  - Lista de eventos
  - Lista de mesas
  - Lista de juegos libres
- Click para cargar datos nuevos
- Animación de giro mientras carga

**Uso:**

- Si alguien crea un evento nuevo
- Si se llenan lugares en una mesa
- Para ver cambios recientes

### 🔒 Eventos Privados

**Crear Evento Privado:**

1. Marca checkbox "Evento Privado"
2. Ingresa contraseña
3. Comparte la contraseña con invitados

**Ver Evento Privado:**

1. Click en la tarjeta (solo muestra título)
2. Aparece modal de contraseña
3. Ingresa la contraseña
4. Accedes al contenido

**Seguridad:**

- La contraseña está encriptada
- Solo ves el contenido si sabes la contraseña
- Útil para eventos exclusivos

### ℹ️ Tooltips Informativos

**Dónde aparecen:**

- Íconos ℹ️ junto a títulos importantes
- Explicaciones contextuales
- Ayudas en formularios

**Cómo usarlos:**

- Pasa el mouse sobre el ícono
- Aparece una cajita con explicación
- Desaparece al quitar el mouse

**Ejemplos:**

- "¿Qué es un evento?"
- "¿Qué es una mesa de juego?"
- "¿Qué son los juegos libres?"

### 📱 Diseño Responsive

La aplicación se adapta a diferentes pantallas:

**En Computadora** 💻

- Tarjetas en cuadrícula (3 columnas)
- Todos los textos visibles
- Botones con texto e ícono

**En Tablet** 📱

- Cuadrícula de 2 columnas
- Algunos textos se ocultan
- Botones optimizados

**En Móvil** 📱

- Una columna
- Vista compacta
- Solo íconos en botones
- Scroll suave

### 🎯 Búsqueda Visual

**Identificadores de Color:**

**Eventos:**

- Banner naranja-rojo en detalles
- Tarjetas blancas/oscuras según tema

**Mesas:**

- Header naranja-rosa
- Botones verdes (unirse)
- Botones rojos (salir/eliminar)

**Estados:**

- Verde = Disponible, Éxito
- Rojo = Lleno, Error, Eliminar
- Amarillo = Advertencia, Archivar
- Azul = Información
- Gris = Deshabilitado, Cancelar

### 🔐 Seguridad y Privacidad

**Autenticación:**

- Contraseñas encriptadas
- Sesión guardada localmente
- Cierre de sesión automático (inactividad)

**Permisos:**

- Solo editas tu contenido
- Admins tienen permisos especiales
- Validaciones en el servidor

**Datos:**

- Tu información es privada
- Solo se muestra tu nombre público
- Email no visible para otros usuarios

---

## Preguntas Frecuentes

### ¿Puedo editar un evento después de crearlo?

Actualmente no hay función de edición. Puedes:

- Archivarlo y crear uno nuevo
- Eliminar juegos/mesas específicas
- Usar el evento como plantilla para uno nuevo

### ¿Qué pasa si una mesa se llena?

- El botón "Unirse" se deshabilita
- Aparece el mensaje "Mesa Llena"
- Solo pueden salir quienes ya están registrados
- Si alguien sale, se libera un lugar

### ¿Puedo unirme a varias mesas del mismo evento?

Sí, puedes registrarte en todas las mesas que quieras (si hay lugares).

### ¿Cómo consigo insignias?

Solo los administradores pueden asignar insignias a través del Panel de Administración.

### ¿Los eventos pasados se eliminan automáticamente?

No. Permanecen hasta que:

- El creador los archive/elimine
- Un admin los archive/elimine
- Puedes configurar auto-archivado (funcionalidad del servidor)

### ¿Puedo ver quién está en una mesa antes de unirme?

Sí, la lista de jugadores registrados es visible para todos.

### ¿Qué pasa si olvido la contraseña de un evento privado?

Debes contactar al creador del evento para que te la comparta nuevamente.

### ¿Puedo cambiar mi nombre de usuario?

Actualmente no hay función de edición de perfil. Deberías crear una nueva cuenta.

### ¿Hay límite de eventos que puedo crear?

No hay límite técnico, pero procura archivar eventos pasados para mantener la lista limpia.

### ¿Los juegos libres son obligatorios?

No, son opcionales. Solo compártelos si traes juegos al evento.

---

## Consejos para Organizadores

### 🎯 Crear Buenos Eventos

1. **Título Claro**: Indica el tipo de evento

   - ✅ "Noche de Estrategia - Viernes 20"
   - ❌ "Juntada"

2. **Ubicación Específica**: Facilita que la gente llegue

   - ✅ "Café Gamers, Av. Central 456, Local 3"
   - ❌ "Centro"

3. **Descripción Detallada**:

   - Qué tipo de juegos habrá
   - Si hay comida/bebidas
   - Costo de entrada (si aplica)
   - Horario de inicio y fin

4. **Usa el Mapa**: Verifica que la ubicación sea correcta

### 🎲 Crear Buenas Mesas

1. **Nombre Completo**: Incluye expansiones si es relevante

   - ✅ "Catan - Expansión Navegantes"
   - ❌ "Catan"

2. **Descripción Útil**:

   - Nivel requerido (principiante/experto)
   - Duración aproximada
   - Si traes el juego o alguien debe traerlo
   - Reglas especiales

3. **Rango de Jugadores Realista**:
   - Considera la experiencia del grupo
   - No pongas el máximo si es un juego largo

### 📚 Compartir Ludoteca Efectivamente

1. **Sé Específico**: Indica versiones y expansiones
2. **Menciona Estado**: "Nuevo", "Usado pero en buen estado"
3. **Agrupa Similar**: "Juegos de Cartas: Uno, Bang, Citadels"
4. **Actualiza**: Si cambias de opinión sobre qué llevar

### 🤝 Gestión de Comunidad

1. **Responde Rápido**: Si eres admin o creador
2. **Mantén Limpio**: Archiva eventos pasados
3. **Sé Inclusivo**: Describe niveles de experiencia claramente
4. **Comunicación Externa**: Comparte el link del evento
5. **Seguimiento**: Crea un grupo de chat para los asistentes

---

## Glosario de Términos

**Evento**: Una reunión en fecha y lugar específicos para jugar juegos de mesa.

**Mesa de Juego**: Un espacio dentro de un evento dedicado a jugar un juego específico, con un anfitrión y límite de jugadores.

**Juegos Libres / Ludoteca**: Lista de juegos que un usuario trae al evento para partidas espontáneas, sin mesa asignada.

**Host / Anfitrión**: Usuario que crea una mesa de juego y generalmente explica las reglas.

**Registrado**: Usuario que se ha unido a una mesa de juego.

**Evento Privado**: Evento que requiere contraseña para ver su contenido.

**Archivar**: Mover un evento al historial sin eliminarlo, manteniéndolo recuperable.

**Badge / Insignia**: Distintivo especial que algunos usuarios tienen junto a su nombre.

**Admin / Administrador**: Usuario con permisos especiales para gestionar la plataforma.

**Toast / Notificación**: Mensaje temporal que aparece en pantalla para confirmar acciones.

**Modal**: Ventana emergente para formularios o confirmaciones.

**Tooltip**: Cajita informativa que aparece al pasar el mouse sobre un ícono.

---

## Atajos y Trucos

### ⌨️ Atajos de Teclado

**Formularios:**

- `Enter` = Enviar formulario (si estás en un campo)
- `Esc` = Cerrar modal (en algunos casos)
- `Tab` = Navegar entre campos

**Navegación:**

- Click en logo = Volver a eventos (si está implementado)
- `F5` = Recargar página (actualiza todo)

### 🚀 Flujos Rápidos

**Crear Evento Completo:**

1. Click "Nuevo Evento"
2. Usa plantilla si existe
3. Cambia fecha
4. Guardar
5. Click en el evento recién creado
6. Crear mesas inmediatamente

**Unirse Rápidamente:**

1. Click en evento desde la lista
2. Revisar mesas disponibles
3. Click "Unirse" en la que te interese

**Compartir Múltiples Juegos:**

1. Click "Compartir Ludoteca"
2. Escribe primer juego
3. Click "Agregar Otro Juego" (varias veces)
4. Llena todos
5. Guardar una sola vez

### 💡 Mejores Prácticas

**Performance:**

- No hagas F5 constantemente (usa botones de actualizar)
- Cierra modales después de usarlos
- Sal de mesas que no usarás

**Organización:**

- Archiva eventos pasados cada semana
- Nombra eventos con fechas en el título
- Usa descripciones claras

**Comunidad:**

- Saluda en las mesas (usa descripción)
- Comparte juegos generosamente
- Respeta los límites de las mesas

---

## Solución de Problemas Comunes

### ❌ No puedo ver los eventos

**Posibles causas:**

- No has iniciado sesión
- Error de conexión
- El servidor está caído

**Soluciones:**

1. Verifica tu conexión a internet
2. Recarga la página (F5)
3. Cierra sesión y vuelve a iniciar
4. Prueba el botón "Actualizar"

### ❌ No puedo crear un evento

**Posibles causas:**

- No has llenado todos los campos obligatorios
- La fecha es en el pasado
- Las contraseñas no coinciden

**Soluciones:**

1. Revisa los mensajes de error en rojo
2. Verifica que todos los campos con \* estén llenos
3. Asegúrate de que la fecha sea futura
4. Confirma que las contraseñas sean idénticas

### ❌ No puedo unirme a una mesa

**Posibles causas:**

- La mesa está llena
- Ya estás en esa mesa
- Error de conexión

**Soluciones:**

1. Verifica el contador de lugares
2. Revisa si tu nombre ya está en la lista
3. Actualiza las mesas (botón 🔄)
4. Prueba salir y volver a entrar

### ❌ El mapa no aparece

**Posibles causas:**

- La ubicación no es válida
- El creador desactivó el mapa
- Error al cargar Google Maps

**Soluciones:**

1. Verifica que la dirección sea completa
2. Espera unos segundos (puede tardar en cargar)
3. Recarga la página
4. Informa al creador si persiste

### ❌ Olvidé la contraseña del evento

**Solución:**

- Contacta al creador del evento
- Pídele que te comparta la contraseña nuevamente

### ❌ Mis badges no aparecen

**Posibles causas:**

- No tienes badges asignados
- Error al cargar tu información
- Cambio reciente no sincronizado

**Soluciones:**

1. Recarga la página
2. Cierra y abre sesión
3. Contacta a un administrador

---

## Contacto y Soporte

### 🆘 ¿Necesitas Ayuda?

Si encuentras problemas:

1. **Consulta esta guía**: La mayoría de dudas están resueltas aquí
2. **Contacta a un Admin**: Identifícalos por su insignia
3. **Reporta Bugs**: Describe detalladamente qué pasó

### 📝 Información Útil al Reportar Problemas

Incluye:

- Qué estabas intentando hacer
- Qué pasó en su lugar
- Mensajes de error (si aparecieron)
- Navegador que usas
- Si pasa en computadora o móvil

---

## Actualizaciones y Nuevas Características

Esta guía se actualiza regularmente. Revisa la fecha de última actualización.

**Última actualización**: Diciembre 2024

---

¡Disfruta organizando tus eventos de juegos de mesa con Ludorganizador! 🎲🎉
