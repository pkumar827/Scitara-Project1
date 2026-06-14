const WebSocket = require('ws');

let wss;

function startWebSocketServer(port = 3001) {

    wss = new WebSocket.Server({ port });

    console.log(
        `WebSocket Server running on ws://localhost:${port}`
    );
}

function broadcast(message) {

    if (!wss) {
        return;
    }

    wss.clients.forEach((client) => {

        if (client.readyState === WebSocket.OPEN) {

            client.send(
                JSON.stringify(message)
            );
        }
    });
}

module.exports = {
    startWebSocketServer,
    broadcast
};