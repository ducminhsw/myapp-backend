const mongoose = require('mongoose');
const { Schema } = mongoose;

const messageSchema = new Schema({
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
        default: Date.now,
        required: true
    }
});

const Message = mongoose.model('message', messageSchema);
module.exports = Message;