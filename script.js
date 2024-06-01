const dataTypes = ['codito', 'macarron', 'Espagueti', 'conchita', 'linwini', 'ravioli', 'fetuchini', 'lasagna'];
const reservedWords = ['estufa', 'sarten', 'refil', 'salado', 'dulce', 'emplatar', 'sazon', 'sabor', 'plato', 'preparar', 'cubiertos']; // Nueva categoría de tipos de datos
const controlStatements = ['sichef', 'enfriar', 'ingredientesreceta', 'ingrediente', 'cucharon', 'picar']; // Nueva categoría de sentencias de control
const accessModifiers = ['desayuno', 'cena', 'protected']; // Nueva categoría de modificadores de acceso
const exceptions = ['hornear', 'pastel', 'servir']; // Nueva categoría de excepciones
const loops = ['cocinarmilanesa', 'milanesa', 'freir']; // Nueva categoría de bucles
const operators = ['=', '::', '+', '-', '*', '/', '==', '<', '>', '<=', '>=', '!=', '&', '|', '%', '(', ')', '{', '}', '++', '--', '[', ']', '+=', '-=', '*=', '/=', ';'];
let newTokens = [];

function adjustTextareaHeight() {
    const codeInput = document.getElementById('codeInput');
    const computedHeight = codeInput.scrollHeight;
    const maxHeight = parseInt(window.getComputedStyle(codeInput).getPropertyValue('max-height'));
    codeInput.style.height = Math.min(computedHeight, maxHeight) + 'px';
}

function analyzeCode() {
    const code = document.getElementById('codeInput').value;
    const tokensTable = document.getElementById('tokensTable').getElementsByTagName('tbody')[0];
    const errorsTable = document.getElementById('errorsTable').getElementsByTagName('tbody')[0];

    // Limpiar tablas anteriores
    tokensTable.innerHTML = '';
    errorsTable.innerHTML = '';
    newTokens = []; // Limpiar los nuevos tokens

    const lines = code.split('\n');
    let errors = [];
    let tokens = [];

    let isInString = false; // Bandera para indicar si estamos dentro de una cadena de texto

    lines.forEach((line, lineNumber) => {
        // Ignorar líneas que contienen ¡comentario!
        if (line.includes('¡comentario!')) {
            return;
        }

        let currentToken = ''; // Cadena para construir el token actual
        let lastToken = ''; // Último token procesado

        for (let i = 0; i < line.length; i++) {
            const char = line[i];

            if (char === '"') {
                isInString = !isInString; // Cambiar el estado de la bandera al encontrar comillas
                continue; // Saltar al siguiente carácter
            }

            if (isInString) {
                continue; // Si estamos dentro de una cadena, saltar al siguiente carácter sin procesar
            }

            if (char === ' ' || operators.includes(char)) {
                // Si encontramos un espacio o un operador
                if (currentToken.trim() !== '') {
                    // Si currentToken no está vacío
                    if (isTokenDefined(currentToken)) {
                        // Si currentToken es un token definido, agregarlo a tokens
                        tokens.push({ lexeme: currentToken, type: 'Token', line: lineNumber + 1 });
                        lastToken = currentToken; // Actualizar el último token
                    } else if (dataTypes.includes(lastToken) && !newTokens.includes(currentToken)) {
                        // Si el último token fue un dataType y currentToken no está en newTokens, agregarlo a newTokens
                        newTokens.push(currentToken);
                        tokens.push({ lexeme: currentToken, type: 'NewToken', line: lineNumber + 1 });
                    } else if (newTokens.includes(currentToken)) {
                        // Si currentToken está en newTokens, agregarlo a tokens
                        tokens.push({ lexeme: currentToken, type: 'NewToken', line: lineNumber + 1 });
                    } else {
                        // Si currentToken no es un token definido ni un nuevo token, agregarlo a errors
                        errors.push({ error: currentToken, description: `Error léxico en la línea ${lineNumber + 1}` });
                    }
                    currentToken = ''; // Reiniciar currentToken
                }
                // Si char es un operador, agregarlo a tokens
                if (operators.includes(char)) {
                    tokens.push({ lexeme: char, type: 'Operador', line: lineNumber + 1 });
                }
            } else {
                // Si char no es un espacio ni un operador, agregarlo a currentToken
                currentToken += char;
            }
        }

        if (currentToken.trim() !== '') {
            // Si hay un currentToken al finalizar la línea
            if (isTokenDefined(currentToken)) {
                // Si currentToken es un token definido, agregarlo a tokens
                tokens.push({ lexeme: currentToken, type: 'Token', line: lineNumber + 1 });
            } else if (dataTypes.includes(lastToken) && !newTokens.includes(currentToken)) {
                // Si el último token fue un dataType y currentToken no está en newTokens, agregarlo a newTokens
                newTokens.push(currentToken);
                tokens.push({ lexeme: currentToken, type: 'NewToken', line: lineNumber + 1 });
            } else if (newTokens.includes(currentToken)) {
                // Si currentToken está en newTokens, agregarlo a tokens
                tokens.push({ lexeme: currentToken, type: 'NewToken', line: lineNumber + 1 });
            } else {
                // Si currentToken no es un token definido ni un nuevo token, agregarlo a errors
                errors.push({ error: currentToken, description: `Error léxico en la línea ${lineNumber + 1}` });
            }
        }
    });

    tokens.forEach(token => {
        const row = tokensTable.insertRow();
        row.insertCell(0).innerText = token.lexeme;
        row.insertCell(1).innerText = token.type;
        row.insertCell(2).innerText = token.line;
    });

    errors.forEach(error => {
        const row = errorsTable.insertRow();
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        cell1.innerText = error.error;
        cell2.innerText = error.description;
        cell1.classList.add('error-cell');
        cell2.classList.add('error-cell');
    });
}

function isTokenDefined(token) {
    // Verificar si el token está definido en alguna categoría
    return (
        dataTypes.includes(token) ||
        reservedWords.includes(token) ||
        controlStatements.includes(token) ||
        accessModifiers.includes(token) ||
        exceptions.includes(token) ||
        loops.includes(token) ||
        newTokens.includes(token)
    );
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('open-btn').addEventListener('click', function() {
        var fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.cbj, .txt';
        
        fileInput.onchange = function(event) {
            var file = event.target.files[0];
            var reader = new FileReader();
    
            reader.onload = function() {
                var textArea = document.getElementById('codeInput');
                textArea.value = reader.result;
            }
    
            reader.readAsText(file);
        };
    
        fileInput.click();
    });
    
    document.getElementById('save-btn').addEventListener('click', function() {
        var textArea = document.getElementById('codeInput');
        var fileContent = textArea.value;
        var blob = new Blob([fileContent], { type: 'text/plain' });
        var fileName = 'file.txt';
    
        var link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
    });
    
    document.getElementById('delete-btn').addEventListener('click', function() {
        var textArea = document.getElementById('codeInput');
        textArea.value = '';
        location.reload(); // Recargar la página puede no ser necesario
    });
});
