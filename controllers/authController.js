const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const { handleResponse, invalidParameterErrorResponse, handleConvertResponse, serverErrorResponse, serverConflictError, generateRandom6Number } = require('../utils/utilsfunc');
const { getRotationRefreshToken } = require('../middlewares/authMiddleware');

const register = async (req, res) => {
    try {
        const { username, password, email, displayName, dateOfBirth } = req.body;
        // check if user exists
        const userExists = await User.exists({ email: email });
        if (userExists) {
            return serverConflictError(res);
        }

        // check passport
        bcrypt.hash(password, Number(process.env.SALT_ROUNDS), async (err, hashPassword) => {
            if (err) {
                console.log(err);
                return serverConflictError(res);
            }
            const userObj = {
                role: 'user',
                email,
                username,
                displayName,
                dateOfBirth,
                hashPassword,
                codeVerify: req.confirmCode
            }
            const user = await User.create(userObj);

            await user.save();

            delete userObj.hashPassword;
            delete userObj.codeVerify;

            return handleConvertResponse(res, 200, "Create user success", {
                userBasicInfo: userObj,
            });
        });
    } catch (error) {
        return serverErrorResponse(res);
    }
};

const verifyCodeFromEmail = async (req, res) => {
    try {
        const { confirmCode, email } = req.body;

        if (!confirmCode || typeof confirmCode !== "string" || confirmCode.length !== 6) {
            return invalidParameterErrorResponse(res);
        }

        if (!email || typeof email !== "string") {
            return invalidParameterErrorResponse(res);
        }

        const user = await User.findOne({ email: email });

        if (!user) {
            return serverConflictError(res);
        }

        if (user.verified) {
            return serverConflictError(res);
        }

        if (user.codeVerify !== confirmCode) {
            return serverConflictError(res);
        }

        user.verified = true;
        await user.save();

        return handleConvertResponse(res);
    } catch (error) {
        return serverErrorResponse(res);
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // check if user exists
        const userExists = await User.findOne({ email: email });
        if (!userExists) return serverConflictError(res);
        // check if password is match
        const match = await bcrypt.compare(password, userExists.hashPassword);
        if (!match) return serverConflictError(res);

        // check if user is verified
        if (!userExists.verified) return serverConflictError(res);

        getRotationRefreshToken(res, userExists);

        return res.status(200).send(handleResponse(200, 'Login success.',
            {
                userBasicInfo: {
                    role: userExists.role,
                    userId: userExists._id,
                    email: userExists.email,
                    username: userExists.username,
                    firstName: userExists.firstName,
                    lastName: userExists.lastName,
                    avatar: userExists.avatar,
                    friends: userExists.friends,
                    phoneNumber: userExists.phoneNumber,
                    underServer: userExists.underServer,
                    headOfSever: userExists.headOfSever,
                    dateOfBirth: userExists.dateOfBirth,
                    storyNow: userExists.storyNow,
                    stories: userExists.stories,
                }
            }));
    } catch (error) {
        return serverErrorResponse(res);
    }
};

// refresh token rotation
const handleGetRefreshToken = async (req, res) => {
    try {
        const refresh_token = req.cookies["refresh_token"];
        const { email } = req.body;

        if (!email || typeof email !== "string") return handleConvertResponse(res, 400, "Error: Invalid parameters");
        if (!refresh_token || typeof refresh_token !== "string") return handleConvertResponse(res, 400, "Error: Invalid parameters");

        const user = await User.findOne({ email: email, jwtRefeshToken: refresh_token });
        if (!user) return handleConvertResponse(res, 404, "Unknown target user");

        jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET_MINHND52, (err, decoded) => { });

        const { err, accessToken, refreshToken } = getRotationRefreshToken(res, user);
        if (err) return handleConvertResponse(res, 500, "Something went wrong");
        console.log(refreshToken);

        return handleConvertResponse(res, 200, "Create new refresh token success", { token: accessToken });
    } catch (error) {
        return handleConvertResponse(res, 500, "Something went wrong");
    }
}

module.exports = { login, register, handleGetRefreshToken, verifyCodeFromEmail }