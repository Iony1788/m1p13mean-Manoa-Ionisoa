const mongoose = require('mongoose');

const boutiqueSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true, default: 'Ma boutique' },
    adresse: { type: String },
    description: { type: String },
    telephone: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } 
  },
  { timestamps: true }
);



module.exports = mongoose.models.Boutique || mongoose.model('Boutique', boutiqueSchema);