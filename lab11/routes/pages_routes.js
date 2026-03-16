const express = require("express");
const router = express.Router();

const {
  html_header,
  html_footer,
  renderInicio,
  renderCatalogo,
  renderAcceso,
  renderPreguntas,
} = require("../utils/templates");

router.get("/", (req, res) => {
  res.send(html_header + renderInicio() + html_footer);
});

router.get("/catalogo", (req, res) => {
  res.send(html_header + renderCatalogo() + html_footer);
});

router.get("/acceso", (req, res) => {
  res.send(html_header + renderAcceso() + html_footer);
});

router.get("/preguntas", (req, res) => {
  res.send(html_header + renderPreguntas() + html_footer);
});

module.exports = router;