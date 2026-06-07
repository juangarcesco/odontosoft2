const express = require('express');
const cors = require('cors'); // Asegúrate de haber hecho: npm install cors
const app = express();

app.use(cors()); // Habilita CORS para todas las rutas

// Tu ruta de prueba
app.get('/api/health', (req, res) => {
    res.json({ message: "¡El backend de OdontoSoft está vivo y conectado!" });
});

app.listen(3000, () => {
    console.log('Servidor corriendo en puerto 3000');
});