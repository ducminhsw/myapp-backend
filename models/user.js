const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    role: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String
    },
    hashPassword: {
        type: String,
        required: true
    },
    headOfGroup: {
        type: Schema.Types.ObjectId
    },
    dateOfBirth: {
        type: String
    },
    banned: Boolean,
    friends: [
        {
            type: Schema.Types.ObjectId
        }
    ]
});

const User = mongoose.model('user', userSchema);
module.exports = User;