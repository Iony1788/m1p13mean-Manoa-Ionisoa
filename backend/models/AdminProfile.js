const mongoose = require('mongoose');

const adminProfileSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AdminProfile', adminProfileSchema);