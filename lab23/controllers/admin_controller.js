const Usuario = require('../models/usuario');

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

exports.getUsuarios = (request, response, next) => {
    Promise.all([
        Usuario.fetchAllWithRoles(),
        Usuario.fetchAllRoles(),
    ])
        .then(([[usuarios], [rolesDisponibles]]) => {
            response.render('admin_usuarios', {
                titulo: 'Administracion de roles',
                usuarios,
                rolesDisponibles,
                mensaje: obtenerFlash(request, 'mensajeAdmin'),
            });
        })
        .catch((error) => renderError(response, error));
};

exports.postActualizarRoles = (request, response, next) => {
    const usuarioId = Number(request.params.usuario_id);
    let rolesSeleccionados = request.body.roles || [];

    if (!Array.isArray(rolesSeleccionados)) {
        rolesSeleccionados = [rolesSeleccionados];
    }

    const roleIds = [...new Set(
        rolesSeleccionados
            .map((roleId) => Number(roleId))
            .filter((roleId) => Number.isInteger(roleId) && roleId > 0)
    )];

    if (!roleIds.length) {
        request.session.mensajeAdmin = `
            <div class="alert alert-warning">
                Debes asignar al menos un rol por usuario.
            </div>
        `;
        return request.session.save((error) => {
            if (error) {
                console.log(error);
            }
            response.redirect('/admin/usuarios');
        });
    }

    Usuario.findById(usuarioId)
        .then(([rows]) => {
            if (rows.length === 0) {
                response.status(404).render('404');
                return null;
            }

            return Usuario.assignRoles(usuarioId, roleIds)
                .then(() => rows[0]);
        })
        .then((usuario) => {
            if (!usuario) {
                return null;
            }

            const esUsuarioActual = request.session.user && Number(request.session.user.id) === usuarioId;

            if (!esUsuarioActual) {
                request.session.mensajeAdmin = `
                    <div class="alert alert-success">
                        Roles actualizados correctamente para ${usuario.nombre}.
                    </div>
                `;
                return request.session.save((error) => {
                    if (error) {
                        console.log(error);
                    }
                    response.redirect('/admin/usuarios');
                });
            }

            return Usuario.fetchAccessProfile(usuarioId)
                .then((accessProfile) => {
                    request.session.roles = accessProfile.roles;
                    request.session.roleDetails = accessProfile.roleDetails;
                    request.session.permissions = accessProfile.permissions;
                    request.session.permissionDetails = accessProfile.permissionDetails;
                    request.session.user = {
                        id: usuario.id,
                        nombre: usuario.nombre,
                        email: usuario.email,
                    };

                    if (accessProfile.permissions.includes('roles.assign')) {
                        request.session.mensajeAdmin = `
                            <div class="alert alert-success">
                                Tus roles se actualizaron correctamente y sigues teniendo acceso al panel RBAC.
                            </div>
                        `;
                        return request.session.save((error) => {
                            if (error) {
                                console.log(error);
                            }
                            response.redirect('/admin/usuarios');
                        });
                    }

                    request.session.mensajeCatalogo = `
                        <div class="alert alert-info">
                            Tus roles se actualizaron correctamente. Ya no tienes permiso para administrar asignaciones de roles.
                        </div>
                    `;
                    return request.session.save((error) => {
                        if (error) {
                            console.log(error);
                        }
                        response.redirect('/catalogo');
                    });
                });
        })
        .catch((error) => renderError(response, error));
};
