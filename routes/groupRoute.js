const express = require('express');
const route = express.Router();

route.post('/create')
route.get('/information')
route.put('/information')
route.delete('/delete')

module.exports = route;