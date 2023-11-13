const express = require('express');
const route = express.Router();
const { register, login, verifyAccount } = require('../controllers/authController');

route.post('/register', register);
route.post('/login', login);
route.post('/verifyAccount', verifyAccount);
route.delete('/account');

module.exports = route;