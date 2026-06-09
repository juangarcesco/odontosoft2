# 🦷 OdontoSoft — Módulo 1 explicado desde cero

> Esta guía explica todo lo que construimos en el Módulo 1 como si fuera la primera vez que escuchas estas palabras. No necesitas saber programar para entenderla.

---

## Antes de empezar: ¿qué es una aplicación web?

Cuando abres Facebook, Gmail o cualquier página en el navegador, estás usando una **aplicación web**. Por dentro, toda aplicación web tiene dos partes:

```
┌─────────────────────────────────────────────────────────┐
│                    TU NAVEGADOR                          │
│                                                         │
│   Lo que ves: botones, formularios, colores, textos     │
│                                                         │
│              Esto se llama FRONTEND                     │
└─────────────────────────┬───────────────────────────────┘
                          │
                          │  Se comunican por internet
                          │  enviando y recibiendo datos
                          │
┌─────────────────────────▼───────────────────────────────┐
│                    SERVIDOR                              │
│                                                         │
│   Lo que no ves: lógica, reglas, base de datos          │
│                                                         │
│              Esto se llama BACKEND                      │
└─────────────────────────────────────────────────────────┘
```

**En OdontoSoft:**
- El **frontend** es lo que ve la recepcionista o el odontólogo en su computador
- El **backend** es el programa que guarda los datos de los pacientes, verifica contraseñas, etc.

Son dos programas separados que se hablan entre sí.

---

## ¿Qué construimos en el Módulo 1?

El sistema de **autenticación** — es decir, el Login. Que la persona pueda entrar con su usuario y contraseña, y que el sistema recuerde quién es mientras navega.

Al final del módulo logramos:

✅ Una pantalla de Login con email y contraseña  
✅ El sistema verifica si las credenciales son correctas  
✅ Si son correctas, entra al Dashboard  
✅ Si no tiene sesión, no puede acceder a otras páginas  
✅ Botón de cerrar sesión  

---

## PARTE 1: El Backend

### ¿Qué es Node.js?

Node.js es el programa que hace correr el backend. Es como el motor de un carro — no lo ves, pero sin él nada funciona.

Antes de Node.js, el código que corría en servidores era Java, PHP, Python. Node.js permitió usar JavaScript (el lenguaje de las páginas web) también en el servidor. Esto es útil porque aprendes un solo lenguaje para todo.

### ¿Qué es Express?

Express es una librería que va encima de Node.js y facilita crear un servidor web. Sin Express tendrías que escribir muchísimo código para cosas básicas. Con Express es simple:

```
// Sin Express (complicado):
const http = require('http')
const server = http.createServer((req, res) => {
  if (req.url === '/login' && req.method === 'POST') {
    // mucho código...
  }
})

// Con Express (simple):
app.post('/login', (req, res) => {
  // lógica aquí
})
```

### ¿Qué es una API?

API significa "interfaz de programación de aplicaciones". En términos simples: **es el menú de un restaurante**.

Cuando vas a un restaurante no entras a la cocina a preparar tu comida. Le dices al mesero "quiero una hamburguesa" y él te la trae. La API funciona igual:

```
Frontend (el cliente)          API (el mesero)         Base de datos (la cocina)
       │                            │                          │
       │  "Dame los datos del       │                          │
       │   paciente Juan"           │   "Busca a Juan"         │
       │ ─────────────────────────► │ ──────────────────────► │
       │                            │ ◄────────────────────── │
       │ ◄───────────────────────── │  Aquí están los datos   │
       │  Datos de Juan             │                          │
```

El frontend nunca toca directamente la base de datos. Siempre pasa por la API.

### ¿Qué es PostgreSQL?

Es la **base de datos** — el lugar donde se guardan todos los datos de forma organizada. Piénsala como una hoja de Excel muy poderosa:

