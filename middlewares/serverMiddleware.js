const Channel = require("../models/channel");
const Server = require("../models/server");
const User = require("../models/user");
const { handleConvertResponse } = require("../utils/utilsfunc");

const verifyUserWithServer = async (req, res, next) => {
    try {
        const { userId, serverId } = req.body;

        if (!userId || typeof userId !== 'string') return handleConvertResponse(res, 400, "Error: Invalid user");
        if (!serverId || typeof serverId !== 'string') return handleConvertResponse(res, 400, "Error: Invalid server");

        const user = await User.findById(userId, (err, doc) => {
            if (err) return undefined;
            return doc;
        });
        if (!user) return handleConvertResponse(res, 400, "Error: Invalid user");

        const server = await Server.findById(serverId, (err, doc) => {
            if (err) return undefined;
            return doc;
        });
        if (!server) return handleConvertResponse(res, 400, "Error: Invalid server");

        await server.populate('channels.chatChannel.channel').populate('channels.voiceChannel.channel').exec();

        req.verifiedServer = server;
        req.verifiedUser = user;

        next();
    } catch (error) {
        return handleConvertResponse(res, 500, "Error: Something went wrong");
    }
}

const verifyUserMiddleware = async (req, res, next) => {
    try {
        const { userId } = req.body;
        if (!userId || typeof userId !== "string") return handleConvertResponse(res, 400, "Error: Invalid user information");
        const user = await User.findById(userId, (err, doc) => {
            if (err) return undefined;
            return doc;
        });
        if (!user) return handleConvertResponse(res, 400, "Error: Invalid server");
        req.verifiedUser = user;
        next();
    } catch (error) {
        console.log(error);
        return handleConvertResponse(res, 500, "Error: Something went wrong");
    }
}

const verifyServerMiddleware = async (req, res, next) => {
    try {
        const { serverId } = req.body;
        if (!serverId || typeof serverId !== "string") return handleConvertResponse(res, 400, "Error: Invalid server information");
        const server = await Server.findById(serverId, (err, doc) => {
            if (err) return undefined;
            return doc;
        });
        if (!server) return handleConvertResponse(res, 400, "Error: Invalid server");
        req.verifiedServer = server;
        next();
    } catch (error) {
        console.log(error);
        return handleConvertResponse(res, 500, "Error: Something went wrong");
    }
}

const verifyServerOwnerMiddleware = async (req, res, next) => {
    try {
        const { verifiedUser, verifiedServer } = req;
        const headerIndex = verifiedServer.headOfServer.filter(item => item.user === verifiedUser._id);
        if (headerIndex < 0) return handleConvertResponse(res, 403, "Error: You are not one of the head of the server");
        next();
    } catch (error) {
        console.log(error);
        return handleConvertResponse(res, 500, "Error: Something went wrong");
    }
}

module.exports = { verifyUserWithServer, verifyUserMiddleware, verifyServerMiddleware, verifyServerOwnerMiddleware };