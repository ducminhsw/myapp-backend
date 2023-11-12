const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const { handleResponse } = require('../utils/utilsfunc');

const saltRounds = process.env.SALT_ROUNDS;

const register = async (req, res) => {
    try {
        const { username, password, email } = req.body;

        // check if user exists
        const userExists = await User.exists({ email, username });
        if (!userExists) {
            return res.status(409).send(handleResponse(409, "Email already in use."));
        }

        // check passport
        bcrypt.hash(password, saltRounds, function (err, result) {
            if (err) {
                console.log(err);
                return res.status(409).send("Something went wrong");
            }
            const { firstName, lastName, phoneNumber, dateOfBirth } = req.body;
            const user = User.create({
                username,
                hashPassword: result,
                email,
                firstName: firstName,
                lastName: lastName,
                phoneNumber: phoneNumber,
                dateOfBirth: dateOfBirth,
                friends: []
            });

            // create jwt token
            const token = jwt.sign(
                {
                    userId: userExists._id,
                    mail: userExists.email
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
}

const login = async (req, res) => {
    try {
        const { email, password } = reb.body;

        // check if user exists
        const userExists = User.findOne({ email });
        if (userExists && (await bcrypt.compare(password, userExists.hashPassword))) {
            // create jwt token
            const token = jwt.sign(
                {
                    userId: userExists._id,
                    mail: userExists.email
                },
                process.env.TOKEN_KEY,
                {
                    expiresIn: '24h'
                });
            return res.status(200).send(handleResponse(200, 'Login success', {
                userCredentials: {
                    username: userExists.username,
                    email,
                    firstName: userExists.firstName,
                    lastName: userExists.lastName,
                    friends: userExists.friends,
                    token: token
                }
            }));
        }

        // check if password is right
        return res.status(409).send(handleResponse(400, "Email or password is invalid."));
    } catch (error) {
        return res.status(500).send(handleResponse(500, "Something went wrong. Please login again!"));
    }
}