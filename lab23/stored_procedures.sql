DELIMITER //

CREATE PROCEDURE sp_insertar_personaje(
    IN p_nombre VARCHAR(100),
    IN p_descripcion TEXT,
    IN p_tipo VARCHAR(100),
    IN p_universo VARCHAR(100),
    IN p_imagen TEXT
)
BEGIN
    INSERT INTO personajes (nombre, descripcion, tipo, universo, imagen)
    VALUES (p_nombre, p_descripcion, p_tipo, p_universo, p_imagen);
END //

CREATE PROCEDURE sp_listar_personajes_por_universo(
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
