# ✅ Checklist de Migración a MongoDB

## 📋 Pasos para completar la migración

### 1. ☐ Configurar MongoDB Atlas

- [ ] Ir a https://www.mongodb.com/cloud/atlas/register
- [ ] Crear cuenta gratuita
- [ ] Crear cluster M0 (GRATIS)
- [ ] Crear usuario de base de datos y guardar contraseña
- [ ] Configurar Network Access (agregar 0.0.0.0/0)
- [ ] Copiar connection string (URI)

📖 **Guía detallada**: [MONGODB_SETUP.md](MONGODB_SETUP.md)

---

### 2. ☐ Configurar localmente

- [ ] Abrir terminal en la carpeta del proyecto
- [ ] Ejecutar: `cd server && npm install`
- [ ] Crear archivo `server/.env` (copiar de `server/.env.example`)
- [ ] Pegar tu MONGODB_URI en el archivo `.env`
- [ ] Guardar el archivo

**Ejemplo de `server/.env`:**

```env
PORT=3001
JWT_SECRET=una_clave_secreta_segura_123456789
NODE_ENV=development
MONGODB_URI=mongodb+srv://usuario:password@cluster.xxxxx.mongodb.net/ludorganizador?retryWrites=true&w=majority
```

---

### 3. ☐ Probar localmente

- [ ] Abrir terminal en `server/`
- [ ] Ejecutar: `npm start`
- [ ] Verificar mensaje: "✅ Conectado a MongoDB"
- [ ] Abrir otra terminal en la raíz del proyecto
- [ ] Ejecutar: `npm run dev`
- [ ] Abrir http://localhost:5173
- [ ] Registrar un usuario de prueba
- [ ] Crear un evento de prueba
- [ ] Verificar en MongoDB Atlas → Browse Collections que aparecen los datos

---

### 4. ☐ Configurar en Render (Producción)

- [ ] Ir a https://dashboard.render.com
- [ ] Seleccionar tu servicio `ludorganizador-api`
- [ ] Ir a "Environment" en el menú izquierdo
- [ ] Hacer clic en "Add Environment Variable"
- [ ] Agregar:
  - **Key**: `MONGODB_URI`
  - **Value**: (pegar tu URI de MongoDB Atlas)
- [ ] Hacer clic en "Save Changes"
- [ ] Esperar a que se complete el redespliegue

---

### 5. ☐ Verificar en producción

- [ ] Abrir los logs en Render (pestaña "Logs")
- [ ] Buscar el mensaje: "✅ Conectado a MongoDB"
- [ ] Abrir tu aplicación en Netlify
- [ ] Registrar un nuevo usuario
- [ ] Crear un evento
- [ ] Verificar en MongoDB Atlas que los datos se guardaron

---

## 🎉 ¡Listo!

Una vez completados todos los pasos:

✅ Tu aplicación usa MongoDB Atlas
✅ Los datos persisten entre reinicios
✅ Todos los usuarios comparten la misma base de datos
✅ Tienes backups automáticos

---

## 🆘 ¿Problemas?

Consulta los documentos:

- **Guía completa**: [MONGODB_SETUP.md](MONGODB_SETUP.md)
- **Resumen técnico**: [PASOS_MIGRACION_MONGODB.md](PASOS_MIGRACION_MONGODB.md)
- **README general**: [README.md](README.md)

---

## 📊 Verifica que todo funciona

### En MongoDB Atlas:

1. Ve a https://cloud.mongodb.com
2. Haz clic en "Browse Collections"
3. Deberías ver 4 colecciones:
   - ✅ `users`
   - ✅ `events`
   - ✅ `tables`
   - ✅ `freegames`

### En tu aplicación:

1. Registra 2-3 usuarios diferentes
2. Crea varios eventos (algunos con contraseña)
3. Crea mesas en los eventos
4. Agrega juegos a la ludoteca
5. Únete a mesas con diferentes usuarios
6. Verifica que todo se guarda correctamente

---

## 🔐 Seguridad en Producción

Cuando tu app esté funcionando bien:

- [ ] Cambiar JWT_SECRET en Render por una clave única
- [ ] En Atlas → Network Access, quitar `0.0.0.0/0`
- [ ] Agregar solo las IPs de Render (Settings → Outbound IPs)
- [ ] Cambiar contraseña del usuario de MongoDB cada 3-6 meses

---

**Tiempo estimado**: 30-45 minutos

**Costo**: $0 (todo es gratis con los planes free tier)
