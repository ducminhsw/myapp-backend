const nodemailer = require('nodemailer');

const createEmailTransport = () => {

    global._transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.ACCOUNT_EMAIL,
            pass: process.env.PASSWORD_EMAIL
        }

    });
}

module.exports = {
    createEmailTransport
}