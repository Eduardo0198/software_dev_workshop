const express = require('express');
const router = express.Router();

const personajesController = require('../controllers/personajes_controller');
const isAuth = require('../middleware/is-auth');

router.get('/', personajesController.getInicio);
router.get('/catalogo', personajesController.getCatalogo);
router.get('/personajes/:personaje_id', personajesController.getDetallePersonaje);
router.get('/agregar', isAuth, personajesController.getAgregar);
router.post('/agregar', isAuth, personajesController.postAgregar);
router.get('/personajes/:personaje_id/editar', isAuth, personajesController.getEditar);
router.post('/personajes/:personaje_id/editar', isAuth, personajesController.postEditar);
router.get('/preguntas', personajesController.getPreguntas);

module.exports = router;
