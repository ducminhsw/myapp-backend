const mongoose = require('mongoose');
const { Schema } = mongoose;

const channelSchema = new Schema({
    channel_name: {
        type: String,
        required: true
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    member: [{
        type: Schema.Types.ObjectId,
        ref: 'user'
    }],
    channel_type: {
        type: Number,
        required: true
    },
    messages: [{
        page_id: Number,
        page_index: Number,
        message_max: Number,
        startAt: {
            type: Date,
            default: Date.now
        },
        message_count: Number,
        message: [{
            type: Schema.Types.ObjectId,
            ref: 'message'
        }]
    }
    ]
});

const Channel = mongoose.model('channel', channelSchema);
module.exports = Channel;