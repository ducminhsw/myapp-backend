const express = require('express');
const { REQUEST_TYPE } = require('../utils/contants');
const route = express.Router();

// GET friend status
route.get('/status');

// POST send friend request
route.post(`/request/:targetUser/${REQUEST_TYPE.FRIEND_REQUEST}`);

// POST send unfriend
route.post(`/request/:targetUser/${REQUEST_TYPE.UNFRIEND}`);

// POST block
route.post(`/request/:targetUser/${REQUEST_TYPE.BLOCK}`);

// POST unblock
route.post(`/request/:targetUser/${REQUEST_TYPE.UNBLOCK}`);

module.exports = route;