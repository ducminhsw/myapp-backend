const express = require('express');
const route = express.Router();

// create server
route.post('/new')

// delete server
route.delete('/:id')

// get server info
route.get('/:id')

// edit server info
route.put('/:id')

// user join server
route.post('/:id/on')

// user leave server
route.post('/:id/off')

// remove user from server
route.delete('/:id/:user_id')

module.exports = route;