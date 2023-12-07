const io = require('socket.io');
const webrtc = require('wrtc');
const { isEmpty } = require('../utils/utilsfunc');
const { Server } = io;

const streamSender = new Map();
const consumeTransport = new Map();
const peerConnection = new Map();

const servers = {
    iceServers: [
        {
            urls: 'stun:stun.l.google.com:19302'
        },
        {
            urls: 'turn:relay1.expressturn.com:3478',
            username: 'ef2QGP88JE576UZJ7D',
            credential: 'fu4PRmzfP5GpXdqj',
        },
        { urls: "turn:a.relay.metered.ca:80", username: "1a38a9ab28c6d467023a08fb", credential: "KJi1ynRRNT2eB9UL" },
        { urls: "turn:a.relay.metered.ca:80?transport=tcp", username: "1a38a9ab28c6d467023a08fb", credential: "KJi1ynRRNT2eB9UL" },
        { urls: "turn:a.relay.metered.ca:443", username: "1a38a9ab28c6d467023a08fb", credential: "KJi1ynRRNT2eB9UL" },
        { urls: "turn:a.relay.metered.ca:443?transport=tcp", username: "1a38a9ab28c6d467023a08fb", credential: "KJi1ynRRNT2eB9UL" }
    ]
}

const registerSocketServer = (server) => {
    const ioServer = new Server(server, {
        cors: {
            origin: "*",
            methods: ['GET', 'POST', 'DELETE', 'PUT']
        }
    });

    const handleOfferFromClient = async (socket, message) => {
        const socketString = String(socket.id);
        peerConnection.set(socketString, new webrtc.RTCPeerConnection(servers));

        peerConnection.get(socketString).ontrack = (event) => {
            console.log('into ontrack');
            peerConnection.get(socketString).stream = event.streams[0];
        }
        const { offer } = message;

        await peerConnection.get(socketString).setRemoteDescription(offer);
        const answer = await peerConnection.get(socketString).createAnswer();
        await peerConnection.get(socketString).setLocalDescription(answer);

        socket.emit(
            'webrtc-client',
            {
                type: 'answer-offer',
                answer: answer
            }
        );
    }

    const handleRequestGetPeers = (socket, message) => {
        const listPeers = [];
        for (const peer in streamSender) {
            if (peer === String(socket.id)) continue;
            listPeers.push(
                {
                    peerId: peer,
                    peerName: peer.username || socket.id
                }
            );
        }

        socket.emit('peers', { listPeers });
    }

    const handleIceFromClient = (socket, message) => {
        console.log('into add ice');
        peerConnection.get(message.peerId).addIceCandidate(message.candidate);
    }

    const handleRequestStreamFromClient = (socket, message) => {

    }

    const handleSendIceConsumeToClient = (socket, message) => {

    }

    // webrtc
    const handleMessageFromClient = (socket, message) => {
        switch (message.type) {
            case 'send-offer':
                handleOfferFromClient(socket, message);
                break;
            case 'get-peer':
                handleRequestGetPeers(socket, message);
                break;
            case 'send-ice':
                handleIceFromClient(socket, message);
                break;
            case 'consume-stream':
                handleRequestStreamFromClient(socket, message);
                break;
            case 'consume-ice-stream':
                handleSendIceConsumeToClient(socket, message);
                break;
        }
    }

    // message

    try {
        ioServer.on('connection', (socket) => {
            // webrtc
            socket.on('webrtc-server', (message) => {
                handleMessageFromClient(message);
            })
        })
    } catch (error) {
        console.log(error)
    }
};

module.exports = { registerSocketServer };