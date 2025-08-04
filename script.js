const canvas = document.getElementById("rompecabezas");
const ctx = canvas.getContext("2d");
const tamaño = 4;
const tamPieza = canvas.width / tamaño;
let piezas = [];
let imagen = new Image();
imagen.src = "assets/rompecabezas-bosque.png";

imagen.onload = () => {
  iniciarJuego();
};

function iniciarJuego() {
  piezas = [];
  for (let y = 0; y < tamaño; y++) {
    for (let x = 0; x < tamaño; x++) {
      piezas.push({ x, y });
    }
  }
  piezas.pop();
  piezas.sort(() => Math.random() - 0.5);
  piezas.push(null);
  dibujar();
}

function dibujar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  piezas.forEach((pieza, index) => {
    if (pieza) {
      const x = (index % tamaño) * tamPieza;
      const y = Math.floor(index / tamaño) * tamPieza;
      ctx.drawImage(
        imagen,
        pieza.x * tamPieza,
        pieza.y * tamPieza,
        tamPieza,
        tamPieza,
        x,
        y,
        tamPieza,
        tamPieza
      );
    }
  });
}

canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left) / tamPieza);
  const y = Math.floor((e.clientY - rect.top) / tamPieza);
  const index = y * tamaño + x;
  const vacio = piezas.indexOf(null);
  const dx = Math.abs((index % tamaño) - (vacio % tamaño));
  const dy = Math.abs(Math.floor(index / tamaño) - Math.floor(vacio / tamaño));

  if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
    piezas[vacio] = piezas[index];
    piezas[index] = null;
    dibujar();
  }
});

document.getElementById("reiniciar").addEventListener("click", iniciarJuego);
