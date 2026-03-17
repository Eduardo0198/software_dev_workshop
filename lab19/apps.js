const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const csrf = require('csurf');
const db = require('./util/database');

const app = express();

const authRoutes = require('./routes/auth_routes');
const adminRoutes = require('./routes/admin_routes');
const personajesRoutes = require('./routes/personajes_routes');
const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: 'lab19-marvel-rbac-secret-string',
    resave: false,
    saveUninitialized: false,
}));
app.use(csrfProtection);
app.use((request, response, next) => {
    const roles = request.session.roles || [];
    const permissions = request.session.permissions || [];

    response.locals.isAuthenticated = request.session.isLoggedIn === true;
    response.locals.currentUser = request.session.user || null;
    response.locals.currentRoles = roles;
    response.locals.currentPermissions = permissions;
    response.locals.roleDetails = request.session.roleDetails || [];
    response.locals.permissionDetails = request.session.permissionDetails || [];
    response.locals.hasPermission = (permission) => permissions.includes(permission);
    response.locals.csrfToken = request.csrfToken();
    next();
});
app.use(express.static(path.join(__dirname, 'public')));

app.use(authRoutes);
app.use(adminRoutes);
app.use(personajesRoutes);

app.use((request, response, next) => {
    response.status(404).render('404');
});

app.use((error, request, response, next) => {
    if (error.code !== 'EBADCSRFTOKEN') {
        return next(error);
    }

    response.status(403).send('Token CSRF invalido. Recarga la pagina e intenta de nuevo.');
});

app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');

    db.execute('SELECT 1')
        .then(() => {
            console.log('Conexion a MySQL verificada correctamente.');
        })
        .catch((error) => {
            console.log('No se pudo conectar a MySQL.');
            console.log('Revisa DB_HOST, DB_PORT, DB_USER, DB_PASSWORD y DB_NAME en util/database.js o en tus variables de entorno.');
            console.log(error.code || error.message);
        });
});
