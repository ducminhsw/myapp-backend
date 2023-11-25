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