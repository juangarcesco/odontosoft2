# 🦷 OdontoSoft — Módulo 1: Backend & Autenticación

> **Fecha:** Junio 2026  
> **Estado:** ✅ Completado  
> **Repositorio:** `odontosoft2/backend`

---

## ¿Qué construimos?

El **núcleo del backend**: un servidor Express con base de datos PostgreSQL, ORM Prisma, y un sistema de autenticación con JWT (tokens). Esto es la base sobre la que se construirán todos los demás módulos (pacientes, citas, tratamientos, etc.).

---

## Tecnologías usadas y por qué

| Tecnología | Rol | Por qué la elegimos |
|---|---|---|
| **Node.js v24** | Entorno de ejecución | Ya lo tienes, es el más popular para backends JS |
| **Express** | Framework web | Ligero, flexible, enorme comunidad |
| **PostgreSQL** | Base de datos | Relacional, robusta, ideal para datos clínicos |
| **Prisma ORM** | Capa de datos | Simplifica las consultas SQL, genera tipos automáticamente |
| **bcryptjs** | Seguridad | Encripta contraseñas de forma segura (hashing) |
| **jsonwebtoken** | Autenticación | Genera tokens JWT para mantener sesiones |
| **dotenv** | Configuración | Carga variables de entorno desde `.env` |
| **cors** | Seguridad HTTP | Permite que el frontend (puerto 5173) llame al backend (3001) |
| **helmet** | Seguridad HTTP | Agrega headers de seguridad a las respuestas |
| **nodemon** | Desarrollo | Reinicia el servidor automáticamente al guardar cambios |

---

## Estructura de carpetas

```
backend/
├── prisma/
│   ├── schema.prisma       ← Define los modelos de la base de datos
│   └── seed.js             ← Crea datos iniciales (usuario admin)
├── src/
│   ├── controllers/
│   │   └── auth.controller.js   ← Lógica del login y /me
│   ├── middlewares/
│   │   └── auth.middleware.js   ← Verifica el token JWT
│   ├── routes/
│   │   └── auth.routes.js       ← Define las URLs de autenticación
│   ├── app.js              ← Configura Express (middlewares, rutas)
│   └── server.js           ← Arranca el servidor en el puerto
├── .env                    ← Variables secretas (NO se sube a GitHub)
└── package.json            ← Dependencias y scripts
```

---

## Paso a paso: qué hicimos y por qué

### 1. Instalar dependencias

```bash
npm install prisma @prisma/client bcryptjs jsonwebtoken dotenv cors helmet express-rate-limit zod
npm install -D nodemon
```

**Nota importante:** Tuvimos que fijar Prisma en la versión `5.22.0` porque la versión más reciente tenía un bug de compatibilidad con Node.js v24 en Codespaces:

```bash
npm install prisma@5.22.0 @prisma/client@5.22.0
```

---

### 2. Variables de entorno — `.env`

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/odontosoft"
JWT_SECRET="odontosoft_super_secret_2026"
JWT_EXPIRES_IN="8h"
PORT=3001
```

**¿Qué es cada variable?**

- `DATABASE_URL` → La dirección completa de tu base de datos PostgreSQL. Formato: `postgresql://usuario:contraseña@host:puerto/nombre_db`
- `JWT_SECRET` → Clave secreta para firmar y verificar tokens. Nunca la compartas.
- `JWT_EXPIRES_IN` → Cuánto dura un token antes de expirar. `8h` = 8 horas (una jornada laboral).
- `PORT` → Puerto donde corre el backend. El frontend corre en 5173, el backend en 3001.

> ⚠️ El archivo `.env` **nunca** debe subirse a GitHub. Asegúrate de que está en `.gitignore`.

---

