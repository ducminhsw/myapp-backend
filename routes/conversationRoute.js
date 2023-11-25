const express = require('express');
const route = express.Router();

// POST create/start a conversation
route.post('/start')

// GET list message
route.get('/list/:block')

// 

// PUT update information a conversation
route.put('/update')

// GET al message in conversation
route.get('/:id')

module.exports = route;