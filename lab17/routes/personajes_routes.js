const express = require('express');
const router = express.Router();

const personajesController = require('../controllers/personajes_controller');

router.get('/', personajesController.getInicio);
router.get('/catalogo', personajesController.getCatalogo);
router.get('/personajes/:personaje_id', personajesController.getDetallePersonaje);
router.get('/agregar', personajesController.getAgregar);
router.post('/agregar', personajesController.postAgregar);
router.get('/personajes/:personaje_id/editar', personajesController.getEditar);
router.post('/personajes/:personaje_id/editar', personajesController.postEditar);
router.get('/acceso', personajesController.getAcceso);
router.post('/guardar-password', personajesController.postGuardarPassword);
router.post('/logout', personajesController.postLogout);
router.get('/preguntas', personajesController.getPreguntas);

module.exports = router;
