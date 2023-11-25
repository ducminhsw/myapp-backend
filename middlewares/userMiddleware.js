const bcrypt = require('bcrypt');
const User = require("../models/user");
const { invalidParameterErrorResponse, notFoundErrorResponse, serverErrorResponse } = require("../utils/utilsfunc");

const isValidUser = async (req, res, next) => {
    const { userId, password } = req.body;
    if (!userId || typeof userId !== 'string') {
        return invalidParameterErrorResponse(res);
    }

    const { decodedToken } = req;
    if (userId !== decodedToken.userId) {
        return invalidParameterErrorResponse(res);
    }

    const user = await User.findById(userId);
    if (!user) {
        return notFoundErrorResponse(res);
    }

    bcrypt.compare(password, user.hashPassword, function (err, result) {
        if (err) {
            console.log(err);
            return serverErrorResponse(res);
        }
        if (result === true) {
            try {
                req.userMongo = user;
                next();
            } catch (error) {
                return serverErrorResponse(res);
            }
        } else {
            return invalidParameterErrorResponse(res);
        }
    });
}

module.exports = { isValidUser };