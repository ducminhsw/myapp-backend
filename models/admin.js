const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminSchema = new Schema({
    firstName: String,
    lastName: String,
    userBanned: [{
        id: Schema.Types.ObjectId,
        reason: String
    }],
    role: 'admin',
    dateOfBirth: Date
}, {
    timestamps: true
});

const Admin = mongoose.model('admin', adminSchema);
module.exports = Admin;