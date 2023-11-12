const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    hashPassword: {
        type: String,
        required: true
    },
    role: 'user',
    headOfGroup: {
        type: Schema.Types.ObjectId,
        required: true
    },
    dateOfBirth: {
        type: String,
        required: true
    },
    banned: Boolean,
    friends: [
        {
            type: Schema.Types.ObjectId
        }
    ]
}, {
    timestamps: true
});

const User = mongoose.model('user', userSchema);
module.exports = User;