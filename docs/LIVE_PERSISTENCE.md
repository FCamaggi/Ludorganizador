# Persistencia en Vivo - Documentación

## Estado Actual

Actualmente, la aplicación **no cuenta con persistencia en tiempo real** de eventos creados por terceros. Los cambios realizados por otros usuarios (crear eventos, mesas, juegos libres) **no se reflejan automáticamente** en la interfaz hasta que el usuario recarga la página manualmente.

## Comportamiento Observado

### Lo que NO se actualiza en vivo:

- ✗ Eventos nuevos creados por otros usuarios
- ✗ Mesas de juego creadas por otros usuarios
- ✗ Juegos libres agregados por otros usuarios
- ✗ Cambios en roles/badges de usuarios (ahora sí se actualiza para el usuario afectado)
- ✗ Usuarios uniéndose o saliendo de mesas
- ✗ Eliminación de eventos/mesas/juegos por otros usuarios

### Lo que SÍ se actualiza:

- ✓ Acciones del usuario actual se reflejan inmediatamente en su propia sesión
- ✓ Cambios de rol del usuario actual (implementado en esta actualización)

## Impacto

**Impacto: Leve**

Aunque no es ideal, la falta de actualización en tiempo real no impide el funcionamiento básico de la aplicación. Los usuarios pueden:

- Ver sus propios cambios inmediatamente
- Refrescar manualmente la página para ver actualizaciones de otros
- Participar en eventos sin problemas graves de sincronización

## Posibles Soluciones

### 1. WebSockets (Solución Completa)

**Tecnología:** Socket.io

**Ventajas:**

- Actualizaciones en tiempo real genuinas
- Bajo latencia
- Bidireccional

**Desventajas:**

- Requiere configuración adicional en el servidor
- Más complejo de mantener
- Mayor consumo de recursos del servidor

**Implementación estimada:** 8-12 horas

### 2. Polling Periódico (Solución Simple)

**Tecnología:** setInterval con llamadas a la API

**Ventajas:**

- Fácil de implementar
- No requiere cambios en el servidor
- Funciona con la infraestructura actual

**Desventajas:**

- Mayor carga en el servidor (llamadas repetitivas)
- No es tiempo real genuino (retraso de 5-30 segundos)
- Consume más ancho de banda

**Implementación estimada:** 2-4 horas

### 3. Server-Sent Events (SSE)

**Tecnología:** EventSource API

**Ventajas:**

- Unidireccional del servidor al cliente
- Más ligero que WebSockets para notificaciones
- Reconexión automática

**Desventajas:**

- Solo servidor → cliente
- Limitaciones en algunos navegadores/proxies
- Requiere cambios en el servidor

**Implementación estimada:** 6-8 horas

## Recomendación

Para el corto plazo y dado el impacto leve, se recomienda:

1. **Mantener el estado actual** y documentar claramente que los usuarios deben refrescar para ver cambios de terceros
2. Si se decide implementar persistencia en vivo, empezar con **Polling Periódico** como MVP:

   - Implementar polling cada 30 segundos cuando el usuario está en la vista de eventos
   - Implementar polling cada 15 segundos cuando está dentro de un evento específico
   - Detener polling cuando el usuario está inactivo (para ahorrar recursos)

3. **Para el largo plazo**, migrar a WebSockets si la base de usuarios crece y la funcionalidad en tiempo real se vuelve crítica

## Código de Ejemplo - Polling Periódico

```typescript
// En hooks/useEvents.ts
useEffect(() => {
  if (!isActive) return;

  const interval = setInterval(() => {
    loadEvents(); // Recargar eventos silenciosamente
  }, 30000); // cada 30 segundos

  return () => clearInterval(interval);
}, [isActive, loadEvents]);
```

## Conclusión

La persistencia en vivo es una **mejora deseable pero no crítica** en esta etapa del proyecto. Los usuarios pueden trabajar efectivamente con la aplicación usando refresh manual. Si se decide implementar, la solución de polling periódico es la más rápida y práctica para empezar.
