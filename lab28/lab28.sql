-- Lab 28: Triggers
-- Implementación de triggers en MariaDB/MySQL

-- Primero, crear tabla de auditoría para los triggers
CREATE TABLE IF NOT EXISTS auditoria_personajes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    accion VARCHAR(50) NOT NULL,
    personaje_id INT,
    nombre_personaje VARCHAR(255),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuario VARCHAR(100) DEFAULT 'sistema'
);

-- Trigger 1: AFTER INSERT
-- Registra cada inserción de personaje en la tabla de auditoría
DELIMITER //
CREATE TRIGGER trg_after_insert_personaje
AFTER INSERT ON personajes
FOR EACH ROW
BEGIN
    INSERT INTO auditoria_personajes (accion, personaje_id, nombre_personaje)
    VALUES ('INSERT', NEW.id, NEW.nombre);
END;
//
DELIMITER ;

-- Trigger 2: BEFORE DELETE
-- Registra cada eliminación de personaje antes de que ocurra
DELIMITER //
CREATE TRIGGER trg_before_delete_personaje
BEFORE DELETE ON personajes
FOR EACH ROW
BEGIN
    INSERT INTO auditoria_personajes (accion, personaje_id, nombre_personaje)
    VALUES ('DELETE', OLD.id, OLD.nombre);
END;
//
DELIMITER ;

-- Pruebas de los triggers

-- Insertar un personaje para probar trigger 1
INSERT INTO personajes (nombre, descripcion, tipo, universo, imagen)
VALUES ('Spider-Man', 'Hombre araña', 'Héroe', 'Marvel', 'https://example.com/spiderman.jpg');

-- Verificar que se registró en auditoria
SELECT * FROM auditoria_personajes WHERE accion = 'INSERT';

-- Eliminar un personaje para probar trigger 2 (usar un ID existente)
-- DELETE FROM personajes WHERE id = 1;

-- Verificar que se registró en auditoria
-- SELECT * FROM auditoria_personajes WHERE accion = 'DELETE';

-- Para probar el DELETE, descomenta las líneas anteriores y ajusta el ID