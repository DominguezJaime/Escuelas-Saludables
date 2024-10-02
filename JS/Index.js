document.addEventListener('DOMContentLoaded', (event) => {
    const reiniciarBtn = document.getElementById('reiniciar');

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

    function reiniciarLocalStorage() {
        localStorage.clear();
        mostrarEstadoModulos();
    }

    if (reiniciarBtn) {
        reiniciarBtn.addEventListener('click', reiniciarLocalStorage);
    }

    // Mostrar el estado de los módulos al cargar la página
    mostrarEstadoModulos();
});
