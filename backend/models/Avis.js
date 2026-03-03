const mongoose = require('mongoose');

const avisSchema = new mongoose.Schema({
  note: {
    type: Number,
    required: [true, 'La note est obligatoire'],
    min: [0, 'La note doit être au minimum 0'],
    max: [5, 'La note doit être au maximum 5']
  },
  commentaire: {
    type: String,
    trim: true,
    maxlength: [500, 'Le commentaire ne peut pas dépasser 500 caractères']
  },
  type: {
    type: Number,
    required: [true, 'Le type est obligatoire'],
    enum: {
      values: [0, 1],
      message: 'Le type doit être 0 ou 1'
    }
  },
  produit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Produit',
    index: true
  },
  boutiqueProfile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Boutique',
    index: true
  },
  acheteurProfile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Le profil acheteur est obligatoire'],
    index: true
  }
}, {
  timestamps: true 
});

avisSchema.index({ acheteurProfile: 1, produit: 1 }, { 
  unique: true, 
  sparse: true,
  partialFilterExpression: { produit: { $type: "objectId" } }
});

avisSchema.index({ acheteurProfile: 1, boutiqueProfile: 1 }, { 
  unique: true, 
  sparse: true,
  partialFilterExpression: { boutiqueProfile: { $type: "objectId" } }
});

avisSchema.pre('validate', function(next) {
  if (!this.produit && !this.boutiqueProfile) {
    next(new Error('Un avis doit être associé soit à un produit, soit à une boutique'));
  }
  return next;
});

avisSchema.statics.calculateProductAverageRating = async function(productId) {
  const result = await this.aggregate([
    { $match: { produit: productId } },
    { $group: {
        _id: null,
        averageNote: { $avg: '$note' },
        totalAvis: { $sum: 1 }
      }}
  ]);
  
  return result.length > 0 ? result[0] : { averageNote: 0, totalAvis: 0 };
};

avisSchema.statics.calculateBoutiqueAverageRating = async function(boutiqueId) {
  const result = await this.aggregate([
    { $match: { boutiqueProfile: boutiqueId } },
    { $group: {
        _id: null,
        averageNote: { $avg: '$note' },
        totalAvis: { $sum: 1 }
      }}
  ]);
  
  return result.length > 0 ? result[0] : { averageNote: 0, totalAvis: 0 };
};

const Avis = mongoose.model('Avis', avisSchema);

module.exports = Avis;