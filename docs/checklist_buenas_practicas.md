# ✅ Checklist de Buenas Prácticas — OdontoSoft Módulo 1

> Qué hicimos bien, qué falta, y qué debe mantenerse en todos los módulos siguientes.

---

## 🔐 Autenticación y Seguridad

### Lo que ya tenemos
- [x] Las contraseñas se guardan encriptadas con bcrypt (nunca en texto plano)
- [x] El mensaje de error es genérico: "Credenciales inválidas" (no revela si el email existe o no)
- [x] Los tokens JWT tienen fecha de expiración (8 horas)
- [x] El JWT_SECRET vive en `.env` y no está hardcodeado en el código
- [x] Las rutas protegidas verifican el token antes de responder
- [x] El middleware `verificarToken` es reutilizable para todos los módulos
- [x] El archivo `.env` está en `.gitignore` — nunca se sube a GitHub
- [x] Helmet agrega headers de seguridad HTTP automáticamente

### Lo que falta (para producción)
- [ ] Límite de intentos de login fallidos (rate limiting) — evita ataques de fuerza bruta
- [ ] Refresh tokens — renovar la sesión sin hacer login de nuevo
- [ ] HTTPS obligatorio en producción
- [ ] CORS configurado con origen específico (no `'*'`) en producción
- [ ] Logs de intentos de login fallidos
- [ ] Validación del body en el backend con Zod (actualmente solo validamos en el frontend)

---

## 🗄️ Base de Datos y Prisma

### Lo que ya tenemos
- [x] El schema define tipos de datos claros para cada campo
- [x] Se usa `enum` para el rol — solo acepta valores predefinidos
- [x] Los campos `createdAt` y `updatedAt` se manejan automáticamente
- [x] El campo `activo` permite desactivar usuarios sin borrarlos
- [x] Las migraciones están versionadas en `prisma/migrations/`
- [x] El seed usa `upsert` — se puede correr múltiples veces sin duplicar datos
- [x] Las credenciales de la BD viven en `.env`

### Lo que falta
- [ ] Índices en campos que se buscan frecuentemente (email, documento del paciente)
- [ ] Validaciones a nivel de base de datos (constraints)
- [ ] Backups automáticos de la base de datos
- [ ] Variables de entorno separadas para desarrollo y producción

---

## 🛠️ Estructura del Backend

### Lo que ya tenemos
- [x] Separación clara de responsabilidades: routes → controller → base de datos
- [x] Un archivo por responsabilidad (no todo en un solo archivo)
- [x] El servidor (`server.js`) separado de la configuración (`app.js`)
- [x] Rutas organizadas por módulo (`auth.routes.js`)
- [x] Controllers separados de las rutas
- [x] Middleware reutilizable para autenticación
- [x] Ruta `/api/health` para verificar que el servidor está vivo
- [x] nodemon para reinicio automático en desarrollo

### Lo que falta
- [ ] Manejo centralizado de errores (un middleware que capture todos los errores)
- [ ] Validación del body con Zod en el backend
- [ ] Variables de entorno validadas al arrancar (que falle rápido si falta algo)
- [ ] Logs estructurados (Winston o Pino) — saber qué pasa en producción
- [ ] Tests unitarios de los controllers

---

## ⚛️ Frontend — React

### Lo que ya tenemos
- [x] Separación clara: pages, components, context, router, api
- [x] Un archivo por componente
- [x] AuthContext centraliza el estado de sesión
- [x] El token se agrega automáticamente via interceptor de Axios
- [x] Rutas protegidas redirigen al login si no hay sesión
- [x] La sesión persiste al recargar (localStorage)
- [x] Validación de formulario en el cliente con Zod antes de llamar al backend
- [x] Estado de carga (`cargando`) en el botón — evita doble envío
- [x] Mensajes de error visibles al usuario
- [x] NavLink resalta automáticamente la ruta activa

### Lo que falta
- [ ] Manejo global de errores HTTP (si el token expira, redirigir al login automáticamente)
- [ ] Variables de entorno para la URL del backend (no hardcodeada en axios.js)
- [ ] Loading states en todas las peticiones
- [ ] Manejo de errores de red (qué pasa si el backend no responde)

---

## 📁 Organización del Proyecto

### Lo que ya tenemos
- [x] Backend y frontend en carpetas separadas
- [x] `node_modules` en `.gitignore` — no se sube al repositorio
- [x] `.env` en `.gitignore` — las credenciales no se suben
- [x] Carpeta `docs/` con documentación de cada módulo
- [x] README actualizado con instrucciones de instalación
- [x] Commits con mensajes descriptivos (Conventional Commits)
- [x] Ramas separadas para experimentos (`experiment/navbar-top`)
- [x] `main` siempre estable y funcional

### Lo que falta
- [ ] Archivo `.env.example` — muestra qué variables se necesitan sin revelar los valores
- [ ] `CHANGELOG.md` — historial de cambios por versión
- [ ] Archivo `docker-compose.yml` para levantar PostgreSQL fácilmente

---

## 🎨 Frontend — Diseño y UX

### Lo que ya tenemos
- [x] Diseño responsive (se adapta a diferentes tamaños de pantalla)
- [x] Navbar con dos niveles (barra superior + módulos)
- [x] Indicador visual de la página activa en el navbar
- [x] Avatar con inicial del usuario
- [x] Badge con el rol del usuario visible
- [x] Buscador visible en el navbar
- [x] Mensajes de error claros en el formulario de login
- [x] Botón deshabilitado mientras carga

### Lo que falta
- [ ] Favicon personalizado (el ícono de la pestaña del navegador)
- [ ] Página 404 personalizada
- [ ] Confirmación antes de cerrar sesión
- [ ] Responsive en móvil para el navbar (menú hamburguesa)
- [ ] Modo oscuro (opcional)

---

## 🚀 Lo más importante para el Módulo 2

Antes de arrancar Pacientes, estas dos cosas son prioritarias:

### 1. Archivo `.env.example` en el backend
```bash
# Crear este archivo en backend/
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/odontosoft"
JWT_SECRET="tu_clave_secreta_aqui"
JWT_EXPIRES_IN="8h"
PORT=3001
```
Así cualquier developer que clone el repo sabe qué variables necesita.

### 2. Variable de entorno para la URL del backend en el frontend
En lugar de tener esto hardcodeado en `axios.js`:
```js
baseURL: 'https://cautious-space-dollop-...-3001.app.github.dev/api'
```

Debería ser:
```js
baseURL: import.meta.env.VITE_API_URL
```

Y en `frontend/.env`:
```
VITE_API_URL=https://cautious-space-dollop-...-3001.app.github.dev/api
```

Así cuando cambies de Codespace o vayas a producción, solo cambias el `.env` — no el código.

---

## Resumen por prioridad

| Prioridad | Práctica | Módulo |
|---|---|---|
| 🔴 Alta | Validación Zod en el backend | Módulo 2 |
| 🔴 Alta | Variable de entorno para URL del backend | Antes del Módulo 2 |
| 🔴 Alta | Archivo `.env.example` | Antes del Módulo 2 |
| 🟡 Media | Manejo global de errores HTTP en frontend | Módulo 2 |
| 🟡 Media | Manejo centralizado de errores en backend | Módulo 2 |
| 🟡 Media | Rate limiting en login | Módulo 2 |
| 🟢 Baja | Logs estructurados | Módulo 3+ |
| 🟢 Baja | Tests unitarios | Módulo 3+ |
| 🟢 Baja | Refresh tokens | Antes de producción |
| 🟢 Baja | Responsive móvil navbar | Antes de producción |

---

*Actualizar este checklist al terminar cada módulo.*
