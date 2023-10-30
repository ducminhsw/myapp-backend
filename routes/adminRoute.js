const express = require('express');
const route = express.Router();

// GET all users
route.get('/users/2')

// GET all banned users
route.get('/users/0')

// GET all available users
route.get('/users/1')

// POST ban user
route.post('/users/ban')

// POST unban user
route.post('/users/unban')

// DELETE delete user account
route.delete('/users/delete')

// GET user activity
route.get('/users/:id/activity')

module.exports = route;