console.log("hola desde node!");

const filesystem = require('fs');

filesystem.writeFileSync('hola.txt', 'Hola desde node');

setTimeout(() => {
    console.log("jojo te hackié!");
}, 15000);

const arreglo = [5000, 60, 90, 100, 10, 20, 10000, 0, 120, 2000, 340, 1000, 50];

for (let item of arreglo) {
    setTimeout(() => {
        console.log(item);
    }, item);
} 

const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>José Eduardo Viveros Escamilla - TC2005B</title>

  <!-- Nos enlazamos con lab03.css -->
  <link rel="stylesheet" href="lab03.css" />
</head>
<body>

<header class="site-header">    
  <div class="container">
    <h1>José Ed
    uardo Viveros Escamilla</h1>
    <p class="meta">Matrícula: A01710605 · Correo: joseduardo1604@outlook.com</p>
  </div>
</header>

<nav class="site-nav">
  <div class="container">
    <ul>
      <li><a href="#sobre-mi">Sobre mí</a></li>
      <li><a href="#proyectos">Proyectos</a></li>
      <li><a href="#preguntas">Preguntas</a></li>
      <li><a href="#contacto">Contacto</a></li>
    </ul>
  </div>
</nav>

<main class="container">
  <section id="sobre-mi" class="card">
    <h2>Sobre mí</h2>
    <p>Soy estudiante de Ingeniería en Tecnologías Computacionales en el Tecnológico de Monterrey.</p>
    <p>Me apasionan <strong>la divulgación tecnológica, las sereies/peliculas, basquetbol, natación,machine learning y desarrollo web</strong>.</p>
    <figure class="figure">
      <img src="https://imagenes.elpais.com/resizer/v2/IZJ5HFINBX7SA2VLZKXRUQTXJQ.jpg?auth=629b7a11190311a06f5d43f003e25a12759e5a52319ecc8354a2317b013af19a&width=1200" alt="Imagen representativa" />
      <figcaption>Imagen representativa</figcaption>
    </figure>
  </section>

  <section id="proyectos" class="card">
    <h2>Proyectos</h2>
    <ul class="list">
      <li>Proyecto de análisis de sentimientos con Deep Learning</li>
      <li>Sistema web para gestión de artículos y reservas</li>
      <li>Grupo estudiantil Tech For Geeks</li>
    </ul>

    <h3>Tabla de habilidades</h3>
    <div class="table-wrap" role="region" aria-label="Tabla de habilidades">
      <table class="table">
        <thead>
          <tr>
            <th>Tecnología</th>
            <th>Nivel</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Python</td>
            <td>Avanzado</td>
          </tr>
          <tr>
            <td>HTML</td>
            <td>Intermedio</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <section id="preguntas" class="card">
    <h2>Preguntas Teóricas</h2>

   <article class="qa">
  <h3>1) Recomendación sobre usar <code>!important</code> en CSS</h3>
  <p>Evitarlo casi siempre; úsalo solo como último recurso (hotfix) porque dificulta mantener y depurar estilos.</p>
</article>

<article class="qa">
  <h3>2) Imagen de fondo: ¿por qué escogerla con cuidado?</h3>
  <p>Porque afecta rendimiento (peso), legibilidad del texto y puede verse mal en distintas pantallas si la pagina no es responsiva.</p>
</article>

<article class="qa">
  <h3>3) Recomendación entre <code>%</code>, <code>px</code> y <code>pt</code></h3>
  <p><code>%</code> para diseños responsivos, <code>px</code> para tamaños precisos en pantalla, y <code>pt</code> principalmente para impresión.</p>
</article>

<article class="qa">
  <h3>4) ¿Por qué un CSS minimizado mejora rendimiento?</h3>
  <p>Pesa menos y se descarga más rápido, reduciendo tiempo de carga por so tambien lo reducimos a una linea con el .min</p>
</article>

  <section id="contacto" class="card">
    <h2>Formulario de contacto</h2>

    <form class="form" method="POST" action="#">
      <div class="field">
        <label for="nombre">Nombre</label>
        <input type="text" id="nombre" name="nombre" required />
      </div>

      <div class="field">
        <label for="email">Correo</label>
        <input type="email" id="email" name="email" required />
      </div>

      <div class="field">
        <label for="mensaje">Mensaje</label>
        <textarea id="mensaje" name="mensaje" rows="4"></textarea>
      </div>

      <button type="submit">Enviar</button>
    </form>
  </section>
</main>

<footer class="site-footer">
  <div class="container">
    <p>Editor utilizado: Visual Studio Code — <a href="https://code.visualstudio.com/" target="_blank" rel="noopener">Sitio oficial</a></p>
  </div>
</footer>

</body>
</html>
`;

const http = require('http');

const server = http.createServer((request, response) => {  
//    console.log(request);  
//    console.log(response);
    console.log(request.url);
    response.setHeader('Content-Type', 'text/html');
    response.write(html);
    response.end();
});

server.listen(3000);