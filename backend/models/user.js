const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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

// Méthode pour comparer le mot de passe
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Middleware simplifié pour hacher le mot de passe (sans next)
UserSchema.pre('save', async function() {
  // Si le mot de passe a été modifié, le hacher
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
});

module.exports = mongoose.model('User', UserSchema);

module.exports = mongoose.model('User', UserSchema);