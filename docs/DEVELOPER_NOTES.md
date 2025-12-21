# Notas Importantes para el Desarrollador

## 🚨 Cambios Críticos en esta Actualización

### 1. Modelo de Usuario Actualizado

El modelo de `User` ha cambiado significativamente:

**ANTES:**

```javascript
{
  name: String (requerido),
  email: String (requerido, único),
  password: String (requerido)
}
```

**AHORA:**

```javascript
{
  name: String (requerido),
  username: String (requerido, único),
  email: String (opcional),
  password: String (requerido)
}
```

### 2. Autenticación

- El login ahora usa `username` en lugar de `email`
- Los tokens JWT incluyen `username` en el payload
- El endpoint `/auth/refresh` permite actualizar la información del usuario sin cerrar sesión

### 3. Tipos TypeScript

Todos los tipos relacionados con usuarios han sido actualizados:

```typescript
// Usuario básico
interface User {
  id: string;
  name: string;
  username: string; // ← NUEVO, requerido
  email?: string; // ← Ahora opcional
  role?: 'nuevo' | 'user' | 'admin';
  badges?: string[];
  approved?: boolean;
}

// Credenciales de login
interface LoginCredentials {
  username: string; // ← Cambió de email
  password: string;
}

// Datos de registro
interface RegisterData {
  name: string;
  username: string; // ← NUEVO
  password: string;
  confirmPassword: string; // ← NUEVO
}
```

## 🔧 Nuevas Funcionalidades

### Refresh de Usuario

```typescript
// En cualquier componente con acceso a useAuth
const { refreshCurrentUser } = useAuth();

// Actualizar información del usuario
await refreshCurrentUser();
```

### Tooltips de Ayuda

```tsx
import Tooltip from '../ui/Tooltip';

<Tooltip content="Texto de ayuda aquí" />;
```

### Paleta de Colores

Importar desde constants:

```typescript
import { COLORS, GRADIENTS, BADGE_COLORS } from '../constants';

// Usar en Tailwind
className={`bg-[${COLORS.primary.DEFAULT}]`}

// O mejor aún, usar las clases directamente
className="bg-[#FC2F00] hover:bg-[#D42800]"
```

## 📝 Patrones de Código

### 1. Actualización de Roles

Cuando se actualiza el rol de un usuario desde el admin panel:

```typescript
// En AdminPanel
const handleToggleRole = async (userId, newRole) => {
  // ... actualizar en backend

  // Si es el usuario actual, refrescar
  if (userId === currentUserId && onUserUpdate) {
    onUserUpdate(); // Esto llama a refreshCurrentUser()
  }
};
```

### 2. Validación de Contraseñas

En formularios que requieren contraseña:

```typescript
const [password, setPassword] = useState('');
const [confirmPassword, setConfirmPassword] = useState('');

// En validación
if (password !== confirmPassword) {
  setError('Las contraseñas no coinciden');
  return;
}
```

### 3. Tooltips Condicionales

Solo mostrar tooltips donde sea realmente útil:

```tsx
<div className="flex items-center gap-2">
  <h2>Título de Sección</h2>
  <Tooltip content="Explicación detallada de esta sección" />
</div>
```

## 🎨 Guía de Estilos

### Gradientes Principales

```tsx
// Header/Navegación
className = 'bg-gradient-to-r from-[#EC7D10] to-[#FC2F00]';

// Tarjetas destacadas
className = 'bg-gradient-to-r from-[#FFBC0A] to-[#EC7D10]';

// Elementos de comunidad
className = 'bg-gradient-to-r from-[#EC0868] to-[#C200FB]';
```

### Botones

```tsx
// Acción principal (CTA)
<Button variant="primary">  {/* Rojo #FC2F00 */}

// Acción secundaria
<Button variant="secondary"> {/* Naranja #EC7D10 */}

// Outline
<Button variant="outline">  {/* Borde amarillo #FFBC0A */}
```

### Focus States

Todos los inputs deben usar:

