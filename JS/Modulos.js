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
        backgroundAudio.muted = !backgroundAudio.muted;
        volumeControl.classList.toggle('muted');
    });

    // Obtener el nombre del jugador de la URL y guardarlo en sessionStorage
    const urlParams = new URLSearchParams(window.location.search);
    const nombreJugador = urlParams.get('nombre');
    if (nombreJugador) {
        sessionStorage.setItem('nombreJugador', nombreJugador);
    }

    // Guardar el número del módulo en sessionStorage
    const moduloNumero = urlParams.get('modulo');
    if (moduloNumero) {
        sessionStorage.setItem('moduloNumero', moduloNumero);
    }

    // Cargar la primera pregunta
    cargarPregunta(INDEX_PREGUNTA);
});

// Variables globales para el índice de la pregunta, puntaje e intentos
let INDEX_PREGUNTA = 0;
let puntaje = 0;
let intentos = 0;
let numeroDeModulo = sessionStorage.getItem('moduloNumero'); // Obtener el número del módulo desde sessionStorage

// Función para cargar una pregunta
function cargarPregunta(index) {
    const objetoPregunta = baseDePreguntas[index];
  
    // Ordenar las opciones en el orden A, B, C, D, E, F
    let opciones = [objetoPregunta.respuesta, ...objetoPregunta.distractores];
    opciones.sort((a, b) => a.charAt(0).localeCompare(b.charAt(0)));
  
    document.getElementById("pregunta").innerHTML = objetoPregunta.pregunta;

    // Eliminar todas las opciones existentes
    const opcionesContainer = document.getElementById("opciones-container");
    opcionesContainer.innerHTML = '';

    // Crear y mostrar solo los botones necesarios en el orden A, B, C, D, E, F
    for (let i = 0; i < opciones.length; i++) {
        const opcionElement = document.createElement('div');
        opcionElement.className = 'opcion';
        opcionElement.id = `opcion-${i + 1}`;
        opcionElement.innerHTML = opciones[i];
        opcionElement.onclick = () => seleccionarOpcion(i);
        opcionesContainer.appendChild(opcionElement);
    }
}

// Función para manejar la selección de una opción
async function seleccionarOpcion(index) {
    const objetoPregunta = baseDePreguntas[INDEX_PREGUNTA];
    const opciones = [objetoPregunta.respuesta, ...objetoPregunta.distractores];
    opciones.sort((a, b) => a.charAt(0).localeCompare(b.charAt(0)));
    const validezRespuesta = opciones[index] === objetoPregunta.respuesta;

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
        }).then(() => {
            // Guardar el progreso del módulo
            guardarProgreso(numeroDeModulo, puntaje, baseDePreguntas.length); // Usar la variable numeroDeModulo

            // Obtener el nombre del jugador desde sessionStorage
            const nombreJugador = sessionStorage.getItem('nombreJugador');

            // Redirigir a index.html con el nombre del jugador y los puntajes
            window.location.href = `../index.html?nombre=${encodeURIComponent(nombreJugador)}&puntaje=${puntaje}&total=${baseDePreguntas.length}&modulo=${numeroDeModulo}`;
        });
    }
}

// Función para guardar el progreso en localStorage
function guardarProgreso(modulo, puntaje, total) {
    localStorage.setItem(`modulo${modulo}`, JSON.stringify({ completado: true, puntaje: puntaje, total: total }));
}
