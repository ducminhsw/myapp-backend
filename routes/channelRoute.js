const express = require('express');
const route = express.Router();

// create new channel
route.post('/new')

// get channel info
route.get('/:id')

// edit channel info
route.put('/:id')

// delete a channel
route.delete('/:id')

module.exports = route;