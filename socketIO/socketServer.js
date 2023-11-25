const io = require('socket.io');
const { Server } = io;

const registerSocketServer = (server) => {
    const ioServer = new Server(server, {
        cors: {
            origin: "*",
            methods: ['GET', 'POST', 'DELETE', 'PUT']
        }
    });

    ioServer.on('connect', socket => {
        console.log('Socket on:', socket);

        socket.on('disconnect')
    });
};

module.exports = { registerSocketServer };