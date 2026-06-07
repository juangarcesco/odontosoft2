# 🦷 OdontoSoft

Sistema de gestión para clínica dental. Permite administrar pacientes, citas, tratamientos y pagos desde una interfaz web moderna.

> Proyecto en desarrollo activo — actualmente en Fase 1 (Backend & Autenticación)

---

## Stack tecnológico

**Backend**
- Node.js v24 + Express
- PostgreSQL + Prisma ORM 5.22
- JWT (jsonwebtoken) + bcryptjs
- dotenv, cors, helmet, nodemon

**Frontend** *(próximamente)*
- React + Vite
- TailwindCSS
- React Router v7
- TanStack Query v5

---

## Estructura del repositorio

```
odontosoft2/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma        # Modelos de la base de datos
│   │   ├── seed.js              # Datos iniciales (usuario admin)
│   │   └── migrations/          # Historial de migraciones SQL
│   ├── src/
│   │   ├── controllers/
│   │   │   └── auth.controller.js
│   │   ├── middlewares/
│   │   │   └── auth.middleware.js
│   │   ├── routes/
│   │   │   └── auth.routes.js
│   │   ├── app.js               # Configuración de Express
│   │   └── server.js            # Punto de entrada
│   ├── .env                     # Variables de entorno (no se sube a GitHub)
│   └── package.json
└── frontend/                    # Próximamente
```

---

## Requisitos previos

- [Node.js](https://nodejs.org/) v18 o superior
- [PostgreSQL](https://www.postgresql.org/) corriendo localmente o en Docker
- Git

---

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/juangarcesco/odontosoft2.git
cd odontosoft2/backend
```

### 2. Instalar dependencias

```bash
npm install
```

> **Nota:** Este proyecto usa Prisma 5.22.0 por compatibilidad con Node.js v24 en GitHub Codespaces.

### 3. Configurar variables de entorno

Crea el archivo `.env` en la carpeta `backend/`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/odontosoft"
JWT_SECRET="odontosoft_super_secret_2026"
JWT_EXPIRES_IN="8h"
PORT=3001
```

### 4. Generar el cliente de Prisma

```bash
npx prisma generate
```

### 5. Crear las tablas en la base de datos

```bash
npx prisma migrate dev --name init_usuarios
```

### 6. Crear el usuario administrador inicial

```bash
npm run seed
```

### 7. Iniciar el servidor

```bash
npm run dev
```

El servidor queda corriendo en `http://localhost:3001`

---

## Variables de entorno

| Variable | Descripción | Ejemplo |
|---|---|---|
| `DATABASE_URL` | Cadena de conexión a PostgreSQL | `postgresql://user:pass@localhost:5432/odontosoft` |
| `JWT_SECRET` | Clave secreta para firmar tokens JWT | cualquier string largo y aleatorio |
| `JWT_EXPIRES_IN` | Tiempo de expiración del token | `8h`, `1d`, `7d` |
| `PORT` | Puerto donde corre el servidor | `3001` |

---

## Scripts

```bash
npm run dev    # Inicia el servidor con nodemon (reinicio automático al guardar)
npm run seed   # Crea el usuario administrador en la base de datos
```

---

## Endpoints disponibles

### Autenticación

| Método | URL | Auth requerida | Descripción |
|---|---|---|---|
| `GET` | `/api/health` | No | Verifica que el servidor está corriendo |
| `POST` | `/api/auth/login` | No | Inicia sesión, devuelve token JWT |
| `GET` | `/api/auth/me` | ✅ Sí | Devuelve datos del usuario autenticado |

### Ejemplo: Login

**Request**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@odontosoft.com",
  "password": "admin123"
}
```

**Response**
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

### Ejemplo: Ruta protegida

```http
GET /api/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
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

## Roadmap

- [x] **Módulo 1 — Backend & Autenticación**
  - [x] Servidor Express configurado
  - [x] Base de datos PostgreSQL + Prisma
  - [x] Modelo de Usuario con roles
  - [x] Login con JWT
  - [x] Middleware de autenticación
  - [x] Usuario admin inicial (seed)

- [ ] **Módulo 1 — Frontend**
  - [ ] Proyecto React + Vite
  - [ ] Pantalla de Login
  - [ ] AuthContext y rutas protegidas
  - [ ] Layout base con sidebar

- [ ] **Módulo 2 — Pacientes**
- [ ] **Módulo 3 — Citas**
- [ ] **Módulo 4 — Tratamientos**
- [ ] **Módulo 5 — Pagos**

---

## Desarrollado con

- [Express](https://expressjs.com/)
- [Prisma](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)
