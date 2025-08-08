const mongoose = require('mongoose');
// user schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'INACTIVE'],
        default: 'ACTIVE'
    },
    groupPermissions: 
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'GroupPermissions'
        }
    ,
    extraPermissions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Permission'
        }
    ],
    restrictedPermissions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Permission'
        }
    ],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);
module.exports = User;
