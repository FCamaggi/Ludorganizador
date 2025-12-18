# 📝 Guía Rápida de Comandos - Ludorganizador

## 🚀 Inicio Rápido

### Instalación Inicial

```bash
# Clonar repositorio
git clone https://github.com/FCamaggi/Ludorganizador.git
cd Ludorganizador

# Instalar dependencias frontend
npm install

# Instalar dependencias backend
cd server
npm install
cd ..

# Configurar variables de entorno
cp .env.example .env
cp server/.env.example server/.env

# Editar .env con tus configuraciones
# Windows
notepad .env
notepad server\.env

# macOS/Linux
nano .env
nano server/.env
```

### Iniciar Desarrollo

```bash
# Terminal 1 - Frontend (puerto 5173)
npm run dev

# Terminal 2 - Backend (puerto 3001)
cd server
npm run dev
```

---

## 🛠️ Comandos del Frontend

### Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev

# Iniciar con puerto específico
npm run dev -- --port 3000

# Limpiar caché y reiniciar
rm -rf node_modules .vite
npm install
npm run dev
```

### Build

```bash
# Build de producción
npm run build

# Preview del build
npm run preview

# Build y preview
npm run build && npm run preview

# Limpiar dist
rm -rf dist
npm run build
```

### Linting y Formato

```bash
# Ejecutar linter
npm run lint

# Fix automático
npm run lint -- --fix

# Verificar tipos TypeScript
npx tsc --noEmit
```

### Análisis

```bash
# Analizar bundle size
npm run build -- --mode analyze

# Ver árbol de dependencias
npm list
npm list --depth=0
```

---

## 🖥️ Comandos del Backend

### Desarrollo

```bash
cd server

# Iniciar con watch mode
npm run dev

# Iniciar normalmente
npm start

# Con nodemon (si está instalado)
npx nodemon index.js
```

### Base de Datos

```bash
# Conectar a MongoDB local
mongosh

# Usar base de datos
use ludorganizador

# Ver colecciones
show collections

# Ver usuarios
db.users.find().pretty()

# Ver eventos
db.events.find().pretty()

# Limpiar base de datos (¡CUIDADO!)
db.users.deleteMany({})
db.events.deleteMany({})
db.tables.deleteMany({})
db.freegames.deleteMany({})
```

### Administración

```bash
# Hacer admin a un usuario
node makeAdmin.js usuario@email.com

# Verificar estructura del proyecto
ls -la
tree -L 2  # si tree está instalado
```

---

## 🗃️ MongoDB

### Instalación (según SO)

#### macOS (Homebrew)

```bash
# Instalar MongoDB
brew tap mongodb/brew
brew install mongodb-community@7.0

# Iniciar MongoDB
brew services start mongodb-community@7.0

# Detener MongoDB
brew services stop mongodb-community@7.0

# Verificar estado
brew services list
```

#### Windows

```bash
# Descargar de: https://www.mongodb.com/try/download/community
# Instalar como servicio

# Iniciar MongoDB
net start MongoDB

# Detener MongoDB
net stop MongoDB
```

#### Linux (Ubuntu/Debian)

```bash
# Instalar
sudo apt-get install -y mongodb-org

# Iniciar
sudo systemctl start mongod

# Habilitar en inicio
sudo systemctl enable mongod

# Verificar estado
sudo systemctl status mongod
```

### Comandos MongoDB

```bash
# Conectar a MongoDB
mongosh

# Ver bases de datos
show dbs

# Usar base de datos
use ludorganizador

# Ver colecciones
show collections

# Queries útiles
db.users.find({})
db.users.countDocuments()
db.users.find({ role: 'admin' })

db.events.find({}).sort({ date: -1 })
db.events.find({ title: /juegos/i })

db.tables.find({ eventId: 'event_id_aqui' })

# Crear índices
db.users.createIndex({ email: 1 }, { unique: true })
db.events.createIndex({ date: 1 })

# Backup
mongodump --db ludorganizador --out ./backup

