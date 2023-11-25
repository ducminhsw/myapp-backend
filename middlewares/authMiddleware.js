const jwt = require("jsonwebtoken");
const { handleResponse, serverErrorResponse } = require("../utils/utilsfunc");

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
        jwt.verify(token, config.TOKEN_KEY, function (err, decodedToken) {
            if (err) {
                console.log(err);
                return;
            }
            console.log('decodedToken', decodedToken);

            if (!decodedToken) {
                return res.status(401).send(401, "Not authenticated.");
            }

            try {
                req.decodedToken = decodedToken;
                next();
            } catch (error) {
                return serverErrorResponse(res);
            }
        });
    } catch (error) {
        return res.status(403).send(handleResponse(403, "Something went wrong."));
    }
};

const configJwtSignObject = (user) => {
    const obj = {
        userId: user._id,
        email: user.email,
        phoneNumber: user.phoneNumber,
        verified: user.verified,
        firstName: user.firstName,
        lastName: user.lastName
    }
    return obj;
}

module.exports = { verifyToken, configJwtSignObject };