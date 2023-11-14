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

module.exports = route;