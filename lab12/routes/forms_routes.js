const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

router.post('/guardar-password', (req, res, next) => {
  const { password, confirmPassword } = req.body;

  if (!password || !confirmPassword) {
    return res.render('acceso', {
      titulo: 'Secure Access',
      mensaje: `
        <div class="alert alert-danger">
          Debes completar ambos campos.
        </div>
      `
    });
  }

  if (password !== confirmPassword) {
    return res.render('acceso', {
      titulo: 'Secure Access',
      mensaje: `
        <div class="alert alert-danger">
          Las contraseñas no coinciden.
        </div>
      `
    });
  }

  const rutaArchivo = path.join(__dirname, '..', 'accesos.txt');
  const contenido = `Password guardada: ${password}\n`;

  fs.appendFile(rutaArchivo, contenido, (err) => {
    if (err) {
      return res.render('acceso', {
        titulo: 'Secure Access',
        mensaje: `
          <div class="alert alert-danger">
            Ocurrio un error al guardar la contraseña.
          </div>
        `
      });
    }

    return res.render('acceso', {
      titulo: 'Secure Access',
      mensaje: `
        <div class="alert alert-success">
          Contraseña guardada correctamente.
        </div>
      `
    });
  });
});

module.exports = router;