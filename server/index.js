import { createServer } from 'http';
import { WebSocketServer } from 'ws';

const server = createServer();
const wss = new WebSocketServer({ server });

let currentPlayer = 'X';
let hasWinner = false;


wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.send(
    JSON.stringify({
      onLoad: true,
      currentPlayer: currentPlayer
    })
  );

  ws.on('message', (message) => {
    wss.clients.forEach((client) => {
      const data = {
        onLoad: false,
        buttonId: message.toString(),
        currentPlayer
      };

      client.send(JSON.stringify(data));
    });

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  });

  ws.on('error', console.error);
});

const PORT = 8081;
server.listen(PORT, () => {
  console.log(`WebSocket server is running on port ${PORT}`);
});
