const express = require('express');
const router = express.Router();

const personajes = require('../utils/personajes');

router.get('/', (req, res, next) => {
  res.render('inicio', { titulo: 'Inicio' });
});

router.get('/catalogo', (req, res, next) => {
  res.render('catalogo', {
    titulo: 'Catalogo Marvel',
    personajes: personajes
  });
});

router.get('/acceso', (req, res, next) => {
  res.render('acceso', {
    titulo: 'Secure Access',
    mensaje: ''
  });
});

router.get('/preguntas', (req, res, next) => {
  res.render('preguntas', { titulo: 'Preguntas' });
});

module.exports = router;