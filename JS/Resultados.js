document.addEventListener('DOMContentLoaded', () => {
    const mensajeJugador = document.getElementById('mensaje-jugador');
    const pdfLink = document.getElementById('pdfLink');

    mensajeJugador.innerHTML = '¡Estos Son Los Resultados De Los Módulos Realizados!';

    mostrarResultadosModulos();

    pdfLink.addEventListener('click', generarPDF);
});

function mostrarResultadosModulos() {
    const resultadosContainer = document.getElementById('resultados');
    resultadosContainer.innerHTML = ''; // Limpiar el contenedor antes de agregar resultados
    for (let i = 1; i <= 5; i++) {
        const modulo = JSON.parse(localStorage.getItem(`modulo${i}`));
        if (modulo && modulo.completado) {
            const resultadoDiv = document.createElement('div');
            resultadoDiv.className = 'resultado-modulo';
            let porcentaje = (modulo.puntaje / modulo.total) * 100;
            if (porcentaje === 100) {
                porcentaje = porcentaje.toFixed(0); // Sin decimales si es 100%
            } else {
                porcentaje = porcentaje.toFixed(1); // Un decimal si es menor a 100%
            }
            resultadoDiv.innerText = `En el módulo ${i} obtuviste un ${porcentaje}%`;
            resultadosContainer.appendChild(resultadoDiv);
        }
    }
}

function generarPDF() {
    const body = document.body; // Selecciona todo el cuerpo de la página

    // Opciones para html2pdf
    const opt = {
        margin: 1,
        filename: 'ResultadosJuego.pdf',
        image: { type: 'png', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, backgroundColor: null },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // Usar html2pdf para generar el PDF de toda la página
    html2pdf().from(body).set(opt).save();
}
