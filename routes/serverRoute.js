const express = require('express');
const { createServer, getServerInformation, editServerInformation, requestJoinServer, requestLeaveServer, resignServerPosition, deleteUserInServer, acceptUserJoin } = require('../controllers/serverController');
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
route.delete('/:id');

// get server info
route.get('/:id', getServerInformation);

// edit server info
route.put('/:id', editServerInformation);

// user request join server
route.post('/:id/on', requestJoinServer);

// accept user join server
route.post('/:id/accept', acceptUserJoin);

// user leave server
route.post('/:id/off', requestLeaveServer);

// head of server resign
route.post('/:id/resign', resignServerPosition);

// remove user from server
route.delete('/:id/:user_id', deleteUserInServer)

module.exports = route;