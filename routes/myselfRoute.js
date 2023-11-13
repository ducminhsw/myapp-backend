const express = require('express');
const route = express.Router();

const { getProfile, postProfile, putProfile, getSecreteProfile, postSecretProfile, putSecretProfile, getStory, postStory, deleteStory } = require('../controllers/myselfController');

// PUT my profile information
route.route('/profile').get(getProfile)
    .post(postProfile)
    .put(putProfile);

// secret profile
route.route('/scprofile').get(getSecreteProfile)
    .post(postSecretProfile)
    .put(putSecretProfile);

// story
route.route('/story').get(getStory)
    .post(postStory)
    .delete(deleteStory);

module.exports = route;