const mongoose = require('mongoose');

const roleAssignmentSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    role: { 
        type: Number, 
        enum: [0, 1, 2], 
        required: true,
        default: 1 // 0=Admin, 1=Acheteur, 2=Boutique
    },
    adminProfile: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'AdminProfile' 
    },
    acheteurProfile: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'AcheteurProfile' 
    },
    boutiqueProfile: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'BoutiqueProfile' 
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('RoleAssignment', roleAssignmentSchema);