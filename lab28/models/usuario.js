const bcrypt = require('bcryptjs');
const db = require('../util/database');

module.exports = class Usuario {
    constructor(nombre, email, password) {
        this.nombre = nombre;
        this.email = email;
        this.password = password;
    }

    save() {
        let usuarioIdCreado = null;

        return bcrypt.hash(this.password, 12)
            .then((passwordCifrado) => {
                return db.execute(
                    'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)',
                    [this.nombre, this.email, passwordCifrado]
                );
            })
            .then(([resultado]) => {
                usuarioIdCreado = resultado.insertId;
                return this.constructor.assignDefaultRole(usuarioIdCreado);
            })
            .catch((error) => {
                if (!usuarioIdCreado) {
                    throw error;
                }

                return db.execute('DELETE FROM usuarios WHERE id = ?', [usuarioIdCreado])
                    .catch(() => null)
                    .then(() => {
                        throw error;
                    });
            });
    }

    static findByEmail(email) {
        return db.execute('SELECT * FROM usuarios WHERE email = ?', [email]);
    }

    static findById(id) {
        return db.execute('SELECT * FROM usuarios WHERE id = ?', [id]);
    }

    static fetchRolesByUserId(userId) {
        return db.execute(`
            SELECT DISTINCT roles.id, roles.nombre, roles.descripcion
            FROM roles
            INNER JOIN usuario_rol ON usuario_rol.rol_id = roles.id
            WHERE usuario_rol.usuario_id = ?
            ORDER BY roles.id
        `, [userId]);
    }

    static fetchPermissionsByUserId(userId) {
        return db.execute(`
            SELECT DISTINCT permisos.id, permisos.clave, permisos.descripcion
            FROM permisos
            INNER JOIN rol_permiso ON rol_permiso.permiso_id = permisos.id
            INNER JOIN usuario_rol ON usuario_rol.rol_id = rol_permiso.rol_id
            WHERE usuario_rol.usuario_id = ?
            ORDER BY permisos.id
        `, [userId]);
    }

    static fetchAccessProfile(userId) {
        return Promise.all([
            this.fetchRolesByUserId(userId),
            this.fetchPermissionsByUserId(userId),
        ]).then(([[rolesRows], [permissionsRows]]) => {
            return {
                roles: rolesRows.map((rol) => rol.nombre),
                roleDetails: rolesRows,
                permissions: permissionsRows.map((permiso) => permiso.clave),
                permissionDetails: permissionsRows,
            };
        });
    }

    static assignDefaultRole(userId) {
        return db.execute('SELECT id FROM roles WHERE nombre = ?', ['viewer'])
            .then(([rows]) => {
                if (rows.length === 0) {
                    const error = new Error('No existe el rol viewer en la base de datos.');
                    error.code = 'DEFAULT_ROLE_NOT_FOUND';
                    throw error;
                }

                return db.execute(
                    'INSERT INTO usuario_rol (usuario_id, rol_id) VALUES (?, ?)',
                    [userId, rows[0].id]
                );
            });
    }

    static fetchAllWithRoles() {
        return db.execute(`
            SELECT
                usuarios.id,
                usuarios.nombre,
                usuarios.email,
                COALESCE(GROUP_CONCAT(DISTINCT roles.nombre ORDER BY roles.id SEPARATOR ', '), 'Sin rol') AS roles,
                COALESCE(GROUP_CONCAT(DISTINCT roles.id ORDER BY roles.id SEPARATOR ','), '') AS roleIds
            FROM usuarios
            LEFT JOIN usuario_rol ON usuario_rol.usuario_id = usuarios.id
            LEFT JOIN roles ON roles.id = usuario_rol.rol_id
            GROUP BY usuarios.id, usuarios.nombre, usuarios.email
            ORDER BY usuarios.id ASC
        `);
    }

    static fetchAllRoles() {
        return db.execute('SELECT id, nombre, descripcion FROM roles ORDER BY id ASC');
    }

    static assignRoles(userId, roleIds) {
        const ids = [...new Set(
            roleIds
                .map((roleId) => Number(roleId))
                .filter((roleId) => Number.isInteger(roleId) && roleId > 0)
        )];

        return db.execute('DELETE FROM usuario_rol WHERE usuario_id = ?', [userId])
            .then(() => {
                if (ids.length === 0) {
                    return Promise.resolve();
                }

                const placeholders = ids.map(() => '(?, ?)').join(', ');
                const values = ids.flatMap((roleId) => [userId, roleId]);

                return db.execute(
                    `INSERT INTO usuario_rol (usuario_id, rol_id) VALUES ${placeholders}`,
                    values
                );
            });
    }
};
