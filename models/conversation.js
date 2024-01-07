const mongoose = require('mongoose');
const { Schema } = mongoose;

const conversationSchema = new Schema({
    firstUserId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    secondUserId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    message: [{
        type: Schema.Types.ObjectId,
        ref: 'message'
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