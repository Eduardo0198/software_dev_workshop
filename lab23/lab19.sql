CREATE DATABASE IF NOT EXISTS lab19_marvel;
USE lab19_marvel;

DROP TABLE IF EXISTS rol_permiso;
DROP TABLE IF EXISTS usuario_rol;
DROP TABLE IF EXISTS permisos;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS personajes;
DROP TABLE IF EXISTS usuarios;

CREATE TABLE usuarios (
    id INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    password VARCHAR(255) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY unique_email (email)
);

CREATE TABLE personajes (
    id INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT NOT NULL,
    tipo VARCHAR(100) NOT NULL,
    universo VARCHAR(100) NOT NULL,
    imagen TEXT NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE roles (
    id INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY unique_role_name (nombre)
);

CREATE TABLE permisos (
    id INT NOT NULL AUTO_INCREMENT,
    clave VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY unique_permission_key (clave)
);

CREATE TABLE usuario_rol (
    usuario_id INT NOT NULL,
    rol_id INT NOT NULL,
    PRIMARY KEY (usuario_id, rol_id),
    CONSTRAINT fk_usuario_rol_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_usuario_rol_rol
        FOREIGN KEY (rol_id) REFERENCES roles(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE rol_permiso (
    rol_id INT NOT NULL,
    permiso_id INT NOT NULL,
    PRIMARY KEY (rol_id, permiso_id),
    CONSTRAINT fk_rol_permiso_rol
        FOREIGN KEY (rol_id) REFERENCES roles(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_rol_permiso_permiso
        FOREIGN KEY (permiso_id) REFERENCES permisos(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

INSERT INTO roles (id, nombre, descripcion) VALUES
(1, 'admin', 'Puede ver, crear, editar personajes y administrar asignaciones de roles'),
(2, 'editor', 'Puede ver, crear y editar personajes'),
(3, 'viewer', 'Solo puede consultar el catalogo y el detalle de personajes');

INSERT INTO permisos (id, clave, descripcion) VALUES
(1, 'personajes.view', 'Permite consultar el catalogo y detalle de personajes'),
(2, 'personajes.create', 'Permite registrar nuevos personajes'),
(3, 'personajes.edit', 'Permite editar personajes existentes'),
(4, 'roles.assign', 'Permite administrar la asignacion de roles');

INSERT INTO rol_permiso (rol_id, permiso_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 4),
(2, 1), (2, 2), (2, 3),
(3, 1);

INSERT INTO usuarios (id, nombre, email, password) VALUES
(1, 'Admin Marvel', 'admin@marvel.com', '$2b$12$tupvSZ9IWDRu7A9CFlE2puA34Nfds6C7wagQo8vQaIPBEucfP7reW'),
(2, 'Editor Marvel', 'editor@marvel.com', '$2b$12$tupvSZ9IWDRu7A9CFlE2puA34Nfds6C7wagQo8vQaIPBEucfP7reW'),
(3, 'Viewer Marvel', 'viewer@marvel.com', '$2b$12$tupvSZ9IWDRu7A9CFlE2puA34Nfds6C7wagQo8vQaIPBEucfP7reW');

INSERT INTO usuario_rol (usuario_id, rol_id) VALUES
(1, 1),
(2, 2),
(3, 3);

INSERT INTO personajes (nombre, descripcion, tipo, universo, imagen) VALUES
('Spider-Man', 'Peter Parker es uno de los heroes mas iconicos de Marvel. Destaca por su agilidad, inteligencia y sentido de responsabilidad.', 'Heroe', 'Spider-Verse', 'https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=1200&auto=format&fit=crop'),
('Iron Man', 'Tony Stark utiliza su inteligencia, creatividad y tecnologia avanzada para combatir amenazas como Iron Man.', 'Avenger', 'Tecnologia', 'https://images.unsplash.com/photo-1635863138275-d9b33299680b?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),
('Scarlet Witch', 'Wanda Maximoff posee poderosas habilidades relacionadas con la energia del caos, la manipulacion de la realidad y la magia.', 'Mistica', 'Avenger', 'https://miro.medium.com/v2/resize:fit:1100/format:webp/1*9XQlc5ayl-KL7l4Ox7aSrg.jpeg'),
('Loki', 'Loki es el dios del engano. Es un personaje complejo, astuto, impredecible y muy importante dentro del multiverso.', 'Asgard', 'Antiheroe', 'https://i.blogs.es/46ca18/marvel-doomsday-loki-tva/1200_800.jpeg'),
('Black Panther', 'TChalla es el rey de Wakanda y un guerrero estratega con un traje de vibranio muy avanzado.', 'Avenger', 'Wakanda', 'https://images.unsplash.com/photo-1549921296-3fd7edaf41f0?q=80&w=1200&auto=format&fit=crop'),
('Doctor Strange', 'Stephen Strange es el maestro de las artes místicas y protege la realidad de amenazas mágicas.', 'Maestro', 'Mistica', 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=1200&auto=format&fit=crop');
