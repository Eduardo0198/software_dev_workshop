const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const csrf = require('csurf');
const db = require('./util/database');


//importamos multer para manejar archivos
const multer = require('multer');

const app = express();
const upload = multer({ dest: 'public/uploads/' });

const authRoutes = require('./routes/auth_routes');
const adminRoutes = require('./routes/admin_routes');
const personajesRoutes = require('./routes/personajes_routes');
const csrfProtection = csrf();


//fileStorage: Configuración para manejar el almacenamiento de archivos
const fileStorage = multer.diskStorage({
    destination: (request, file, callback) => {
        //'uploads': Directorio del servidor donde se subirán los archivos 
        callback(null, 'uploads');
    },
    filename: (request, file, callback) => {
        //Concatenamos el timestamp para evitar nombres duplicados
        callback(null, new Date().toISOString() + '-' + file.originalname);
    },
});

//fileFilter: Configuración para filtrar tipos de archivos
const fileFilter = (request, file, callback) => {
    if (file.mimetype == 'image/png' || 
        file.mimetype == 'image/jpg' ||
        file.mimetype == 'image/jpeg') {
        callback(null, true);
    } else {
        callback(null, false);
    }
};




app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: 'lab19-marvel-rbac-secret-string',
    resave: false,
    saveUninitialized: false,
}));

//Registro de multer después de bodyParser
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('imagen'));

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
