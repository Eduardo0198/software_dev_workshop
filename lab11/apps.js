const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const pagesRoutes = require("./routes/pages_routes");
const formsRoutes = require("./routes/forms_routes");
const app = express();

// Usamos el CSS que esta en public y el body parser para procesar los datos de los formularios
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(pagesRoutes);
app.use(formsRoutes);

app.use((req, res) => {
  res.status(404).send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>404</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
      <link rel="stylesheet" href="./style.css">
    </head>
    <body>
      <section class="container my-5">
        <div class="alert alert-danger shadow-sm">
          <h2 class="fw-bold">404 - Pagina no encontrada</h2>
          <p class="mb-0">La ruta que intentaste abrir no existe en este servidor.</p>
        </div>
      </section>
    </body>
    </html>
  `);
});

app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});