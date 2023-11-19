const express = require('express');
const { createServer, deleteServer, getServerInformation, editServerInformation } = require('../controllers/serverController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { verifiedServerInfo } = require('../middlewares/serverMiddleware');
const route = express.Router();

// authen
route.use(verifyToken);

// create server
route.post('/new', createServer);

// delete server
route.delete('/:id', deleteServer);

// get server info
route.get('/:id', verifiedServerInfo, getServerInformation);

// edit server info
route.put('/:id', editServerInformation);

// user join server
route.post('/:id/on')

// user leave server
route.post('/:id/off')

// remove user from server
route.delete('/:id/:user_id')

module.exports = route;