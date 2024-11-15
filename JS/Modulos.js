let INDEX_PREGUNTA = 0;
let puntaje = 0;
let intentos = 0;
let moduloNumero = null; // Definir moduloNumero en un ámbito más amplio

document.addEventListener('DOMContentLoaded', (event) => {
    moduloNumero = new URLSearchParams(window.location.search).get('modulo'); // Asignar valor a moduloNumero
    cargarPregunta(INDEX_PREGUNTA);
});

// Función para cargar una pregunta
function cargarPregunta(index) {
    const objetoPregunta = baseDePreguntas[index];
    let opciones = [objetoPregunta.respuesta, ...objetoPregunta.distractores];
    opciones.sort((a, b) => a.charAt(0).localeCompare(b.charAt(0)));

    document.getElementById("pregunta").innerHTML = objetoPregunta.pregunta;
    const opcionesContainer = document.getElementById("opciones-container");
    opcionesContainer.innerHTML = '';

    for (let i = 0; i < opciones.length; i++) {
        const opcionElement = document.createElement('div');
        opcionElement.className = 'opcion';
        opcionElement.id = `opcion-${i + 1}`;
        opcionElement.innerHTML = opciones[i];
        opcionElement.onclick = () => seleccionarOpcion(i);
        opcionesContainer.appendChild(opcionElement);
    }

    // Actualizar imágenes
    document.getElementById('imagen-izquierda').src = objetoPregunta.imagenIzquierda;
    document.getElementById('imagen-derecha').src = objetoPregunta.imagenDerecha;
}

// Función para manejar la selección de una opción
async function seleccionarOpcion(index) {
    const objetoPregunta = baseDePreguntas[INDEX_PREGUNTA];
    const opciones = [objetoPregunta.respuesta, ...objetoPregunta.distractores];
    opciones.sort((a, b) => a.charAt(0).localeCompare(b.charAt(0)));
    const validezRespuesta = opciones[index] === objetoPregunta.respuesta;

    if (validezRespuesta) {
        var correctSound = document.getElementById('correct-sound');
        correctSound.play();
        await Swal.fire({
            title: "Respuesta correcta",
            text: "La respuesta ha sido correcta",
            icon: "success",
        });
        puntaje++;
        intentos = 0;
        INDEX_PREGUNTA++;
    } else {
        var incorrectSound = document.getElementById('incorrect-sound');
        incorrectSound.play();
        intentos++;
        if (intentos < 2) {
            await Swal.fire({
                title: "Respuesta Incorrecta",
                text: "Inténtalo de nuevo",
                icon: "error",
            });
        } else {
            await Swal.fire({
                title: "Respuesta Incorrecta",
                html: `La respuesta correcta es ${objetoPregunta.respuesta}`,
                icon: "error",
            });
            intentos = 0;
            INDEX_PREGUNTA++;
        }
    }

    if (INDEX_PREGUNTA < baseDePreguntas.length) {
        cargarPregunta(INDEX_PREGUNTA);
    } else {
        var finalScoreSound = document.getElementById('final-score-sound');
        finalScoreSound.play();

        let porcentaje = (puntaje / baseDePreguntas.length) * 100;
        let mensaje = porcentaje >= 80 ? "¡Felicidades! Has aprobado." : "Puedes intentarlo de nuevo.";
        await Swal.fire({
            title: "Juego terminado",
            text: `Tu puntaje fue de: ${puntaje}/${baseDePreguntas.length} (${porcentaje.toFixed(2)}%). ${mensaje}`,
        }).then(() => {
            guardarProgreso(moduloNumero, puntaje, baseDePreguntas.length);
            // Redirigir a index.html
            window.location.href = `../index.html?puntaje=${puntaje}&total=${baseDePreguntas.length}&modulo=${moduloNumero}`;
        });
    }
}

// Función para guardar el progreso en localStorage
function guardarProgreso(modulo, puntaje, total) {
    localStorage.setItem(`modulo${modulo}`, JSON.stringify({ completado: true, puntaje: puntaje, total: total }));
}
