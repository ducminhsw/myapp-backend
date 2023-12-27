const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const { handleResponse, invalidParameterErrorResponse, handleConvertResponse, serverErrorResponse, serverConflictError } = require('../utils/utilsfunc');
const { configJwtSignObject } = require('../middlewares/authMiddleware');

const generateAccessToken = (user) => {
    const token = jwt.sign(
        configJwtSignObject(user),
        process.env.TOKEN_KEY,
        {
            expiresIn: '30s'
        });

    return token;
}

const generateRefreshToken = (user) => {
    const token = jwt.sign(
        configJwtSignObject(user),
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: '365d'
        });

    return token;
}


const sendMail = async (mailOptions) => {
    return await _transporter.sendMail(mailOptions);
}

const sendMailToConfirmRegister = async (req, res) => {

    try {
        const { confirmCode, email } = req.body

        if (confirmCode.toString().length !== 6) return res.tatus(400).json("Code is invalid")

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
            res.status(200).json('Send confirmation code sucessfully')
        }
    } catch (error) {
        serverErrorResponse(error)
    }

}

const register = async (req, res) => {
    try {
        const { username, password, email, displayName, dateOfBirth } = req.body;
        // check if user exists
        const userExists = await User.exists({ email: email });
        if (userExists) {
            return serverConflictError(res);
        }

        // check passport
        bcrypt.hash(password, Number(process.env.SALT_ROUNDS), async (err, hashPassword) => {
            if (err) {
                console.log(err);
                return serverConflictError(res);
            }
            const userObj = {
                role: 'user',
                email,
                username,
                displayName,
                dateOfBirth,
                hashPassword,
            }
            const user = await User.create(userObj);

            await user.save();

            delete userObj.password;

            return handleConvertResponse(res, 200, "Create user success", {
                userCredentials: userObj,
            });
        });
    } catch (error) {
        return serverErrorResponse(res);
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // check if user exists
        const userExists = await User.findOne({ email: email });
        if (!userExists) return serverConflictError(res);

        // check if password is match
        const match = await bcrypt.compare(password, userExists.hashPassword);
        if (!match) return serverConflictError(res);

        const token = generateAccessToken(userExists);
        const refreshToken = generateRefreshToken(userExists);
        res.cookie('access_token', token, {
            maxAge: 365 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            // secure:true
        })
        res.cookie('refresh_token', refreshToken, {
            maxAge: 365 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            // secure:true
        })
        return res.status(200).send(handleResponse(200, 'Login success.',
            {
                userCredentials: {
                    role: userExists.role,
                    userId: userExists._id,
                    email: userExists.email,
                    username: userExists.username,
                    firstName: userExists.firstName,
                    lastName: userExists.lastName,
                    avatar: userExists.avatar,
                    friends: userExists.friends,
                    phoneNumber: userExists.phoneNumber,
                    underServer: userExists.underServer,
                    headOfSever: userExists.headOfSever,
                    dateOfBirth: userExists.dateOfBirth,
                    storyNow: userExists.storyNow,
                    stories: userExists.stories,
                }
            }));

    } catch (error) {
        return serverErrorResponse(res);
    }
};

// verify account after register
// const verifyAccount = async (req, res) => {
//     const { email } = req.body;

//     if (typeof email !== 'string') {
//         return res.status(401).send(handleResponse(401, "Invalid authentication input."));
//     }

//     const user = await User.findOne({ email: email });

//     if (!user) {
//         return res.status(401).send(handleResponse(401, "User does not exists."));
//     }

//     try {
//         user.verified = true;
//         await user.save();
//         return handleConvertResponse(res);
//     } catch (error) {
//         console.log(error);
//         return serverErrorResponse(res);
//     }
// };

const deleteAccount = async (req, res) => {
    const { email } = req.body;
    if (!email || typeof email !== 'string') {
        return invalidParameterErrorResponse(res);
    }

    const user = await User.findOne({ email: email });
    if (!user) {
        return invalidParameterErrorResponse(res);
    }

    try {
        const deletedUser = await User.deleteOne(user);
        return handleConvertResponse(res, 202, deletedUser);
    } catch (error) {
        return serverErrorResponse(res);
    }
}

const refreshToken = (req, res) => {
    const token = generateAccessToken(req.decodedToken);
    res.cookie('access_token', token, {
        maxAge: 365 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        // secure:true
    })
    return handleConvertResponse(res, 200, 'Refresh token success', { token: token });
}

// change password
const changePassword = (req, res) => { };

// request password after forgot password
const requestPassword = (req, res) => { };

module.exports = { login, register, deleteAccount, changePassword, requestPassword, refreshToken, sendMailToConfirmRegister }