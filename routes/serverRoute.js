const express = require('express');
const { createServer, getServerInformation, editServerInformation,
    requestJoinServer, requestLeaveServer, resignServerPosition,
    deleteUserInServer, acceptUserJoin } = require('../controllers/serverController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { verifiedTargetServer } = require('../middlewares/serverMiddleware');
const route = express.Router();

// create server
route.post('/create', createServer);

// middleware verify valid user send request and target server
route.use(verifiedTargetServer);

// admin/head of server deletes the server
route.delete('/delete');
// user gets server info
route.post('/get', getServerInformation);
// admin/head of server edits server info
route.put('/put', editServerInformation);

// admin/head of server creates new channel
// admin/head of server deletes channel
// admin/head of server edits channel's info


// user makes request join server
route.post('/request-to-join', requestJoinServer);
// admin accepts user join server
route.post('/accept-join-request', acceptUserJoin);
// user makes request to leave server
route.post('/request-to-leave', requestLeaveServer);
// head of the server resigns
route.post('/head-user-resign', resignServerPosition);
// admin/head of server removes user from server
route.delete('/remove-user', deleteUserInServer);

module.exports = route;