const rooms = {};  // { roomId: [sockets] }

function manageRoom(ws, roomId) {
    if (!rooms[roomId]) {
        rooms[roomId] = [];
    }

    // Add the user to the room
    rooms[roomId].push(ws);
    ws.roomId = roomId;

    console.log(`User joined room ${roomId}`);
}

module.exports = { manageRoom };
