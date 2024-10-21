const express = require('express');
const http = require('http');
const { setupWebSocket } = require('./websocket/collabSocket');

const app = express();
const server = http.createServer(app);

// Set up WebSocket server and attach to HTTP server
setupWebSocket(server);

// Basic route to test the server
app.get('/', (req, res) => {
    res.send('CollabService is running');
});

module.exports = { app, server };
