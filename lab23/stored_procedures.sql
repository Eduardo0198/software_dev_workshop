DELIMITER //

CREATE PROCEDURE sp_guardar_personaje(
    IN p_id INT,
    IN p_nombre VARCHAR(100),
    IN p_descripcion TEXT,
    IN p_tipo VARCHAR(100),
    IN p_universo VARCHAR(100),
    IN p_imagen TEXT
)
BEGIN
    IF p_id IS NULL OR p_id = 0 THEN
        INSERT INTO personajes (nombre, descripcion, tipo, universo, imagen)
        VALUES (p_nombre, p_descripcion, p_tipo, p_universo, p_imagen);
    ELSE
        UPDATE personajes
        SET nombre = p_nombre,
            descripcion = p_descripcion,
            tipo = p_tipo,
            universo = p_universo,
            imagen = p_imagen
        WHERE id = p_id;
    END IF;
END //

CREATE PROCEDURE sp_obtener_personajes_por_universo(
    IN p_universo VARCHAR(100)
)
BEGIN
    IF p_universo IS NULL OR p_universo = '' THEN
        SELECT * FROM personajes ORDER BY id DESC;
    ELSE
        SELECT * FROM personajes
        WHERE universo = p_universo
        ORDER BY id DESC;
    END IF;
END //

CREATE PROCEDURE sp_contar_personajes_por_universo(
    IN p_universo VARCHAR(100)
)
BEGIN
    IF p_universo IS NULL OR p_universo = '' THEN
        SELECT universo, COUNT(*) AS total_personajes
        FROM personajes
        GROUP BY universo;
    ELSE
        SELECT universo, COUNT(*) AS total_personajes
        FROM personajes
        WHERE universo = p_universo
        GROUP BY universo;
    END IF;
END //

DELIMITER ;
