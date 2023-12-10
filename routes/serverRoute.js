const express = require('express');
const { createServer, getServerInformation, editServerInformation,
    requestJoinServer, requestLeaveServer, resignServerPosition,
    deleteUserInServer, acceptUserJoin } = require('../controllers/serverController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { verifiedServerInfo } = require('../middlewares/serverMiddleware');
const route = express.Router();

// authen
route.use(verifyToken);

// create server
route.post('/new', createServer);

// middleware verify valid user send request and target server
route.use(verifiedServerInfo);

// delete server
route.delete('/:serverId');

// get server info
route.get('/:serverId', getServerInformation);

// edit server info
route.put('/:serverId', editServerInformation);

// user request join server
route.post('/:serverId/on', requestJoinServer);

// accept user join server
route.post('/:serverId/:targetUserId/accept', acceptUserJoin);

// user leave server
route.post('/:serverId/off', requestLeaveServer);

// head of server resign
route.post('/:serverId/resign', resignServerPosition);

// remove user from server
route.delete('/:serverId/:targetUserId', deleteUserInServer)

module.exports = route;