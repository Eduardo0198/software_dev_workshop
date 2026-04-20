module.exports = (request, response, next) => {
    if (!request.session.isLoggedIn) {
        request.session.mensajeLogin = `
            <div class="alert alert-warning">
                Debes iniciar sesion para acceder a esa ruta.
            </div>
        `;

        return request.session.save((error) => {
            if (error) {
                console.log(error);
            }
            response.redirect('/login');
        });
    }

    next();
};
