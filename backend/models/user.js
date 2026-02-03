const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: true
    },
    prenom: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: Number,
      enum: [0, 1, 2],
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
