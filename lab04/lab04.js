function SetOutputText(html) {
    document.getElementById("output").innerHTML = html;
}

/**
 * Ejecuta un callback que usa document.write() y captura lo escrito,
 * sin destruir la página principal.
 */
function captureDocumentWrite(run) {
  const originalHTML = document.body.innerHTML;

  document.open();
  document.write("<!doctype html><html><head><meta charset='utf-8'></head><body>");
  run();
  document.write("</body></html>");
  document.close();

  const captured = document.body.innerHTML;

  document.open();
  document.write("<!doctype html><html><head><meta charset='utf-8'></head><body>");
  document.write(originalHTML);
  document.write("</body></html>");
  document.close();

  return captured;
}

/**
 * EJERCICIO 1
 */
function ejercicio1() {
  const n = Number(prompt("Dame un número entero >= 1:", "10"));

  const html = captureDocumentWrite(() => {
    if (!Number.isInteger(n) || n < 1) {
      document.write("<p>Entrada inválida.</p>");
      return;
    }

    document.write("<h2>Tabla 1..n (cuadrado y cubo)</h2>");
    document.write("<table border='1' cellpadding='6'>");
    document.write("<tr><th>N</th><th>N^2</th><th>N^3</th></tr>");

    for (let i = 1; i <= n; i++) {
      document.write(`<tr><td>${i}</td><td>${i * i}</td><td>${i * i * i}</td></tr>`);
    }

    document.write("</table>");
  });

  SetOutputText(html);
}

/**
 * EJERCICIO 2
 */
function ejercicio2() {
  const numero1 = Math.floor(Math.random() * 100);
  const numero2 = Math.floor(Math.random() * 100);

  const inicio = Date.now();
  const respuesta = prompt(`¿Cuál es la suma de ${numero1} + ${numero2}?`, "");
  const fin = Date.now();

  const tiempo = ((fin - inicio) / 1000).toFixed(2);
  const respuestaNum = Number(respuesta);

  let resultado = "";
  if (respuesta === null) {
    resultado = "Cancelado";
  } else if (respuestaNum === numero1 + numero2) {
    resultado = "Correcto";
  } else {
    resultado = "Incorrecto";
  }

  SetOutputText(`
    <h2>Ejercicio 2</h2>
    <p><strong>Pregunta:</strong> ${numero1} + ${numero2}</p>
    <p><strong>Tu respuesta:</strong> ${respuesta === null ? "Cancelado" : respuesta}</p>
    <p><strong>Resultado:</strong> ${resultado}</p>
    <p><strong>Respuesta correcta:</strong> ${numero1 + numero2}</p>
    <p><strong>Tiempo:</strong> ${tiempo} segundos</p>
  `);
}

/**
 * EJERCICIO 3
 */
function contador(arr) {
  let negativos = 0;
  let ceros = 0;
  let positivos = 0;

  for (let x of arr) {
    if (x < 0) negativos++;
    else if (x === 0) ceros++;
    else positivos++;
  }

  return { negativos, ceros, positivos };
}

