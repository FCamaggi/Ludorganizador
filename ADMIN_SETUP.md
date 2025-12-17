# 🔧 Sistema de Administración

## Crear un Administrador

Para asignar el rol de administrador a un usuario:

```powershell
cd server
node makeAdmin.js tu-email@ejemplo.com
```

Ejemplo:

```powershell
node makeAdmin.js fabrizio@example.com
```

## Funcionalidades del Admin

El usuario con rol `admin` tendrá acceso a:

1. **Panel de Administración** (botón con icono de escudo en el header)
2. **Estadísticas globales**:

   - Total de usuarios
   - Total de eventos
   - Total de mesas
   - Total de juegos libres

3. **Gestión de Usuarios**:

   - Ver todos los usuarios
   - Eliminar usuarios (excepto su propia cuenta)
   - Al eliminar un usuario, se eliminan todos sus eventos

4. **Gestión de Eventos**:

   - Ver todos los eventos (incluso privados)
   - Eliminar cualquier evento
   - Al eliminar un evento, se eliminan sus mesas y juegos

5. **Modales de Confirmación**:
   - Advertencias antes de eliminar
   - Información sobre consecuencias de las acciones

## Seguridad

- Solo usuarios con `role: 'admin'` pueden acceder a las rutas de admin
- El middleware `adminAuth` valida el token JWT y el rol
- No se puede auto-eliminar como admin
- Todas las acciones destructivas requieren confirmación

---

## 🗺️ Google Places API (Próxima Implementación)

Para integrar autocompletado de lugares con Google Places:

### Paso 1: Obtener API Key

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto
3. Habilita "Places API"
4. Crea una API Key
5. Restringe la key a:
   - Solo tu dominio (localhost y producción)
   - Solo Places API

### Paso 2: Configurar en el Proyecto

Agregar al `.env` principal:

```env
VITE_GOOGLE_PLACES_API_KEY=tu_api_key_aqui
```

### Paso 3: Instalar Dependencia

```powershell
npm install @googlemaps/js-api-loader
```

### Paso 4: Implementar Componente

Crear `components/PlaceAutocomplete.tsx` con:

- Input con autocompletado
- Integración con Google Places Autocomplete
- Selección de lugar con latitud/longitud
- Mostrar mapa opcional

### Costo

- **Gratis** hasta 25,000 requests/mes
- Luego $17 USD por cada 1,000 requests adicionales
- Para proyectos personales/pequeños, suele ser gratis

### Alternativas Gratuitas

Si prefieres evitar Google:

- **Nominatim** (OpenStreetMap) - 100% gratis
- **LocationIQ** - 5,000 requests gratis/mes
- **Mapbox** - 100,000 requests gratis/mes

¿Quieres que implemente alguna de estas opciones?
