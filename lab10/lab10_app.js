const http = require("http");
const fs = require("fs");
const path = require("path");
const querystring = require("querystring");

// ===============================
// Datos del catalogo
// ===============================
const personajes = [
  {
    nombre: "Spider-Man",
    descripcion:
      "Peter Parker es uno de los heroes mas iconicos de Marvel. Destaca por su agilidad, inteligencia y sentido de responsabilidad.",
    tipo: "Heroe",
    universo: "Spider-Verse",
    imagen:
      "https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=1200&auto=format&fit=crop",
  },
  {
    nombre: "Iron Man",
    descripcion:
      "Tony Stark utiliza su inteligencia, creatividad y tecnologia avanzada para combatir amenazas como Iron Man.",
    tipo: "Avenger",
    universo: "Tecnologia",
    imagen:
      "https://images.unsplash.com/photo-1635863138275-d9b33299680b?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    nombre: "Scarlet Witch",
    descripcion:
      "Wanda Maximoff posee poderosas habilidades relacionadas con la energia del caos, la manipulacion de la realidad y la magia.",
    tipo: "Mistica",
    universo: "Avenger",
    imagen:
      "https://miro.medium.com/v2/resize:fit:1100/format:webp/1*9XQlc5ayl-KL7l4Ox7aSrg.jpeg",
  },
  {
    nombre: "Loki",
    descripcion:
      "Loki es el dios del engaño. Es un personaje complejo, astuto, impredecible y muy importante dentro del multiverso.",
    tipo: "Asgard",
    universo: "Antiheroe",
    imagen:
      "https://i.blogs.es/46ca18/marvel-doomsday-loki-tva/1200_800.jpeg",
  },
  {
    nombre: "Doctor Strange",
    descripcion:
      "Stephen Strange paso de ser cirujano a convertirse en el Hechicero Supremo, protector del equilibrio mistico.",
    tipo: "Mago",
    universo: "Multiverso",
    imagen:
      "https://sm.ign.com/t/ign_latam/screenshot/default/doctor-strange-avengers-doomsday_yurt.2560.jpg",
  },
  {
    nombre: "Black Panther",
    descripcion:
      "T Challa combina liderazgo, combate, estrategia y tecnologia avanzada como rey y protector de Wakanda.",
    tipo: "Wakanda",
    universo: "Lider",
    imagen: "https://img.rtve.es/n/1676080?w=1600",
  },
];

// ===============================
// Partes HTML
// ===============================
const html_header = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Lab 10 - Marvel Catalog</title>

  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="/lab06_style.css">
</head>
<body>

  <nav class="navbar navbar-expand-lg navbar-dark bg-danger shadow-sm">
    <div class="container">
      <a class="navbar-brand fw-bold" href="/">Marvel Catalog</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContenido">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarContenido">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <a class="nav-link" href="/">Inicio</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/catalogo">Catalogo</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/acceso">Secure Access</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/preguntas">Preguntas</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
