const isEmpty = (obj) => {
    return JSON.stringify(obj) === '{}';
}

const handleConvertResponse = (res, responseCode = 200, message = "Success", data = null) => {
    return res.status(responseCode)
        .send({
            code: responseCode,
            message: message,
            data
        });
}

const generateRandom6Number = () => {
    const numbers = "1234567890";
    let code = "";
    for (let i = 0; i < 6; i++) {
        let randomIndex = Math.floor(Math.random() * 10);
        code += numbers[randomIndex];
    }
    return code;
}

module.exports = { isEmpty, handleConvertResponse, generateRandom6Number };