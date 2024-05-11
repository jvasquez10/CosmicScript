// Tokens predefinidos por categoría
var tiposDeDatos = [
  { nombre: "codito", descripcion: "Tipo de dato entero" },
  { nombre: "macarron", descripcion: "Tipo de dato flotante" },
  { nombre: "Espagueti", descripcion: "Tipo de dato cadena de texto" },
  { nombre: "conchita", descripcion: "Tipo de dato punto flotante" },
  { nombre: "linwini", descripcion: "Tipo de dato cadena de texto var" },
  { nombre: "ravioli", descripcion: "Tipo de datos char" },
  { nombre: "Fetuchini", descripcion: "long" },
  { nombre: "lasagna", descripcion: "boolean" }
];

var finalizadoresLinea = [
  { nombre: ";", descripcion: "Punto y coma (terminador de sentencia)" }
];

var comentarios = [
  { nombre: "*¡comentario!", descripcion: "Inicio de comentario especial" },
  { nombre: "¡comentario!*", descripcion: "Fin de comentario especial" },
  { nombre: "¡comentario!", descripcion: "Comentario de una sola línea" }
];

var sentenciasControl = [
  { nombre: "sichef", descripcion: "sentencia de control if" },
  { nombre: "enfriar", descripcion: "sentencia de control if" },
  { nombre: "ingredientesreceta", descripcion: "sentencia de control if" },
  { nombre: "ingrediente", descripcion: "sentencia de control if" },
  { nombre: "cucharon", descripcion: "sentencia de control if" },
  { nombre: "picar", descripcion: "sentencia de control if" }
];

var operadores = [
  { nombre: "=", descripcion: "Operador de asignación" },
  { nombre: "::", descripcion: "Operador de asignación variables" },
  { nombre: "+", descripcion: "operador suma" },
  { nombre: "-", descripcion: "operador -" },
  { nombre: "*", descripcion: "operador multiplicar" },
  { nombre: "/", descripcion: "operador division" },
  { nombre: "==", descripcion: "comparacion" },
  { nombre: "<", descripcion: "menor que" },
  { nombre: ">", descripcion: "mayor que" },
  { nombre: "<=", descripcion: "menor o igual" },
  { nombre: ">=", descripcion: "mayor o igual" },
  { nombre: "!=", descripcion: "diferencia" },
  { nombre: "&", descripcion: "logica and" },
  { nombre: "|", descripcion: "logica or" },
  { nombre: "%", descripcion: "modulo, devuelve el resto de una division" },
  { nombre: "(", descripcion: "agrupacion parentesis abierto" },
  { nombre: ")", descripcion: "agrupacion parentesis cerrado" },
  { nombre: "{", descripcion: "agrupacion llave abierta" },
  { nombre: "}", descripcion: "agrupacion llave cerrada" },
  { nombre: "++", descripcion: "aumenta el valor de una variable" },
  { nombre: "--", descripcion: "disminuir el valor de una variable" },
  { nombre: "'", descripcion: "define caracteres" },
  { nombre: "[", descripcion: "Declaracion de un array" },
  { nombre: "]", descripcion: "Declaracion de un array" },
  { nombre: "+=", descripcion: "el valor se aumenta n cantidad de veces" },
  { nombre: "-=", descripcion: "el valor se disminuye n cantidad de veces" },
  { nombre: "*=", descripcion: "el valor se multiplica n cantidad de veces" },
  { nombre: "/=", descripcion: "el valor se aumenta n cantidad de veces" }
];

var bucles = [
  { nombre: "cocinarmilanesa", descripcion: "bucle do while" },
  { nombre: "milanesa", descripcion: "bucle de while" },
  { nombre: "freir", descripcion: "bucle for" }
];

var modificadoresAcceso = [
  { nombre: "desayuno", descripcion: "componente clase public" },
  { nombre: "cena", descripcion: "private" },
  { nombre: "protected", descripcion: "protected" }
];

var excepciones = [
  { nombre: "hornear", descripcion: "try" },
  { nombre: "pastel", descripcion: "catch" },
  { nombre: "servir", descripcion: "finaly" }
];

