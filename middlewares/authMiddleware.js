const jwt = require("jsonwebtoken");
const { generateRandom6Number, handleConvertResponse } = require("../utils/utilsfunc");
const User = require("../models/user");

const configJwtSignObject = (user) => {
    const obj = {
        userId: user._id,
        role: user.role
    }
    return obj;
}

const generateAccessToken = (user) => {
    const token = jwt.sign(
        configJwtSignObject(user),
        process.env.ACCESS_TOKEN_SECRET_MINHND52,
        {
            expiresIn: '30m'
        });

    return token;
}

const generateRefreshToken = (user) => {
    const token = jwt.sign(
        configJwtSignObject(user),
        process.env.REFRESH_TOKEN_SECRET_MINHND52,
        {
            expiresIn: '365d'
        });
    return token;
}

const getRotationRefreshToken = (res, user) => {
    try {
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        res.cookie('refresh_token', refreshToken, {
            maxAge: 365 * 24 * 60 * 60 * 1000,
            httpOnly: true
        });

        return {
            err: undefined,
            accessToken,
            refreshToken
        }
    } catch (error) {
        console.log(error);
        return {
            err: error
        }
    }
}

const verifyAccessToken = (req, res, next) => {
    try {
        const accessToken = req.headers.authorization;
        if (!accessToken) return res.status(406).send({ message: "Unauthorized: Please add your headers right" });
        jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET_MINHND52, async (err, decodedAccessToken) => {
            if (err) {
                switch (err.name) {
                    case "TokenExpiredError":
                        if (err.message === "jwt expired") {
                            const refreshTokenCookie = req.cookies["refresh_token"];
                            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_MINHND52, async (err, refresh_decoded) => {
                                if (err) {
                                    if (err.message === "jwt expired")
                                        return handleConvertResponse(res, 401, "Your credentials are expired. Please log in again.");
                                    return handleConvertResponse(res, 401, "Your credentials are broken. Please log in again.");
                                }
                                const { email } = req.body;
                                const user = await User.findOne({ email });
                                if (!user) return handleConvertResponse(res, 404, "Unknown target user");
                                if (user._id !== refresh_decoded.userId) return handleConvertResponse(res, 404, "Unknown target user");
                                if (user.jwtRefeshToken !== refreshTokenCookie && user.jwtRefeshTokenList.includes(refreshTokenCookie)) {
                                    user.jwtRefeshToken = "";
                                    user.jwtRefeshTokenList = [];
                                    await user.save();
                                    res.clearCookie("refresh_token");
                                    return handleConvertResponse(res, 401, "Opps. Your credentials are blocked. Please log in again.");
                                }

                                const { err, accessToken, refreshToken } = getRotationRefreshToken(res, user);
                                if (err) return handleConvertResponse(res, 500, "Something went wrong");
                                user.jwtRefeshToken = refreshToken;
                                user.jwtRefeshTokenList.push(refreshToken);
                                await user.save();
                                // if need a new access token, generate immediately
                                req.newAccessToken = accessToken;
                                next();
                            });
                        }
                        break;
                    case "JsonWebTokenError":
                        return handleConvertResponse(res, 401, "Unauthorized: Invalid access token");
                }
            } else {
                const { email } = req.body;
                const user = await User.findOne({ email });
                if (!user) return handleConvertResponse(res, 404, "Unknown target user");
                if (user._id !== decodedAccessToken.userId) return handleConvertResponse(res, 404, "Unknown target user");
                next();
            }
        });
    } catch (error) {
        console.log(error);
        return handleConvertResponse(res, 500, "Something has broken");
    }
}

const sendMail = async (mailOptions) => {
    return await _transporter.sendMail(mailOptions);
}

const sendMailToConfirmRegister = async (req, res, next) => {
    try {
        const { email } = req.body

        const confirmCode = generateRandom6Number();

        const mailOptions = {
            from: 'norediscord86@gmail.com',
            to: email,
            subject: 'Confirmation Code',
            html: ` 
            <div style="width:100%">
            <p>Here is your confirmation code please go back to your site and enter this code to complete the register process: </p>
                <div style="font-size:25px;text-align:center;background-color:lightblue">
                    <p>
                        <b>${confirmCode}</b>
                    </p>
                </div>    
            </div>
            `
        }

        // Send the email
        const mailResponse = await sendMail(mailOptions);
        if (mailResponse.response.match(/[OK]/g)) {
            req.confirmCode = confirmCode;
            next();
        }
    } catch (error) {
        console.log(error);
        return serverErrorResponse(res);
    }
}

module.exports = { configJwtSignObject, sendMailToConfirmRegister, verifyAccessToken, generateAccessToken, generateRefreshToken, getRotationRefreshToken };