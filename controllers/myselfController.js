const User = require('../models/user');

const { handleConvertResponse } = require('../utils/utilsfunc');

const getProfile = async (req, res) => {
    const { decodedToken } = req;
    if (!decodedToken) {
        return handleConvertResponse(res, 401, 'Invalid token');
    }

    const { username, email } = req.body;
    if (typeof username !== 'string' || typeof email !== 'string') {
        return handleConvertResponse(res, 401, 'Invalid params type')
    }

    try {
        const user = await User.findOne({ username: username, email: email });
        if (!user) {
            return handleConvertResponse(res, 401, 'Invalid user');
        }

        return handleConvertResponse(res, 200, 'Get data success', user);
    } catch (error) {
        console.log(error);
        return handleConvertResponse(res, 500, 'Something went wrong');
    }
};

const getUserProfile = async (res, req) => {
    const { userId, username } = req.body;

    if (!username || typeof username !== 'string') {
        return invalidParameterErrorResponse(res);
    }

    if (!userId || typeof userId !== 'string') {
        return invalidParameterErrorResponse(res);
    }

    try {
        const user = await User.findOne({ _id: userId, username: username });
        if (!user) return notFoundErrorResponse(res);
        return res.status(200).send(handleResponse(200, "Information of choosen", user));
    } catch (error) {
        return res.status(500).send(handleResponse(500, "Something went wrong"));
    }
};

const putProfile = async (req, res) => {
    const { decodedToken } = req;
    if (!decodedToken) {
        return handleConvertResponse(res, 401, 'Invalid token');
    }

    const { username, email } = req.body;
    if (typeof username !== 'string' || typeof email !== 'string') {
        return handleConvertResponse(res, 401, 'Invalid params type')
    }

    const { firstName, lastName, phoneNumber, dateOfBirth } = req.body;

    if (firstName || lastName || phoneNumber || dateOfBirth) {
        return handleConvertResponse(res, 401, 'No information need to update');
    }

    try {
        const user = await User.findOne({ username: username, email: email });
        if (!user) {
            return handleConvertResponse(res, 401, 'Invalid user');
        }

        if (firstName && typeof firstName === 'string') user.firstName = firstName;
        if (lastName && typeof lastName === 'string') user.lastName = lastName;
        if (phoneNumber && typeof phoneNumber === 'string') user.phoneNumber = phoneNumber;
        if (dateOfBirth && typeof dateOfBirth === 'string') user.dateOfBirth = dateOfBirth;

        await user.save();

        return handleConvertResponse(res, 200, 'Edit data success', user);
    } catch (error) {
        console.log(error);
        return handleConvertResponse(res, 500, 'Something went wrong');
    }
};

const postStory = async (req, res) => {
    const { tokenCredential } = req;
    if (!tokenCredential) {
        return handleConvertResponse(res, 401, 'Invalid token');
    }

    const { email } = req.body;
    if (typeof email !== 'string') {
        return handleConvertResponse(res, 401, 'Invalid params type')
    }

    const { story } = req.body;

    if (!story) {
        return handleConvertResponse(res, 401, 'No story is available.');
    }

    if (typeof story !== 'string') {
        return handleConvertResponse(res, 401, 'Invalid type story.');
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return handleConvertResponse(res, 404, 'Invalid user.');
        }
        const storyContent = {
            content: story,
            dateOfStory: new Date()
        };
        user.storyNow = storyContent;

        await user.save();

        return handleConvertResponse(res, 200, 'Post story success', story);
    } catch (error) {
        console.log(error);
        return handleConvertResponse(res, 500, 'Something went wrong.');
    }
};

const deleteStory = async (req, res) => {
    const { tokenCredential } = req;
    if (!tokenCredential) {
        return handleConvertResponse(res, 401, 'Invalid token.');
    }

    const { email } = req.body;
    if (!email) {
        return handleConvertResponse(res, 401, 'Invalid params.')
    }

    if (typeof email !== 'string') {
        return handleConvertResponse(res, 401, 'Invalid params type.')
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return handleConvertResponse(res, 404, 'Invalid user.');
        }

        if (!user.storyNow) {
            return handleConvertResponse(res, 404, 'No valid story to delete.');
        }

        const date = new Date();
        if (date - user.storyNow.dateOfStory > 86400) {
            return handleConvertResponse(res, 404, 'No valid story to delete.');
        }

        user.storyNow = null;

        await user.save();

        return handleConvertResponse(res, 200, 'Delete story success.');
    } catch (error) {
        console.log(error);
        return handleConvertResponse(res, 500, 'Something went wrong.');
    }
};

module.exports = {
    getProfile, putProfile,
    deleteStory, postStory, getUserProfile
}