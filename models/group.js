const mongoose = require('mongoose');
const { Schema } = mongoose;

const groupSchema = new Schema({
    title: String,
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    messagePageCount: Number,
    messagePageMax: Number,
    message: [{
        messages_id: Number,
        messages_index: Number,
        startAt: Date,
        messages: {
            type: Schema.Types.ObjectId,
            ref: 'messages'
        },
        messages_count: Number
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

const Group = mongoose.model('group', groupSchema);
module.exports = Group;