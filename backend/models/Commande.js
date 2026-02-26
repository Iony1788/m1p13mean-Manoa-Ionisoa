const mongoose = require('mongoose');

const CommandeSchema = new mongoose.Schema({

  acheteur: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },

  panier: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Panier',
    required: true
  },

  totalPrix: { 
    type: Number,
    required: true
  },

  totalQuantite: {
    type: Number,
    required: true
  },

  produitsSnapshot: [{
    produitId: mongoose.Schema.Types.ObjectId,
    nom: String,
    prix: Number,
    image: String,
    quantite: Number,
    subtotal: Number
  }],

  statut: {
    type: String,
    enum: ['en_attente', 'payee', 'livree'],
    default: 'en_attente'
  },

  dateAchat: { 
    type: Date, 
    default: Date.now 
  }

}, { 
  timestamps: true 
});

module.exports = mongoose.model('Commande', CommandeSchema);