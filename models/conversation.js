const mongoose = require('mongoose');
const { Schema } = mongoose;

const conversationSchema = new Schema({
    firstUser: {
        type: Schema.Types.ObjectId,
        required: true
    },
    firstUserName: {
        type: String,
        required: true
    },
    secondUser: {
        type: Schema.Types.ObjectId,
        required: true
    },
    secondUserName: {
        type: String,
        required: true
    },
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
    }],
    mediaFile: [{
        sender: {
            type: Schema.Types.ObjectId,
            required: true
        },
        content: {
            type: String,
            required: true
        },
    }]
});

const Conversation = mongoose.model('conversation', conversationSchema);
module.exports = Conversation;