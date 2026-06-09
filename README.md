# 🦷 OdontoSoft

Sistema de gestión para clínica dental. Permite administrar pacientes, citas, tratamientos y pagos desde una interfaz web moderna.

> **Estado actual:** Módulo 1 completado — Login, autenticación JWT, layout y dashboard funcionando.

---

## Stack tecnológico

**Backend**
- Node.js v24 + Express
- PostgreSQL 16 + Prisma ORM 5.22
- JWT (jsonwebtoken) + bcryptjs
- dotenv, cors, helmet, nodemon

**Frontend**
- React + Vite
- TailwindCSS v4
- React Router v7
- TanStack Query v5
- React Hook Form + Zod
- Axios

---

## Estructura del repositorio

```
odontosoft2/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── seed.js
│   │   └── migrations/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── auth.controller.js
│   │   ├── middlewares/
│   │   │   └── auth.middleware.js
│   │   ├── routes/
│   │   │   └── auth.routes.js
│   │   ├── app.js
│   │   └── server.js
│   ├── .env
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── router/
│   │   │   └── AppRouter.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── components/
│   │   │   └── layout/
│   │   │       ├── Layout.jsx
│   │   │       └── Sidebar.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── docs/
│   ├── modulo1_backend.md
│   ├── modulo1_frontend_conceptos.md
│   ├── modulo1_frontend_setup.md
│   └── modulo1_frontend_login.md
└── README.md
```

---

## Requisitos previos

- [Node.js](https://nodejs.org/) v18 o superior
- [PostgreSQL](https://www.postgresql.org/) v16
- Git
- GitHub Codespaces (entorno de desarrollo usado en este proyecto)

---

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/juangarcesco/odontosoft2.git
cd odontosoft2
```

### 2. Instalar dependencias del backend

```bash
cd backend
npm install
```

### 3. Configurar variables de entorno del backend

Crea el archivo `backend/.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/odontosoft"
JWT_SECRET="odontosoft_super_secret_2026"
JWT_EXPIRES_IN="8h"
PORT=3001
```

### 4. Instalar dependencias del frontend

```bash
cd ../frontend
npm install
```

### 5. Configurar la URL del backend en Axios

Abre `frontend/src/api/axios.js` y actualiza la `baseURL` con la URL pública de tu Codespace:

```js
const api = axios.create({
  baseURL: 'https://[CODESPACE_NAME]-3001.app.github.dev/api'
})
```

> El patrón es: `https://[nombre-de-tu-codespace]-3001.app.github.dev/api`
> Puedes ver el nombre con: `echo $CODESPACE_NAME`

---

## Iniciar el proyecto

Estos tres pasos son necesarios **cada vez que abres el Codespace**:

### 1. Iniciar PostgreSQL

```bash
sudo service postgresql start
```

### 2. Terminal 1 — Backend

```bash
cd /workspaces/odontosoft2/backend
npm run dev
```

### 3. Terminal 2 — Frontend

```bash
cd /workspaces/odontosoft2/frontend
npm run dev
```

Luego abre la pestaña **Ports** en Codespaces y abre el puerto **5173** en el navegador.

---

## Primera vez: migración y seed

Solo necesitas correr esto una vez al configurar el proyecto:

```bash
cd backend

# Generar el cliente de Prisma
npx prisma generate

# Crear las tablas en la base de datos
npx prisma migrate dev --name init_usuarios

# Crear el usuario administrador
npm run seed
```

---

## Variables de entorno

| Variable | Descripción | Ejemplo |
|---|---|---|
| `DATABASE_URL` | Cadena de conexión a PostgreSQL | `postgresql://postgres:postgres@localhost:5432/odontosoft` |
| `JWT_SECRET` | Clave secreta para firmar tokens JWT | cualquier string largo y aleatorio |
| `JWT_EXPIRES_IN` | Tiempo de expiración del token | `8h`, `1d`, `7d` |
| `PORT` | Puerto donde corre el servidor backend | `3001` |

---

## Scripts disponibles

**Backend**
```bash
npm run dev    # Inicia el servidor con nodemon
npm run seed   # Crea el usuario administrador inicial
```

**Frontend**
```bash
npm run dev    # Inicia Vite en modo desarrollo
npm run build  # Genera la versión de producción
```

---

## Endpoints disponibles

| Método | URL | Auth | Descripción |
|---|---|---|---|
| `GET` | `/api/health` | No | Verifica que el servidor está vivo |
| `POST` | `/api/auth/login` | No | Inicia sesión, devuelve token JWT |
| `GET` | `/api/auth/me` | ✅ Sí | Devuelve datos del usuario autenticado |

### Ejemplo: Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@odontosoft.com",
  "password": "admin123"
}
```

Respuesta:
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

---

## Credenciales de prueba

| Campo | Valor |
|---|---|
| Email | `admin@odontosoft.com` |
| Contraseña | `admin123` |
| Rol | `ADMIN` |

> ⚠️ Cambia estas credenciales antes de llevar el proyecto a producción.

---

## Roles del sistema

| Rol | Descripción |
|---|---|
| `ADMIN` | Acceso total al sistema |
| `ODONTOLOGO` | Acceso a pacientes, citas y tratamientos |
| `RECEPCIONISTA` | Acceso a pacientes y citas |

---

## Problemas conocidos en Codespaces

### PostgreSQL se apaga al cerrar el Codespace
PostgreSQL no persiste entre sesiones. Siempre debes iniciarlo manualmente:
```bash
sudo service postgresql start
```

### Axios no puede conectar con localhost
En Codespaces cada puerto tiene una URL pública. No uses `localhost:3001` en el frontend — usa la URL pública del Codespace. Ver paso 5 de instalación.

### Error de CORS
Durante desarrollo el backend tiene `cors({ origin: '*' })`. Además el puerto 3001 debe estar configurado como **Public** en la pestaña Ports de Codespaces.

### Prisma incompatible con Node.js v24
Se usa Prisma `5.22.0` por compatibilidad con Node.js v24 en Codespaces. No actualizar sin verificar compatibilidad.

---

## Documentación

Cada módulo tiene su propia documentación en la carpeta `docs/`:

| Archivo | Descripción |
|---|---|
| `modulo1_backend.md` | Backend, Prisma, PostgreSQL y autenticación JWT |
| `modulo1_frontend_conceptos.md` | Conceptos generales del frontend para principiantes |
| `modulo1_frontend_setup.md` | Configuración inicial del proyecto React + Vite |
| `modulo1_frontend_login.md` | Login, AuthContext, Router y Layout |

---

## Roadmap

- [x] **Módulo 1 — Backend**
  - [x] Servidor Express configurado
  - [x] PostgreSQL + Prisma ORM
  - [x] Modelo Usuario con roles
  - [x] Login con JWT
  - [x] Middleware de autenticación
  - [x] Seed con usuario admin

- [x] **Módulo 1 — Frontend**
  - [x] Proyecto React + Vite + TailwindCSS
  - [x] Axios configurado con interceptor JWT
  - [x] AuthContext y manejo de sesión
  - [x] Rutas protegidas con React Router v7
  - [x] Pantalla de Login con validación
  - [x] Layout con sidebar de navegación
  - [x] Dashboard de bienvenida

- [ ] **Módulo 2 — Pacientes**
- [ ] **Módulo 3 — Citas**
- [ ] **Módulo 4 — Tratamientos**
- [ ] **Módulo 5 — Pagos**
