# Guía de Despliegue - Actualización 20 Diciembre 2025

## ⚠️ IMPORTANTE: Leer antes de desplegar

Esta actualización incluye cambios en el modelo de datos que requieren una migración de la base de datos.

## Pre-requisitos

- Acceso a la base de datos MongoDB
- Node.js instalado
- Variables de entorno configuradas
- Backup de la base de datos (recomendado)

## Pasos de Despliegue

### 1. Backup de la Base de Datos (Recomendado)

```bash
# MongoDB Atlas
mongodump --uri="<TU_MONGODB_URI>" --out=./backup-20dic2025

# MongoDB Local
mongodump --db=ludorganizador --out=./backup-20dic2025
```

### 2. Actualizar el Código

```bash
# Pull los últimos cambios
git pull origin main

# Instalar dependencias (si hay nuevas)
npm install
cd server && npm install && cd ..
```

### 3. Ejecutar Migración de Base de Datos

**⚠️ Este paso es CRÍTICO y debe hacerse ANTES de iniciar el servidor actualizado**

```bash
cd server
node scripts/addUsernameField.js
```

**Salida esperada:**

```
🔄 Conectando a MongoDB...
✅ Conectado a MongoDB

📊 Usuarios sin username encontrados: X

✅ Migrado: Usuario1 -> username: usuario1
✅ Migrado: Usuario2 -> username: usuario2
...

📊 Resumen de migración:
   ✅ Exitosos: X
   ❌ Errores: 0

✨ Migración completada
```

### 4. Verificar la Migración

Conectar a MongoDB y verificar:

```javascript
// En MongoDB shell o Compass
db.users.find({ username: { $exists: true } }).count();
// Debe devolver el número total de usuarios
```

### 5. Reiniciar el Servidor

```bash
# Detener el servidor actual
pm2 stop ludorganizador

# Iniciar con nueva versión
pm2 start ecosystem.config.js
pm2 save
```

O si usas otro método:

```bash
# Detener
Ctrl+C (si está en terminal)

# Iniciar
npm run dev  # desarrollo
npm start    # producción
```

### 6. Verificar el Frontend

```bash
cd ..  # volver a raíz
npm run build
npm run preview  # para verificar build
```

### 7. Testing Post-Despliegue

Realizar las siguientes pruebas:

#### Test 1: Login Existente

- [ ] Los usuarios existentes pueden hacer login con su username generado
- [ ] Verificar en la base de datos qué username se les asignó

#### Test 2: Registro Nuevo

- [ ] Crear un nuevo usuario
- [ ] Verificar que pide username
- [ ] Verificar que pide confirmación de contraseña
- [ ] Registrarse correctamente

#### Test 3: Cambios de Rol

- [ ] Como admin, cambiar el rol de un usuario
- [ ] Verificar que el cambio se refleja sin cerrar sesión

#### Test 4: Evento con Contraseña

- [ ] Crear evento con contraseña
- [ ] Verificar campo de confirmación
- [ ] Crear correctamente

#### Test 5: Tooltips

- [ ] Verificar que aparecen los tooltips de ayuda (?)

#### Test 6: Paleta de Colores

- [ ] Verificar que el header tiene el gradiente naranja-rojo
- [ ] Verificar botones con nuevos colores

## Rollback (Si algo sale mal)

### Opción 1: Restaurar Backup

```bash
mongorestore --uri="<TU_MONGODB_URI>" --drop ./backup-20dic2025
```

### Opción 2: Revertir Código

```bash
git revert HEAD
git push origin main
```

## Notificación a Usuarios

### Mensaje Sugerido

```
🎮 ¡Ludorganizador ha sido actualizado!

Novedades:
✅ Ahora usamos username en lugar de email
✅ Los cambios de rol se reflejan instantáneamente
✅ Mejoras en seguridad con confirmación de contraseñas
✅ Nuevos tooltips de ayuda (?)
✅ Nueva paleta de colores más vibrante

📝 Si eres usuario existente:
Se te ha asignado automáticamente un username basado en tu email.
Puedes ver tu username en tu perfil.

¿Problemas? Contáctanos en [tu contacto]
```

## Monitoreo Post-Despliegue

### Logs a Revisar

```bash
# PM2 logs
pm2 logs ludorganizador

# Errores de Node
tail -f /var/log/ludorganizador-error.log

# MongoDB logs
# Ver en MongoDB Atlas o logs locales
```

### Métricas a Monitorear

- [ ] Tasa de errores de login (primeras 24 horas)
- [ ] Usuarios que no pueden acceder
- [ ] Errores en creación de eventos
- [ ] Tiempo de respuesta del servidor

## Soporte

### Problemas Comunes

#### "Username already exists" al migrar

**Solución:** El script maneja esto automáticamente agregando números al username

#### Usuarios no pueden hacer login

**Causa:** Probablemente intentan usar su email
**Solución:** Comunicar que ahora deben usar su username asignado

#### Error "username is required"

**Causa:** La migración no se ejecutó
**Solución:** Ejecutar el script de migración

## Contacto de Emergencia

En caso de problemas críticos:

- Revisar logs inmediatamente
- Considerar rollback si más del 10% de usuarios reportan problemas
- Documentar todos los errores para debugging

## Checklist Final

- [ ] Backup completado
- [ ] Código actualizado
- [ ] Migración ejecutada exitosamente
- [ ] Servidor reiniciado
- [ ] Tests básicos pasando
- [ ] Usuarios notificados
- [ ] Monitoreo activo

---

**Fecha de última actualización:** 20 de Diciembre 2025
**Versión:** 2.0.0
**Responsable:** [Tu nombre]
