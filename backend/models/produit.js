const mongoose = require('mongoose');

const ProduitSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    prix: {
      type: Number,
      required: true
    },
    image: {
      type: String
    },
    disponible: {
      type: Boolean,
      default: true
    },
    quantiteStock: {
      type: Number,
      default: 0
    },
    id_boutique: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Boutique',
      required: true
    },
    idCategorie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Categorie',
      required: true
    }
  },
  { timestamps: true }
);


module.exports = mongoose.models.Produit || mongoose.model('produit', ProduitSchema);
