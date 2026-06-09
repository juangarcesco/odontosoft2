# 🦷 OdontoSoft — Módulo 1: Frontend (Login, Layout y Dashboard)

> **Estado:** ✅ Completado  
> **Prerequisito:** `docs/modulo1_backend.md`  
> **Resultado:** Login funcional conectado al backend, Dashboard con sidebar y navegación

---

## ¿Qué construimos?

La interfaz visual completa del Módulo 1:

- Proyecto React + Vite configurado desde cero
- TailwindCSS para los estilos
- Pantalla de Login conectada al backend via Axios
- Sistema de sesión con AuthContext y localStorage
- Rutas protegidas con React Router v7
- Layout con sidebar de navegación
- Dashboard de bienvenida

---

## Stack del frontend

| Librería | Versión | Para qué |
|---|---|---|
| React + Vite | latest | Framework + bundler |
| React Router | v7 | Navegación entre páginas |
| TanStack Query | v5 | Fetch de datos y caché |
| React Hook Form | latest | Manejo de formularios |
| Zod | latest | Validación de datos |
| Axios | latest | Cliente HTTP |
| TailwindCSS | v4 | Estilos utilitarios |

---

## Estructura de carpetas

```
frontend/
├── src/
│   ├── api/
│   │   └── axios.js              ← Instancia de Axios con URL base e interceptor
│   ├── context/
│   │   └── AuthContext.jsx       ← Estado global de sesión
│   ├── router/
│   │   └── AppRouter.jsx         ← Rutas públicas y protegidas
│   ├── pages/
│   │   ├── Login.jsx             ← Pantalla de inicio de sesión
│   │   └── Dashboard.jsx         ← Página principal
│   ├── components/
│   │   └── layout/
│   │       ├── Layout.jsx        ← Contenedor sidebar + contenido
│   │       └── Sidebar.jsx       ← Menú lateral de navegación
│   ├── App.jsx                   ← Raíz de la app
│   └── main.jsx                  ← Punto de entrada de React
├── index.html
├── vite.config.js
└── package.json
```

---

## Paso a paso

### 1. Crear el proyecto React + Vite

```bash
cd /workspaces/odontosoft2
npm create vite@latest frontend -- --template react
cd frontend
npm install
```

### 2. Instalar dependencias

```bash
npm install axios react-router-dom@7 @tanstack/react-query react-hook-form zod @hookform/resolvers
npm install -D tailwindcss @tailwindcss/vite
```

### 3. Configurar TailwindCSS

**`vite.config.js`**
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
```

**`src/index.css`**
```css
@import "tailwindcss";
```

### 4. Crear las carpetas y archivos

```bash
cd src
mkdir -p api context pages router components/layout
touch api/axios.js context/AuthContext.jsx pages/Login.jsx pages/Dashboard.jsx router/AppRouter.jsx components/layout/Layout.jsx components/layout/Sidebar.jsx
```

---

## Archivos y su explicación

### `src/api/axios.js` — El puente frontend ↔ backend

Crea una instancia de Axios apuntando al backend. El interceptor agrega el token JWT automáticamente a cada petición.

```js
import axios from 'axios'

