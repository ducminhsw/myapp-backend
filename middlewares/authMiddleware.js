const jwt = require('jsonwebtoken');
const { handleResponse } = require('../utils/utilsfunc');

const config = process.env;

const verifyToken = (req, res, next) => {
    let token = req.body.token || req.query.token || req.header['authorization'];

    if (!token) {
        return res.status(403).send(handleResponse(403, "Invalid token"));
    }
    try {
        token = token.replace(/^Bearer\s+/, "");
        const decoded = jwt.verify(token, config.TOKEN_KEY);
        req.username = decoded.username;
    } catch (error) {
        return res.status(403).send(handleResponse(403, ""));
    }

    return next();
}

module.exports = verifyToken;