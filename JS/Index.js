document.addEventListener('DOMContentLoaded', (event) => {
    const nombreJugadorMostrado = document.getElementById('nombre-jugador-mostrado');
    const nombreJugadorInput = document.getElementById('nombre-jugador-input');
    const guardarNombreBtn = document.querySelector('button');
    const reiniciarBtn = document.getElementById('reiniciar');
    const resultadosBtn = document.getElementById('resultados');

    function guardarNombre() {
        const nombreJugador = nombreJugadorInput.value;
        const nombreGuardado = localStorage.getItem('nombreJugador');

        if (nombreJugador !== nombreGuardado) {
            // Borrar los resultados de los módulos si el nombre es distinto
            for (let i = 1; i <= 5; i++) {
                localStorage.removeItem(`modulo${i}`);
            }
        }

        localStorage.setItem('nombreJugador', nombreJugador);
        mostrarEstadoModulos();
        mostrarNombreJugador();
    }

    function mostrarEstadoModulo(modulo) {
        const estado = JSON.parse(localStorage.getItem(`modulo${modulo}`));
        const estadoModuloElem = document.getElementById(`estado-modulo${modulo}`);
        if (estado && estado.completado) {
            const porcentaje = ((estado.puntaje / estado.total) * 100).toFixed(2);
            estadoModuloElem.innerText = `Completado - Puntaje: ${porcentaje}%`;
            estadoModuloElem.style.display = 'block';
        } else {
            estadoModuloElem.innerText = 'No completado';
            estadoModuloElem.style.display = 'block';
        }
    }

    function mostrarEstadoModulos() {
        for (let i = 1; i <= 5; i++) {
            mostrarEstadoModulo(i);
        }
    }

    function mostrarNombreJugador() {
        const nombreGuardado = localStorage.getItem('nombreJugador');
        if (nombreGuardado && nombreGuardado !== 'null' && nombreGuardado.trim() !== '') {
            nombreJugadorMostrado.innerText = `¡Bienvenido ${nombreGuardado}!`;
        } else {
            nombreJugadorMostrado.innerText = '¡Bienvenido!';
        }
    }

    function reiniciarLocalStorage() {
        localStorage.clear();
        mostrarEstadoModulos();
        mostrarNombreJugador();
    }

    guardarNombreBtn.addEventListener('click', guardarNombre);
    reiniciarBtn.addEventListener('click', reiniciarLocalStorage);

    // Mostrar el estado de los módulos y el nombre del jugador al cargar la página
    mostrarEstadoModulos();
    mostrarNombreJugador();
});
