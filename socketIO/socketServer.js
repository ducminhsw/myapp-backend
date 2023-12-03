const io = require('socket.io');
const webrtc = require('wrtc');
const { isEmpty } = require('../utils/utilsfunc');
const { Server } = io;

const streamSender = {};
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

    try {
        ioServer.on('connection', (socket) => {
            // webrtc
            // offer from client
            socket.on('offer_room', async ({ roomId, offer }) => {
                // create peer connection
                const socketString = String(socket.id);
                peerConnection.set(socketString, new webrtc.RTCPeerConnection(servers));

                // peerConnection[socketString] = new webrtc.RTCPeerConnection(servers);

                peerConnection.get(socketString).ontrack = (event) => {
                    streamSender[socketString] = event.streams[0];
                    const senderTracksLength = streamSender[socketString].getTracks().length - 1;
                    for (const stream in streamSender) {
                        // console.log('into for loop')
                        // new user get his/her stream from another
                        if (stream === String(socket.id)) {
                            for (const another in streamSender) {
                                if (socket.id === another) continue;
                                let tracks = streamSender[another].getTracks().length - 1;
                                peerConnection.get(socketString).addTrack(streamSender[another].getTracks()[tracks], streamSender[socketString]);
                            }
                        } else {
                            // new user send his/her stream to another
                            console.log('59', stream);
                            peerConnection.get(stream).addTrack(streamSender[socketString].getTracks()[senderTracksLength], streamSender[stream]);
                        }
                    }
                }

                // create description from offer
                const offerDesc = new webrtc.RTCSessionDescription(offer);

                // set remote description
                await peerConnection.get(socketString).setRemoteDescription(offerDesc);

                // create answer
                const answer = await peerConnection.get(socketString).createAnswer();

                // set local description
                const answerDesc = new webrtc.RTCSessionDescription(answer);
                await peerConnection.get(socketString).setLocalDescription(answerDesc);

                // answer to client by socket
                socket.emit(`finish_answer_${socket.id}`, { answer: answer });
            });

            socket.on('send_ice_candidate', async ({ candidate }) => {
                await peerConnection.get(String(socket.id)).addIceCandidate(candidate);
            })

            // messages
            socket.on('send-message', (socket) => {

            });

            socket.on('withdraw-message', (socket) => {

            });

            socket.on('recieve-message', (socket) => {

            });

            socket.on('disconnect', () => {

            });
        })
    } catch (error) {
        console.log(error)
    }
};

module.exports = { registerSocketServer };