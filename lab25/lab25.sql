-- Lab 25: Manipulación de datos usando Transacciones
-- Ejemplos de transacciones en SQL

-- Transacción explícita para insertar múltiples personajes
START TRANSACTION;

INSERT INTO personajes (nombre, descripcion, tipo, universo, imagen) 
VALUES ('Iron Man', 'Millonario playboy filántropo', 'Héroe', 'Marvel', 'https://example.com/ironman.jpg');

INSERT INTO personajes (nombre, descripcion, tipo, universo, imagen) 
VALUES ('Captain America', 'Super soldado patriota', 'Héroe', 'Marvel', 'https://example.com/captain.jpg');

-- Si todo va bien, confirmar
COMMIT;

-- Ejemplo de transacción con rollback
START TRANSACTION;

INSERT INTO personajes (nombre, descripcion, tipo, universo, imagen) 
VALUES ('Thanos', 'Titán loco', 'Villano', 'Marvel', 'https://example.com/thanos.jpg');

-- Simular error (por ejemplo, violación de constraint)
-- Si hay error, revertir
ROLLBACK;