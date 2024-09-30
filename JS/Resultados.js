document.addEventListener('DOMContentLoaded', () => {
    const nombreJugador = sessionStorage.getItem('nombreJugador');
    const mensajeJugador = document.getElementById('mensaje-jugador');
    const felicitaciones = document.getElementById('felicitaciones');

    if (nombreJugador && nombreJugador !== 'null' && nombreJugador.trim() !== '') {
        mensajeJugador.innerHTML = `¡Estos Son Los Resultados De Los Módulos Realizados!`;
        felicitaciones.querySelector('h3').innerText = `¡Felicitaciones, ${nombreJugador}! Este es tu resultado:`;
    } else {
        mensajeJugador.innerHTML = '¡Estos Son Los Resultados De Los Módulos Realizados!';
        felicitaciones.querySelector('h3').innerText = '¡Felicitaciones! Este es tu resultado:';
    }

    mostrarResultadosModulos();
});

function mostrarResultadosModulos() {
    const resultadosContainer = document.getElementById('resultados');
    for (let i = 1; i <= 5; i++) {
        const modulo = JSON.parse(sessionStorage.getItem(`modulo${i}`));
        if (modulo && modulo.completado) {
            const resultadoDiv = document.createElement('div');
            resultadoDiv.innerText = `Módulo ${i}: Puntaje - ${modulo.puntaje}`;
            resultadosContainer.appendChild(resultadoDiv);
        }
    }
}
