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
    headOfSever: {
        type: Schema.Types.ObjectId,
        ref: 'server'
    },
    dateOfBirth: {
        type: String
    },
    banned: {
        type: Boolean,
    },
    friends: [
        {
            type: Schema.Types.ObjectId,
            ref: 'user'
        }
    ]
});

const User = mongoose.model('user', userSchema);
module.exports = User;