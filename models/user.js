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
    avatar: {
        type: String
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
    underServer: [{
        server: {
            type: Schema.Types.ObjectId,
            ref: 'server'
        },
        createAt: {
            type: Date,
            default: Date.now()
        }
    }],
    headOfSever: [{
        server: {
            type: Schema.Types.ObjectId,
            ref: 'server'
        },
        createAt: {
            type: Date,
            default: Date.now()
        }
    }],
    dateOfBirth: {
        type: String
    },
    verified: {
        type: Boolean,
        required: true
    },
    storyNow: {
        content: { type: String },
        dateOfStory: { type: Date, default: Date.now }
    },
    stories: [{
        story: {
            type: String
        }
    }],
    banned: {
        type: Boolean,
    },
    friends: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'user'
        },
        createAt: {
            type: Date,
            default: Date.now()
        }
    }]
});

const User = mongoose.model('user', userSchema);
module.exports = User;