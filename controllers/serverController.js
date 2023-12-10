const Channel = require("../models/channel");
const Server = require("../models/server");
const User = require("../models/user");
const { CHANNEL_TYPE, SERVER_TYPE } = require("../utils/contants");
const { handleConvertResponse, serverErrorResponse, unauthorizeErrorResponse,
    invalidParameterErrorResponse, notFoundErrorResponse, serverConflictError } = require("../utils/utilsfunc");

const createServer = async (req, res) => {
    const { userId, email, verified, typeServer } = req.body;
    if (!userId || typeof userId !== 'string') {
        return invalidParameterErrorResponse(res);
    }

    if (!email || typeof email !== 'string') {
        return invalidParameterErrorResponse(res);
    }

    if (!verified || typeof verified !== 'boolean') {
        return handleConvertResponse(res, 401, 'User not verified, can not create a server.');
    }

    if (!typeServer || typeof typeServer !== 'number') {
        return invalidParameterErrorResponse(res);
    }

    const user = await User.findOne({ _id: userId, email: email });
    if (!user) {
        return notFoundErrorResponse(res);
    }

    try {
        const newChatChannel = await Channel.create({
            channel_name: 'general',
            headOfChannel: [{
                user: user._id
            }],
            member: [],
            channel_type: CHANNEL_TYPE.CHAT,
            messages: []
        });

        const newVoiceChannel = await Channel.create({
            channel_name: 'general',
            headOfChannel: [{
                user: user._id
            }],
            member: [],
            channel_type: CHANNEL_TYPE.CHAT,
            messages: []
        });

        const server = await Server.create({
            title: 'server',
            headOfServer: [{
                user: user._id
            }],
            type: typeServer,
            channels: {
                chatChannel: [newChatChannel._id],
                voiceChannel: [newVoiceChannel._id]
            },
            admin: [],
            participants: [],
            joinRequest: [],
            muted: [],
            banned: []
        });

        return handleConvertResponse(res, 201, "Create server successfully.",
            await server.populate('channels.chatChannel.channel')
                .populate('channels.voiceChannel.channel')
                .exec());
    } catch (error) {
        console.log(error);
        return serverErrorResponse(res);
    }
}

const getServerInformation = async (req, res) => {
    const { userRequest, serverMongo } = req;

    if (!userRequest || !serverMongo) {
        return unauthorizeErrorResponse(res);
    }

    try {
        return handleConvertResponse(res, 200, "Success", serverMongo);
    } catch (error) {
        console.log(err);
        return serverErrorResponse(res);
    }
}

const requestJoinServer = async (req, res) => {
    const { userRequest, serverMongo } = req;

    if (!userRequest || !serverMongo) {
        return unauthorizeErrorResponse(res);
    }

    try {
        if (serverMongo.type === SERVER_TYPE.PUBLIC) {
            serverMongo.participants.push({ user: userRequest._id, createAt: Date.now() });
            await serverMongo.save();
            userRequest.underServer.push({ user: serverMongo._id, createAt: Date.now() });
            await userRequest.save();
            return handleConvertResponse(res);
        }
        if (serverMongo.type === SERVER_TYPE.PRIVATE) {
            serverMongo.requestJoinServer.push({ user: userRequest._id, createAt: Date.now() });
            serverMongo.save();
            return handleConvertResponse(res, 200, 'Send request join server successed.');
        }
        return invalidParameterErrorResponse(res, 404, "Invalid server type.");
    } catch (error) {
        console.log(error);
        return serverErrorResponse(res);
    }
}

