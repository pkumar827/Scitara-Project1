const app = require("./app");

const {
    startWebSocketServer
} = require("../../advanced/websocket/websocketServer");

const PORT = 3000;

app.listen(PORT, () => {

    console.log(
        `Server running on http://localhost:${PORT}`
    );

    startWebSocketServer();
});