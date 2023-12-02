const io = require('socket.io');
const webrtc = require('wrtc');
const { isEmpty } = require('../utils/utilsfunc');
const { Server } = io;

const streamSender = {};
const peerConnection = {};

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
            // offer from server
            socket.on('join_room', async ({ roomId, socketId }) => {
                console.log(socketId);
                // create new peer connection with socket.id
                peerConnection[`${socketId}`] = new webrtc.RTCPeerConnection(servers);

                // if client add track
                peerConnection[`${socketId}`].ontrack = (event) => {
                    console.log(event.streams[0]);
                    streamSender[`${socketId}`] = event.streams[0];
                }

                // if client add track
                peerConnection[`${socketId}`].onicecandidate = (event) => {
                    console.log(event);
                    if (event.candidate) {
                        console.log('New ICE candidate', event.candidate);
                    }
                }

                // create offer to client
                const serverOffer = await peerConnection[`${socketId}`].createOffer();
                const desc = new webrtc.RTCSessionDescription(serverOffer);
                // setLocal(server)Description
                await peerConnection[`${socketId}`].setLocalDescription(desc);

                // emit event offer connection to client
                socket.emit(`server_offer_${socketId}`, { serverOffer });
            });

            socket.on('answer_server', async ({ answer, socketId }) => {
                const desc = new webrtc.RTCSessionDescription(answer);
                await peerConnection[`${socketId}`].setRemoteDescription(desc);
                socket.emit('RTC connection created');
            });

            // offer from client
            socket.on('offer_room', async ({ roomId, offer }) => {
                socket.join(roomId);
                // create peer connection
                peerConnection[`${socket.id}`] = new webrtc.RTCPeerConnection(servers);

                peerConnection[`${socket.id}`].ontrack = (event) => {
                    console.log(event);
                    streamSender[`${socket.id}`] = event.streams[0];
                }

                peerConnection.onicecandidate = (event) => {
                    console.log('Candidate 0000');
                    if (event.candidate) {
                        console.log('Candidate', event.candidate);
                    }
                }

                // create description from offer
                const offerDesc = new webrtc.RTCSessionDescription(offer);

                // set remote description
                await peerConnection[`${socket.id}`].setRemoteDescription(offerDesc);

                // create answer
                const answer = await peerConnection[`${socket.id}`].createAnswer();

                // set local description
                const answerDesc = new webrtc.RTCSessionDescription(answer);
                await peerConnection[`${socket.id}`].setLocalDescription(answerDesc);

                // answer to client by socket
                socket.emit(`finish_answer_${socket.id}`, { answer: answer });
            });

            socket.on('join_channel_done', () => {
                console.log('Done');
                const isEmptyRoom = isEmpty(streamSender);
                if (!isEmptyRoom) {
                    for (stream of streamSender) {
                        if (stream === socket.id) continue;
                        peerConnection[`${socket.id}`].addTrack(streamSender[`${socket.id}`]);
                    }
                }
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
        })
    } catch (error) {
        console.log(error)
    }
};

module.exports = { registerSocketServer };