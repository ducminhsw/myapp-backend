const mongoose = require('mongoose');
const { Schema } = mongoose;

const serverSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    channels: [{
        type: Schema.Types.ObjectId,
        ref: 'channel'
    }],
    admin: [{
        type: Schema.Types.ObjectId,
        ref: 'user'
    }],
    participants: [{
        type: Schema.Types.ObjectId,
        ref: 'user'
    }],
    muted: [{
        type: Schema.Types.ObjectId,
        ref: 'user'
    }],
    banned: [{
        type: Schema.Types.ObjectId,
        ref: 'user'
    }]
});

const Server = mongoose.model('server', serverSchema);
module.exports = Server;