const Channel = require("../models/channel");
const Server = require("../models/server");
const User = require("../models/user");
const { CHANNEL_TYPE } = require("../utils/contants");
const { handleConvertResponse, serverErrorResponse, unauthorizeErrorResponse, invalidParameterErrorResponse, notFoundErrorResponse } = require("../utils/utilsfunc");

const createServer = async (req, res) => {
    const { tokenCredential } = req;

    if (!tokenCredential || typeof tokenCredential !== 'object') {
        return handleConvertResponse(res, 401, 'User not authenticated.');
    }

    const { userId, email, verified } = tokenCredential;
    if (!userId) {
        return handleConvertResponse(res, 401, 'Invalid user id.');
    }

    if (!email) {
        return handleConvertResponse(res, 401, 'Invalid email.');
    }

    if (!verified) {
        return handleConvertResponse(res, 401, 'User not verified, can not create a server.');
    }

    const user = await User.findOne({ _id: userId, email: email });
    if (!user) {
        return handleConvertResponse(res, 401, 'User is invalid.');
    }

    try {
        const newChannels = await Channel.create({
            channel_name: 'general',
            creator: [user._id],
            member: [user._id],
            channel_type: CHANNEL_TYPE.CHAT,
            messages: []
        });

        const server = await Server.create({
            title: 'server',
            creator: user._id,
            channels: [newChannels._id],
            admin: [user._id],
            participants: [user._id],
            muted: [],
            banned: []
        });

        return handleConvertResponse(res, 201, "Create server successfully.", server);
    } catch (error) {
        console.log(error);
        return serverErrorResponse(res);
    }
}

const deleteServer = async (req, res) => {
    const { tokenCredential } = req;
    if (!tokenCredential || typeof tokenCredential !== 'object') {
        return unauthorizeErrorResponse(res);
    }

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

    const server = await server.findById(serverId, (err, doc) => {
        if (err) {
            return invalidParameterErrorResponse(res, 404);
        }
        return doc;
    });
    if (!server) {
        return invalidParameterErrorResponse(res, 404, 'Not found.');
    }

    if (server.creator !== creator._id) {
        return unauthorizeErrorResponse(res, 405, 'Method not allowed.');
    }

    Server.findByIdAndDelete(serverId, (err, doc) => {
        if (err) {
            console.log(err);
            return serverErrorResponse(res);
        }
        return handleConvertResponse(res, 200, 'Delete success.', doc);
    });
}

const getServerInformation = async (req, res) => {
    const { userId, serverId } = req.body;
    if (!userId || typeof userId !== 'string') {
        return invalidParameterErrorResponse(res);
    }

    if (!serverId || typeof serverId !== 'string') {
        return invalidParameterErrorResponse(res);
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return notFoundErrorResponse(res);
        }

        const server = await Server.findById(serverId);
        if (!server) {
            return notFoundErrorResponse(res);
        }

        return handleConvertResponse(res, 200, 'Success', server);
    } catch (error) {
        console.log(err);
        return serverErrorResponse(res);
    }
}

const editServerInformation = (req, res) => {
    const { userId, serverId } = req.body;
}

module.exports = { createServer, deleteServer, getServerInformation, editServerInformation };