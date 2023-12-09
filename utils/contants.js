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

const responseCode = {
    CREATE_SUCCESS: {
        statusCode: 201,
        body: {
            privateCode: "0001",
            message: "Create success"
        }
    },
    CREATE_FAILED: {
        statusCode: 400,
        body: {
            privateCode: "0002",
            message: "Create failed"
        }
    },
    PUT_SUCCESS: {
        statusCode: 200,
        body: {
            privateCode: "0001",
            message: "Edit success"
        }
    },
    PUT_FAILED: {
        statusCode: 400,
        body: {
            privateCode: "0002",
            message: "Edit failed"
        }
    },
    GET_SUCCESS: {
        statusCode: 200,
        body: {
            privateCode: "0001",
            message: "Get data success"
        }
    },
    GET_FAILED: {
        statusCode: 400,
        body: {
            privateCode: "0002",
            message: "Get data failed"
        }
    },
    DELETE_SUCCESS: {
        statusCode: 200,
        body: {
            privateCode: "0001",
            message: "Delete data success"
        }
    },
    DELETE_FAILED: {
        statusCode: 400,
        body: {
            privateCode: "0002",
            message: "Delete failed"
        }
    },
    SERVER_CONFLICT: {
        statusCode: 409,
        body: {
            privateCode: "0002",
            message: "Conflict server"
        }
    },
    SERVER_ERROR: {
        statusCode: 500,
        body: {
            privateCode: "0002",
            message: "Something went wrong"
        }
    }
}

module.exports = { responseCode, GET_USER_TYPE, FRIEND_STATUS, REQUEST_TYPE, ACCOUNT_TYPE, CHANNEL_TYPE, SERVER_TYPE };