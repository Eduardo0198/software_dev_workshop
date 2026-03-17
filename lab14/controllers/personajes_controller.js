const Personaje = require('../models/personajes');

function leerCookies(request) {
    const cookieHeader = request.get('Cookie');
    const cookies = {};

    if (!cookieHeader) {
        return cookies;
    }

    for (const cookie of cookieHeader.split(';')) {
        const partes = cookie.trim().split('=');
        const nombre = partes.shift();
        const valor = partes.join('=');

        if (nombre) {
            cookies[nombre] = decodeURIComponent(valor || '');
        }
    }

    return cookies;
}

function definirCookies(response, cookies) {
    response.setHeader('Set-Cookie', cookies);
}

function obtenerFlash(request, nombreFlash) {
    const mensaje = request.session[nombreFlash] || '';
    delete request.session[nombreFlash];
    return mensaje;
}

exports.getInicio = (request, response, next) => {
    const cookies = leerCookies(request);

    definirCookies(response, [
        'ultima_seccion=inicio; Max-Age=3600; Path=/; HttpOnly'
    ]);

    response.render('inicio', {
        titulo: 'Inicio',
        ultimaSeccion: cookies.ultima_seccion || 'Aun no hay secciones previas registradas',
        visitasCatalogo: cookies.visitas_catalogo || 0,
        accesoPermitido: request.session.accesoPermitido === true,
        personajesAgregados: request.session.personajesAgregados || 0,
        ultimoAccesoSeguro: request.session.ultimoAccesoSeguro || 'Sin acceso validado'
    });
};

exports.getCatalogo = (request, response, next) => {
    const cookies = leerCookies(request);
    const visitasCatalogo = Number(cookies.visitas_catalogo || 0) + 1;
    const personajes = Personaje.fetchAll();

    definirCookies(response, [
        `visitas_catalogo=${visitasCatalogo}; Max-Age=3600; Path=/; HttpOnly`,
        'ultima_seccion=catalogo; Max-Age=3600; Path=/; HttpOnly'
    ]);

    response.render('catalogo', {
        titulo: 'Catalogo',
        personajes: personajes,
        visitasCatalogo: visitasCatalogo,
        personajesAgregados: request.session.personajesAgregados || 0,
        accesoPermitido: request.session.accesoPermitido === true,
        mensaje: obtenerFlash(request, 'mensajeCatalogo')
    });
};

exports.getAgregar = (request, response, next) => {
    if (!request.session.accesoPermitido) {
        request.session.mensajeAcceso = `
            <div class="alert alert-warning">
                Primero debes validar tu acceso seguro para poder agregar personajes.
            </div>
        `;
        return response.redirect('/acceso');
    }

    definirCookies(response, [
        'ultima_seccion=agregar; Max-Age=3600; Path=/; HttpOnly'
    ]);

    response.render('add', {
        titulo: 'Agregar personaje',
        mensaje: obtenerFlash(request, 'mensajeAgregar')
    });
};

exports.postAgregar = (request, response, next) => {
    if (!request.session.accesoPermitido) {
        request.session.mensajeAcceso = `
            <div class="alert alert-warning">
                Tu sesion no tiene permisos para agregar personajes. Vuelve a validar tu acceso.
            </div>
        `;
        return response.redirect('/acceso');
    }

    const personaje = new Personaje(
        request.body.nombre,
        request.body.descripcion,
        request.body.tipo,
        request.body.universo,
        request.body.imagen
    );

    personaje.save();
    request.session.personajesAgregados = (request.session.personajesAgregados || 0) + 1;
    request.session.mensajeCatalogo = `
        <div class="alert alert-success">
            Personaje agregado correctamente. En esta sesion has agregado ${request.session.personajesAgregados} personaje(s).
        </div>
    `;

    response.redirect('/catalogo');
};

exports.getPreguntas = (request, response, next) => {
    definirCookies(response, [
        'ultima_seccion=preguntas; Max-Age=3600; Path=/; HttpOnly'
    ]);

    response.render('preguntas', {
        titulo: 'Preguntas'
    });
};

exports.getAcceso = (request, response, next) => {
    definirCookies(response, [
        'ultima_seccion=acceso; Max-Age=3600; Path=/; HttpOnly'
    ]);

    response.render('acceso', {
        titulo: 'Acceso seguro',
        mensaje: obtenerFlash(request, 'mensajeAcceso'),
        accesoPermitido: request.session.accesoPermitido === true,
        ultimoAccesoSeguro: request.session.ultimoAccesoSeguro || 'Sin acceso validado'
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
        request.session.accesoPermitido = false;
        request.session.mensajeAcceso = `
            <div class="alert alert-danger">
                Contraseña inválida. Debe tener al menos 8 caracteres, una mayúscula, un número y coincidir en ambos campos.
            </div>
        `;
        return response.redirect('/acceso');
    }

    request.session.accesoPermitido = true;
    request.session.ultimoAccesoSeguro = new Date().toLocaleString('es-MX');
    request.session.mensajeAcceso = `
        <div class="alert alert-success">
            Contraseña validada correctamente. La sesion quedo activa.
        </div>
    `;

    response.redirect('/acceso');
};

exports.postLogout = (request, response, next) => {
    request.session.destroy(() => {
        response.setHeader('Set-Cookie', [
            'ultima_seccion=logout; Max-Age=3600; Path=/; HttpOnly',
            'connect.sid=; Max-Age=0; Path=/; HttpOnly'
        ]);
        response.redirect('/');
    });
};
