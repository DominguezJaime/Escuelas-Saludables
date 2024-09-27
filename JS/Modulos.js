document.addEventListener('DOMContentLoaded', (event) => {
    var volumeControl = document.getElementById('volume-control');
    var backgroundAudio = document.getElementById('background-audio');

    // Asegurarse de que el audio de fondo no esté silenciado
    backgroundAudio.muted = false;

    // Inicializar el estado de mute según el estado actual del audio
    if (backgroundAudio.muted) {
        volumeControl.classList.add('muted');
    } else {
        volumeControl.classList.remove('muted');
    }

    // Añadir el evento de clic para alternar el estado de mute
    volumeControl.addEventListener('click', () => {
        if (backgroundAudio.muted) {
            backgroundAudio.muted = false;
            volumeControl.classList.remove('muted');
        } else {
            backgroundAudio.muted = true;
            volumeControl.classList.add('muted');
        }
    });
});

// Variables globales para el índice de la pregunta, puntaje e intentos
let INDEX_PREGUNTA = 0;
let puntaje = 0;
let intentos = 0;

// Cargar la primera pregunta
cargarPregunta(INDEX_PREGUNTA);

// Función para cargar una pregunta
function cargarPregunta(index) {
    objetoPregunta = baseDePreguntas[index];
  
    opciones = [...objetoPregunta.distractores];
    opciones.push(objetoPregunta.respuesta);
    for (let i = 0; i < 4; i++) {
        opciones.sort();
    }
  
    document.getElementById("pregunta").innerHTML = objetoPregunta.pregunta;

    // Ocultar todos los botones primero
    for (let i = 1; i <= 4; i++) {
        document.getElementById(`opcion-${i}`).style.display = 'none';
    }

    // Mostrar solo los botones necesarios
    for (let i = 0; i < opciones.length; i++) {
        document.getElementById(`opcion-${i + 1}`).style.display = 'block';
        document.getElementById(`opcion-${i + 1}`).innerHTML = opciones[i];
    }
}

// Función para manejar la selección de una opción
async function seleccionarOpción(index) {
    let validezRespuesta = opciones[index] == objetoPregunta.respuesta;
    if (validezRespuesta) {
        var correctSound = document.getElementById('correct-sound');
        correctSound.play(); // Reproducir el sonido de respuesta correcta

        await Swal.fire({
            title: "Respuesta correcta",
            text: "La respuesta ha sido correcta",
            icon: "success",
        });
        puntaje++;
        intentos = 0; // Reiniciar los intentos después de una respuesta correcta
        INDEX_PREGUNTA++; // Pasar a la siguiente pregunta
    } else {
        var incorrectSound = document.getElementById('incorrect-sound');
        incorrectSound.play(); // Reproducir el sonido de respuesta incorrecta

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
            intentos = 0; // Reiniciar los intentos después de mostrar la respuesta correcta
            INDEX_PREGUNTA++; // Pasar a la siguiente pregunta
        }
    }

    if (INDEX_PREGUNTA < baseDePreguntas.length) {
        cargarPregunta(INDEX_PREGUNTA);
    } else {
        var finalScoreSound = document.getElementById('final-score-sound');
        finalScoreSound.play(); // Reproducir el sonido de puntaje final

        let porcentaje = (puntaje / baseDePreguntas.length) * 100;
        let mensaje = porcentaje >= 80 ? "¡Felicidades! Has aprobado." : "Puedes intentarlo de nuevo.";
        await Swal.fire({
            title: "Juego terminado",
            text: `Tu puntaje fue de: ${puntaje}/${baseDePreguntas.length} (${porcentaje.toFixed(2)}%). ${mensaje}`,
        });
        INDEX_PREGUNTA = 0;
        puntaje = 0;
        cargarPregunta(INDEX_PREGUNTA);
    }
}
