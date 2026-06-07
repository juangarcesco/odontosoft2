# Configuración Inicial del Proyecto OdontoSoft

Documentación del estado actual del sistema y la configuración del entorno.

## 1. Estructura del Proyecto
El proyecto está organizado para separar la lógica del servidor de la interfaz:
- `/backend`: Servidor Node.js con Express.
- `/frontend`: Interfaz de usuario (Vanilla JS).
- `/docs`: Documentación técnica.

## 2. Tecnologías y Entorno
- **Plataforma**: GitHub Codespaces.
- **Runtime**: Node.js v24+.
- **Framework Backend**: Express.js.
- **Herramientas de Desarrollo**: Nodemon (recarga automática).

## 3. Configuración de Seguridad (.gitignore)
Se han implementado archivos `.gitignore` en la raíz, `/backend` y `/frontend` para:
- Excluir `node_modules/` (dependencias pesadas).
- Proteger archivos de variables de entorno `.env` (credenciales de DB).
- Ignorar archivos de configuración de VS Code y logs del sistema.

## 4. Estado del Backend
- Servidor inicializado con `npm init`.
- Dependencias instaladas: `express`, `mongoose`, `dotenv`, `cors`, etc.
- Punto de entrada: `server.js`.
- Endpoints activos: 
  - `GET /` (Bienvenida).
  - `GET /api/health` (Estado del servidor).

---
*Nota: Este documento se actualizará conforme se avance en la conexión a la base de datos y la implementación de modelos.*