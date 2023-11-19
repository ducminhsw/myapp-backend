const Server = require("../models/server");
const User = require("../models/user");

const verifiedServerInfo = async (req, res, next) => {
    const { userId, serverId } = req.body;
    if (!userId || typeof userId !== 'string') {
        return invalidParameterErrorResponse(res);
    }
    if (!serverId || typeof serverId !== 'string') {
        return invalidParameterErrorResponse(res);
    }

    const creator = await User.findById(userId, (err, doc) => {
        if (err) {
            return invalidParameterErrorResponse(res, 404);
        }
        return doc;
    });
    if (!creator) {
        return invalidParameterErrorResponse(res, 404, 'Not found');
    }

    const server = await Server.findById(serverId, (err, doc) => {
        if (err) {
            return invalidParameterErrorResponse(res, 404);
        }
        return doc;
    });
    if (!server) {
        return invalidParameterErrorResponse(res, 404, 'Not found.');
    }

    next();
}

module.exports = { verifiedServerInfo };