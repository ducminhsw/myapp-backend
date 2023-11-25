const mongoose = require('mongoose');
const { SERVER_TYPE } = require('../utils/contants');
const { Schema } = mongoose;

const serverSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    headOfServer: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'user'
        },
        createAt: {
            type: Date,
            default: Date.now()
        }
    }],
    type: {
        type: Number,
        required: true
    },
    channels: [{
        channel: {
            type: Schema.Types.ObjectId,
            ref: 'channel'
        },
        createAt: {
            type: Date,
            default: Date.now()
        }
    }],
    participants: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'user'
        },
        createAt: {
            type: Date,
            default: Date.now()
        }
    }],
    joinRequest: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'user'
        },
        createAt: {
            type: Date,
            default: Date.now()
        }
    }],
    muted: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'user'
        },
        createAt: {
            type: Date,
            default: Date.now()
        }
    }],
    banned: [{
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

const Server = mongoose.model('server', serverSchema);
module.exports = Server;