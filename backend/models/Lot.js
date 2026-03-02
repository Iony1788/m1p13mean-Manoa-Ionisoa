// backend/models/Lot.js
const mongoose = require('mongoose');

const lotSchema = new mongoose.Schema(
  {
    nom_lot: { type: String, required: true },
    superficie: { type: Number },
    prix_location: { type: Number, default: 0.0 },
    niveau: { type: String },
    description: { type: String },
    statut: {
      type: String,
      enum: ['libre', 'reserve', 'occupe'],
      default: 'libre'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.models.Lot || mongoose.model('Lot', lotSchema);
