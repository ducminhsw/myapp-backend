const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const { handleConvertResponse, generateRandom6Number } = require('../utils/utilsfunc');
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
        // clear the cookie
        req.clearCookie("refresh_token");

        // check if user exists
        const user = await User.findOne({ email: email });
        if (!user) return handleConvertResponse(res, 400, "There are no user match this authentication information");
        const match = await bcrypt.compare(password, user.hashPassword);
        if (!match) return handleConvertResponse(res, 401, "There are no user match this authentication information");
        if (!user.verified) return handleConvertResponse(res, 401, "Can not log in. Verify your account first.");

        // create tokens
        const { err, accessToken, refreshToken } = getRotationRefreshToken(res, user);
        if (err) return handleConvertResponse(res, 401, "There are some problems with authentication");

        user.jwtRefeshToken = refreshToken;
        // user.jwtRefeshTokenList.push(refreshToken);
        await user.save();

        return handleConvertResponse(res, 200, "Login success",
            {
                userBasicInfo: {
                    role: user.role,
                    userId: user._id,
                    email: user.email,
                    username: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    avatar: user.avatar,
                    friends: user.friends,
                    phoneNumber: user.phoneNumber,
                    underServer: user.underServer,
                    headOfSever: user.headOfSever,
                    dateOfBirth: user.dateOfBirth,
                    storyNow: user.storyNow,
                    stories: user.stories,
                },
                accessToken: accessToken
            });
    } catch (error) {
        console.log(error);
        return handleConvertResponse(res, 500, "Something went wrong", error);
    }
};

const logout = async (req, res) => {
    try {
        const { email } = req.body;
        const refreshToken = req.cookies["refresh_token"];
        const user = await User.findOne({ email, jwtRefeshToken: refreshToken });
        if (!user) {
            return handleConvertResponse(res, 404, "Unknown target user");
        }
        res.clearCookie("refresh_token");
        user.jwtRefeshToken = "";
        // user.jwtRefeshTokenList = [];
        await user.save();
        return handleConvertResponse(res, 204, "Logout success");
    } catch (error) {
        console.log(error);
        return handleConvertResponse(res, 500, "Something went wrong")
    }
}

module.exports = { login, logout, register, verifyCodeFromEmail }