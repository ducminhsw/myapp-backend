const io = require('socket.io');
const { Server } = io;

const registerSocketServer = (server) => {
    const serverIO = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", 'POST', 'DELETE', 'PUT']
        }
    });

    serverIO.on('connect', socket => {
        console.log("Socket on:", socket);
    });
};

module.exports = { registerSocketServer };