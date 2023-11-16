const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { handleResponse } = require('../utils/utilsfunc');
const User = require('../models/user');

// Get user Profile
const getUserProfile = async (res, req) => {
    const { email, username, token } = req.body;

    if (!token || !username || !email) {
        return res.status(401).send(handleResponse(401, "User not authenticated"));
    }

    try {
        const user = await User.findOne({ username: username, email: email });
        if (!user.verified) {
            // need more information
            const userLimitInformation = {
                username: user.username,
                avatar: user.avatar,
                firstName: user.firstName,
                lastName: user.lastName
            }
            return res.status(200).send(handleResponse(200, "Information of choosen (limited)", userLimitInformation));
        }
        return res.status(200).send(handleResponse(200, "Information of choosen", user));
    } catch (error) {
        return res.status(500).send(handleResponse(500, "Something went wrong"));
    }
};

module.exports = { getUserProfile }