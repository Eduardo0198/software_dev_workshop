const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');

function obtenerFlash(request, nombreFlash) {
    const mensaje = request.session[nombreFlash] || '';
    delete request.session[nombreFlash];
    return mensaje;
}

exports.getLogin = (request, response, next) => {
    response.render('login', {
        titulo: 'Iniciar sesion',
        mensaje: obtenerFlash(request, 'mensajeLogin')
    });
};

exports.getSignup = (request, response, next) => {
    response.render('signup', {
        titulo: 'Crear cuenta',
        mensaje: obtenerFlash(request, 'mensajeSignup')
    });
};

exports.postSignup = (request, response, next) => {
    const nombre = (request.body.nombre || '').trim();
    const email = (request.body.email || '').trim().toLowerCase();
    const password = request.body.password || '';
    const confirmPassword = request.body.confirmPassword || '';

    if (!nombre || !email || !password || password !== confirmPassword) {
        request.session.mensajeSignup = `
            <div class="alert alert-danger">
                Revisa los datos del registro. Todos los campos son obligatorios y las contrasenas deben coincidir.
            </div>
        `;
        return response.redirect('/signup');
    }

    Usuario.findByEmail(email)
        .then(([rows, fieldData]) => {
            if (rows.length > 0) {
                request.session.mensajeSignup = `
                    <div class="alert alert-warning">
                        Ya existe un usuario registrado con ese correo.
                    </div>
                `;
                return response.redirect('/signup');
            }

            const usuario = new Usuario(nombre, email, password);

            return usuario.save()
                .then(() => {
                    request.session.mensajeLogin = `
                        <div class="alert alert-success">
                            Cuenta creada correctamente. Ahora puedes iniciar sesion.
                        </div>
                    `;
                    response.redirect('/login');
                });
        })
        .catch((error) => {
            console.log(error);

            if (error.code === 'ER_DUP_ENTRY') {
                request.session.mensajeSignup = `
                    <div class="alert alert-warning">
                        Ya existe un usuario registrado con ese correo.
                    </div>
                `;
                return response.redirect('/signup');
            }

            request.session.mensajeSignup = `
                <div class="alert alert-danger">
                    No fue posible crear el usuario. Revisa la base de datos e intenta de nuevo.
                </div>
            `;
            response.redirect('/signup');
        });
};

exports.postLogin = (request, response, next) => {
    const email = (request.body.email || '').trim().toLowerCase();
    const password = request.body.password || '';

    Usuario.findByEmail(email)
        .then(([rows, fieldData]) => {
            if (rows.length === 0) {
                request.session.mensajeLogin = `
                    <div class="alert alert-danger">
                        Credenciales invalidas. Verifica tu correo y contrasena.
                    </div>
                `;
                return response.redirect('/login');
            }

            const usuario = rows[0];

            return bcrypt.compare(password, usuario.password)
                .then((doMatch) => {
                    if (!doMatch) {
                        request.session.mensajeLogin = `
                            <div class="alert alert-danger">
                                Credenciales invalidas. Verifica tu correo y contrasena.
                            </div>
                        `;
                        return response.redirect('/login');
                    }

                    request.session.isLoggedIn = true;
                    request.session.user = {
                        id: usuario.id,
                        nombre: usuario.nombre,
                        email: usuario.email
                    };

                    return request.session.save((error) => {
                        if (error) {
                            console.log(error);
                        }
                        response.redirect('/');
                    });
                });
        })
        .catch((error) => {
            console.log(error);
            request.session.mensajeLogin = `
                <div class="alert alert-danger">
                    No fue posible iniciar sesion. Revisa la base de datos e intenta de nuevo.
                </div>
            `;
            response.redirect('/login');
        });
};

exports.postLogout = (request, response, next) => {
    request.session.destroy(() => {
        response.redirect('/login');
    });
};

exports.redirectAcceso = (request, response, next) => {
    response.redirect('/login');
};
