# 🌿 Guía de Git para OdontoSoft

> Cómo trabajar con ramas, hacer buenos commits y no dañar lo que ya funciona.

---

## La idea general

Piensa en Git como un árbol:

```
main (lo que funciona, lo que va a producción)
  │
  ├── feature/navbar-top        ← prueba el navbar arriba
  ├── feature/modulo2-pacientes ← desarrollo de pacientes
  └── feature/dark-mode         ← experimento de diseño
```

**La regla de oro:** `main` siempre debe funcionar. Los experimentos y desarrollos nuevos van en ramas separadas. Cuando algo está listo y probado, se une a `main`.

---

## Comandos esenciales

### Ver en qué rama estás
```bash
git branch
```
La rama activa tiene un `*` al lado.

### Ver todas las ramas (locales y remotas)
```bash
git branch -a
```

### Crear una rama nueva y moverte a ella
```bash
git checkout -b nombre-de-la-rama
```

### Moverte a una rama que ya existe
```bash
git checkout nombre-de-la-rama
```

### Ver el estado de tus archivos
```bash
git status
```

### Ver el historial de commits
```bash
git log --oneline
```

---

## Flujo de trabajo estándar

### 1. Siempre parte desde main actualizado
```bash
git checkout main
git pull origin main
```

### 2. Crea tu rama de feature
```bash
git checkout -b feature/navbar-top
```

### 3. Trabaja y haz commits frecuentes
```bash
# Ver qué cambió
git status

# Agregar archivos específicos
git add src/components/Navbar.jsx

# O agregar todo
git add .

# Hacer el commit
git commit -m "feat: agrega navbar horizontal con menú superior"
```

### 4. Subir la rama a GitHub
```bash
git push origin feature/navbar-top
```

### 5. Cuando está listo, unir a main
```bash
git checkout main
git merge feature/navbar-top
git push origin main
```

### 6. Borrar la rama (opcional, ya no la necesitas)
```bash
git branch -d feature/navbar-top
git push origin --delete feature/navbar-top
```

---

## Convención de nombres para ramas

| Prefijo | Cuándo usarlo | Ejemplo |
|---|---|---|
| `feature/` | Nueva funcionalidad | `feature/modulo2-pacientes` |
| `fix/` | Corrección de bug | `fix/login-error-cors` |
| `experiment/` | Prueba visual o técnica | `experiment/navbar-top` |
| `docs/` | Solo documentación | `docs/guia-despliegue` |
| `refactor/` | Reorganizar código sin cambiar función | `refactor/auth-context` |

---

## Convención de commits (Conventional Commits)

```
tipo: descripción corta en presente
```

| Tipo | Cuándo usarlo |
|---|---|
| `feat:` | Nueva funcionalidad |
| `fix:` | Corrección de bug |
| `docs:` | Solo documentación |
| `style:` | Cambios visuales (CSS, layout) |
| `refactor:` | Reorganización interna |
| `chore:` | Dependencias, configuración |

### Ejemplos reales de OdontoSoft

```bash
git commit -m "feat: agrega módulo de pacientes con CRUD completo"
git commit -m "fix: corrige error de CORS en producción"
git commit -m "style: cambia navbar de sidebar a barra superior"
git commit -m "docs: agrega guía de despliegue en Railway"
git commit -m "chore: actualiza dependencias de frontend"
```

### Commit con descripción larga (para cambios importantes)
```bash
git commit -m "feat: módulo 2 pacientes backend" -m "- Modelo Paciente en Prisma
- Endpoints CRUD: GET, POST, PUT, DELETE
- Validación con Zod
- Paginación en listado"
```

---

## Tu caso: probar navbar horizontal

Quieres experimentar con el layout cambiando el sidebar vertical por una barra de navegación horizontal (como la imagen que mostraste). Así lo harías:

### Paso 1 — Crear la rama del experimento
```bash
cd /workspaces/odontosoft2
git checkout main
git pull origin main
git checkout -b experiment/navbar-top
```

### Paso 2 — Hacer los cambios
Modificas `Sidebar.jsx`, `Layout.jsx` y lo que necesites.

### Paso 3 — Guardar el experimento
```bash
git add .
git commit -m "experiment: prueba navbar horizontal en lugar de sidebar"
git push origin experiment/navbar-top
```

### Resultado
Ahora tienes **dos versiones del layout** en GitHub:
- `main` → sidebar vertical (funciona, probado)
- `experiment/navbar-top` → navbar horizontal (en prueba)

Puedes cambiar entre ellas cuando quieras:
```bash
git checkout main                    # vuelves al sidebar
git checkout experiment/navbar-top  # vuelves al experimento
```

### Si te gusta el experimento y quieres adoptarlo
```bash
git checkout main
git merge experiment/navbar-top
git push origin main
```

### Si no te gusta y lo quieres descartar
```bash
git checkout main
git branch -d experiment/navbar-top
```

---

## Comandos para solucionar problemas comunes

### Deshaces el último commit (pero conservas los cambios)
```bash
git reset --soft HEAD~1
```

### Descartas todos los cambios sin guardar
```bash
git checkout .
```

### Guardas cambios temporalmente sin hacer commit (útil para cambiar de rama)
```bash
git stash          # guarda los cambios temporalmente
git stash pop      # los recuperas después
```

### Ves qué cambió en un archivo
```bash
git diff src/components/layout/Sidebar.jsx
```

---

## Estado actual de OdontoSoft en Git

```
main
  ├── feat: módulo 1 backend - autenticación JWT con Prisma y PostgreSQL
  ├── feat: módulo 1 frontend - login, layout, dashboard y autenticación JWT
  ├── docs: agrega README con estructura, endpoints y roadmap
  ├── docs: agrega documentación completa módulo 1
  └── chore: limpia node_modules y archivos raíz del tracking de git
```

---

## Próximos commits esperados

```bash
# Cuando termines el experimento del navbar
git commit -m "experiment: prueba navbar horizontal"

# Cuando arranques pacientes
git commit -m "feat: modelo Paciente en Prisma con migración"
git commit -m "feat: endpoints CRUD de pacientes en backend"
git commit -m "feat: módulo pacientes frontend con listado y formulario"
```

---

*Guarda este archivo como referencia. Con el tiempo estos comandos se vuelven automáticos.*
