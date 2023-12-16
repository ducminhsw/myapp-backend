const io = require('socket.io');
const webrtc = require('wrtc');
const { isEmpty } = require('../utils/utilsfunc');
const { Server } = io;
// copy of user stream
const consumeTransporter = new Map();
// real user stream created when create connection
const streamTransport = new Map();
// peers in the server
const peer = new Map();
const clientEmitter = 'webrtc-client';
const serverEmitter = 'webrtc-server';

const servers = {
    iceServers: [
        {
            urls: "stun:stun.relay.metered.ca:80",
        },
        {
            urls: "turn:a.relay.metered.ca:80",
            username: "704093801ff4bbc6cf50683c",
            credential: "a/yUFSINlu9VgERN",
        },
        {
            urls: "turn:a.relay.metered.ca:80?transport=tcp",
            username: "704093801ff4bbc6cf50683c",
            credential: "a/yUFSINlu9VgERN",
        },
        {
            urls: "turn:a.relay.metered.ca:443",
            username: "704093801ff4bbc6cf50683c",
            credential: "a/yUFSINlu9VgERN",
        },
        {
            urls: "turn:a.relay.metered.ca:443?transport=tcp",
            username: "704093801ff4bbc6cf50683c",
            credential: "a/yUFSINlu9VgERN",
        },
    ],
}

const registerSocketServer = (server) => {
    const ioServer = new Server(server, {
        cors: {
            origin: "*",
            methods: ['GET', 'POST', 'DELETE', 'PUT']
        }
    });

    // webrtc

    try {
        ioServer.on('connection', (socket) => {
            const socketString = String(socket.id);

            socket.on("disconnect", (_reason) => {
                const leavePayload = {
                    type: 'someone-left-room',
                    socketId: socketString
                }
                socket.to('main-room').emit("webrtc-client", leavePayload);
                console.log('user leave');
                peer.delete(socketString);
                streamTransport.delete(socketString);
            });

            // webrtc
            socket.on(serverEmitter, async (message) => {
                switch (message.type) {
                    case 'local-send-ice':
                        if (peer.get(socketString) && message.data.ice)
                            peer.get(socketString)
                                .addIceCandidate(new webrtc.RTCIceCandidate(message.data.ice))
                                .catch(e => console.log('1:', e));;
                        break;
                    case 'ice-for-peer-transport':
                        const { uuid, ice } = message.data;
                        if (ice && uuid && consumeTransporter.get(uuid)) {
                            consumeTransporter.get(uuid)
                                .addIceCandidate(new webrtc.RTCIceCandidate(ice))
                                .catch(e => console.log('2:', e));
                        }
                        break;
                    case 'local-send-offer':
                        const { data } = message;
                        const { offer } = data;

                        peer.set(socketString, new webrtc.RTCPeerConnection());
                        peer.get(socketString).ontrack = (event) => {
                            streamTransport.set(socketString, event.streams[0]);
                        }
                        peer.get(socketString).onicecandidate = (event) => {
                            if (event.candidate) {
                                const icePayload = {
                                    type: 'send-ice-to-client',
                                    ice: event.candidate
                                }
                                socket.emit(clientEmitter, icePayload);
                            }
                        }
                        await peer.get(socketString).setRemoteDescription(new webrtc.RTCSessionDescription(offer));
                        const answer = await peer.get(socketString).createAnswer();
                        await peer.get(socketString).setLocalDescription(answer);
                        const answerPayload = {
                            type: 'server-answer-local-offer',
                            answer: answer
                        }
                        socket.emit(clientEmitter, answerPayload);
                        socket.join('main-room');
                        break;
                    case 'get-all-peer':
                        const peers = [];
                        for (const [peerKey, _pc] of peer) {
                            if (peerKey === socketString) continue;
                            peers.push(peerKey);
                        }
                        const peersPayload = {
                            type: 'all-peer',
                            peers: peers
                        }
                        socket.emit(clientEmitter, peersPayload);
                        break;
                    case 'send-offer-for-peer-stream':
                        const offerRemoteStream = message.data.offer;
                        const randomUuid = message.data.uuid;
                        const peerId = message.data.peerId;

                        consumeTransporter.set(randomUuid, new webrtc.RTCPeerConnection(servers));
                        if (!streamTransport.get(peerId)) return;
                        streamTransport.get(peerId).getTracks().forEach((track) => {
                            consumeTransporter.get(randomUuid).addTrack(track, streamTransport.get(peerId));
                        });
                        await consumeTransporter.get(randomUuid).setRemoteDescription(new webrtc.RTCSessionDescription(offerRemoteStream));
                        const answerConsumerTransport = await consumeTransporter.get(randomUuid).createAnswer();
                        await consumeTransporter.get(randomUuid).setLocalDescription(answerConsumerTransport);

                        const consumeTransportPayload = {
                            type: 'answer-consume-remote-stream',
                            peerId: peerId,
                            answer: answerConsumerTransport
                        }
                        socket.emit(clientEmitter, consumeTransportPayload);
                        break;
                    case 'broadcast-all-new-user-joined':
                        const otherPeers = [];
                        for (const [peerKey, _pc] of otherPeers) {
                            if (peerKey === socketString) continue;
                            otherPeers.push(peerKey);
                        }
                        const otherPeersPayload = {
                            type: 'new-user-joined-room',
                            peers: otherPeers,
                            peerId: socketString
                        }
                        socket.to('main-room').emit(clientEmitter, otherPeersPayload);
                        break;
                }
            });

            // message user-user
            socket.on('message-channel-server', (message) => {
                switch (message.type) {
                    case 'send-message-to-channel':
                        break;
                    case 'receive-message-from-channel':
                        break;
                    case 'delete-my-message':
                        break;
                }
            });

            socket.on('message-inbox-server', (message) => {
                switch (message.type) {
                    case 'send-message-to-other':
                        break;
                    case 'receive-message-from-other':
                        break;
                    case 'delete-message':
                        break;
                }
            });
        });
    } catch (error) {
        console.log(error)
    }
};

module.exports = { registerSocketServer };