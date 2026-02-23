
function SetOutputText(html) {
    document.getElementById("output").innerHTML = html;
}

/**
 * Ejecuta un callback que usa document.write() y captura lo escrito,
 * sin destruir la página principal.
 */

function captureDocumentWrite(run) {
  const originalHTML = document.body.innerHTML;

  // Reemplazamos temporalmente el documento (en memoria de esta página)
  document.open();
  document.write("<!doctype html><html><head><meta charset='utf-8'></head><body>");
  run(); // aquí se usa document.write()
  document.write("</body></html>");
  document.close();

  // Capturamos lo que se escribió
  const captured = document.body.innerHTML;

  // Restauramos la página original
  document.open();
  document.write("<!doctype html><html><head><meta charset='utf-8'></head><body>");
  document.write(originalHTML);
  document.write("</body></html>");
  document.close();

  return captured;
}

/**
EJERCICIO 1
 */
function ejercicio1() {
  const n = Number(prompt("Dame un número entero >= 1:", "10"));

  const html = captureDocumentWrite(() => {
    if (!Number.isInteger(n) || n < 1) {
      document.write("<p>Entrada inválida.</p>");
      return;
    }

    document.write("<h2>Tabla 1..n (cuadrado y cubo)</h2>");
    document.write("<table border='1'>");
    document.write("<tr><th>N</th><th>N^2</th><th>N^3</th></tr>");

    for (let i = 1; i <= n; i++) {
      document.write(`<tr><td>${i}</td><td>${i*i}</td><td>${i*i*i}</td></tr>`);
    }

    document.write("</table>");
  });

  SetOutputText(html);
}


/**
EJERCICIO 2
 */
function ejercicio2() {
    /**
     * Genera dos números aleatorios entre 0 y 100
     */
    const numero1 = Math.floor(Math.random() * 100);
    const numero2 = Math.floor(Math.random() * 100);

    /** Creamos el contador de tiempo antes de enviar la pregunta */
    const inicio = Date.now();
    const respuesta = prompt(`¿Cuál es la suma de ${numero1} + ${numero2}?`, "");
    const fin = Date.now();

    /** Calculamos el tiempo transcurrido en segundos 
     * La diferencia entre fin e inicio nos da el tiempo en milisegundos,
     * por eso lo dividimos entre 1000 para obtener segundos.
    */
    const tiempo = ((fin - inicio) / 1000);
    const respuestaNum = Number(respuesta);

  SetOutputText(`
    <h2>Ejercicio 2</h2>
    <p><strong>Pregunta:</strong> ${numero1} + ${numero2}</p>
    <p><strong>Tu respuesta:</strong> ${respuesta === null ? "Cancelado" : respuesta}</p>
    <p><strong>Resultado:</strong> ${respuestaNum === numero1 + numero2 ? "Correcto" : "Incorrecto"} (correcta: ${numero1 + numero2})</p>
    <p><strong>Tiempo:</strong> ${tiempo} segundos</p>
  `);

}

/**
EJERCICIO 3
 */

function contador(arr){
    let negativos = 0;
    let ceros = 0;
    let positivos = 0;

    for(let x of arr){
        if(x < 0) negativos++;
        else if(x === 0) ceros++;
        else positivos++;
    }
    return {negativos, ceros, positivos};
}

// PRUEBAS AUTOMATICAS
console.assert(
    JSON.stringify(contador([-1, 0, 2])) === JSON.stringify({negativos: 2, ceros: 1, positivos: 2}),
  "Ej3 Test 1 falló"
);
console.assert(
  JSON.stringify(contador([0, 0, 0])) === JSON.stringify({ negativos: 0, ceros: 3, positivos: 0 }),
  "Ej3 Test 2 falló"
);
console.assert(
  JSON.stringify(contador([-5, -2, -1])) === JSON.stringify({ negativos: 3, ceros: 0, positivos: 0 }),
  "Ej3 Test 3 falló"
);

function ejercicio3() {
  // Caso de ejemplo (puedes cambiarlo)
  const ejemplo = [-3, -1, 0, 0, 2, 7];
  const res = contador(ejemplo);

  SetOutputText(`
    <h2>Ejercicio 3</h2>
    <p><strong>Arreglo:</strong> ${JSON.stringify(ejemplo)}</p>
    <p><strong>Negativos:</strong> ${res.negativos}</p>
    <p><strong>Ceros:</strong> ${res.ceros}</p>
    <p><strong>Positivos:</strong> ${res.positivos}</p>
  `);
}