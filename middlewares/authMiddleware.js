const jwt = require("jsonwebtoken");
const { handleResponse } = require("../utils/utilsfunc");

const config = process.env;

const verifyToken = (req, res, next) => {
    let token = req.body.token || req.query.token || req.header["authorization"];

    // check the token
    if (!token || typeof token !== 'string') {
        return res.status(403).send(handleResponse(403, "Invalid token"));
    }

    // get the credential out of the token
    try {
        token = token.replace(/^Bearer\s+/, "");
        const decodedToken = jwt.verify(token, config.TOKEN_KEY, function (err, decoded) {
            if (err) {
                console.log(err);
                return;
            }
            return decoded;
        });

        if (!decodedToken) {
            return res.status(401).send(401, "Not authenticated.");
        }

        req.tokenCredential = decodedToken;
        return next();
    } catch (error) {
        return res.status(403).send(handleResponse(403, "Something went wrong."));
    }
};

const configJwtSignObject = (user) => {
    const obj = {
        userId: user._id,
        email: user.email,
        verified: user.verified,
        firstName: user.firstName,
        lastName: user.lastName
    }
    return obj;
}

module.exports = { verifyToken, configJwtSignObject };