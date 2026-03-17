const express = require('express');
const router = express.Router();

const personajesController = require('../controllers/personajes_controller');

router.get('/', personajesController.getInicio);
router.get('/catalogo', personajesController.getCatalogo);
router.get('/agregar', personajesController.getAgregar);
router.post('/agregar', personajesController.postAgregar);
router.get('/acceso', personajesController.getAcceso);
router.post('/guardar-password', personajesController.postGuardarPassword);
router.post('/logout', personajesController.postLogout);
router.get('/preguntas', personajesController.getPreguntas);

module.exports = router;
