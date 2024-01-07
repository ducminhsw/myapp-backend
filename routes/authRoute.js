const express = require('express');
const route = express.Router();
const { register, login, logout, verifyCodeFromEmail } = require('../controllers/authController');
const { sendMailToConfirmRegister } = require('../middlewares/authMiddleware');

route.post('/register', sendMailToConfirmRegister, register);
route.post('/verifyEmail', verifyCodeFromEmail);
route.post('/login', login);
route.post('/logout', logout);

module.exports = route;