// PRUEBAS AUTOMATICAS
console.assert(
  JSON.stringify(contador([-1, 0, 2])) === JSON.stringify({ negativos: 1, ceros: 1, positivos: 1 }),
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

/**
 * EJERCICIO 4
 * Función: promedios
 * Parámetros: Un arreglo de arreglos de números
 * Regresa: Un arreglo con los promedios de cada renglón
 */
function promedios(matriz) {
  let resultado = [];

  for (let fila of matriz) {
    let suma = 0;

    for (let num of fila) {
      suma += num;
    }

    resultado.push(fila.length > 0 ? suma / fila.length : 0);
  }

  return resultado;
}

// PRUEBAS AUTOMATICAS
console.assert(
  JSON.stringify(promedios([[1, 2, 3], [4, 5, 6]])) === JSON.stringify([2, 5]),
  "Ej4 Test 1 falló"
);
console.assert(
  JSON.stringify(promedios([[10, 20], [3, 3, 3], [8]])) === JSON.stringify([15, 3, 8]),
  "Ej4 Test 2 falló"
);
console.assert(
  JSON.stringify(promedios([[], [2, 4]])) === JSON.stringify([0, 3]),
  "Ej4 Test 3 falló"
);

function ejercicio4() {
  const matriz = [
    [10, 8, 9],
    [7, 6, 10],
    [5, 5, 5, 5]
  ];

  const res = promedios(matriz);

  SetOutputText(`
    <h2>Ejercicio 4</h2>
    <p><strong>Matriz:</strong> ${JSON.stringify(matriz)}</p>
    <p><strong>Promedios por renglón:</strong> ${JSON.stringify(res)}</p>
  `);
}

/**
 * EJERCICIO 5
 * Función: inverso
 * Parámetros: Un número
 * Regresa: El número con sus dígitos en orden inverso
 */
function inverso(num) {
  let texto = Math.abs(num).toString();
  let invertido = texto.split("").reverse().join("");
  let resultado = Number(invertido);

  return num < 0 ? -resultado : resultado;
}

// PRUEBAS AUTOMATICAS
console.assert(inverso(12345) === 54321, "Ej5 Test 1 falló");
console.assert(inverso(100) === 1, "Ej5 Test 2 falló");
console.assert(inverso(-987) === -789, "Ej5 Test 3 falló");

function ejercicio5() {
  const numero = Number(prompt("Dame un número para invertir sus dígitos:", "12345"));

  if (isNaN(numero)) {
    SetOutputText(`
      <h2>Ejercicio 5</h2>
      <p>Entrada inválida.</p>
    `);
    return;
  }

  const res = inverso(numero);

  SetOutputText(`
    <h2>Ejercicio 5</h2>
    <p><strong>Número original:</strong> ${numero}</p>
    <p><strong>Número inverso:</strong> ${res}</p>
  `);
}

/**
 * EJERCICIO 6
 * Problema elegido:
 * Control de gastos semanales para un estudiante
 */

class ControlGastos {
  constructor(nombrePersona, presupuestoSemanal) {
    this.nombrePersona = nombrePersona;
    this.presupuestoSemanal = presupuestoSemanal;
    this.gastos = [];
  }

  agregarGasto(concepto, monto) {
    this.gastos.push({ concepto, monto });
  }

  calcularTotalGastado() {
    let total = 0;

    for (let gasto of this.gastos) {
      total += gasto.monto;
    }

    return total;
  }

  calcularDisponible() {
    return this.presupuestoSemanal - this.calcularTotalGastado();
  }

  obtenerGastoMayor() {
    if (this.gastos.length === 0) {
      return null;
    }

    let mayor = this.gastos[0];

    for (let gasto of this.gastos) {
      if (gasto.monto > mayor.monto) {
        mayor = gasto;
      }
    }

    return mayor;
  }
}

// PRUEBAS AUTOMATICAS
const controlPrueba = new ControlGastos("Prueba", 1000);
controlPrueba.agregarGasto("Transporte", 120);
controlPrueba.agregarGasto("Comida", 250);
controlPrueba.agregarGasto("Materiales", 180);

console.assert(controlPrueba.calcularTotalGastado() === 550, "Ej6 Test 1 falló");
console.assert(controlPrueba.calcularDisponible() === 450, "Ej6 Test 2 falló");
console.assert(
  JSON.stringify(controlPrueba.obtenerGastoMayor()) === JSON.stringify({ concepto: "Comida", monto: 250 }),
  "Ej6 Test 3 falló"
);

function ejercicio6() {
  const control = new ControlGastos("Ana", 1500);

  control.agregarGasto("Transporte", 180);
  control.agregarGasto("Comida", 520);
  control.agregarGasto("Fotocopias y materiales", 230);
  control.agregarGasto("Entretenimiento", 150);

  const totalGastado = control.calcularTotalGastado();
  const disponible = control.calcularDisponible();
  const gastoMayor = control.obtenerGastoMayor();

  let listaGastos = "<ul>";
  for (let gasto of control.gastos) {
    listaGastos += `<li>${gasto.concepto}: $${gasto.monto}</li>`;
  }
  listaGastos += "</ul>";

  SetOutputText(`
    <h2>Ejercicio 6</h2>
    <p><strong>Estudiante:</strong> ${control.nombrePersona}</p>
    <p><strong>Presupuesto semanal:</strong> $${control.presupuestoSemanal}</p>
    <p><strong>Gastos registrados:</strong></p>
    ${listaGastos}
    <p><strong>Total gastado:</strong> $${totalGastado}</p>
    <p><strong>Dinero disponible:</strong> $${disponible}</p>
    <p>
      <strong>Gasto mayor:</strong> ${gastoMayor.concepto} ($${gastoMayor.monto})
    </p>
    <p>
      Este ejemplo muestra cómo un objeto puede ayudar a organizar información
      y resolver un problema real de administración de dinero.
    </p>
  `);
}
