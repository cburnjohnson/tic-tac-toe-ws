const winningCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];
const buttons = document.querySelectorAll('button');
const turnInfo = document.getElementById('turnInfo');

buttons.forEach((button) => {
  button.addEventListener('click', onClick);
});

function onClick(event) {
  socket.send(event.target.id);
}

function checkWinner() {
  const isWinningCombo = winningCombos.some((combo) => {
    const [a, b, c] = combo;
    if (
      buttons[a].innerText &&
      buttons[a].innerText === buttons[b].innerText &&
      buttons[a].innerText === buttons[c].innerText
    ) {
      return true;
    }

    return false;
  });

  return isWinningCombo;
}

function updateCurrentPlayer() {
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  turnInfo.innerText = `${currentPlayer}'s Turn`;
}

function updateWinner() {
  turnInfo.innerText = `${currentPlayer} wins!`;
  hasWinner = true;
}

const socket = new WebSocket('ws://localhost:8081');

socket.addEventListener('open', (event) => {
  console.log('Connected to WebSocket server');
});

socket.addEventListener('message', (event) => {
  const data = JSON.parse(event.data);
  if (data.onLoad) {
    turnInfo.innerText = `${data.currentPlayer}'s Turn`;

    return;
  }

  const button = document.getElementById(data.buttonId);
  button.innerText = data.currentPlayer;
  turnInfo.innerText = `${data.currentPlayer}'s Turn`;

  const isWinner = checkWinner();
  if (isWinner) {
    turnInfo.innerText = `${data.currentPlayer} wins!`;
  }
});

socket.addEventListener('close', (event) => {
  if (event.wasClean) {
    console.log(
      `Connection closed cleanly, code=${event.code}, reason=${event.reason}`
    );
  } else {
    console.log('Connection died');
  }
});
