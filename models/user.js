const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    role: {
        type: String,
        required: true
    },
    displayName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        default: ''
    },
    lastName: {
        type: String,
        default: ''
    },
    avatar: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        default: ''
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
        type: String,
        default: ''
    },
    verified: {
        type: Boolean,
        default: false
    },
    storyNow: {
        content: { type: String, default: "" },
        dateOfStory: { type: Date, default: Date.now }
    },
    stories: [{
        story: {
            type: String,
            default: ''
        }
    }],
    online: {
        type: Boolean,
        default: false
    },
    offline: {
        type: Date,
        default: Date.now
    },
    usersBlocked: [{
        type: Schema.Types.ObjectId,
        ref: 'user'
    }],
    banned: {
        type: Boolean,
        default: false
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