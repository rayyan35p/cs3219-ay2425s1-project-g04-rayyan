const express = require('express');
const http = require('http');
const { setupWebSocket } = require('./websocket/collabSocket');
// const { WebsocketServer } = require('y-websockets-server');

const app = express();
//const PORT = 1234;
 
const server = http.createServer(app);

// Set up WebSocket server and attach to HTTP server
setupWebSocket(server);

//const wss = new WebsocketServer(PORT);
//console.log(`Yjs WebSocket server is running on ws://localhost:${PORT}`)

// Basic route to test the server
app.get('/', (req, res) => {
    res.send('CollabService using Yjs is running');
});

module.exports = { server };
