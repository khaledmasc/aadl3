const WebSocket = require('ws');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`✅ Serveur WebSocket en écoute sur le port ${PORT}`);
});

const wss = new WebSocket.Server({ server });

let clients = {}; // username => WebSocket

wss.on('connection', ws => {
  let username = null;

  ws.on('message', message => {
    try {
      const data = JSON.parse(message);
      if (data.from && !username) {
        username = data.from;
        clients[username] = ws;
      }

      const recipient = clients[data.to];
      if (recipient && recipient.readyState === WebSocket.OPEN) {
        recipient.send(JSON.stringify(data));
      }
    } catch (e) {
      console.error("Erreur WebSocket :", e);
    }
  });

  ws.on('close', () => {
    if (username && clients[username]) delete clients[username];
  });
});
