const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Servir archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, 'public')));

// Ruta raíz opcional que redirige al index
app.get('/', (req, res) => {
  res.redirect('/page/index.html');
});

app.listen(PORT, () => {
  console.log(`Servidor Node.js activo en http://localhost:${PORT}`);
});

