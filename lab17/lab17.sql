CREATE DATABASE IF NOT EXISTS lab17_marvel;
USE lab17_marvel;

CREATE TABLE IF NOT EXISTS personajes (
    id INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT NOT NULL,
    tipo VARCHAR(100) NOT NULL,
    universo VARCHAR(100) NOT NULL,
    imagen TEXT NOT NULL,
    PRIMARY KEY (id)
);

INSERT INTO personajes (nombre, descripcion, tipo, universo, imagen)
VALUES
('Spider-Man', 'Peter Parker es uno de los heroes mas iconicos de Marvel. Destaca por su agilidad, inteligencia y sentido de responsabilidad.', 'Heroe', 'Spider-Verse', 'https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=1200&auto=format&fit=crop'),
('Iron Man', 'Tony Stark utiliza su inteligencia, creatividad y tecnologia avanzada para combatir amenazas como Iron Man.', 'Avenger', 'Tecnologia', 'https://images.unsplash.com/photo-1635863138275-d9b33299680b?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),
('Scarlet Witch', 'Wanda Maximoff posee poderosas habilidades relacionadas con la energia del caos, la manipulacion de la realidad y la magia.', 'Mistica', 'Avenger', 'https://miro.medium.com/v2/resize:fit:1100/format:webp/1*9XQlc5ayl-KL7l4Ox7aSrg.jpeg'),
('Loki', 'Loki es el dios del engano. Es un personaje complejo, astuto, impredecible y muy importante dentro del multiverso.', 'Asgard', 'Antiheroe', 'https://i.blogs.es/46ca18/marvel-doomsday-loki-tva/1200_800.jpeg');
