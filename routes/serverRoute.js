const express = require('express');
const { createServer, getServerInformation, editServerInformation,
    requestJoinServer, requestLeaveServer, resignServerPosition,
    deleteUserInServer, acceptUserJoin, createInvitation } = require('../controllers/serverController');
const { verifyAccessToken } = require('../middlewares/authMiddleware');
const { verifyUserWithServer } = require('../middlewares/serverMiddleware');
const route = express.Router();

// this already verify the user validation
route.use(verifyAccessToken);

route.post('/create-server', createServer);
route.post('/create-initation', createInvitation)

// verify server
route.use(verifyUserWithServer)
    .post('/get-server-info', getServerInformation)
    .put('/edit-server-info', editServerInformation)
    .delete('/delete-server');

route.post('/create-channel');

// verify channel
route.post('/get-channel-info');
route.put('/edit-channel-info');
route.delete('/delete-channel');

// verify admin/head of server
route.post('/request-to-join', requestJoinServer);
route.post('/accept-join-request', acceptUserJoin);
route.post('/request-to-leave', requestLeaveServer);
route.post('/head-user-resign', resignServerPosition);
route.delete('/remove-user', deleteUserInServer);

module.exports = route;