const io = require('socket.io');
const { Server } = io;

const registerSocketServer = (server) => {
    const ioServer = new Server(server, {
        cors: {
            origin: "*",
            methods: ['GET', 'POST', 'DELETE', 'PUT']
        }
    });

    ioServer.on('connection', (socket) => {
        console.log('Socket on');

        // webrtc
        socket.on('server_signaling', (signal) => {
            console.log('User create the answer.', signal);
        });

        socket.on('enter_room', (room) => {
            console.log('User enter the room.', room);
            socket.join(room.room);
        });

        socket.on('create_offer', (offer) => {
            console.log('User create the offer.', offer);
            socket.emit('receive_offer', { offer: offer });
        });

        socket.on('create_answer', (answer) => {
            console.log('User create the answer.', answer);
        });

        socket.on('left_room', () => {
            console.log('User left the room.');
        });

        // messages
        socket.on('send-message', (socket) => {

        });

        socket.on('withdraw-message', (socket) => {

        });

        socket.on('recieve-message', (socket) => {

        });

        socket.on('disconnect', () => {

        });
    });
};

module.exports = { registerSocketServer };