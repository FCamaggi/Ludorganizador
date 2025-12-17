# 🗄️ Configurar MongoDB Atlas - Guía Completa

Esta guía te ayudará a configurar MongoDB Atlas (base de datos en la nube GRATIS) para Ludorganizador.

---

## ¿Por qué MongoDB Atlas?

- ✅ **GRATIS** hasta 512MB de almacenamiento
- ✅ **Persistencia real** - los datos no se pierden
- ✅ **En la nube** - accesible desde cualquier lugar
- ✅ **Backups automáticos**
- ✅ **Fácil de configurar**

---

## Paso 1: Crear Cuenta en MongoDB Atlas

1. Ve a https://www.mongodb.com/cloud/atlas/register
2. Regístrate con email o Google (recomendado)
3. Completa el formulario:
   - **¿Qué describes mejor tu organización?**: Personal/Hobby
   - **¿Qué lenguaje usas?**: JavaScript
   - **¿Qué framework?**: Express
4. Haz clic en "Finish"

---

## Paso 2: Crear un Cluster (Base de Datos)

### 2.1 Crear nuevo cluster

1. Una vez dentro, verás "Create a deployment"
2. Haz clic en "Create"
3. Selecciona **M0 (Free tier)** - Debe decir "FREE"

### 2.2 Configurar el cluster

| Campo            | Valor                                                      |
| ---------------- | ---------------------------------------------------------- |
| **Provider**     | AWS (recomendado)                                          |
| **Region**       | Selecciona la más cercana a ti (ej: Frankfurt para Europa) |
| **Cluster Tier** | M0 Sandbox (debe decir FREE)                               |
| **Cluster Name** | ludorganizador (o el que prefieras)                        |

### 2.3 Crear cluster

1. Haz clic en "Create Deployment" (botón verde)
2. **IMPORTANTE**: Aparecerá un modal "Security Quickstart"

---

## Paso 3: Configurar Seguridad

### 3.1 Crear usuario de base de datos

En el modal que apareció:

1. **Username**: `ludoadmin` (o el que prefieras)
2. **Password**: Haz clic en "Autogenerate Secure Password"
3. **¡IMPORTANTE!** Copia la contraseña generada y guárdala - la necesitarás después

   Ejemplo de contraseña generada:

   ```
   xK9mP2wR5tL8qN3v
   ```

4. Haz clic en "Create Database User"

### 3.2 Configurar acceso de red

1. En la misma ventana, ve a la sección "Where would you like to connect from?"
2. Selecciona **"My Local Environment"**
3. Haz clic en **"Add My Current IP Address"**
4. Para desarrollo, también agrega acceso desde cualquier IP:

   - Haz clic en "Add IP Address"
   - IP Address: `0.0.0.0/0`
   - Description: `Permitir todo (solo desarrollo)`
   - Haz clic en "Add Entry"

5. Haz clic en "Finish and Close"
6. En el siguiente modal, haz clic en "Go to Overview"

---

## Paso 4: Obtener la URI de Conexión

### 4.1 Conseguir connection string

1. En el dashboard, verás tu cluster
2. Haz clic en el botón **"Connect"**
3. Selecciona **"Drivers"**
4. En "Driver": Selecciona **Node.js**
5. En "Version": Selecciona la última versión

### 4.2 Copiar la URI

Verás algo como:

```
mongodb+srv://ludoadmin:<password>@ludorganizador.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

**IMPORTANTE:**

1. Copia esta URI completa
2. Reemplaza `<password>` con la contraseña que generaste en el Paso 3.1
3. Agrega el nombre de la base de datos antes de `?retryWrites`

**URI final debe verse así:**

```
mongodb+srv://ludoadmin:xK9mP2wR5tL8qN3v@ludorganizador.xxxxx.mongodb.net/ludorganizador?retryWrites=true&w=majority
```

Nota: `ludorganizador` después de `.net/` es el nombre de tu base de datos.

---

## Paso 5: Configurar en Local

### 5.1 Actualizar .env del servidor

1. Abre el archivo `server/.env`
2. Actualiza la línea de `MONGODB_URI`:

```env
MONGODB_URI=mongodb+srv://ludoadmin:TU_PASSWORD@ludorganizador.xxxxx.mongodb.net/ludorganizador?retryWrites=true&w=majority
```

**Reemplaza** `TU_PASSWORD` con tu contraseña real.

### 5.2 Instalar dependencias

```powershell
cd server
npm install
```

Esto instalará Mongoose (driver de MongoDB).

### 5.3 Probar la conexión

```powershell
# Desde la carpeta server/
npm start
```

Deberías ver:

```
✅ Conectado a MongoDB
🚀 Servidor corriendo en puerto 3001
```

Si ves el ✅, ¡funcionó!

---

## Paso 6: Configurar en Render (Producción)

### 6.1 Agregar variable de entorno

1. Ve a tu dashboard de Render
2. Selecciona tu servicio `ludorganizador-api`
3. Ve a **"Environment"** en el menú izquierdo
4. Haz clic en **"Add Environment Variable"**
5. Agrega:

   - **Key**: `MONGODB_URI`
   - **Value**: Tu URI completa de MongoDB Atlas

   ```
   mongodb+srv://ludoadmin:TU_PASSWORD@ludorganizador.xxxxx.mongodb.net/ludorganizador?retryWrites=true&w=majority
   ```

6. Haz clic en **"Save Changes"**
7. El servicio se redespliegará automáticamente

---

## Paso 7: Verificar en Producción

### 7.1 Ver logs en Render

1. En Render, ve a tu servicio
2. Ve a la pestaña **"Logs"**
3. Busca el mensaje:
   ```
   ✅ Conectado a MongoDB
   ```

### 7.2 Probar la aplicación

1. Abre tu aplicación en Netlify
2. Registra un nuevo usuario
3. Crea un evento
4. ¡Los datos ahora se guardan en MongoDB!

### 7.3 Verificar datos en Atlas

1. Ve a MongoDB Atlas
2. Haz clic en "Browse Collections"
3. Verás las colecciones:
   - `users`
   - `events`
   - `tables`
   - `freegames`
4. Haz clic en cada una para ver tus datos

---

## 🎉 ¡Listo!

Tu aplicación ahora usa MongoDB Atlas con persistencia real.

### Beneficios que ahora tienes:

✅ Los datos NO se pierden cuando Render reinicia
✅ Todos los usuarios ven los mismos datos
✅ Backups automáticos cada 24 horas (en plan gratuito)
✅ Puedes ver y gestionar datos desde Atlas

---

## 🔐 Seguridad - IMPORTANTE

### Para Producción:

1. **Cambiar acceso de red**:

   - En Atlas → Network Access
   - Elimina la regla `0.0.0.0/0`
   - Agrega solo las IPs de Render:
     1. Ve a tu servicio en Render
     2. Ve a Settings → Static Outbound IP Addresses
     3. Copia cada IP
     4. Agrégalas en Atlas

2. **Rotar contraseñas**:
   - Cambia la contraseña periódicamente
   - Atlas → Database Access → Edit User → Reset Password

---

## 📊 Monitorear tu Base de Datos

### Ver métricas en Atlas:

1. Ve a tu cluster en Atlas
2. Haz clic en "Metrics"
3. Verás:
   - Conexiones activas
   - Operaciones por segundo
   - Uso de almacenamiento
   - Network traffic

### Límites del plan gratuito:

- 512 MB de almacenamiento
- Conexiones compartidas
- Backups cada 24 horas (últimas 2 copias)

---

## 🆘 Solución de Problemas

### Error: "Authentication failed"

**Solución:**

- Verifica que la contraseña en la URI sea correcta
- Verifica que el usuario existe en Database Access

### Error: "Connection timeout"

**Solución:**

- Verifica que agregaste `0.0.0.0/0` en Network Access
- O agrega las IPs específicas de Render

### Error: "Database not found"

**Solución:**

- Verifica que el nombre de la DB está en la URI: `/ludorganizador?retry...`
- MongoDB creará la DB automáticamente al insertar datos

### Los datos no aparecen

**Solución:**

1. Ve a Atlas → Browse Collections
2. Refresh
3. Si están vacías, prueba crear un usuario desde la app
4. Revisa los logs del servidor para errores

---

## 📚 Recursos Adicionales

- **Documentación Atlas**: https://docs.atlas.mongodb.com/
- **Mongoose Docs**: https://mongoosejs.com/docs/
- **MongoDB University** (cursos gratis): https://university.mongodb.com/

---

¿Preguntas? Revisa los logs del servidor o de Atlas para más detalles.
