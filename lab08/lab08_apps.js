const fs = require('fs');
const http = require('http');

// -----------------------------------
// 1. Función que recibe un arreglo y devuelve el promedio
// -----------------------------------
function calcularPromedio(arreglo) {
    if (!Array.isArray(arreglo) || arreglo.length === 0) {
        return 0;
    }

    let suma = 0;
    for (let num of arreglo) {
        suma += num;
    }

    return suma / arreglo.length;
}

const numeros = [10, 20, 30, 40, 50];
console.log("Promedio del arreglo:", calcularPromedio(numeros));

// -----------------------------------
// 2. Función que recibe un string y lo escribe en un archivo
// -----------------------------------
function escribirArchivo(texto) {
    fs.writeFileSync('salida.txt', texto);
    console.log("Archivo creado correctamente con el texto:", texto);
}

escribirArchivo("Hola, este archivo fue creado desde Node.js");

// -----------------------------------
// 3. Problema resuelto antes en otro lenguaje
// Ejemplo: invertir un número
// -----------------------------------
function inverso(numero) {
    let texto = Math.abs(numero).toString();
    let invertido = texto.split('').reverse().join('');
    let resultado = Number(invertido);

    return numero < 0 ? -resultado : resultado;
}

console.log("Número inverso de 12345:", inverso(12345));
console.log("Número inverso de -987:", inverso(-987));

// -----------------------------------
// 4. Servidor web que devuelve mi lab06 catalogo de marvel
// -----------------------------------
const server = http.createServer((request, response) => {
    console.log("Se recibió una petición:", request.url);

    if (request.url === "/") {
        fs.readFile("lab06.html", "utf8", (err, data) => {
            if (err) {
                response.statusCode = 500;
                response.setHeader("Content-Type", "text/plain; charset=utf-8");
                response.end("Error al cargar el archivo HTML");
                return;
            }

            response.statusCode = 200;
            response.setHeader("Content-Type", "text/html; charset=utf-8");
            response.end(data);
        });
    } else {
        response.statusCode = 404;
        response.setHeader("Content-Type", "text/plain; charset=utf-8");
        response.end("Página no encontrada");
    }
});

server.listen(3000, () => {
    console.log("Servidor corriendo en http://localhost:3000");
});