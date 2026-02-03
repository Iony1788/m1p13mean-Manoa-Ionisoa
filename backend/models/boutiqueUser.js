const mongoose = require("mongoose");

const boutiqueUserSchema = new mongoose.Schema(
  {
    id_user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    id_boutique: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Boutique",
      required: true
    },

    roleDansBoutique: {
      type: Number,
      enum: [0, 1, 2],
      required: true
    }
  },
  { timestamps: true } 
);

module.exports = mongoose.models.BoutiqueUser || mongoose.model("BoutiqueUser", boutiqueUserSchema);
