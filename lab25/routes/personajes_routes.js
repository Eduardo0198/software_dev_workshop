const express = require('express');
const router = express.Router();

const personajesController = require('../controllers/personajes_controller');
const isAuth = require('../middleware/is-auth');
const hasPermission = require('../middleware/has-permission');

router.get('/', personajesController.getInicio);
router.get('/catalogo', isAuth, hasPermission('personajes.view'), personajesController.getCatalogo);
router.get('/personajes/:personaje_id', isAuth, hasPermission('personajes.view'), personajesController.getDetallePersonaje);
router.get('/agregar', isAuth, hasPermission('personajes.create'), personajesController.getAgregar);
router.post('/agregar', isAuth, hasPermission('personajes.create'), personajesController.postAgregar);
router.get('/personajes/:personaje_id/editar', isAuth, hasPermission('personajes.edit'), personajesController.getEditar);
router.post('/personajes/:personaje_id/editar', isAuth, hasPermission('personajes.edit'), personajesController.postEditar);
router.get('/preguntas', personajesController.getPreguntas);
router.get('/servicios', personajesController.getServicios);
router.get('/transacciones', isAuth, hasPermission('personajes.create'), personajesController.getTransacciones);
router.post('/transacciones', isAuth, hasPermission('personajes.create'), personajesController.postTransacciones);

module.exports = router;
