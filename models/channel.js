const mongoose = require('mongoose');
const { Schema } = mongoose;

const channelSchema = new Schema({
    channel_name: {
        type: String,
        required: true
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
        startAt: Date,
        message_count: Number,
        message: [{
            content: {
                type: String,
                required: true
            },
            sender: {
                type: Schema.Types.ObjectId,
                ref: 'user',
                required: true
            },
            sentAt: {
                type: Date,
                required: true
            }
        }]
    }
    ]
});

const Channel = mongoose.model('channel', channelSchema);
module.exports = Channel;