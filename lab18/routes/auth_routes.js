const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth_controller');

router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.get('/signup', authController.getSignup);
router.post('/signup', authController.postSignup);
router.post('/logout', authController.postLogout);
router.get('/acceso', authController.redirectAcceso);

module.exports = router;
