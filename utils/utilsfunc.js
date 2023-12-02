const isEmpty = (obj) => {
    return JSON.stringify(obj) === '{}';
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

module.exports = { isEmpty, handleResponse, handleConvertResponse, serverErrorResponse, unauthorizeErrorResponse, invalidParameterErrorResponse, notFoundErrorResponse, serverConflictError };