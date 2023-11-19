const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const { handleResponse } = require('../utils/utilsfunc');
const { configJwtSignObject } = require('../middlewares/authMiddleware');

const saltRounds = process.env.SALT_ROUNDS;

const register = async (req, res) => {
    try {
        const { username, password, email } = req.body;
        // check if user exists
        const userExists = await User.exists({ email: email, username: username });
        if (userExists) {
            return res.status(409).send(handleResponse(409, "Email already in use."));
        }

        // check passport
        return bcrypt.hash(password, Number(saltRounds), async (err, hashPassword) => {
            if (err) {
                console.log(err);
                return res.status(409).send(handleResponse(409, "Something went wrong"));
            }
            const { firstName, lastName, dateOfBirth } = req.body;
            const user = await User.create({
                role: 'user',
                username: username,
                hashPassword: hashPassword,
                verified: false,
                email: email,
                firstName: firstName,
                lastName: lastName,
                dateOfBirth: dateOfBirth,
                friends: []
            });

            await user.save();

            // create jwt token
            const token = jwt.sign(
                configJwtSignObject(user),
                process.env.TOKEN_KEY,
                {
                    expiresIn: '24h'
                });
            return res.status(201).send(handleResponse(201, "Create user success", {
                userCredentials: user,
                token
            }));
        });
    } catch (error) {
        return res.status(500).send(handleResponse(500, "Something went wrong. Please register again!"));
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // check if user exists
        const userExists = await User.findOne({ email: email });
        if (!userExists) return res.status(409).send(handleResponse(409, "User not found."));

        // check if password is match
        const match = await bcrypt.compare(password, userExists.hashPassword);
        if (!match) return res.status(409).send(handleResponse(409, "Authentication failed."));

        // create login token
        try {
            const token = jwt.sign(
                configJwtSignObject(userExists),
                process.env.TOKEN_KEY,
                {
                    expiresIn: '24h'
                });
            return res.status(200).send(handleResponse(200, 'Login success.',
                {
                    userCredentials: {
                        username: userExists.username,
                        email: userExists.email,
                        firstName: userExists.firstName,
                        lastName: userExists.lastName,
                        friends: userExists.friends,
                        token: token
                    }
                }));
        } catch (error) {
            return res.status(500).send(handleResponse(500, 'Something went wrong.'))
        }
    } catch (error) {
        return res.status(500).send(handleResponse(500, "Something went wrong. Please login again!"));
    }
};

// verify account after register
const verifyAccount = async (req, res) => {
    const { email, username, token } = req.body;

    if (!token) {
        return res.status(401).send(handleResponse(401, "User not signed in yet."));
    }

    if (typeof email !== 'string' || typeof username !== 'string') {
        return res.status(401).send(handleResponse(401, "Invalid authentication input."));
    }

    const user = await User.findOne({ email: email, username: username });

    if (!user) {
        return res.status(401).send(handleResponse(401, "User does not exists."));
    }

    try {
        await user.save();
        return res.status(201).send(handleResponse(201, "User verified successfully.", user));
    } catch (error) {
        console.log(error);
        return res.status(500).send(handleResponse(500, "Something went wrong."));
    }
};

const deleteAccount = async (req, res) => {
    const { tokenCredential } = req;
    if (!tokenCredential) {
        return res.status(401).send(handleResponse(401, "User is not authenticated."));
    }

    const { username, email } = req.body;
    if (!username || !email) {
        return res.status(400).send(handleResponse(400, "Invalid user information"));
    }

    const user = await User.findOne({ email: email, username: username });
    if (!user) {
        return res.status(400).send(handleResponse(400, "User is invalid"));
    }

    try {
        const deletedUser = await User.deleteOne(user);
        return res.status(200).send(handleResponse(200, "Delete user success.", deletedUser));
    } catch (error) {
        return res.status(500).send(handleResponse(500, "Something went wrong."));
    }
}

// change password
const changePassword = (req, res) => { };

// request password after forgot password
const requestPassword = (req, res) => { };

module.exports = { login, register, verifyAccount, deleteAccount, changePassword, requestPassword }