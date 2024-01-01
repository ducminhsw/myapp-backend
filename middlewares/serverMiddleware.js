const Server = require("../models/server");
const User = require("../models/user");
const { serverErrorResponse } = require("../utils/utilsfunc");

const verifiedTargetServer = async (req, res, next) => {
    const { userId, serverId } = req.body;

    if (!userId || typeof userId !== 'string') {
        return invalidParameterErrorResponse(res);
    }

    if (!serverId || typeof serverId !== 'string') {
        return invalidParameterErrorResponse(res);
    }

    const user = await User.findById(userId, (err, userDoc) => {
        if (err) {
            return;
        }
        return userDoc;
    });

    if (!user) {
        return invalidParameterErrorResponse(res, 404, 'Not found');
    }

    const server = await Server.findById(serverId, (err, serverDoc) => {
        if (err) {
            return;
        }
        return serverDoc;
    }).populate('channels.chatChannel.channel')
        .populate('channels.voiceChannel.channel')
        .exec();

    if (!server) {
        return invalidParameterErrorResponse(res, 404, 'Not found.');
    }

    try {
        req.serverMongo = server;
        req.userRequest = user;
        next();
    } catch (error) {
        return serverErrorResponse(res);
    }
}

module.exports = { verifiedTargetServer };