const api = axios.create({
  baseURL: 'https://[CODESPACE_NAME]-3001.app.github.dev/api'
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
```

> ⚠️ En Codespaces la `baseURL` usa la URL pública del puerto 3001, no `localhost`. El patrón es: `https://[CODESPACE_NAME]-3001.app.github.dev/api`

---

### `src/context/AuthContext.jsx` — La memoria de sesión

Maneja el estado global de autenticación. Guarda el token y datos del usuario en `localStorage` para que la sesión persista al recargar.

```jsx
import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(() => {
    const guardado = localStorage.getItem('usuario')
    return guardado ? JSON.parse(guardado) : null
  })

  const login = (token, datosUsuario) => {
    localStorage.setItem('token', token)
    localStorage.setItem('usuario', JSON.stringify(datosUsuario))
    setUsuario(datosUsuario)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    setUsuario(null)
  }

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
```

---

### `src/router/AppRouter.jsx` — El guardia de rutas

Define rutas públicas (login) y protegidas (todo lo demás). Si no hay sesión activa, redirige automáticamente al login.

```jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import Layout from '../components/layout/Layout'

const RutaProtegida = ({ children }) => {
  const { usuario } = useAuth()
  return usuario ? children : <Navigate to="/login" replace />
}

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <RutaProtegida>
            <Layout />
          </RutaProtegida>
        }>
          <Route index element={<Dashboard />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter
```

---

### `src/App.jsx` — La capa raíz

Une todos los proveedores globales. El orden importa: AuthProvider debe envolver al Router.

```jsx
import { AuthProvider } from './context/AuthContext'
import AppRouter from './router/AppRouter'

const App = () => {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  )
}

export default App
```

---

### `src/pages/Login.jsx` — Pantalla de inicio de sesión

Formulario con validación (Zod + React Hook Form) conectado al endpoint `POST /api/auth/login`.

**Flujo:**
1. Usuario ingresa email y contraseña
2. Zod valida los campos
3. Axios llama al backend
4. Backend responde con token y datos del usuario
5. `login()` guarda la sesión
6. React Router redirige al Dashboard

---

### `src/components/layout/Sidebar.jsx` — Menú lateral

Navegación principal de la app. Usa `NavLink` para resaltar la ruta activa automáticamente. Incluye botón de cerrar sesión.

---

### `src/components/layout/Layout.jsx` — Esqueleto visual

Contenedor que combina Sidebar + contenido de la página actual. `Outlet` es el espacio donde React Router inyecta la página correspondiente a la ruta activa.

```jsx
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

const Layout = () => {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
```

---

## Problemas encontrados y soluciones

### PostgreSQL no persiste en Codespaces

**Problema:** Cada vez que se reinicia el Codespace, PostgreSQL se apaga.

**Solución:** Iniciarlo manualmente al abrir el Codespace:

```bash
sudo service postgresql start
```

### Error CORS en Codespaces

**Problema:** El frontend no podía llamar al backend porque CORS bloqueaba la petición.

**Solución 1:** Cambiar `cors({ origin: 'http://localhost:5173' })` por `cors({ origin: '*' })` en `backend/src/app.js` durante desarrollo.

**Solución 2:** Hacer el puerto 3001 **público** en la pestaña Ports de Codespaces.

### Axios apuntaba a localhost

**Problema:** En Codespaces `localhost:3001` no funciona desde el navegador — cada puerto tiene una URL pública diferente.

**Solución:** Usar la URL pública del Codespace en `axios.js`:
```
https://[CODESPACE_NAME]-3001.app.github.dev/api
```

---

## Cómo iniciar el proyecto en una nueva sesión

Cada vez que abras el Codespace debes correr estos comandos:

```bash
# 1. Iniciar PostgreSQL
sudo service postgresql start

# 2. Terminal 1 — Backend
cd /workspaces/odontosoft2/backend
npm run dev

# 3. Terminal 2 — Frontend
cd /workspaces/odontosoft2/frontend
npm run dev
```

Luego abre el puerto 5173 en la pestaña Ports.

---

## Credenciales de prueba

| Campo | Valor |
|---|---|
| Email | `admin@odontosoft.com` |
| Contraseña | `admin123` |

---

## Resultado final

- ✅ Login con validación y manejo de errores
- ✅ Token JWT guardado en localStorage
- ✅ Rutas protegidas funcionando
- ✅ Sidebar con navegación activa
- ✅ Dashboard con datos del usuario conectado
- ✅ Botón de cerrar sesión

---

## ¿Qué sigue? — Módulo 2: Pacientes

Con el sistema de autenticación y el layout listos, el siguiente módulo agrega el CRUD completo de pacientes:

- Backend: modelo `Paciente` en Prisma, rutas y controller
- Frontend: listado, formulario de creación, edición y eliminación

---

*Continúa en: `docs/modulo2_pacientes.md`*
