const express = require('express');
const http = require('http');
const { setupWebSocket } = require('./websocket/roomManagerSocket');
const { setUpYjsSocket } = require('./websocket/collabSocket');
const app = express();
 
const server = http.createServer(app);
const yjsPORT = 1234

// Set up WebSocket server and attach to HTTP server
setupWebSocket(server);
setUpYjsSocket(yjsPORT);

// Basic route to test the server
app.get('/', (req, res) => {
    res.send('CollabService using Yjs is running');
});



module.exports = { server };