```
Tabla: Usuario
┌────┬──────────────────┬───────────────────────┬────────────────┬──────┐
│ id │ nombre           │ email                 │ password       │ rol  │
├────┼──────────────────┼───────────────────────┼────────────────┼──────┤
│  1 │ Administrador    │ admin@odontosoft.com   │ $2b$10$xyz...  │ ADMIN│
│  2 │ Dra. García      │ garcia@odontosoft.com  │ $2b$10$abc...  │ ODONT│
└────┴──────────────────┴───────────────────────┴────────────────┴──────┘
```

Cada fila es un registro. Cada columna es un campo. Nota que las contraseñas no se guardan como texto — se guardan encriptadas (eso es la columna password con `$2b$10$...`).

### ¿Qué es Prisma?

Prisma es un **traductor**. La base de datos habla SQL (un lenguaje especial para bases de datos). Tu código habla JavaScript. Prisma traduce entre los dos:

```javascript
// Sin Prisma (tienes que escribir SQL):
db.query("SELECT * FROM usuarios WHERE email = 'admin@odontosoft.com'")

// Con Prisma (JavaScript normal):
prisma.usuario.findUnique({ where: { email: 'admin@odontosoft.com' } })
```

Prisma también genera la estructura de las tablas automáticamente a partir de un archivo llamado `schema.prisma`.

---

## Los archivos del backend

### `prisma/schema.prisma` — El plano de la base de datos

Este archivo le dice a Prisma cómo deben ser las tablas. Es como el plano de una casa antes de construirla:

```prisma
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

**Explicación línea por línea:**

| Línea | Significado |
|---|---|
| `id Int @id @default(autoincrement())` | Un número que se asigna automáticamente: 1, 2, 3... |
| `nombre String` | Un campo de texto para el nombre |
| `email String @unique` | Un email, y no pueden repetirse |
| `password String` | La contraseña (guardada encriptada) |
| `rol Rol @default(RECEPCIONISTA)` | El rol del usuario. Si no se especifica, será RECEPCIONISTA |
| `activo Boolean @default(true)` | Si el usuario está activo o desactivado |
| `createdAt DateTime @default(now())` | La fecha en que se creó el registro (automática) |
| `updatedAt DateTime @updatedAt` | La fecha de la última modificación (automática) |

El `enum Rol` define que el campo `rol` **solo puede tener** uno de estos tres valores exactos. Si intentas poner "GERENTE" dará error.

### `prisma/seed.js` — El dato inicial

"Seed" en inglés significa semilla. Este archivo planta el primer dato en la base de datos: el usuario administrador.

Sin este usuario no podrías entrar al sistema por primera vez.

```javascript
await bcrypt.hash('admin123', 10)  // encripta la contraseña
await prisma.usuario.upsert({...}) // crea el usuario si no existe
```

El comando para correrlo es:
```bash
npm run seed
```

### `src/app.js` — La configuración del servidor

Aquí se configura Express con sus "poderes" adicionales:

```javascript
app.use(helmet())              // seguridad: protege contra ataques comunes
app.use(cors({ origin: '*' })) // permite que el frontend se comunique
app.use(express.json())        // permite recibir datos en formato JSON
app.use('/api/auth', authRoutes) // registra las rutas de autenticación
```

**¿Qué es JSON?**

JSON es el formato en que frontend y backend se envían datos. Es texto estructurado que ambos entienden:

```json
{
  "email": "admin@odontosoft.com",
  "password": "admin123"
}
```

### `src/controllers/auth.controller.js` — La lógica del login

Este es el archivo más importante del backend. Aquí está la lógica que verifica si un usuario puede entrar:

**Función `login` — paso a paso:**

```
1. Recibe el email y contraseña que escribió el usuario

2. Busca en la base de datos si existe un usuario con ese email
   → Si no existe: responde "Credenciales inválidas" (error 401)

3. Compara la contraseña con el hash guardado
   → Si no coincide: responde "Credenciales inválidas" (error 401)
   (Nota: nunca se comparan contraseñas directamente,
    siempre se comparan los hashes por seguridad)

