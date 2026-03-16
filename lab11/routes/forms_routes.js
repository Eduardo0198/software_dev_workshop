const express = require("express");
const fs = require("fs");
const router = express.Router();

const { html_header, html_footer, renderAcceso } = require("../utils/templates");

router.post("/guardar-password", (req, res) => {
  const password = req.body.password || "";
  const confirmPassword = req.body.confirmPassword || "";

  const tieneLongitud = password.length >= 8;
  const tieneMayuscula = /[A-Z]/.test(password);
  const tieneNumero = /[0-9]/.test(password);
  const coinciden = password !== "" && password === confirmPassword;

  if (tieneLongitud && tieneMayuscula && tieneNumero && coinciden) {
    const registro = `Password: ${password} | Confirmacion: ${confirmPassword}\n`;

    fs.appendFile("accesos.txt", registro, (error) => {
      if (error) {
        res.status(500).send(
          html_header +
            renderAcceso(`
              <div class="alert alert-danger">
                Ocurrio un error al guardar la contraseña en el servidor.
              </div>
            `) +
            html_footer
        );
        return;
      }

      res.send(
        html_header +
          renderAcceso(`
            <div class="alert alert-success">
              Contraseña valida y guardada correctamente en el servidor.
            </div>
          `) +
          html_footer
      );
    });
  } else {
    res.send(
      html_header +
        renderAcceso(`
          <div class="alert alert-danger">
            La contraseña no cumple con los requisitos o no coincide.
          </div>
        `) +
        html_footer
    );
  }
});

module.exports = router;