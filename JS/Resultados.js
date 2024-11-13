document.addEventListener('DOMContentLoaded', () => {
    const mensajeJugador = document.getElementById('mensaje-jugador');
    const pdfLink = document.getElementById('pdfLink');

    mensajeJugador.innerHTML = '¡Estos Son Los Resultados De Los Módulos Realizados!';
    mostrarResultadosModulos();

    // Listener para generar PDF
    pdfLink.addEventListener('click', (event) => {
        event.preventDefault();
        generarPDF();
    });
});

function mostrarResultadosModulos() {
    const resultadosContainer = document.getElementById('resultados');
    resultadosContainer.innerHTML = '';
    for (let i = 1; i <= 5; i++) {
        const modulo = JSON.parse(localStorage.getItem(`modulo${i}`));
        if (modulo && modulo.completado) {
            const resultadoDiv = document.createElement('div');
            resultadoDiv.className = 'resultado-modulo';
            let porcentaje = (modulo.puntaje / modulo.total) * 100;
            porcentaje = porcentaje === 100 ? porcentaje.toFixed(0) : porcentaje.toFixed(1);
            resultadoDiv.innerText = `En el módulo ${i} obtuviste un ${porcentaje}%`;
            resultadosContainer.appendChild(resultadoDiv);
        }
    }
}

async function generarPDF() {
    const container = document.getElementById('felicitaciones'); // Selecciona el contenedor específico

    // Captura la imagen del contenedor
    const canvas = await html2canvas(container, {
        scale: 1,
        useCORS: true,
        backgroundColor: null  // Mantiene el fondo transparente si es necesario
    });

    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');

    // Ajuste de tamaño para A4
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = (canvas.height * pageWidth) / canvas.width;

    // Agrega la imagen al PDF
    pdf.addImage(imgData, 'JPEG', 0, 0, pageWidth, pageHeight);
    pdf.save('ResultadosJuego.pdf');
}