4. Si todo está bien: genera un Token JWT y lo envía
```

**¿Por qué no se guarda el mensaje "contraseña incorrecta" vs "usuario no existe"?**

Por seguridad. Si el sistema dijera "ese email no existe", un atacante sabría qué emails están registrados. Al decir siempre "credenciales inválidas" no revela información.

### `src/middlewares/auth.middleware.js` — El guardia

Un **middleware** es código que se ejecuta en el medio — entre que llega una petición y que se procesa.

El middleware `verificarToken` funciona como el guardia de un edificio:

```
Petición llega
      │
      ▼
┌─────────────────────┐
│   verificarToken    │  ← El guardia
│                     │
│ ¿Traes token?       │
│   NO → Error 401    │  ← "No puedes entrar"
│   SÍ → ¿Es válido?  │
│     NO → Error 403  │  ← "Tu pase está vencido"
│     SÍ → Continúa   │  ← "Adelante"
└─────────────────────┘
      │
      ▼
  Controller
```

### `src/routes/auth.routes.js` — El directorio

Define qué URLs existen y qué función se ejecuta en cada una:

```javascript
router.post('/login', login)           // POST /api/auth/login → función login
router.get('/me', verificarToken, me)  // GET  /api/auth/me   → verifica token, luego función me
```

**¿Qué significa POST y GET?**

Son los métodos HTTP — la forma en que se envía una petición:

| Método | Para qué | Analogía |
|---|---|---|
| `GET` | Pedir información | "Dame los datos de Juan" |
| `POST` | Enviar información nueva | "Crea este nuevo paciente" |
| `PUT` | Actualizar información | "Modifica los datos de Juan" |
| `DELETE` | Borrar información | "Elimina a Juan" |

---

## ¿Qué es un Token JWT?

JWT significa "JSON Web Token". Es el sistema que usamos para mantener la sesión activa.

**El problema que resuelve:**

HTTP (el protocolo de internet) no tiene memoria. Cada petición es independiente. Sin JWT, el servidor no sabría quién eres de una petición a la siguiente — tendrías que escribir tu contraseña en cada click.

**La solución:**

Cuando haces login exitosamente, el servidor te da un "pase de acceso" — el token. Ese token lo guardas y lo presentas en cada petición posterior.

```
Primera vez (Login):
  → Envías: email + contraseña
  ← Recibes: token (válido por 8 horas)

Peticiones siguientes:
  → Envías: token
  ← Recibes: los datos que pediste
```

**¿Cómo se ve un token?**

```
eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwicm9sIjoiQURNSU4ifQ.Sg3abc123...
```

Son tres partes separadas por puntos:

```
HEADER                    PAYLOAD                   FIRMA
eyJhbGciOiJIUzI1NiJ9  .  eyJpZCI6MSwicm9sIjoiQURNSU4ifQ  .  Sg3abc123
"algoritmo usado"          "id: 1, rol: ADMIN"               "verificación"
```

El payload se puede leer (no está encriptado, solo codificado). La firma sí es secreta — garantiza que nadie modificó el token.

**¿Por qué dura 8 horas?**

Es un balance entre seguridad y comodidad. Si dura demasiado poco, el usuario tiene que hacer login constantemente. Si dura demasiado, un token robado da acceso por mucho tiempo. 8 horas = una jornada laboral.

---

## PARTE 2: El Frontend

### ¿Qué es React?

React es una librería de JavaScript para construir interfaces de usuario. Fue creada por Facebook en 2013 y hoy es la tecnología más usada para frontends web.

**La idea principal de React: componentes**

Un componente es un pedazo reutilizable de interfaz. Como bloques de LEGO:

```
Aplicación
├── Sidebar (componente)
│   ├── Logo
│   ├── MenuItem (componente, se repite)
│   ├── MenuItem
│   └── LogoutButton
└── Dashboard (componente)
    ├── WelcomeCard
    ├── StatCard (componente, se repite 3 veces)
    └── StatCard