`;

const html_footer = `
  <footer class="bg-dark text-white text-center py-4 mt-5">
    <p class="mb-1 fw-bold">Jose Eduardo Viveros Escamilla</p>
    <p class="mb-0">Lab 10 - Rutas y Formas con Node.js</p>
  </footer>

  <div class="modal fade" id="infoModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content rounded-4">
        <div class="modal-header bg-danger text-white">
          <h5 class="modal-title" id="modalTitle">Personaje</h5>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body" id="modalBody">
          Informacion del personaje.
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cerrar</button>
        </div>
      </div>
    </div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
  <script>
    function mostrarInfo(nombre, descripcion) {
      document.getElementById("modalTitle").textContent = nombre;
      document.getElementById("modalBody").textContent = descripcion;
      const modal = new bootstrap.Modal(document.getElementById("infoModal"));
      modal.show();
    }

    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");
    const passwordHelp = document.getElementById("passwordHelp");
    const confirmHelp = document.getElementById("confirmHelp");
    const togglePasswordBtn = document.getElementById("togglePassword");
    const passwordForm = document.getElementById("passwordForm");
    const resultadoPassword = document.getElementById("resultadoPassword");
    const validatorTitle = document.getElementById("validatorTitle");

    const reqLength = document.getElementById("reqLength");
    const reqUppercase = document.getElementById("reqUppercase");
    const reqNumber = document.getElementById("reqNumber");
    const reqMatch = document.getElementById("reqMatch");

    function actualizarEstado(elemento, valido) {
      if (!elemento) return;
      if (valido) {
        elemento.classList.add("valid");
        elemento.classList.remove("invalid");
      } else {
        elemento.classList.add("invalid");
        elemento.classList.remove("valid");
      }
    }

    function validarPassword() {
      if (!passwordInput || !confirmPasswordInput) return false;

      const password = passwordInput.value;
      const confirmPassword = confirmPasswordInput.value;

      const tieneLongitud = password.length >= 8;
      const tieneMayuscula = /[A-Z]/.test(password);
      const tieneNumero = /[0-9]/.test(password);
      const coinciden = password !== "" && password === confirmPassword;

      actualizarEstado(reqLength, tieneLongitud);
      actualizarEstado(reqUppercase, tieneMayuscula);
      actualizarEstado(reqNumber, tieneNumero);
      actualizarEstado(reqMatch, coinciden);

      return tieneLongitud && tieneMayuscula && tieneNumero && coinciden;
    }

    if (passwordInput && confirmPasswordInput) {
      passwordInput.addEventListener("focus", function () {
        if (passwordHelp) {
          passwordHelp.textContent = "Debe tener minimo 8 caracteres, una mayuscula y un numero.";
        }
      });

      confirmPasswordInput.addEventListener("focus", function () {
        if (confirmHelp) {
          confirmHelp.textContent = "Repite exactamente la misma contraseña.";
        }
      });

      passwordInput.addEventListener("blur", function () {
        if (passwordHelp) {
          passwordHelp.textContent = "Revisa que tu contraseña sea segura.";
        }
      });

      confirmPasswordInput.addEventListener("blur", function () {
        if (confirmHelp) {
          confirmHelp.textContent = "Verifica que ambas contraseñas coincidan.";
        }
      });

      passwordInput.addEventListener("input", validarPassword);
      confirmPasswordInput.addEventListener("input", validarPassword);
    }

    if (togglePasswordBtn && passwordInput && confirmPasswordInput) {
      togglePasswordBtn.addEventListener("click", function () {
        if (passwordInput.type === "password") {
          passwordInput.type = "text";
          confirmPasswordInput.type = "text";
        } else {
          passwordInput.type = "password";
          confirmPasswordInput.type = "password";
        }
      });
    }

    if (validatorTitle) {
      validatorTitle.addEventListener("mouseover", function () {
        validatorTitle.style.fontStyle = "italic";
        validatorTitle.style.fontSize = "2.3rem";
        validatorTitle.style.color = "#0d6efd";
      });

      validatorTitle.addEventListener("mouseout", function () {
        validatorTitle.style.fontStyle = "normal";
        validatorTitle.style.fontSize = "";
        validatorTitle.style.color = "";
      });
    }

    if (passwordForm) {
      passwordForm.addEventListener("submit", function (event) {
        const esValida = validarPassword();

        if (!esValida) {
          event.preventDefault();
          if (resultadoPassword) {
            resultadoPassword.innerHTML = \`
              <div class="alert alert-danger">
                Contraseña invalida. Verifica los requisitos y vuelve a intentarlo.
              </div>
            \`;
          }
        }
      });
    }
  </script>
</body>
</html>
`;

// ===============================
// Funciones que "inyectan" HTML
// funciones RENDERS
// Aquin inyectamos el html que hicimos en lab 6,
// dentro de las rutas del servidor para mostrarlo como paginas independientes
// ===============================
function renderInicio() {
  return `
    <header class="hero-section text-white text-center d-flex align-items-center">
      <div class="container">
        <h1 class="display-4 fw-bold">Catalogo de Personajes de Marvel</h1>
        <p class="lead mt-3">
          Aplicacion desarrollada con Node.js para el Laboratorio 10 de rutas y formas.
        </p>
        <a href="/catalogo" class="btn btn-light btn-lg mt-3 fw-semibold">Ver catalogo</a>
      </div>
    </header>

    <section class="container my-5">
      <div class="card shadow-sm border-0 rounded-4">
        <div class="card-body p-4">
          <h2 class="mb-3">Descripcion del proyecto</h2>
          <p>
            Esta version toma como base el catalogo de Marvel del Lab 6 y lo adapta para
            trabajar con rutas en el servidor usando Node.js sin frameworks.
          </p>
          <p class="mb-0">
            Ahora el sitio cuenta con paginas separadas para inicio, catalogo, acceso seguro
            y preguntas del laboratorio, ademas de una ruta POST para guardar datos enviados
            desde una forma HTML.
          </p>
        </div>
      </div>
    </section>
  `;
}


function renderCatalogo() {
  let html = `
    <section class="container my-5">
      <h2 class="text-center mb-4 fw-bold">Catalogo de personajes</h2>
      <div class="row g-4">
  `;

  for (const personaje of personajes) {
    html += `
      <div class="col-md-6 col-lg-4">
        <div class="card h-100 shadow-sm character-card">
          <img src="${personaje.imagen}" class="card-img-top character-img" alt="${personaje.nombre}">
          <div class="card-body">
            <h5 class="card-title fw-bold">${personaje.nombre}</h5>
            <span class="badge bg-danger">${personaje.tipo}</span>
            <span class="badge bg-secondary">${personaje.universo}</span>
            <p class="card-text mt-3">
              ${personaje.descripcion}
            </p>
            <button
              class="btn btn-outline-danger w-100"
              onclick="mostrarInfo('${escapeJS(personaje.nombre)}', '${escapeJS(personaje.descripcion)}')"
            >
              Ver mas
            </button>
          </div>
        </div>
      </div>
    `;
  }

  html += `
      </div>
    </section>
  `;

  return html;
}

function renderAcceso(mensaje = "") {
  return `
    <section class="container my-5">
      <div class="card shadow-sm border-0 rounded-4">
        <div class="card-body p-4">
          <h2 id="validatorTitle" class="mb-4 text-center fw-bold text-danger">
            Avengers Secure Access
          </h2>

          <p class="text-center text-muted">
            Ingresa una contraseña segura para acceder al archivo secreto de S.H.I.E.L.D.
          </p>

          ${mensaje}

          <form id="passwordForm" action="/guardar-password" method="POST" novalidate>
            <div class="mb-3">
              <label for="password" class="form-label fw-semibold">Contraseña</label>
              <input type="password" class="form-control" id="password" name="password" placeholder="Escribe tu contraseña">
              <div id="passwordHelp" class="form-text text-muted">
                La contraseña debe ser segura.
              </div>
            </div>

            <div class="mb-3">
              <label for="confirmPassword" class="form-label fw-semibold">Confirmar contraseña</label>
              <input type="password" class="form-control" id="confirmPassword" name="confirmPassword" placeholder="Vuelve a escribir la contraseña">
              <div id="confirmHelp" class="form-text text-muted">
                Ambas contraseñas deben coincidir.
              </div>
            </div>

            <div class="mb-3">
              <button type="button" id="togglePassword" class="btn btn-outline-danger">
                Mostrar / Ocultar contraseñas
              </button>
            </div>

            <div class="mb-3">
              <h5 class="fw-bold">Requisitos</h5>
              <ul class="list-group">
                <li id="reqLength" class="list-group-item">Minimo 8 caracteres</li>
                <li id="reqUppercase" class="list-group-item">Al menos una mayuscula</li>
                <li id="reqNumber" class="list-group-item">Al menos un numero</li>
                <li id="reqMatch" class="list-group-item">Las contraseñas deben coincidir</li>
              </ul>
            </div>

            <button type="submit" class="btn btn-danger w-100">
              Validar y guardar contraseña
            </button>
          </form>

          <div id="resultadoPassword" class="mt-4"></div>
        </div>
      </div>
    </section>
  `;
}

function renderPreguntas() {
  return `
    <section class="container my-5">
      <div class="card shadow-sm border-0 rounded-4">
        <div class="card-body p-4">
          <h2 class="mb-4">Preguntas del laboratorio</h2>

          <div class="accordion" id="accordionPreguntas">

            <div class="accordion-item">
              <h2 class="accordion-header">
                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#pregunta1">
                  ¿Por que es una buena practica usar JavaScript para checar que sean validos los inputs de las formas antes de enviar los datos al servidor?
                </button>
              </h2>
              <div id="pregunta1" class="accordion-collapse collapse show" data-bs-parent="#accordionPreguntas">
                <div class="accordion-body">
                  Porque permite validar datos de forma inmediata en el navegador, mejora la experiencia
                  del usuario y ayuda a detectar errores antes de enviar informacion al servidor.
                </div>
              </div>
            </div>

            <div class="accordion-item">
              <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#pregunta2">
                  ¿Como puedes saltarte la seguridad de validaciones hechas con JavaScript?
                </button>
              </h2>
              <div id="pregunta2" class="accordion-collapse collapse" data-bs-parent="#accordionPreguntas">
                <div class="accordion-body">
                  Porque JavaScript corre del lado del cliente. Un usuario podria desactivar JavaScript,
                  modificar el codigo desde el navegador o enviar peticiones manuales al servidor.
                </div>
              </div>
            </div>

            <div class="accordion-item">
              <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#pregunta3">
                  ¿Que ventajas ofrece Bootstrap?
                </button>
              </h2>
              <div id="pregunta3" class="accordion-collapse collapse" data-bs-parent="#accordionPreguntas">
                <div class="accordion-body">
                  Bootstrap permite construir interfaces responsivas mas rapido, ofrece componentes
                  reutilizables y facilita mantener una apariencia visual consistente.
                </div>
              </div>
            </div>

            <div class="accordion-item">
              <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#pregunta4">
                  Si te puedes saltar la seguridad de las validaciones de JavaScript, entonces ¿por que sigue siendo una buena practica?
                </button>
              </h2>
              <div id="pregunta4" class="accordion-collapse collapse" data-bs-parent="#accordionPreguntas">
                <div class="accordion-body">
                  Porque no reemplaza la seguridad del servidor, pero si mejora la usabilidad y previene
                  errores comunes antes del envio. La validacion real siempre debe hacerse tambien en el servidor.
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  `;
}

// REBDERIZMOS UN ERROR 404 PARA RUTAS NO DEFINIDAS
function render404() {
  return `
    <section class="container my-5">
      <div class="alert alert-danger shadow-sm">
        <h2 class="fw-bold">404 - Pagina no encontrada</h2>
        <p class="mb-0">La ruta que intentaste abrir no existe en este servidor.</p>
      </div>
    </section>
  `;
}

// ===============================
// Utilidad para evitar romper JS inline
// ===============================
function escapeJS(texto) {
  return String(texto)
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/\n/g, " ")
    .replace(/\r/g, " ");
}

// ===============================
// Servidor
// ===============================
const server = http.createServer((request, response) => {
  // Servir CSS
  if (request.url === "/lab06_style.css") {
    const cssPath = path.join(__dirname, "lab06_style.css");

    fs.readFile(cssPath, (error, contenido) => {
      if (error) {
        response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
        response.end("Error al cargar el archivo CSS.");
        return;
      }

      response.writeHead(200, { "Content-Type": "text/css" });
      response.end(contenido);
    });
    return;
  }

  // RUTAS QUE ASOCIAMOS A LOS RENDERS QUE DEFINIMOS ARRIBA
  // Ruta inicio
  if (request.url === "/" && request.method === "GET") {
    response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    response.end(html_header + renderInicio() + html_footer);
    return;
  }

  // Ruta catalogo
  if (request.url === "/catalogo" && request.method === "GET") {
    response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    response.end(html_header + renderCatalogo() + html_footer);
    return;
  }

  // Ruta acceso
  if (request.url === "/acceso" && request.method === "GET") {
    response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    response.end(html_header + renderAcceso() + html_footer);
    return;
  }

  // Ruta preguntas
  if (request.url === "/preguntas" && request.method === "GET") {
    response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    response.end(html_header + renderPreguntas() + html_footer);
    return;
  }

  // Ruta POST para guardar password
  if (request.url === "/guardar-password" && request.method === "POST") {
    const datos_completos = [];

    request.on("data", (chunk) => {
      datos_completos.push(chunk);
    });

    request.on("end", () => {
      const body = Buffer.concat(datos_completos).toString();
      const datos = querystring.parse(body);

      const password = datos.password || "";
      const confirmPassword = datos.confirmPassword || "";

      const tieneLongitud = password.length >= 8;
      const tieneMayuscula = /[A-Z]/.test(password);
      const tieneNumero = /[0-9]/.test(password);
      const coinciden = password !== "" && password === confirmPassword;

      if (tieneLongitud && tieneMayuscula && tieneNumero && coinciden) {
        const registro = `Password: ${password} | Confirmacion: ${confirmPassword}\n`;

        fs.appendFile("accesos.txt", registro, (error) => {
          if (error) {
            response.writeHead(500, { "Content-Type": "text/html; charset=utf-8" });
            response.end(
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

          response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
          response.end(
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
        response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        response.end(
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

    return;
  }

  // 404
  response.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
  response.end(html_header + render404() + html_footer);
});

server.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});