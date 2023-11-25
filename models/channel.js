const mongoose = require('mongoose');
const { Schema } = mongoose;

const channelSchema = new Schema({
    channel_name: {
        type: String,
        required: true
    },
    headOfChannel: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'user'
        },
        createAt: {
            type: Date,
            default: Date.now()
        }
    }],
    member: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'user'
        },
        createAt: {
            type: Date,
            default: Date.now()
        }
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
            message: {
                type: Schema.Types.ObjectId,
                ref: 'message'
            },
            sentAt: {
                type: Date,
                default: Date.now()
            }
        }]
    }
    ]
});

const Channel = mongoose.model('channel', channelSchema);
module.exports = Channel;