```

Cada componente maneja su propia lógica y apariencia. Si cambias el componente `MenuItem`, todos los ítems del menú cambian automáticamente.

### ¿Qué es Vite?

Vite es la herramienta que empaqueta y sirve el proyecto React. Cuando guardas un archivo, Vite actualiza el navegador instantáneamente sin recargar toda la página. Hace el desarrollo mucho más rápido.

### ¿Qué es TailwindCSS?

TailwindCSS es una forma de darle estilos (colores, tamaños, espaciados) a los elementos usando clases predefinidas directamente en el HTML:

```jsx
// CSS tradicional (dos archivos):
// HTML: <button class="boton-azul">Entrar</button>
// CSS:  .boton-azul { background: blue; padding: 8px; border-radius: 4px; }

// Con Tailwind (todo en un lugar):
<button className="bg-blue-600 px-4 py-2 rounded text-white">Entrar</button>
```

---

## Los archivos del frontend

### `src/api/axios.js` — El mensajero

Axios es la librería que hace las peticiones HTTP al backend. Este archivo crea una instancia configurada con la URL del backend.

**El interceptor** es una función especial que se ejecuta automáticamente antes de cada petición. Lo usamos para agregar el token:

```
Petición sale del frontend
         │
         ▼
┌─────────────────────┐
│    Interceptor      │
│                     │
│ ¿Hay token guardado?│
│   SÍ → Lo agrega   │
│        al header    │
│   NO → La deja      │
│        pasar igual  │
└─────────────────────┘
         │
         ▼
    Backend recibe
    la petición con
    el token ya incluido
```

Sin el interceptor tendrías que recordar agregar el token manualmente en cada petición del código.

### `src/context/AuthContext.jsx` — La memoria compartida

**El problema:** React tiene muchos componentes. El Sidebar necesita saber el nombre del usuario. El Dashboard necesita saber el rol. ¿Cómo comparten esa información?

**Sin Context (complicado):**
```
App
└── Layout
    ├── Sidebar  ← necesita el nombre del usuario
    └── Dashboard ← necesita el rol del usuario
```
Tendrías que pasar los datos de componente en componente manualmente.

**Con Context (simple):**
```
AuthContext (pizarra central visible para todos)
  └── App
      └── Layout
          ├── Sidebar  ← lee directamente del Context
          └── Dashboard ← lee directamente del Context
```

El Context es como una pizarra en el centro de la oficina. Cualquiera puede leer lo que dice sin tener que preguntarle al jefe.

**¿Por qué usamos localStorage?**

localStorage es una pequeña bodega que tiene el navegador. Los datos guardados ahí persisten aunque recargues la página.

```
Sin localStorage:
  Usuario recarga la página → sesión perdida → debe hacer login de nuevo ❌

Con localStorage:
  Usuario recarga la página → AuthContext lee el token del localStorage → sesión activa ✅
```

### `src/router/AppRouter.jsx` — El guardia de páginas

React Router maneja la navegación sin recargar la página. AppRouter define qué página se muestra en cada URL:

```
URL /login      → muestra Login.jsx (página pública)
URL /           → muestra Dashboard.jsx (página protegida)
URL /pacientes  → muestra Pacientes.jsx (página protegida)
URL /cualquier-cosa-rara → redirige a /login
```

**Ruta protegida — el componente `RutaProtegida`:**

```
Usuario intenta entrar a /dashboard
              │
              ▼
    ¿Hay usuario en AuthContext?
              │
     ┌────────┴────────┐
     SÍ                NO
     │                 │
     ▼                 ▼
Muestra el       Redirige a
Dashboard        /login
```

### `src/App.jsx` — La raíz de todo

Es el componente principal. Envuelve la app con los "proveedores" globales:

```jsx
<AuthProvider>     ← hace que la sesión esté disponible en toda la app
  <AppRouter />    ← maneja la navegación
