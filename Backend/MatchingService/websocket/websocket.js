const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
    console.log('User connected to WebSocket');
    
    ws.on('message', (message) => {
        console.log(`Received message: ${message}`);
    });

    ws.on('close', () => {
        console.log('User disconnected from WebSocket');
    });
});

/**
 * Notify users through WebSocket.
 * @param {string|array} userId - User ID or an array of user IDs to notify.
 * @param {string} message - The message to send.
 * @param {string} type - The type of message (e.g., 'match' or 'rejection').
 */
function notifyUsers(userId, message, type) {
    console.log(`Notifying user: ${userId}, Message: ${message}, Type: ${type}`); // Log message details
    
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            // Construct the payload to include userId, message, and type
            client.send(JSON.stringify({
                userId, 
                message,
                type // This allows the frontend to differentiate between match and rejection messages
            }));
        }
    });
}

module.exports = { notifyUsers };
