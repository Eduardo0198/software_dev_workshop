const db = require('../util/database');

module.exports = class Personaje {
    constructor(id, nombre, descripcion, tipo, universo, imagen) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.tipo = tipo;
        this.universo = universo;
        this.imagen = imagen;
    }

    save() {
        return db.execute(
            'INSERT INTO personajes (nombre, descripcion, tipo, universo, imagen) VALUES (?, ?, ?, ?, ?)',
            [this.nombre, this.descripcion, this.tipo, this.universo, this.imagen]
        );
    }

    update() {
        return db.execute(
            'UPDATE personajes SET nombre = ?, descripcion = ?, tipo = ?, universo = ?, imagen = ? WHERE id = ?',
            [this.nombre, this.descripcion, this.tipo, this.universo, this.imagen, this.id]
        );
    }

    static fetchAll() {
        return db.execute('SELECT * FROM personajes ORDER BY id DESC');
    }

    static fetchOne(id) {
        return db.execute('SELECT * FROM personajes WHERE id = ?', [id]);
    }
};