</AuthProvider>
```

El orden importa. AuthProvider debe estar afuera para que el Router pueda acceder a la sesión.

### `src/pages/Login.jsx` — La pantalla de login

Usa dos librerías para el formulario:

**React Hook Form** — maneja el estado del formulario (qué escribió el usuario, si fue enviado, si hay errores). Sin esta librería tendrías que escribir mucho código para rastrear cada cambio en cada campo.

**Zod** — valida los datos antes de enviarlos. Define reglas como "el email debe tener formato válido" o "la contraseña debe tener mínimo 6 caracteres". Si no se cumplen las reglas, muestra mensajes de error sin llamar al backend.

**Flujo completo del Login:**

```
1. Usuario escribe email y contraseña
         │
         ▼
2. Zod valida los campos
   ¿Email válido? ¿Contraseña >= 6 chars?
         │
    ┌────┴────┐
  Error      OK
    │         │
    ▼         ▼
Muestra    Axios envía POST
mensaje    a /api/auth/login
de error
              │
         ┌────┴────┐
       Error      OK
         │         │
         ▼         ▼
    "Email o     login() guarda
    contraseña   token y usuario
    incorrectos" en localStorage
                  │
                  ▼
             React Router
             redirige a /
                  │
                  ▼
             Dashboard ✅
```

### `src/components/layout/Sidebar.jsx` — El menú lateral

Muestra los enlaces de navegación. Usa `NavLink` de React Router — es igual a un enlace normal pero detecta automáticamente si estás en esa página y le aplica un estilo diferente (el fondo azul del ítem activo).

### `src/components/layout/Layout.jsx` — El contenedor

Combina el Sidebar con el contenido de la página actual. El componente `Outlet` es el espacio reservado donde React Router inyecta la página que corresponde a la URL actual.

```
┌────────────────────────────────────────┐
│  Layout                                │
│  ┌──────────┐  ┌─────────────────────┐│
│  │ Sidebar  │  │       Outlet        ││
│  │          │  │                     ││
│  │ Dashboard│  │  Aquí va la página  ││
│  │ Pacientes│  │  actual según la    ││
│  │ Citas    │  │  URL                ││
│  │          │  │                     ││
│  └──────────┘  └─────────────────────┘│
└────────────────────────────────────────┘
```

Cuando navegas a `/pacientes`, el Sidebar no se recarga — solo cambia el contenido del Outlet.

---

## Problemas que resolvimos y por qué pasaron

### Prisma no funcionaba con Node.js v24

**¿Por qué?** Prisma lanza versiones nuevas frecuentemente. La versión más reciente tenía un bug específico con Node.js v24 en el entorno de GitHub Codespaces.

**Solución:** Usar una versión anterior estable de Prisma (5.22.0) que sí funciona.

**Lección:** En programación, las versiones de las librerías importan mucho. No siempre lo más nuevo es lo más estable.

### PostgreSQL no persiste en Codespaces

**¿Por qué?** GitHub Codespaces es un servidor virtual que se "congela" cuando no lo usas. PostgreSQL es un servicio del sistema operativo que se apaga cuando el servidor se congela.

**Solución:** Iniciarlo manualmente cada vez:
```bash
sudo service postgresql start
```

**Lección:** En producción (el servidor real), esto no pasa — PostgreSQL está siempre corriendo.

### Axios apuntaba a localhost

**¿Por qué?** `localhost` significa "esta misma computadora". Cuando el frontend corre en Codespaces y hace una petición a `localhost:3001`, busca el puerto 3001 en el navegador del usuario — no en el servidor de Codespaces.

**Solución:** Usar la URL pública que Codespaces asigna a cada puerto:
```
https://[nombre-codespace]-3001.app.github.dev/api
```

**Lección:** En producción también cambiará esta URL — apuntará al dominio real del servidor.

### El .env quedó con datos duplicados

**¿Por qué?** Al editar con `nano`, la línea nueva se pegó junto a la vieja sin salto de línea.

**Solución:** Reescribir el archivo completo con un comando limpio:
```bash
cat > .env << 'EOF'
DATABASE_URL="..."
EOF
```

**Lección:** Al editar archivos de configuración, siempre verifica con `cat .env` que quedó bien.

---

## Flujo completo de principio a fin

```
USUARIO                    FRONTEND                   BACKEND                BASE DE DATOS
   │                           │                          │                       │
   │  Escribe email            │                          │                       │
   │  y contraseña             │                          │                       │
   │ ─────────────────────────►│                          │                       │
   │                           │  Zod valida los datos    │                       │
   │                           │  React Hook Form OK      │                       │
   │                           │                          │                       │
   │                           │  POST /api/auth/login    │                       │
   │                           │ ────────────────────────►│                       │
   │                           │                          │  Busca usuario        │
   │                           │                          │  por email            │
   │                           │                          │ ─────────────────────►│
   │                           │                          │◄─────────────────────-│
   │                           │                          │  Compara contraseñas  │
   │                           │                          │  Genera Token JWT     │
   │                           │◄────────────────────────-│                       │
   │                           │  { token, usuario }      │                       │
   │                           │  Guarda en localStorage  │                       │
   │                           │  AuthContext actualizado │                       │
   │◄─────────────────────────-│                          │                       │
   │  Redirige al Dashboard    │                          │                       │
   │                           │                          │                       │
   │  Navega a /pacientes      │                          │                       │
   │ ─────────────────────────►│                          │                       │
   │                           │  RutaProtegida: ¿hay     │                       │
   │                           │  sesión? SÍ → continúa  │                       │
   │                           │                          │                       │
   │                           │  GET /api/pacientes      │                       │
   │                           │  Authorization: Bearer.. │                       │
   │                           │ ────────────────────────►│                       │
   │                           │                          │  verificarToken       │
   │                           │                          │  JWT válido ✅        │
   │                           │                          │  Busca pacientes      │
   │                           │                          │ ─────────────────────►│
   │                           │                          │◄─────────────────────-│
   │                           │◄────────────────────────-│  Lista de pacientes   │
   │◄─────────────────────────-│                          │                       │
   │  Ve la lista de           │                          │                       │
   │  pacientes                │                          │                       │
