const mongoose = require('mongoose');
const { Schema } = mongoose;

const messageSchema = new Schema({
    messages: [{
        page_id: Number,
        page_index: Number,
        message_max: Number,
        startAt: Date,
        message_count: Number,
        messages: [{
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

const Message = mongoose.model('messages', messageSchema);
module.exports = Message;