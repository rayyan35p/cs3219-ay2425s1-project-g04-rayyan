const WebSocket = require('ws');

function setUpYjsSocket(port) {
    const wss = new WebSocket.Server({ port: 1234 });

    wss.on('connection', (ws) => {
        console.log('New client connected');

        ws.on('close', () => {
            console.log('Client disconnected');
        });
    });

    console.log('Websocket server is listening on ws://localhost:1234')
}

module.exports = { setUpYjsSocket };