var palabrasReservadas = [
  { nombre: "estufa", descripcion: "function" },
  { nombre: "sarten", descripcion: "calss" },
  { nombre: "refil", descripcion: "return" },
  { nombre: "salado", descripcion: "true" },
  { nombre: "dulce", descripcion: "false" },
  { nombre: "emplatar", descripcion: "console.log" },
  { nombre: "sazon", descripcion: "get" },
  { nombre: "sabor", descripcion: "set" },
  { nombre: "plato", descripcion: "length" },
  { nombre: "constructor", descripcion: "cubiertos" },
  { nombre: "preparar", descripcion: "this" }
];

const textarea = document.getElementById("input-text");
      const lineNumberDiv = document.getElementById("line-number");

      textarea.addEventListener("input", () => {
        const lines = textarea.value.split("\n").length;
        lineNumberDiv.innerHTML = "";
        for (let i = 1; i <= lines; i++) {
          lineNumberDiv.innerHTML += i + "<br>";
        }
      });

// Combinar todas las categorías en una única variable
var tokensPredefinidos = [].concat(tiposDeDatos, finalizadoresLinea, comentarios, sentenciasControl, operadores, bucles, modificadoresAcceso, excepciones, palabrasReservadas);

function esToken(cadena, comentarioAbierto) {
  // Verificar si la cadena es el inicio o fin de un comentario especial
  if ((cadena === "*¡comentario!" || cadena === "¡comentario!*") && !comentarioAbierto) {
      return true;
  }

  // Verificar si la cadena es un comentario de una sola línea
  if (cadena === "¡comentario!" && !comentarioAbierto) {
      return true;
  }

  // Si el comentario está abierto, verificar si la cadena es un token
  if (comentarioAbierto) {
      return true;
  }

  // Verificar si la cadena está entre comillas dobles y si está, no considerarla como token
  if (/^"\(.*"\)$/.test(cadena)) {
      return false;
  }

  // Verificar si la cadena contiene solo caracteres alfanuméricos, guiones bajos y especiales permitidos
  var esTokenValido = /^[a-zA-Z0-9_*¡!*]+$/.test(cadena);

  // Si el comentario no está abierto, verificar si la cadena es un token predefinido
  return esTokenValido || tokensPredefinidos.some(function(token) {
      return token.nombre === cadena;
  });
}


