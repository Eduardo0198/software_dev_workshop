const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin_controller');
const isAuth = require('../middleware/is-auth');
const hasPermission = require('../middleware/has-permission');

router.get('/admin/usuarios', isAuth, hasPermission('roles.assign'), adminController.getUsuarios);
router.post('/admin/usuarios/:usuario_id/roles', isAuth, hasPermission('roles.assign'), adminController.postActualizarRoles);

module.exports = router;