### 3. Schema de Prisma — `prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Usuario {
  id        Int      @id @default(autoincrement())
  nombre    String
  email     String   @unique
  password  String
  rol       Rol      @default(RECEPCIONISTA)
  activo    Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum Rol {
  ADMIN
  ODONTOLOGO
  RECEPCIONISTA
}
```

**¿Qué hace cada parte?**

- `model Usuario` → Define la tabla `usuarios` en PostgreSQL.
- `@id @default(autoincrement())` → El campo `id` es la llave primaria y se genera automáticamente (1, 2, 3...).
- `@unique` → No pueden existir dos usuarios con el mismo email.
- `Rol` → Es un `enum`: solo puede tener uno de esos tres valores exactos.
- `@default(RECEPCIONISTA)` → Si no se especifica rol al crear un usuario, queda como RECEPCIONISTA.
- `createdAt / updatedAt` → Prisma los maneja automáticamente.

---

### 4. Comandos clave de Prisma

#### Generar el cliente
```bash
npx prisma generate
```
> Esto crea el código JavaScript que te permite hacer `prisma.usuario.findUnique(...)` etc. **Siempre córrelo después de cambiar el schema.**

#### Crear la migración (y aplicarla)
```bash
npx prisma migrate dev --name init_usuarios
```
> Crea el archivo SQL de migración en `prisma/migrations/` y lo aplica a la base de datos. El nombre `init_usuarios` es descriptivo, puedes poner lo que quieras.

**¿Qué es una migración?**  
Es el historial de cambios de tu base de datos. Cada vez que cambias el schema, creas una migración. Así puedes reproducir la base de datos exactamente en cualquier computador.

---

### 5. Seed — `prisma/seed.js`

```js
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const hash = await bcrypt.hash('admin123', 10)

  await prisma.usuario.upsert({
    where: { email: 'admin@odontosoft.com' },
    update: {},
    create: {
      nombre: 'Administrador',
      email: 'admin@odontosoft.com',
      password: hash,
      rol: 'ADMIN'
    }
  })

  console.log('✅ Usuario admin creado')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

**¿Qué hace?**

- `bcrypt.hash('admin123', 10)` → Encripta la contraseña. El `10` es el número de rondas de encriptación (más alto = más seguro, pero más lento). 10 es el estándar.
- `upsert` → "Update or Insert". Si el usuario ya existe, no hace nada (`update: {}`). Si no existe, lo crea. Así puedes correr el seed múltiples veces sin duplicar datos.

```bash
npm run seed
```

---

### 6. Configuración de Express — `src/app.js`

```js
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const authRoutes = require('./routes/auth.routes')

const app = express()

app.use(helmet())
app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

app.use('/api/auth', authRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'OdontoSoft' })
})

module.exports = app
```

**¿Qué hace cada línea?**

- `app.use(helmet())` → Agrega headers de seguridad automáticamente.
- `app.use(cors(...))` → Permite que solo `localhost:5173` (tu frontend) llame a este backend. Sin esto, el navegador bloquearía las peticiones.
- `app.use(express.json())` → Permite que Express entienda el cuerpo de las peticiones en formato JSON.
- `/api/health` → Ruta de "health check". Sirve para verificar que el servidor está vivo.

---

### 7. El Controller — `src/controllers/auth.controller.js`

El controller contiene la **lógica de negocio**. Aquí pasan las cosas importantes.

**Función `login`:**

```
1. Recibe email y password del body
2. Busca el usuario en la BD por email
3. Si no existe o está inactivo → error 401
4. Compara la contraseña con el hash guardado
5. Si no coincide → error 401
6. Si todo OK → genera un token JWT y lo devuelve
```

**¿Qué es un JWT?**

Un JSON Web Token es una cadena de texto cifrada que contiene información del usuario:

```
eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwicm9sIjoiQURNSU4ifQ.abc123...
```

Se divide en 3 partes separadas por puntos:
1. **Header** → Algoritmo usado
2. **Payload** → Datos (id, rol del usuario)
3. **Signature** → Firma que garantiza que no fue alterado

El frontend guarda este token y lo envía en cada petición para demostrar que está autenticado.

---

### 8. El Middleware — `src/middlewares/auth.middleware.js`

```js
const verificarToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1] // "Bearer TOKEN"

  if (!token) return res.status(401).json({ message: 'Token requerido' })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.usuario = decoded
    next()
  } catch (error) {
    return res.status(403).json({ message: 'Token inválido o expirado' })
  }
}
```

