const mongoose = require('mongoose');

const produitSnapshotSchema = new mongoose.Schema({
  produitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Produit',
    required: true
  },
  nom: {
    type: String,
    required: true
  },
  prix: {
    type: Number,
    required: true
  },
  image: {
    type: String
  },
  quantite: {
    type: Number,
    required: true,
    default: 1
  },
  subtotal: {
    type: Number
  }
}, { _id: false });

const panierSchema = new mongoose.Schema({
  acheteurProfile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AcheteurProfile',
    required: true
  },

  // référence simple (optionnelle si tu utilises snapshot)
  produits: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Produit'
  }],

  // snapshot sécurisé (recommandé)
  produitsSnapshot: [produitSnapshotSchema],

  dateValidation: {
    type: Date
  }

}, {
  timestamps: true // crée automatiquement createdAt et updatedAt
});

module.exports = mongoose.model('Panier', panierSchema);
