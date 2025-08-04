const canvas = document.getElementById("rompecabezas");
const ctx = canvas.getContext("2d");
const jugarBtn = document.getElementById("jugar");
const contador = document.getElementById("contador");

const piezasX = 5;
const piezasY = 4;
const totalPiezas = piezasX * piezasY;
const anchoPieza = canvas.width / piezasX;
const altoPieza = canvas.height / piezasY;

let piezas = [];
let colocadas = 0;
let tiempo = 0;
let intervalo;

const imagen = new Image();
imagen.src = "assets/rompecabezas-bosque.png";

imagen.onload = function () {
  // Dibujo inicial (imagen completa)
  ctx.drawImage(imagen, 0, 0, canvas.width, canvas.height);
};

function iniciarJuego() {
  piezas = [];
  colocadas = 0;
  tiempo = 0;
  clearInterval(intervalo);
  intervalo = setInterval(() => {
    tiempo++;
    actualizarContador();
  }, 1000);

  for (let y = 0; y < piezasY; y++) {
    for (let x = 0; x < piezasX; x++) {
      const pieza = {
        correctX: x * anchoPieza,
        correctY: y * altoPieza,
        actualX: Math.random() * (canvas.width - anchoPieza),
        actualY: Math.random() * (canvas.height - altoPieza),
        colocada: false,
      };
      piezas.push(pieza);
    }
  }

  dibujarPiezas();
}

function dibujarPiezas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  piezas.forEach((pieza, i) => {
    const col = i % piezasX;
    const fil = Math.floor(i / piezasX);

    if (!pieza.colocada) {
      ctx.drawImage(
        imagen,
        col * anchoPieza,
        fil * altoPieza,
        anchoPieza,
        altoPieza,
        pieza.actualX,
        pieza.actualY,
        anchoPieza,
        altoPieza
      );
    } else {
      ctx.drawImage(
        imagen,
        col * anchoPieza,
        fil * altoPieza,
        anchoPieza,
        altoPieza,
        pieza.correctX,
        pieza.correctY,
        anchoPieza,
        altoPieza
      );
    }
  });
}

canvas.addEventListener("mousedown", seleccionarPieza);
let piezaSeleccionada = null;
let offsetX, offsetY;

function seleccionarPieza(e) {
  const mouseX = e.offsetX;
  const mouseY = e.offsetY;

  for (let i = piezas.length - 1; i >= 0; i--) {
    const pieza = piezas[i];
    if (
      !pieza.colocada &&
      mouseX >= pieza.actualX &&
      mouseX <= pieza.actualX + anchoPieza &&
      mouseY >= pieza.actualY &&
      mouseY <= pieza.actualY + altoPieza
    ) {
      piezaSeleccionada = pieza;
      offsetX = mouseX - pieza.actualX;
      offsetY = mouseY - pieza.actualY;
      canvas.addEventListener("mousemove", moverPieza);
      canvas.addEventListener("mouseup", soltarPieza);
      break;
    }
  }
}

function moverPieza(e) {
  if (piezaSeleccionada) {
    piezaSeleccionada.actualX = e.offsetX - offsetX;
    piezaSeleccionada.actualY = e.offsetY - offsetY;
    dibujarPiezas();
  }
}

function soltarPieza() {
  if (piezaSeleccionada) {
    const dx = Math.abs(piezaSeleccionada.actualX - piezaSeleccionada.correctX);
    const dy = Math.abs(piezaSeleccionada.actualY - piezaSeleccionada.correctY);

    if (dx < 15 && dy < 15) {
      piezaSeleccionada.colocada = true;
      piezaSeleccionada.actualX = piezaSeleccionada.correctX;
      piezaSeleccionada.actualY = piezaSeleccionada.correctY;
      colocadas++;

      if (colocadas === totalPiezas) {
        clearInterval(intervalo);
        alert(`¡Felicidades! Has completado el rompecabezas en ${tiempo} segundos.`);
      }
    }

    piezaSeleccionada = null;
    canvas.removeEventListener("mousemove", moverPieza);
    canvas.removeEventListener("mouseup", soltarPieza);
    dibujarPiezas();
    actualizarContador();
  }
}

function actualizarContador() {
  contador.textContent = `Tiempo: ${tiempo} segundos | Piezas colocadas: ${colocadas} / ${totalPiezas}`;
}

jugarBtn.addEventListener("click", iniciarJuego);
