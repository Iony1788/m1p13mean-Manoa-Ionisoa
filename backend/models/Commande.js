const mongoose = require('mongoose');

const CommandeSchema = new mongoose.Schema({

  acheteur: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },

  id_boutique :{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Boutique',
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
    id_boutique: String,
    nom: String,
    prix: Number,
    image: String,
    quantite: Number,
    subtotal: Number
  }],

  

  dateAchat: { 
    type: Date, 
    default: Date.now 
  }

}, { 
  timestamps: true 
});

module.exports = mongoose.model('Commande', CommandeSchema);