# Restore
mongorestore --db ludorganizador ./backup/ludorganizador
```

---

## 🐳 Docker (Opcional)

### MongoDB con Docker

```bash
# Ejecutar MongoDB en Docker
docker run -d \
  --name ludorganizador-mongo \
  -p 27017:27017 \
  -e MONGO_INITDB_DATABASE=ludorganizador \
  -v ludorganizador-data:/data/db \
  mongo:7

# Ver logs
docker logs ludorganizador-mongo

# Detener
docker stop ludorganizador-mongo

# Iniciar
docker start ludorganizador-mongo

# Eliminar
docker rm -f ludorganizador-mongo
```

### Aplicación Completa con Docker

```bash
# Build imagen frontend
docker build -t ludorganizador-frontend .

# Build imagen backend
docker build -t ludorganizador-backend ./server

# Ejecutar con docker-compose (si existe docker-compose.yml)
docker-compose up -d
docker-compose down
```

---

## 🔍 Debugging

### Frontend

```bash
# Modo debug
npm run dev -- --debug

# Ver network requests
# Abrir DevTools → Network → Filter: Fetch/XHR

# Ver errores de compilación
npm run build

# Source maps
# Los source maps están habilitados por defecto en desarrollo
```

### Backend

```bash
# Con inspector de Node.js
node --inspect server/index.js

# Con nodemon y inspector
nodemon --inspect server/index.js

# Ver logs detallados
DEBUG=* npm run dev

# Logs solo de Express
DEBUG=express:* npm run dev
```

---

## 🧪 Testing (Futuro)

### Frontend Tests

```bash
# Ejecutar tests (cuando se implementen)
npm test

# Tests en modo watch
npm test -- --watch

# Coverage
npm test -- --coverage

# Tests específicos
npm test -- EventCard
```

### Backend Tests

```bash
cd server

# Ejecutar tests
npm test

# Tests con coverage
npm test -- --coverage

# Tests específicos
npm test -- auth
```

---

## 📦 Gestión de Dependencias

### Frontend

```bash
# Ver dependencias desactualizadas
npm outdated

# Actualizar dependencias
npm update

# Actualizar a última versión
npm install <package>@latest

# Agregar dependencia
npm install <package>

# Agregar dependencia de desarrollo
npm install -D <package>

# Eliminar dependencia
npm uninstall <package>

# Verificar vulnerabilidades
npm audit

# Fix vulnerabilidades
npm audit fix
```

### Backend

```bash
cd server

# Lo mismo que frontend
npm outdated
npm update
npm install <package>
# etc...
```

---

## 🌿 Git

### Workflow Básico

```bash
# Ver estado
git status

# Ver cambios
git diff

# Agregar archivos
git add .
git add src/components/MyComponent.tsx

# Commit
git commit -m "feat: agregar nuevo componente"

# Push
git push origin main

# Pull
git pull origin main

# Ver log
git log --oneline --graph
```

### Branches

```bash
# Crear y cambiar a nueva rama
git checkout -b feature/nueva-caracteristica

# Cambiar de rama
git checkout main

# Ver ramas
git branch

# Eliminar rama local
git branch -d feature/mi-feature

# Eliminar rama remota
git push origin --delete feature/mi-feature
```

### Stash

```bash
# Guardar cambios temporalmente
git stash

# Ver stash
git stash list

# Aplicar último stash
git stash pop

# Aplicar stash específico
git stash apply stash@{0}
```

---

## 🚢 Deployment

### Netlify (Frontend)

```bash
# Build
npm run build

# Deploy manual
# Sube la carpeta dist/ a Netlify

# Con Netlify CLI
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### Render (Backend)

```bash
# Configurar en Render.com
# Build Command: cd server && npm install
# Start Command: cd server && npm start

# Variables de entorno a configurar:
# MONGODB_URI
# JWT_SECRET
# NODE_ENV=production
```

### Vercel (Frontend alternativo)

```bash
# Con Vercel CLI
npm install -g vercel
vercel --prod
```

---

## 🔧 Solución de Problemas

### Puerto ocupado

