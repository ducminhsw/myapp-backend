const mongoose = require('mongoose');
const { Schema } = mongoose;

const groupSchema = new Schema({
    title: String,
    creator: Schema.Types.ObjectId,
    message: [{
        sender: Schema.Types.ObjectId,
        time: Date
    }],
    admin: [{
        id: Schema.Types.ObjectId
    }],
    muted: [{
        id: Schema.Types.ObjectId,
        reason: String,
        expired: Date
    }],
    banned: [{
        id: Schema.Types.ObjectId,
        reason: String,
        number: Int8Array
    }]
});

const Group = mongoose.model('group', groupSchema);
module.exports = Group;