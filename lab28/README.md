# Laboratorio 28 - Triggers

## Preguntas

### Pregunta 1: ¿Qué utilidad tiene un trigger (ventajas)?
Los triggers son útiles porque permiten automatizar acciones en la base de datos cuando ocurren eventos específicos (INSERT, UPDATE, DELETE). Ventajas:
- **Automatización**: Ejecutan acciones automáticamente sin intervención del usuario.
- **Integridad de datos**: Pueden validar datos o mantener consistencia (ej. actualizar contadores).
- **Auditoría**: Registran cambios para seguimiento histórico.
- **Reglas de negocio**: Implementan lógica compleja a nivel de base de datos.

### Pregunta 2: ¿Tipos de triggers?
- **Por momento**: BEFORE (antes del evento) y AFTER (después del evento).
- **Por evento**: INSERT, UPDATE, DELETE.
- Combinaciones: BEFORE INSERT, AFTER UPDATE, etc.

### Pregunta 3: ¿En qué casos NO son de utilidad?
- Cuando la lógica puede manejarse en la aplicación (mejor mantenibilidad).
- En operaciones de alto rendimiento (triggers pueden ralentizar).
- Cuando generan dependencias complejas difíciles de debuggear.
- En bases de datos con mucha concurrencia (pueden causar deadlocks).

## Triggers Implementados

### Trigger 1: trg_after_insert_personaje
- **Tipo**: AFTER INSERT
- **Función**: Registra cada nueva inserción de personaje en la tabla `auditoria_personajes`.

### Trigger 2: trg_before_delete_personaje
- **Tipo**: BEFORE DELETE
- **Función**: Registra cada eliminación de personaje antes de que ocurra.

## Cómo probar
1. Ejecutar `lab28.sql` en phpMyAdmin o MySQL.
2. Insertar personajes y verificar la tabla `auditoria_personajes`.
3. Eliminar personajes y verificar los registros de auditoría.