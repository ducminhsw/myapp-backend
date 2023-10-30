const express = require('express');
const route = express.Router();

// GET list message
route.get('/list')

// DELETE a conversation
route.delete('/delete')

// POST create a conversation
route.post('/create')

// PUT block a conversation
route.put('/block')

// PUT update information a conversation
route.put('/update')

// GET al message in conversation
route.get('/:id')

module.exports = route;