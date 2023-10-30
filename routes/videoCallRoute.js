const express = require('express');
const route = express.Router();

route.post('/create')
route.post('/join')
route.post('/leave')

module.exports = route;