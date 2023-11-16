const express = require('express');
const route = express.Router();
const { register, login, verifyAccount, deleteAccount } = require('../controllers/authController');
const { verifyToken } = require('../middlewares/authMiddleware');

route.post('/register', register);
route.use(verifyToken);
route.post('/login', login);
route.post('/verifyAccount', verifyAccount);
route.delete('/account', deleteAccount);

module.exports = route;