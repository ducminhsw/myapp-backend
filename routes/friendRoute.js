const express = require('express');
const { REQUEST_TYPE } = require('../utils/contants');
const route = express.Router();

// GET friend status
route.get('/status');

// POST send friend request
route.post('/request/friend/:id');

// POST send unfriend
route.post(`/request/${REQUEST_TYPE.FRIEND_REQUEST}`);

// POST block
route.post(`/request/${REQUEST_TYPE.BLOCK}`);

// POST unblock
route.post(`/request/${REQUEST_TYPE.UNBLOCK}`);

module.exports = route;