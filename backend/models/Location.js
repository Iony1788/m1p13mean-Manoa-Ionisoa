const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema(
  {
    idBoutique: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Boutique',
      required: true
    },

    idLot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lot',
      required: true
    },

    dateDebut: {
      type: Date,
      default: Date.now
    },

    dateFin: {
      type: Date
    },

    statut: {
      type: String,
      enum: ['active', 'terminee', 'annulee'],
      default: 'active'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.models.Location || mongoose.model('Location', locationSchema);