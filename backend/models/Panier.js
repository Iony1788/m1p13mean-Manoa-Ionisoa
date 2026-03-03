const mongoose = require('mongoose');

const produitSnapshotSchema = new mongoose.Schema({
  produitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Produit',
    required: true
  },
  id_boutique: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Boutique',
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

  produits: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Produit'
  }],

  produitsSnapshot: [produitSnapshotSchema],

  dateValidation: {
    type: Date
  }

}, {
  timestamps: true 
});

module.exports = mongoose.model('Panier', panierSchema);