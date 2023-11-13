const io = require('socket.io');

const registerSocketServer = (server) => {
    const severIO = io(server, {
        cors: {
            origin: "*",
            methods: ["GET", 'POST', 'DELETE', 'PUT']
        }
    });

    severIO.on('connection', socket => {
        console.log("Socket on:", socket);
    });
}

module.exports = { registerSocketServer };