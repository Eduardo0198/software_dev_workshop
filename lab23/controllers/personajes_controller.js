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

function renderError(response, error) {
    console.log(error);

    if (error.code === 'ECONNREFUSED') {
        return response.status(500).send('No se pudo conectar a MySQL. Verifica que el servicio este encendido y que util/database.js use el host y puerto correctos.');
    }

    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
        return response.status(500).send('MySQL rechazo el acceso. Revisa el usuario o password configurados en util/database.js.');
    }

    if (error.code === 'ER_BAD_DB_ERROR') {
        return response.status(500).send('La base de datos lab19_marvel no existe. Importa primero el archivo lab19.sql en phpMyAdmin o MySQL.');
    }

    response.status(500).send('Error al interactuar con la base de datos. Revisa la configuracion de MySQL.');
}

exports.getInicio = (request, response, next) => {
    const cookies = leerCookies(request);

    definirCookies(response, [
        'ultima_seccion=inicio; Max-Age=3600; Path=/; HttpOnly'
    ]);

    Personaje.fetchAll()
        .then(([rows, fieldData]) => {
            response.render('inicio', {
                titulo: 'Inicio',
                ultimaSeccion: cookies.ultima_seccion || 'Aun no hay secciones previas registradas',
                visitasCatalogo: cookies.visitas_catalogo || 0,
                personajesAgregados: request.session.personajesAgregados || 0,
                totalPersonajes: rows.length,
                rolesUsuario: request.session.roles || [],
                permisosUsuario: request.session.permissions || []
            });
        })
        .catch((error) => renderError(response, error));
};

exports.getCatalogo = (request, response, next) => {
    const cookies = leerCookies(request);
    const visitasCatalogo = Number(cookies.visitas_catalogo || 0) + 1;

    definirCookies(response, [
        `visitas_catalogo=${visitasCatalogo}; Max-Age=3600; Path=/; HttpOnly`,
        'ultima_seccion=catalogo; Max-Age=3600; Path=/; HttpOnly'
    ]);

    Personaje.fetchAll()
        .then(([rows, fieldData]) => {
            response.render('catalogo', {
                titulo: 'Catalogo',
                personajes: rows,
                visitasCatalogo: visitasCatalogo,
                personajesAgregados: request.session.personajesAgregados || 0,
                mensaje: obtenerFlash(request, 'mensajeCatalogo')
            });
        })
        .catch((error) => renderError(response, error));
};

exports.getDetallePersonaje = (request, response, next) => {
    const id = request.params.personaje_id;

    Personaje.fetchOne(id)
        .then(([rows, fieldData]) => {
            if (rows.length === 0) {
                return response.status(404).render('404');
            }

            response.render('detail', {
                titulo: rows[0].nombre,
                personaje: rows[0],
                mensaje: obtenerFlash(request, 'mensajeDetalle')
            });
        })
        .catch((error) => renderError(response, error));
};

exports.getAgregar = (request, response, next) => {
    definirCookies(response, [
        'ultima_seccion=agregar; Max-Age=3600; Path=/; HttpOnly'
    ]);

    response.render('add', {
        titulo: 'Agregar personaje',
        mensaje: obtenerFlash(request, 'mensajeAgregar')
    });
};

exports.postAgregar = (request, response, next) => {
    const imagenPath = request.file ? '/' + request.file.path.replace(/\\/g, '/') : '';
    const personaje = new Personaje(
        null,
        request.body.nombre,
        request.body.descripcion,
        request.body.tipo,
        request.body.universo,
        request.body.imagen
    );

    personaje.save()
        .then(() => {
            request.session.personajesAgregados = (request.session.personajesAgregados || 0) + 1;
            request.session.mensajeCatalogo = `
                <div class="alert alert-success">
                    Personaje agregado correctamente en la base de datos. En esta sesion has agregado ${request.session.personajesAgregados} personaje(s).
                </div>
            `;
            response.redirect('/catalogo');
        })
        .catch((error) => renderError(response, error));
};