function analizar() {
  var entrada = document.getElementById('input-text').value;
  var outputTokensDiv = document.getElementById('output-tokens');
  var outputErroresDiv = document.getElementById('output-errores');
  
  outputTokensDiv.innerHTML = '';
  outputErroresDiv.innerHTML = '';
  
  var lineas = entrada.split("\n");
  var totalErrores = 0;

  var comentarioAbierto = false;

  for (var i = 0; i < lineas.length; i++) {
      var tokens = lineas[i].match(/("[^"]*"|\S+)/g); // Utilizamos expresión regular para dividir la línea en tokens

      if (tokens.length === 0) {
          continue;
      }

      var inicioComentarioEnLinea = false;

      for (var j = 0; j < tokens.length; j++) {
          var token = tokens[j];
          var tokenDiv = document.createElement('div');

          if (esToken(token, comentarioAbierto)) {
              if (token === "*¡comentario!") {
                  comentarioAbierto = true;
                  inicioComentarioEnLinea = true;
                  tokenDiv.textContent = "Línea " + (i+1) + ": " + token + " (Inicio de comentario especial)";
                  tokenDiv.className = "token";
                  outputTokensDiv.appendChild(tokenDiv);
              } else if (token === "¡comentario!*") {
                  comentarioAbierto = false;
                  tokenDiv.textContent = "Línea " + (i+1) + ": " + token + " (Fin de comentario especial)";
                  tokenDiv.className = "token";
                  outputTokensDiv.appendChild(tokenDiv);
              } else if (token === "¡comentario!") {
                  tokenDiv.textContent = "Línea " + (i+1) + ": " + token + " (Comentario de una sola línea)";
                  tokenDiv.className = "token";
                  outputTokensDiv.appendChild(tokenDiv);
                  break;
              } else if (comentarioAbierto) {
                  continue;
              } else {
                  var tokenPredefinido = tokensPredefinidos.find(function(t) {
                      return t.nombre === token;
                  });

                  if (tokenPredefinido) {
                      tokenDiv.textContent = "Línea " + (i+1) + ", Token " + (j+1) + ": " + token;
                      tokenDiv.className = "token";
                      outputTokensDiv.appendChild(tokenDiv);
                  } else {
                      tokenDiv.textContent = "Error: Token no reconocido en línea " + (i+1) + ", posición " + (j+1) + ": " + token;
                      tokenDiv.className = "error";
                      outputErroresDiv.appendChild(tokenDiv);
                      totalErrores++;
                  }
              }
          } else {
              // Verificar si el token está entre comillas dobles
              if (!/^"[^"]*"$/.test(token)) {
                  // Si no está entre comillas, se procesa normalmente
                  var subtokens = token.split(/(?=[=;])/);
                  for (var k = 0; k < subtokens.length; k++) {
                      if (subtokens[k] === "cc" && k < subtokens.length - 1) {
                          var textoDespuesCodito = subtokens[k + 1].replace(/;/g, '');
                          tokenDiv.textContent += "Línea " + (i+1) + ": " + textoDespuesCodito + " ";
                      } else {
                          if (!/^"[^"]*"$/.test(subtokens[k])) {
                              // Si el subtoken no está entre comillas, se muestra
                              tokenDiv.textContent += "Línea " + (i+1) + ", Subtoken " + (j+1) + "." + (k+1) + ": " + subtokens[k] + " ";
                          }
                      }
                  }
                  tokenDiv.className = "gray";
                  outputTokensDiv.appendChild(tokenDiv);
              }
          }
      }

      if (comentarioAbierto && !inicioComentarioEnLinea && i === lineas.length - 1) {
          var errorDiv = document.createElement('div');
          errorDiv.textContent = "Error: Falta el fin de comentario especial en la línea " + (i+1);
          errorDiv.className = "error";
          outputErroresDiv.appendChild(errorDiv);
          totalErrores++;
      }
  }

  var totalErroresDiv = document.createElement('div');
  totalErroresDiv.textContent = "Total de errores léxicos: " + totalErrores;
  outputErroresDiv.appendChild(totalErroresDiv);
}



//
function cargarArchivo() {
  const fileInput = document.getElementById('file-input')

  // Escucha el cambio en el input de archivo
  fileInput.addEventListener('change', function (event) {
    const file = event.target.files[0]

    try {
      if (file) {
        // Verifica la extensión del archivo
        const extension = file.name.split('.').pop().toLowerCase()
        if (extension !== 'cosmic') {
          throw new Error('Error: El archivo debe tener la extensión .cosmic')
        }

        const reader = new FileReader()
        reader.onload = (event) => {
          const content = event.target.result
          document.getElementById('input-text').value = content // Muestra el contenido del archivo en el textarea
          actualizarNumerosLinea(content) // Actualiza los números de línea
        }
        reader.readAsText(file)
      } else {
        alert('Error: No se ha cargado ningún archivo')
      }
    } catch (error) {
      alert(error.message)
    }
  })

  fileInput.click() // Simula el clic en el input de archivo
}

// Función para contar las líneas y mostrarlas en el textarea de números de línea
function mostrarNumerosLinea() {
  var numeroLineas = document.getElementById('input-text').value.split('\n')
    .length
  var numerosLinea = ''
  for (var i = 1; i <= numeroLineas; i++) {
    numerosLinea += i + '\n'
  }
  document.getElementById('line-numbers').value = numerosLinea
}

// Actualizar los números de línea cuando cambia el contenido del textarea
document
  .getElementById('input-text')
  .addEventListener('input', mostrarNumerosLinea)

// Mostrar los números de línea al cargar la página
window.onload = mostrarNumerosLinea

function limpiarTodo() {
  // Obtener referencias a los elementos output-tokens y output-errores
  var outputTokens = document.getElementById("output-tokens");
  var outputErrores = document.getElementById("output-errores");
  
  // Limpiar el contenido de los elementos output-tokens y output-errores
  outputTokens.innerHTML = "";
  outputErrores.innerHTML = "";
  
  // Obtener referencia al textarea y limpiar su contenido
  var textarea = document.getElementById("input-text");
  textarea.value = "";
  
  // Llamar a la función para mostrar los números de línea actualizados
  mostrarNumerosLinea();
}
