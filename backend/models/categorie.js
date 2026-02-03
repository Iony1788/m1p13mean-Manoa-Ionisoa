const mongoose = require("mongoose");

const categorieSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true },
    description: { type: String },

    idProposeParBoutique: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Boutique"
    },

    isValidated: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.models.Categorie || mongoose.model("Categorie", categorieSchema);