```tsx
className = 'focus:ring-2 focus:ring-[#FC2F00] focus:border-[#FC2F00]';
```

## ⚠️ Precauciones

### 1. Usuarios Existentes

Los usuarios existentes necesitan migración. Siempre ejecutar el script antes de desplegar:

```bash
node server/scripts/addUsernameField.js
```

### 2. Validación de Username

El username debe ser único. El backend valida esto:

```javascript
const existingUser = await User.findOne({ username });
if (existingUser) {
  return res.status(400).json({
    error: 'El nombre de usuario ya está registrado',
  });
}
```

### 3. Tokens JWT

Los tokens antiguos seguirán funcionando (tienen `email` en el payload), pero los nuevos incluyen `username`. El código maneja ambos casos.

### 4. Email Opcional

Aunque el email es opcional ahora, los usuarios existentes lo tienen. No asumir que siempre es `null`:

```typescript
// ✅ Correcto
const contactInfo = user.email || user.username;

// ❌ Incorrecto
const contactInfo = user.email; // Podría ser undefined
```

## 🧪 Testing

### Unit Tests Afectados

Si tienes tests, actualizar:

```javascript
// Antes
const mockUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123',
};

// Ahora
const mockUser = {
  name: 'Test User',
  username: 'testuser',
  password: 'password123',
};
```

### E2E Tests

Actualizar flujos de registro/login para usar username.

## 📚 Documentación

### Documentos Importantes

- `docs/CHANGELOG_20DIC2025.md` - Resumen completo de cambios
- `docs/DEPLOYMENT_GUIDE.md` - Guía de despliegue
- `docs/LIVE_PERSISTENCE.md` - Explicación de persistencia en vivo
- `server/scripts/README.md` - Scripts disponibles

### API Endpoints Nuevos

```
GET /api/auth/refresh
  Headers: Authorization: Bearer <token>
  Response: { token, user }
```

## 🐛 Debugging

### Problemas Comunes

#### "Token inválido" después de actualización

**Causa:** Token antiguo con formato email
**Solución:** Hacer logout y login nuevamente

#### "Username required" al registrar

**Causa:** Frontend no actualizado
**Solución:** Verificar que AuthForm tenga campo username

#### Roles no se actualizan

**Causa:** onUserUpdate no se llama o refreshCurrentUser falla
**Solución:** Verificar console.log en App.tsx

### Logs Útiles

```javascript
// En desarrollo, agregar logs temporales
console.log(
  'User from localStorage:',
  localStorage.getItem('ludorganizador_auth_user')
);
console.log('Token payload:', JSON.parse(atob(token.split('.')[1])));
```

## 🔐 Seguridad

### Validaciones Implementadas

1. **Contraseña mínima:** 6 caracteres
2. **Username único:** Validado en backend
3. **Confirmación de contraseña:** Tanto en registro como eventos
4. **Roles protegidos:** No puedes cambiar tu propio rol

### Consideraciones Futuras

- [ ] Rate limiting en login/registro
- [ ] Verificación de email (si se decide usar)
- [ ] 2FA (autenticación de dos factores)
- [ ] Validación de complejidad de contraseña

## 🚀 Optimizaciones Pendientes

### Mejoras Sugeridas

1. **Persistencia en Vivo:** Ver `docs/LIVE_PERSISTENCE.md`
2. **Caché de Usuarios:** Reducir llamadas a `/auth/refresh`
3. **Lazy Loading:** Cargar tooltips solo cuando se necesitan
4. **Code Splitting:** Separar admin panel del bundle principal

### Performance

Actualmente no hay problemas de performance, pero monitorear:

- Tiempo de carga inicial
- Tamaño del bundle
- Tiempo de respuesta de la API

## 📞 Contacto

Para preguntas sobre estos cambios:

- Revisar primero `docs/CHANGELOG_20DIC2025.md`
- Verificar `docs/DEPLOYMENT_GUIDE.md` para despliegue
- Consultar este documento para detalles técnicos

---

**Última actualización:** 20 de Diciembre 2025
