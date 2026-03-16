const express = require('express');
const path = require('path');

const app = express();

const pagesRoutes = require('./routes/pages_routes');
const formsRoutes = require('./routes/forms_routes');

// Configuracion de EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.use(pagesRoutes);
app.use(formsRoutes);

// 404
app.use((req, res, next) => {
    res.status(404).render('404', {
        titulo: '404 - Pagina no encontrada'
    });
});

// Servidor
app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});