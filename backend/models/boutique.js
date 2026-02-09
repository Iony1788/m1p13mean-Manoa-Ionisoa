const mongoose = require('mongoose');

const boutiqueSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true },
    adresse: { type: String },
    description: { type: String },
    telephone: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.models.Boutique || mongoose.model('Boutique', boutiqueSchema);