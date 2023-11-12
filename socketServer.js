const registerSocketServer = (server) => {
    const io = require('socket.io')(server, {
        cors: {
            origin: "*",
            methods: ["GET", 'POST', 'DELETE', 'PUT']
        }
    });

    io.on('connection', socket => {
        console.log("Socket on:", socket);
    });
}

module.exports = { registerSocketServer };