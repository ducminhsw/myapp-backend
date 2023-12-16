const express = require('express');
const route = express.Router();

const { getProfile, putProfile, postStory, deleteStory, getUserProfile } = require('../controllers/myselfController');
const { verifyToken } = require('../middlewares/authMiddleware');

// verify token
route.use(verifyToken);

// get user profile
route.route('/profile/me')
    .post(getUserProfile);

// my profile information
route.route('/profile')
    .get(getProfile)
    .put(putProfile);

// get another user profile


// story
route.route('/story')
    .post(postStory)
    .delete(deleteStory);

module.exports = route;