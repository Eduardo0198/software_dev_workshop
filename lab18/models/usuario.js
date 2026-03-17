const bcrypt = require('bcryptjs');
const db = require('../util/database');

module.exports = class Usuario {
    constructor(nombre, email, password) {
        this.nombre = nombre;
        this.email = email;
        this.password = password;
    }

    save() {
        return bcrypt.hash(this.password, 12)
            .then((passwordCifrado) => {
                return db.execute(
                    'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)',
                    [this.nombre, this.email, passwordCifrado]
                );
            });
    }

    static findByEmail(email) {
        return db.execute('SELECT * FROM usuarios WHERE email = ?', [email]);
    }

    static findById(id) {
        return db.execute('SELECT * FROM usuarios WHERE id = ?', [id]);
    }
};
