let errorsCount = 0;
let alarmeExibido = false;
let volume = 0;

const localMostrarError = document.getElementById("showError");
const resetButton = document.getElementById("reset");
const body = document.querySelector("body");
const testarAudio = document.getElementById("testAudio");
const horaAtual = document.getElementById("hora");
const testLive = document.getElementById("testLive");

let exibirFundoVermelho = false;

let utimoErro = null;

const audio = new Audio("./audio.mp3");
audio.loop = true;
audio.volume = 1;

async function fetchingData() {
  const response = await fetch(
    "https://raw.githubusercontent.com/this-rafael/this-rafael/main/README.md"
  );

  if (response.status === 200) {
    const data = await response.text();
    // console.log(data);

    const date = new Date();
    console.log(date);
  } else {
    errorsCount += 1;
    console.log("BUCETA", response);
  }
}

function withTimeout(promise, timeout) {
  return Promise.race([
    promise,
    new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error(`Timeout of ${timeout}ms exceeded`));
      }, timeout);
    }),
  ]);
}

async function network() {
  horaAtual.innerText = new Date().toISOString();
  try {
    await withTimeout(fetchingData(), 10000);
  } catch (error) {
    errorsCount += 1;
  }
  console.log("ERROS COUNT", errorsCount);
  if (errorsCount > 30 && !alarmeExibido) {
    alarmeExibido = true;
    console.log("EXIBIR ALARME!!!!!");
    audio.play();
  }

  if (errorsCount > 30) {
    exibirFundoVermelho = !exibirFundoVermelho;
    if (exibirFundoVermelho) {
      body.style.backgroundColor = "red";
    } else {
      body.style.backgroundColor = "white";
    }
  }

  localMostrarError.innerText = errorsCount;
}

async function checkarFuncionamentoDaLive() {
  console.log("checando andamento da live");
  const data = localStorage.getItem("streamStop");
  console.log("data", data);

  if (data === "true") {
    console.log("stream parou");
    audio.play();
  }
}

window.onload = function () {
  resetButton.addEventListener("click", () => {
    audio.pause();
    errorsCount = 0;
    alarmeExibido = false;
    volume = 0;
    body.style.backgroundColor = "white";
    localStorage.setItem("streamStop", "false");
  });
  testAudio.addEventListener("click", () => {
    audio.play();
  });
  testLive.addEventListener("click", () => {
    checkarFuncionamentoDaLive();
  });
  setInterval(network, 2000);

  //const 2 minutos
  const doisMinutos = 5000;
  // setInterval(checkarFuncionamentoDaLive, doisMinutos);
};