const acceptUserJoin = async (req, res) => {
    const { userRequest, serverMongo } = req;

    if (!userRequest || !serverMongo) {
        return unauthorizeErrorResponse(res);
    }

    const requestJoinUserId = req.params.targetUserId;
    const requestJoinUser = await User.findById(requestJoinUserId);
    if (!requestJoinUser) {
        return notFoundErrorResponse(res);
    }

    try {
        // if user is not head of server
        let headServerIndex = serverMongo.headOfServer.findIndex(item => item.user === userRequest._id);
        if (headServerIndex < 0) {
            return unauthorizeErrorResponse(res, 403, "You do not have permission to do this action.");
        }

        // if user is head of server
        const joinIndex = serverMongo.joinRequest.findIndex(item => item.user === requestJoinUser._id);
        if (joinIndex < 0) {
            return notFoundErrorResponse(res);
        }
        serverMongo.joinRequest.splice(joinIndex, 1);
        serverMongo.participants.push(requestJoinUser._id);
        await serverMongo.save();
        requestJoinUser.underServer.push(serverMongo._id);
        await requestJoinUser.save();
        return handleConvertResponse(res);
    } catch (error) {
        console.log('error', error);
        return serverErrorResponse(res);
    }
}

const requestLeaveServer = async (req, res) => {
    const { userRequest, serverMongo } = req;

    if (!userRequest || !serverMongo) {
        return unauthorizeErrorResponse(res);
    }

    try {
        // if user is headOfServer
        let index = serverMongo.headOfServer.findIndex(item => item.user === userRequest._id);
        if (index >= 0) {
            return handleConvertResponse(res, 403, "You are the one of the server headers. If you really want to leave, resign your position first.");
        }

        // if user is a participants
        index = serverMongo.participants.findIndex(item => item.user === userRequest._id);
        if (index < 0) {
            return unauthorizeErrorResponse(res, 401, "User is not in the server");
        }

        // cut the participants down
        serverMongo.participants.splice(index, 1);
        await serverMongo.save();
        return handleConvertResponse(res);
    } catch (error) {
        console.log(error);
        return serverErrorResponse(res);
    }
}

const resignServerPosition = async (req, res) => {
    const { userRequest, serverMongo } = req;

    if (!userRequest || !serverMongo) {
        return unauthorizeErrorResponse(res);
    }

    try {
        // if user is headOfServer
        let index = serverMongo.headOfServer.findIndex(item => item.user === userRequest._id);
        if (index < 0) {
            return handleConvertResponse(res, 403, "You are not one of the server headers. Youn can not resgin.");
        }

        serverMongo.headOfServer.splice(index, 1);
        serverMongo.participants.push({ user: userRequest._id });
        await serverMongo.save();
        return handleConvertResponse(res);
    } catch (error) {
        console.log(error);
        return serverErrorResponse(res);
    }
}

const deleteUserInServer = async (req, res) => {
    const { userRequest, serverMongo } = req;

    if (!userRequest || !serverMongo) {
        return unauthorizeErrorResponse(res);
    }

    const deleteUserId = req.params.user_id;
    const deleteUser = await User.findById(deleteUserId);
    if (!deleteUser) {
        return notFoundErrorResponse(res);
    }

    let target;

    try {
        // request user is a head of server
        const indexHead = serverMongo.headOfServer.findIndex(item => item.user === userRequest._id);
        if (indexHead >= 0) {
            // target user is a head of server
            target = serverMongo.headOfServer.findIndex(item => item.user === deleteUser._id);
            if (target >= 0) {
                return serverConflictError(res, 409, "You can not delete a head of server");
            }

            // target user is a normal guy
            target = serverMongo.participants.findIndex(item => item.user === deleteUser._id);
            if (target >= 0) {
                serverMongo.participants.splice(target, 1);
                await serverMongo.save();
                return handleConvertResponse(res);
            }

            return serverConflictError(res, 409, "Can not find the target user");
        }

        // request user is a normal guy
        return unauthorizeErrorResponse(res, 403, "You can not do this without permission.");
    } catch (error) {
        return serverErrorResponse(res);
    }
}

// pending
const editServerInformation = async (req, res) => { }

module.exports = {
    createServer, getServerInformation, requestJoinServer,
    editServerInformation, requestLeaveServer, resignServerPosition,
    deleteUserInServer, acceptUserJoin, getUserServerInfomation
};