const Personaje = require('../models/personajes');

exports.getInicio = (request, response, next) => {
    response.render('inicio', {
        titulo: 'Inicio'
    });
};

exports.getCatalogo = (request, response, next) => {

    const personajes = Personaje.fetchAll();

    response.render('catalogo', {
        titulo: 'Catalogo',
        personajes: personajes
    });
};

exports.getAgregar = (request, response, next) => {
    response.render('add', {
        titulo: 'Agregar personaje'
    });
};

exports.postAgregar = (request, response, next) => {
    const personaje = new Personaje(
        request.body.nombre,
        request.body.descripcion,
        request.body.tipo,
        request.body.universo,
        request.body.imagen
    );

    personaje.save();

    response.redirect('/catalogo');
};

exports.getPreguntas = (request, response, next) => {
    response.render('preguntas', {
        titulo: 'Preguntas'
    });
};

exports.getAcceso = (request, response, next) => {
    response.render('acceso', {
        titulo: 'Acceso seguro',
        mensaje: ''
    });
};

exports.postGuardarPassword = (request, response, next) => {
    const password = request.body.password || '';
    const confirmPassword = request.body.confirmPassword || '';

    const passwordValida =
        password.length >= 8 &&
        /[A-Z]/.test(password) &&
        /[0-9]/.test(password) &&
        password === confirmPassword;

    if (!passwordValida) {
        return response.status(422).render('acceso', {
            titulo: 'Acceso seguro',
            mensaje: `
                <div class="alert alert-danger">
                    Contraseña inválida. Debe tener al menos 8 caracteres, una mayúscula, un número y coincidir en ambos campos.
                </div>
            `
        });
    }

    response.render('acceso', {
        titulo: 'Acceso seguro',
        mensaje: `
            <div class="alert alert-success">
                Contraseña validada correctamente.
            </div>
        `
    });
};
