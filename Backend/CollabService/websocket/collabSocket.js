const WebSocket = require('ws');
const { manageRoom } = require('../utils/roomManager');

function setupWebSocket(server) {
    const wss = new WebSocket.Server({ server });

    wss.on('connection', (ws) => {
        console.log('User connected to the collaboration space');

        ws.on('message', (message) => {
            const data = JSON.parse(message);

            switch (data.type) {
                case 'joinRoom':
                    manageRoom(ws, data.roomId);
                    break;
                case 'codeUpdate':
                    broadcastToRoom(data.roomId, data.code);
                    break;
                default:
                    console.error('Unknown message type');
            }
        });

        ws.on('close', () => {
            console.log('User disconnected from collaboration space');
        });
    });

    function broadcastToRoom(roomId, code) {
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN && client.roomId === roomId) {
                client.send(JSON.stringify({ type: 'codeUpdate', code }));
            }
        });
    }
}

module.exports = { setupWebSocket };
