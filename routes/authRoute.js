const express = require('express');
const route = express.Router();
const { register, login, verifyAccount, deleteAccount, refreshToken } = require('../controllers/authController');
const { verifyToken } = require('../middlewares/authMiddleware');

route.post('/register', register);
route.post('/login', login);
route.post('/refreshToken', verifyToken('refreshToken'), refreshToken)
route.use(verifyToken());

route.post('/verifyAccount', verifyAccount);
route.delete('/account', deleteAccount);

module.exports = route;