const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const { handleResponse } = require('../utils/utilsfunc');

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
                email: email,
                firstName: firstName,
                lastName: lastName,
                dateOfBirth: dateOfBirth,
                friends: []
            });

            // create jwt token
            const token = jwt.sign(
                {
                    userId: user._id,
                    mail: user.email
                },
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
                {
                    userId: userExists._id,
                    mail: userExists.email
                },
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

const verifyAccount = (req, res) => { };

const changePassword = (req, res) => { };

const requestPassword = (req, res) => { };

module.exports = { login, register, verifyAccount, changePassword, requestPassword }