```

---

## Glosario rápido

| Término | Significado simple |
|---|---|
| **Frontend** | Lo que ve el usuario en el navegador |
| **Backend** | El servidor que procesa la lógica y guarda datos |
| **API** | El canal de comunicación entre frontend y backend |
| **Base de datos** | Donde se guardan todos los datos de forma organizada |
| **Node.js** | Programa que hace correr el backend |
| **Express** | Librería que facilita crear servidores con Node.js |
| **PostgreSQL** | El sistema de base de datos que usamos |
| **Prisma** | Traductor entre JavaScript y la base de datos |
| **React** | Librería para construir interfaces de usuario |
| **Vite** | Herramienta que empaqueta y sirve React |
| **TailwindCSS** | Sistema de estilos con clases predefinidas |
| **Axios** | Librería para hacer peticiones HTTP |
| **JWT** | Token de acceso temporal que mantiene la sesión |
| **Hash** | Contraseña encriptada de forma irreversible |
| **Middleware** | Código que se ejecuta entre la petición y la respuesta |
| **Context** | Pizarra central de datos compartidos en React |
| **Router** | Sistema de navegación entre páginas en React |
| **localhost** | Esta misma computadora |
| **Puerto** | Canal específico de comunicación (3001, 5173) |
| **JSON** | Formato de texto para enviar datos entre sistemas |
| **Seed** | Datos iniciales que se insertan en la base de datos |
| **Migración** | Instrucciones para crear o modificar tablas en la BD |
| **.env** | Archivo con configuraciones secretas del proyecto |

---

*Con esto termina el Módulo 1. El Módulo 2 construye el CRUD de Pacientes — crear, leer, actualizar y eliminar pacientes.*