```bash
# Windows - Matar proceso en puerto 3001
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3001 | xargs kill -9
```

### Limpiar caché

```bash
# Frontend
rm -rf node_modules package-lock.json dist .vite
npm install

# Backend
cd server
rm -rf node_modules package-lock.json
npm install
```

### Reiniciar MongoDB

```bash
# macOS
brew services restart mongodb-community

# Linux
sudo systemctl restart mongod

# Windows
net stop MongoDB
net start MongoDB

# Docker
docker restart ludorganizador-mongo
```

### Errores de permisos

```bash
# macOS/Linux - Cambiar propietario
sudo chown -R $USER:$USER .

# Permisos de ejecución
chmod +x script.sh
```

---

## 📊 Comandos Útiles

### Ver tamaño de proyecto

```bash
# Total
du -sh .

# Por carpeta
du -sh */ | sort -hr

# Sin node_modules
du -sh --exclude=node_modules .
```

### Contar líneas de código

```bash
# Total
find . -name '*.tsx' -o -name '*.ts' | xargs wc -l

# Solo src
find src -name '*.tsx' -o -name '*.ts' | xargs wc -l

# Con cloc (si está instalado)
cloc src/
```

### Buscar en archivos

```bash
# Buscar texto
grep -r "searchText" src/

# Solo en archivos TypeScript
grep -r "searchText" --include="*.tsx" --include="*.ts" src/

# Con contexto
grep -r -C 3 "searchText" src/
```

---

## 🔐 Seguridad

### Generar JWT Secret

```bash
# Con Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Con openssl
openssl rand -hex 32

# Agregar a server/.env
echo "JWT_SECRET=$(openssl rand -hex 32)" >> server/.env
```

### Verificar vulnerabilidades

```bash
# Frontend y Backend
npm audit

# Ver detalles
npm audit --json

# Fix automático (cuidado)
npm audit fix

# Fix forzado (más cuidado)
npm audit fix --force
```

---

## 📝 Logs

### Ver logs en tiempo real

```bash
# Backend con pm2 (si está instalado)
pm2 logs ludorganizador

# Docker logs
docker logs -f ludorganizador-mongo

# Logs de sistema (Linux)
sudo journalctl -u mongod -f
```

### Crear logs

```bash
# Redirect stdout a archivo
npm run dev > app.log 2>&1

# Append a archivo existente
npm run dev >> app.log 2>&1
```

---

## ⚡ Scripts Personalizados

### Agregar al package.json

```json
{
  "scripts": {
    "dev": "vite",
    "dev:debug": "vite --debug",
    "dev:open": "vite --open",
    "clean": "rm -rf dist node_modules",
    "reinstall": "npm run clean && npm install",
    "check": "tsc --noEmit && npm run lint"
  }
}
```

---

## 🎓 Recursos Rápidos

### Documentación Local

```bash
# Abrir docs en navegador
# macOS
open docs/API.md
open docs/FRONTEND.md

# Windows
start docs/API.md

# Linux
xdg-open docs/API.md
```

### URLs Importantes

```bash
# Desarrollo
Frontend: http://localhost:5173
Backend:  http://localhost:3001/api
Health:   http://localhost:3001/api/health
```

---

## 💡 Tips

### Alias útiles (agregar a .bashrc o .zshrc)

```bash
# Alias para desarrollo
alias ludo-dev='cd ~/Ludorganizador && npm run dev'
alias ludo-api='cd ~/Ludorganizador/server && npm run dev'
alias ludo-mongo='mongosh ludorganizador'

# Función para abrir ambos en tmux
ludo-start() {
  tmux new-session -d -s ludo
  tmux split-window -h
  tmux send-keys -t ludo:0.0 'cd ~/Ludorganizador && npm run dev' Enter
  tmux send-keys -t ludo:0.1 'cd ~/Ludorganizador/server && npm run dev' Enter
  tmux attach-session -t ludo
}
```

---

¡Con estos comandos tienes todo lo necesario para desarrollar eficientemente en Ludorganizador! 🎲
