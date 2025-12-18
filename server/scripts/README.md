# Scripts del Servidor

## Archivado Automático de Eventos

### Script: archiveOldEvents.js

Este script archiva automáticamente eventos que tienen más de 1 semana de antigüedad desde su fecha de realización.

### Ejecución Manual

```bash
cd server
npm run archive
```

### Configuración de Cron (Linux/Mac)

Para ejecutar automáticamente todos los días a las 3 AM:

```bash
crontab -e
```

Añade la siguiente línea:

```
0 3 * * * cd /ruta/a/ludorganizador/server && npm run archive >> /var/log/ludorganizador-archive.log 2>&1
```

### Configuración de Task Scheduler (Windows)

1. Abrir "Programador de tareas"
2. Crear tarea básica
3. Nombre: "Ludorganizador - Archivar Eventos"
4. Desencadenador: Diario a las 3:00 AM
5. Acción: Iniciar programa
   - Programa: `node`
   - Argumentos: `scripts/archiveOldEvents.js`
   - Iniciar en: `C:\ruta\a\ludorganizador\server`

### Endpoint Manual (Alternativa)

También puedes archivar eventos mediante el endpoint:

```bash
POST http://localhost:5000/api/events/auto-archive
```

### Eventos Archivados

- Los eventos archivados no aparecen en la lista principal
- Solo los administradores pueden ver eventos archivados
- Se muestra una alerta (!) en el botón de administrador si hay eventos archivados
- Los administradores pueden eliminar permanentemente eventos archivados desde el panel
