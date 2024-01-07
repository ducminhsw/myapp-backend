const mongoose = require('mongoose');
const { Schema } = mongoose;

const channelMessageSchema = new Schema({
    channelId: {
        type: String,
        required: true
    },
    message: [{
        type: Schema.Types.ObjectId,
        ref: 'message'
    }]
});

const ChannelMessage = mongoose.model('channel-message', channelMessageSchema);
module.exports = ChannelMessage;