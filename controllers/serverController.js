const Channel = require("../models/channel");
const Server = require("../models/server");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { CHANNEL_TYPE, SERVER_TYPE, INVITATION_TYPE } = require("../utils/contants");
const { handleConvertResponse, serverErrorResponse, unauthorizeErrorResponse,
    invalidParameterErrorResponse, notFoundErrorResponse, serverConflictError } = require("../utils/utilsfunc");

// done/not tested
const createServer = async (req, res) => {
    try {
        const { email, serverTitle } = req.body;

        if (!email || typeof email !== "string") return handleConvertResponse(res, 400, "Error: Invalid user's email");
        if (!serverTitle || typeof serverTitle !== "string") return handleConvertResponse(res, 400, "Error: Invalid server's name");

        const user = await User.findOne({ email });
        if (!user) return handleConvertResponse(res, 404, "Error: Invalid user");

        const defaultChatChannel = await Channel.create({
            channelTitle: "general",
            member: [],
            channelType: CHANNEL_TYPE.CHAT,
            messages: []
        });

        const defaultVoiceChannel = await Channel.create({
            channelTitle: "General",
            member: [],
            channelType: CHANNEL_TYPE.VOICE,
            messages: []
        });

        const server = await Server.create({
            title: serverTitle,
            headOfServer: user._id,
            channels: {
                chatChannel: [defaultChatChannel._id],
                voiceChannel: [defaultVoiceChannel._id]
            },
            participants: [],
            joinRequest: [],
            muted: [],
            banned: [],
        });

        return handleConvertResponse(res, 201, "Success: Create new server successfully", server);
    } catch (error) {
        console.log(error);
        return handleConvertResponse(res, 500, "Error: Something went wrong", error);
    }
}

// done/not tested
const createInvitation = (req, res) => {
    try {
        const { verifiedUser, verifiedServer } = req;
        const userIndex = verifiedServer.participants.filter(item => item.user === verifiedUser);
        if (userIndex >= 0) {
            const invitation = jwt.sign(`${INVITATION_TYPE.HEAD}/invitation/${verifiedServer._id}`, process.env.INVITATION_SECRET);
            return handleConvertResponse(res, 201, "Success: Return invitation code success", invitation);
        }

        const headIndex = verifiedServer.headOfServer.filter(item => item.user === verifiedUser);
        if (headIndex >= 0) {
            const invitation = jwt.sign(`${INVITATION_TYPE.PARTICIPANT}/invitation/${verifiedServer._id}`, process.env.INVITATION_SECRET);
            return handleConvertResponse(res, 201, "Success: Return invitation code success", invitation);
        }
        return handleConvertResponse(res, 403, "Error: You can not make this action");
    } catch (error) {
        console.log(error);
        return handleConvertResponse(res, 500, "Error: Something went wrong", error);
    }
}

// done/not tested
const enterServerWithInvitation = (req, res) => {
    try {
        const { invitationCode, userId } = req.body;
        jwt.verify(invitationCode, process.env.INVITATION_SECRET, async (err, invitation) => {
            if (err) return handleConvertResponse(res, 500, "Error: Something went wrong", err);
            const [type, _, targetServerId] = invitation.split("/");
            if (type === INVITATION_TYPE.HEAD) {
                const targetServer = await Server.findById(targetServerId, (err, doc) => {
                    if (err) return undefined;
                    return doc;
                });
                if (!targetServer) return handleConvertResponse(res, 404, "Error: Server not found", err);
                targetServer.participants.push({ user: userId, createAt: Date.now() });
                await targetServer.save();
                return handleConvertResponse(res, 201, "Success: Enter server success");
            }

            if (type === INVITATION_TYPE.PARTICIPANT) {
                const targetServer = await Server.findById(targetServerId, (err, doc) => {
                    if (err) return undefined;
                    return doc;
                });
                if (!targetServer) return handleConvertResponse(res, 404, "Error: Server not found", err);
                targetServer.joinRequest.push({ user: userId, createAt: Date.now() });
                await targetServer.save();
                return handleConvertResponse(res, 201, "Success: Waiting for approval");
            }

            return handleConvertResponse(res, 403, "Error: You can not make this action");
        })
    } catch (error) {
        console.log(error);
        return handleConvertResponse(res, 500, "Error: Something went wrong", error);
    }
}

// working
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

    const { requestJoinUserId } = req.body;
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

    const { targetUserId } = req.body;
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
        return notFoundErrorResponse(res);
    }

    let target;

    try {
        // request user is a head of server
        const indexHead = serverMongo.headOfServer.findIndex(item => item.user === userRequest._id);
        if (indexHead >= 0) {
            // target user is a head of server
            target = serverMongo.headOfServer.findIndex(item => item.user === targetUser._id);
            if (target >= 0) {
                return serverConflictError(res, 409, "You can not delete a head of server");
            }

            // target user is a normal guy
            target = serverMongo.participants.findIndex(item => item.user === targetUser._id);
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
    deleteUserInServer, acceptUserJoin, createInvitation,
    enterServerWithInvitation
};