**¿Qué es un middleware?**

Es una función que se ejecuta **entre** que llega la petición y que se ejecuta el controller. Funciona como un guardia de seguridad.

**Flujo:**
```
Petición → [verificarToken] → Controller → Respuesta
               ↓ si falla
            Error 401/403
```

El token llega en el header `Authorization: Bearer eyJhbG...`. El middleware lo extrae, lo verifica, y si es válido agrega `req.usuario` con los datos del usuario para que el controller los use.

---

### 9. Las Rutas — `src/routes/auth.routes.js`

```js
router.post('/login', login)
router.get('/me', verificarToken, me)
```

**Rutas disponibles:**

| Método | URL | Protegida | ¿Qué hace? |
|---|---|---|---|
| `POST` | `/api/auth/login` | No | Recibe email/password, devuelve token |
| `GET` | `/api/auth/me` | ✅ Sí | Devuelve los datos del usuario autenticado |

---

## Problema que tuvimos y cómo lo resolvimos

### Error: `Cannot find module ...query_engine_bg.postgresql.wasm-base64.js`

**¿Por qué pasó?**  
Hay un bug de compatibilidad entre la versión más reciente de Prisma y Node.js v24 en el entorno de GitHub Codespaces.

**Solución:**
```bash
# Borrar todo y reinstalar limpio
rm -rf node_modules
npm install prisma@5.22.0 @prisma/client@5.22.0
npx prisma generate
```

Fijamos Prisma en la versión `5.22.0` que es estable y compatible.

---

## Cómo probar el backend

### 1. Verificar que el servidor está vivo

```
GET https://[tu-codespace]-3001.app.github.dev/api/health
```

Respuesta esperada:
```json
{ "status": "ok", "app": "OdontoSoft" }
```

### 2. Hacer login (con Thunder Client)

```
POST https://[tu-codespace]-3001.app.github.dev/api/auth/login

Body (JSON):
{
  "email": "admin@odontosoft.com",
  "password": "admin123"
}
```

Respuesta esperada:
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "usuario": {
    "id": 1,
    "nombre": "Administrador",
    "email": "admin@odontosoft.com",
    "rol": "ADMIN"
  }
}
```

### 3. Probar ruta protegida

```
GET https://[tu-codespace]-3001.app.github.dev/api/auth/me

Headers:
Authorization: Bearer [token del paso anterior]
```

---

## Scripts disponibles

```bash
npm run dev      # Inicia el servidor con nodemon (reinicio automático)
npm run seed     # Crea el usuario administrador inicial
```

---

## Flujo completo de autenticación

```
Frontend                    Backend                   Base de datos
   │                           │                            │
   │  POST /api/auth/login      │                            │
   │  { email, password }       │                            │
   │ ─────────────────────────► │                            │
   │                           │  findUnique({ email })     │
   │                           │ ──────────────────────────► │
   │                           │ ◄────────────────────────── │
   │                           │  usuario encontrado         │
   │                           │                            │
   │                           │  bcrypt.compare(password)  │
   │                           │  jwt.sign({ id, rol })     │
   │                           │                            │
   │ ◄───────────────────────── │                            │
   │  { token, usuario }        │                            │
   │                           │                            │
   │                           │                            │
   │  GET /api/auth/me          │                            │
   │  Authorization: Bearer ... │                            │
   │ ─────────────────────────► │                            │
   │                           │  jwt.verify(token)         │
   │                           │  req.usuario = decoded     │
   │ ◄───────────────────────── │                            │
   │  { id, rol }               │                            │
```

---

## ¿Qué sigue? — Módulo 1 Frontend

Con el backend listo, el siguiente paso es crear el **frontend en React + Vite** con:

- Pantalla de Login conectada a `/api/auth/login`
- Guardado del token en `localStorage`
- `AuthContext` para compartir el estado de sesión en toda la app
- Rutas protegidas (si no hay token, redirige al login)
- Layout base con sidebar para los demás módulos

---

*Documentación generada durante la sesión de desarrollo — OdontoSoft 2026*
