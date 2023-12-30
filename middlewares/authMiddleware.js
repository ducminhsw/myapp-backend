const jwt = require("jsonwebtoken");
const { handleResponse, serverErrorResponse } = require("../utils/utilsfunc");

const blackList = [];

const verifyToken = (isRefreshToken) => {

    return (req, res, next) => {

        let token = isRefreshToken ? req.cookies.refresh_token : req.cookies.access_token;

        // check the token
        if (!token || typeof token !== 'string') {
            return res.status(403).send(handleResponse(403, "Unauthorize"));
        }


        // get the credential out of the token
        try {
            token = token.replace(/^Bearer\s+/, "");
            jwt.verify(token, isRefreshToken ? process.env.REFRESH_TOKEN_SECRET : process.env.TOKEN_KEY, function (err, decodedToken) {
                if (err) {
                    if (err.message === "jwt expired") {

                        if (isRefreshToken) return res.status(403).send(handleResponse(403, "Unauthorize"));

                        return res.status(401).send(handleResponse(401, "Not Authenticated"));
                    }

                    if (err.message === "invalid token") {
                        return res.status(401).send(handleResponse(401, "Invalid Token"));
                    }
                }

                if (blackList.includes(token)) {
                    return res.status(403).send(handleResponse(403, "Unauthorize"));
                }

                req.decodedToken = decodedToken;
                next();
            })
        } catch (error) {
            return res.status(403).send(handleResponse(403, "Something went wrong."));
        }

    }

};

const configJwtSignObject = (user) => {
    const obj = {
        userId: user._id,
        role: user.role
    }
    return obj;
}

module.exports = { verifyToken, configJwtSignObject };