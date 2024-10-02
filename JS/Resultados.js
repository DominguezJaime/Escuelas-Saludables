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
    const resultadosContainer = document.getElementById('felicitaciones'); // Selecciona el contenedor principal

    // Opciones para html2canvas
    const canvasOptions = {
        scale: 2,
        useCORS: true,
        logging: true,
        backgroundColor: null,
        foreignObjectRendering: true
    };

    // Usar html2canvas para capturar la página como una imagen
    html2canvas(resultadosContainer, canvasOptions).then(canvas => {
        const imgData = canvas.toDataURL('image/jpeg', 0.98);
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('ResultadosJuego.pdf');
    });
}
