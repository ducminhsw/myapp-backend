const GET_USER_TYPE = {
    BANNED: 0,
    AVAILABLE: 1,
    ALL: 2
}

const FRIEND_STATUS = {
    NOTHING: 0,
    SEND_REQUEST: 1,
    RECEIVE_REQUEST: 2,
    FRIENDED: 3,
}

const REQUEST_TYPE = {
    UNFRIEND: 0,
    BLOCK: 1,
    UNBLOCK: 2,
    FRIEND_REQUEST: 3
}

const ACCOUNT_TYPE = {
    PUBLIC: 0,
    PRIVATE: 1
}

const CHANNEL_TYPE = {
    CHAT: 1,
    VOICE: 2
}

const SERVER_TYPE = {
    PUBLIC: 1,
    PRIVATE: 2
}

const CODE_WITH_MESSAGE = {
    "continue": [100, "Continue"],
    "switch_protocol": [101, "Switching Protocols"],
    "processing": [102, "Processing"],
    "early_hints": [103, "Early Hints"],
    "OK": [200, "OK"],
    "created": [201, "Created"],
    "accpented": [202, "Accepted"],
    "no_authoriative": [203, "Non-Authoriative Information"],
    "no_content": [204, "No Content"],
    "reset_content": [205, "Reset Content"],
    "continue": [100, "Continue"],
    "continue": [100, "Continue"],
    "continue": [100, "Continue"],
    "continue": [100, "Continue"],
    "continue": [100, "Continue"],
    "continue": [100, "Continue"],
    "continue": [100, "Continue"],
    "continue": [100, "Continue"],
    "continue": [100, "Continue"],
    "continue": [100, "Continue"],
    "continue": [100, "Continue"],
    "continue": [100, "Continue"],
    "continue": [100, "Continue"],
}

const INVITATION_TYPE = {
    HEAD: "headOfServer",
    PARTICIPANT: "userInServer"
}

module.exports = { INVITATION_TYPE, GET_USER_TYPE, FRIEND_STATUS, REQUEST_TYPE, ACCOUNT_TYPE, CHANNEL_TYPE, SERVER_TYPE, CODE_WITH_MESSAGE };