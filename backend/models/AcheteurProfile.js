const mongoose = require('mongoose');

const acheteurProfileSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    photo: {
        type: String,
        default: null
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AcheteurProfile', acheteurProfileSchema);