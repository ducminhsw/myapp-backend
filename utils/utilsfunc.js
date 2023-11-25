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

const handleResponse = (responseCode, message, data = null) => {
    return {
        code: responseCode,
        message: message,
        data
    }
}

const handleConvertResponse = (res, responseCode = 200, message = "Success", data = null) => {
    return res.status(responseCode).send({
        code: responseCode,
        message: message,
        data
    });
}

const serverConflictError = (res, code = 409, message = "Conflict server") => {
    return res.status(code).send({
        code: code,
        message: message,
        data: null
    });
}

const serverErrorResponse = (res, code = 500, message = "Something went wrong") => {
    return res.status(code).send({
        code: code,
        message: message,
        data: null
    });
}

const unauthorizeErrorResponse = (res, code = 401, message = "Unauthorized") => {
    return res.status(code).send({
        code: code,
        message: message,
        data: null
    });
}

const invalidParameterErrorResponse = (res, code = 400, message = "Invalid parameter") => {
    return res.status(code).send({
        code: code,
        message: message,
        data: null
    });
}

const notFoundErrorResponse = (res, code = 404, message = "Not found") => {
    return res.status(code).send({
        code: code,
        message: message,
        data: null
    });
}

module.exports = { responseCode, handleResponse, handleConvertResponse, serverErrorResponse, unauthorizeErrorResponse, invalidParameterErrorResponse, notFoundErrorResponse, serverConflictError };