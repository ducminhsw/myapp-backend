const express = require('express');
const route = express.Router();

const { getUserProfile } = require('../controllers/userController');

// GET user (even myself) profile
route.get('/profile', getUserProfile);

module.exports = route;