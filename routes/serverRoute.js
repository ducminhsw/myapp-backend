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
route.post('/server', createServer);

// middleware verify valid user send request and target server
route.use(verifiedServerInfo);

// delete server
route.delete('/');

// get server info
route.post('/', getServerInformation);

// edit server info
route.put('/', editServerInformation);

// user request join server
route.post('/on', requestJoinServer);

// accept user join server
route.post('/accept', acceptUserJoin);

// user leave server
route.post('/off', requestLeaveServer);

// head of server resign
route.post('/resign', resignServerPosition);

// remove user from server
route.delete('/server/target', deleteUserInServer);

module.exports = route;