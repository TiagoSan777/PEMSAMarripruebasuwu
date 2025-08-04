
function iniciarRompecabezas() {
  const container = document.getElementById('puzzle-container');
  container.innerHTML = '';
  const totalPiezas = 20;
  const piezasPorFila = 5;
  const tam = 100;
  let piezasCorrectas = 0;
  let tiempo = 0;

  const timeElement = document.getElementById('puzzle-time');
  const piecesElement = document.getElementById('puzzle-pieces');
  timeElement.textContent = 0;
  piecesElement.textContent = 0;

  const piezas = [];

  for (let i = 0; i < totalPiezas; i++) {
    const pieza = document.createElement('div');
    pieza.className = 'puzzle-piece';

    const col = i % piezasPorFila;
    const row = Math.floor(i / piezasPorFila);

    pieza.dataset.index = i;
    pieza.dataset.correctLeft = col * tam;
    pieza.dataset.correctTop = row * tam;
    pieza.style.backgroundPosition = `-${col * tam}px -${row * tam}px`;

    pieza.setAttribute('draggable', 'true');
    pieza.style.left = Math.random() * (400 - tam) + 'px';
    pieza.style.top = Math.random() * (400 - tam) + 'px';

    pieza.addEventListener('dragstart', function (e) {
      e.dataTransfer.setData('text/plain', this.dataset.index);
      setTimeout(() => (this.style.opacity = '0.5'), 0);
    });

    pieza.addEventListener('dragend', function () {
      this.style.opacity = '1';
    });

    container.appendChild(pieza);
    piezas.push(pieza);
  }

  container.addEventListener('dragover', function (e) {
    e.preventDefault();
  });

  container.addEventListener('drop', function (e) {
    e.preventDefault();
    const index = e.dataTransfer.getData('text/plain');
    const pieza = piezas.find((p) => p.dataset.index === index);

    if (pieza) {
      const dropX = e.clientX - container.getBoundingClientRect().left - tam / 2;
      const dropY = e.clientY - container.getBoundingClientRect().top - tam / 2;

      const correctoX = parseInt(pieza.dataset.correctLeft);
      const correctoY = parseInt(pieza.dataset.correctTop);

      if (Math.abs(dropX - correctoX) < 20 && Math.abs(dropY - correctoY) < 20) {
        pieza.style.left = correctoX + 'px';
        pieza.style.top = correctoY + 'px';
        pieza.setAttribute('draggable', 'false');
        piezasCorrectas++;
        piecesElement.textContent = piezasCorrectas;
        if (piezasCorrectas === totalPiezas) {
          clearInterval(timer);
          alert(`¡Completaste el rompecabezas en ${tiempo} segundos!`);
        }
      } else {
        pieza.style.left = dropX + 'px';
        pieza.style.top = dropY + 'px';
      }
    }
  });

  const timer = setInterval(() => {
    tiempo++;
    timeElement.textContent = tiempo;
  }, 1000);
}
