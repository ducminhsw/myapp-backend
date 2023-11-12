const mongoose = require('mongoose');
const { Schema } = mongoose;

const conversationSchema = new Schema({
    _id: String,
    firstUser: Schema.Types.ObjectId,
    secondUser: Schema.Types.ObjectId,
    message: [{
        id: Schema.Types.ObjectId,
        content: String
    }],
    mediaFile: [{
        id: String,
        content: ImageBitmap | VideoEncoder,
    }]
});

const Conversation = mongoose.model('conversation', conversationSchema);
module.exports = Conversation;