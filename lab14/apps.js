const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');

const app = express();

const personajesRoutes = require('./routes/personajes_routes');

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: 'lab14-marvel-session-secret-super-long-random-string',
    resave: false,
    saveUninitialized: false,
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(personajesRoutes);

app.use((request, response, next) => {
    response.status(404).render('404');
});

app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});
