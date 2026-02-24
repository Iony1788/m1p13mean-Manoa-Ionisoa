// backend/models/Lot.js
const mongoose = require('mongoose');

const lotSchema = new mongoose.Schema(
  {
    nom_lot: { type: String, required: true },
    superficie: { type: Number },
    prix_location: { type: Number, default: 0.0 },
    niveau: { type: String },
    etape: { type: String },
    description: { type: String },
    statut: {
      type: String,
      enum: ['libre', 'reserve', 'occupe'],
      default: 'libre'
    },
    id_boutique: { type: mongoose.Schema.Types.ObjectId, ref: 'Boutique' }
  },
  { timestamps: true }
);

module.exports = mongoose.models.Lot || mongoose.model('Lot', lotSchema);