exports.getEditar = (request, response, next) => {
    Personaje.fetchOne(request.params.personaje_id)
        .then(([rows, fieldData]) => {
            if (rows.length === 0) {
                return response.status(404).render('404');
            }

            response.render('edit', {
                titulo: `Editar ${rows[0].nombre}`,
                personaje: rows[0]
            });
        })
        .catch((error) => renderError(response, error));
};

exports.postEditar = (request, response, next) => {
    Personaje.fetchOne(request.params.personaje_id)
        .then(([rows, fieldData]) => {
            if (rows.length === 0) {
                return response.status(404).render('404');
            }

            const imagenActual = rows[0].imagen;
            const imagenPath = request.file ? '/' + request.file.path.replace(/\\/g, '/') : imagenActual;

            const personaje = new Personaje(
                request.params.personaje_id,
                request.body.nombre,
                request.body.descripcion,
                request.body.tipo,
                request.body.universo,
                imagenPath
            );

            return personaje.update();
        })
        .then(() => {
            request.session.mensajeDetalle = `
                <div class="alert alert-success">
                    Personaje actualizado correctamente en la base de datos.
                </div>
            `;
            response.redirect(`/personajes/${request.params.personaje_id}`);
        })
        .catch((error) => renderError(response, error));
};

exports.getPreguntas = (request, response, next) => {
    definirCookies(response, [
        'ultima_seccion=preguntas; Max-Age=3600; Path=/; HttpOnly'
    ]);

    response.render('preguntas', {
        titulo: 'Preguntas'
    });
};


exports.getServicios = (request, response, next) => {
    response.render('servicios', {
        titulo: 'Servicios Web'
    });
};

exports.getProcedimientos = (request, response, next) => {
    response.render('procedimientos', {
        titulo: 'Procedimientos Almacenados',
        resultados: null,
        mensaje: null,
        accion: null,
        universo: ''
    });
};

exports.postProcedimientos = (request, response, next) => {
    const accion = request.body.accion;
    const universo = request.body.universo || null;
    const id = request.body.id ? Number(request.body.id) : null;
    const nombre = request.body.nombre || null;
    const descripcion = request.body.descripcion || null;
    const tipo = request.body.tipo || null;
    const universoInput = request.body.universo || null;
    const imagen = request.body.imagen || null;

    let promesa;

    if (accion === 'guardar') {
        promesa = db.execute(
            'CALL sp_guardar_personaje(?, ?, ?, ?, ?, ?)',
            [id, nombre, descripcion, tipo, universoInput, imagen]
        ).then(() => ({ mensaje: 'Procedimiento sp_guardar_personaje ejecutado correctamente.', resultados: null }));
    } else if (accion === 'listar') {
        promesa = db.execute(
            'CALL sp_obtener_personajes_por_universo(?)',
            [universo]
        ).then(([rows]) => ({
            mensaje: `Personajes del universo ${universo || 'todos'}.`,
            resultados: Array.isArray(rows) && Array.isArray(rows[0]) ? rows[0] : rows
        }));
    } else if (accion === 'contar') {
        promesa = db.execute(
            'CALL sp_contar_personajes_por_universo(?)',
            [universo]
        ).then(([rows]) => ({
            mensaje: `Conteo de personajes por universo ${universo || 'todos'}.`,
            resultados: Array.isArray(rows) && Array.isArray(rows[0]) ? rows[0] : rows
        }));
    } else {
        promesa = Promise.resolve({ mensaje: 'Acción no reconocida.', resultados: null });
    }

    promesa
        .then((data) => {
            response.render('procedimientos', {
                titulo: 'Procedimientos Almacenados',
                resultados: data.resultados,
                mensaje: data.mensaje,
                accion: accion,
                universo: universo || ''
            });
        })
        .catch((error) => renderError(response, error));
};