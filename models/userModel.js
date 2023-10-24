const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ['admin', 'superAdmin']    
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const USER = mongoose.model('users', userSchema);

module.exports = { USER };