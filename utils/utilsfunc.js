const responseCode = {
    CREATE_SUCCESS: {
        statusCode: 200,
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


}

const handleResponse = (responseCode, message, data = null) => {
    return {
        code: responseCode,
        message: message,
        data
    }
}

module.exports = { responseCode, handleResponse };