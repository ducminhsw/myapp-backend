const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminSchema = new Schema({
    role: 'admin',
    admin: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    userBanned: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'user'
        },
        reason: {
            type: String,
            required: true
        }
    }],
    dateOfBirth: {
        type: Date | String
    }
}, {
    timestamps: true
});

const Admin = mongoose.model('admin', adminSchema);
module.exports = Admin;