const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { handleResponse, notFoundErrorResponse, invalidParameterErrorResponse } = require('../utils/utilsfunc');
const User = require('../models/user');

// Get user Profile
const getUserProfile = async (res, req) => {
    const { userId, username } = req.body;

    if (!username || typeof username !== 'string') {
        return invalidParameterErrorResponse(res);
    }

    if (!userId || typeof userId !== 'string') {
        return invalidParameterErrorResponse(res);
    }

    try {
        const user = await User.findOne({ _id: userId, username: username });
        if (!user) return notFoundErrorResponse(res);
        return res.status(200).send(handleResponse(200, "Information of choosen", user));
    } catch (error) {
        return res.status(500).send(handleResponse(500, "Something went wrong"));
    }
};

module.exports = { getUserProfile }