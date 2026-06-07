const express = require('express');
const cors = require('cors'); // Importamos cors para permitir peticiones del frontend
const app = express();

// Middleware para procesar JSON
app.use(express.json());
// Middleware para permitir peticiones desde cualquier origen (ajustar luego a producción)
app.use(cors());

// --- Rutas ---

// Ruta raíz de bienvenida
app.get('/', (req, res) => {
    res.send('Bienvenido a la API de OdontoSoft. El servidor está activo.');
});

// Ruta de health check (verificación)
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'El servidor de OdontoSoft está funcionando correctamente' 
    });
});

// --- Inicio del servidor ---
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en: http://localhost:${PORT}`);
});