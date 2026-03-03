const Avis = require('../models/Avis');
const Produit = require('../models/Produit');
const Boutique = require('../models/Boutique');

// Donner un avis sur un produit
exports.createProductAvis = async (req, res) => {

  try {
    const { produitId } = req.params;
    const { note, commentaire } = req.body;
    const acheteurProfileId = req.user.userId; // À adapter selon votre système d'authentification
    
    console.log('Acheteur ID:', acheteurProfileId);
    console.log('Produit ID:', produitId);

    
    // console.log(note);
    if(req.user.role !== 'acheteur') {
      return res.status(403).json({
        success: false,
        message: 'Accès refusé. Vous devez être un acheteur pour donner un avis.'
      });
    }

    // Vérifier si le produit existe
    const produit = await Produit.findById(produitId);
    if (!produit) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé'
      });
    }

    // Vérifier si l'acheteur a déjà donné un avis sur ce produit
    const existingAvis = await Avis.findOne({
      acheteurProfile: acheteurProfileId,
      produit: produitId
    });

    if (existingAvis) {
      return res.status(400).json({
        success: false,
        message: 'Vous avez déjà donné un avis sur ce produit'
      });
    }

    // Créer l'avis
    const avis = await Avis.create({
      note,
      commentaire,
      type: 0, // 0 pour produit
      produit: produitId,
      acheteurProfile: acheteurProfileId 
    });
  console.log("mety");

    // Calculer la nouvelle note moyenne du produit
    const productRating = await Avis.calculateProductAverageRating(produitId);
    
    // Mettre à jour la note du produit dans sa collection
    await Produit.findByIdAndUpdate(produitId, {
      noteMoyenne: productRating.averageNote,
      nombreAvis: productRating.totalAvis
    });

    res.status(201).json({
      success: true,
      message: 'Avis ajouté avec succès',
      data: {
        avis,
        productRating
      }
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'ajout de l\'avis',
      error: error.message
    });
  }
};

// Donner un avis sur une boutique
exports.createBoutiqueAvis = async (req, res) => {
  try {
    const { boutiqueId } = req.params;
    const { note, commentaire } = req.body;
    const acheteurProfileId = req.user.userId; // À adapter selon votre système d'authentification


    // Vérifier si la boutique existe
    const boutique = await Boutique.findById(boutiqueId);
    if (!boutique) {
      return res.status(404).json({
        success: false,
        message: 'Boutique non trouvée'
      });
    }

    // Vérifier si l'acheteur a déjà donné un avis sur cette boutique
    const existingAvis = await Avis.findOne({
      acheteurProfile: acheteurProfileId,
      boutiqueProfile: boutiqueId
    });

    if (existingAvis) {
      return res.status(400).json({
        success: false,
        message: 'Vous avez déjà donné un avis sur cette boutique'
      });
    }

    // Créer l'avis
    const avis = await Avis.create({
      note,
      commentaire,
      type: 1, // 1 pour boutique
      boutiqueProfile: boutiqueId,
      acheteurProfile: acheteurProfileId
    });

    // Calculer la nouvelle note moyenne de la boutique
    const boutiqueRating = await Avis.calculateBoutiqueAverageRating(boutiqueId);
    
    // Mettre à jour la note de la boutique dans sa collection
    await Boutique.findByIdAndUpdate(boutiqueId, {
      noteMoyenne: boutiqueRating.averageNote,
      nombreAvis: boutiqueRating.totalAvis
    });

    res.status(201).json({
      success: true,
      message: 'Avis ajouté avec succès',
      data: {
        avis,
        boutiqueRating
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'ajout de l\'avis',
      error: error.message
    });
  }
};

// Obtenir la note moyenne d'un produit
exports.getProductRating = async (req, res) => {
  try {
    const { produitId } = req.params;

    // Vérifier si le produit existe
    const produit = await Produit.findById(produitId);
    if (!produit) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé'
      });
    }

    // Calculer la note moyenne
    const productRating = await Avis.calculateProductAverageRating(produitId);

    // Récupérer tous les avis du produit avec les infos de l'acheteur
    const avis = await Avis.find({ produit: produitId })
      .populate('acheteurProfile', 'nom avatar')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      data: {
        averageNote: productRating.averageNote,
        totalAvis: productRating.totalAvis,
        avis: avis
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des notes',
      error: error.message
    });
  }
};

// Obtenir la note moyenne d'une boutique
exports.getBoutiqueRating = async (req, res) => {
  try {
    const { boutiqueId } = req.params;

    // Vérifier si la boutique existe
    const boutique = await Boutique.findById(boutiqueId);
    if (!boutique) {
      return res.status(404).json({
        success: false,
        message: 'Boutique non trouvée'
      });
    }

    // Calculer la note moyenne
    const boutiqueRating = await Avis.calculateBoutiqueAverageRating(boutiqueId);

    // Récupérer tous les avis de la boutique avec les infos de l'acheteur
    const avis = await Avis.find({ boutiqueProfile: boutiqueId })
      .populate('acheteurProfile', 'nom avatar')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      data: {
        averageNote: boutiqueRating.averageNote,
        totalAvis: boutiqueRating.totalAvis,
        avis: avis
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des notes',
      error: error.message
    });
  }
};

// Mettre à jour un avis
exports.updateAvis = async (req, res) => {
  try {
    const { avisId } = req.params;
    const { note, commentaire } = req.body;
    const acheteurProfileId = req.user.userId;

    // Trouver l'avis et vérifier qu'il appartient bien à l'acheteur
    const avis = await Avis.findOne({
      _id: avisId,
      acheteurProfile: acheteurProfileId
    });

    if (!avis) {
      return res.status(404).json({
        success: false,
        message: 'Avis non trouvé ou vous n\'êtes pas autorisé à le modifier'
      });
    }

    // Mettre à jour l'avis
    avis.note = note || avis.note;
    avis.commentaire = commentaire || avis.commentaire;
    await avis.save();

    // Mettre à jour la note moyenne du produit ou de la boutique concerné
    if (avis.type === 0 && avis.produit) {
      const productRating = await Avis.calculateProductAverageRating(avis.produit);
      await Produit.findByIdAndUpdate(avis.produit, {
        noteMoyenne: productRating.averageNote,
        nombreAvis: productRating.totalAvis
      });
    } else if (avis.type === 1 && avis.boutiqueProfile) {
      const boutiqueRating = await Avis.calculateBoutiqueAverageRating(avis.boutiqueProfile);
      await Boutique.findByIdAndUpdate(avis.boutiqueProfile, {
        noteMoyenne: boutiqueRating.averageNote,
        nombreAvis: boutiqueRating.totalAvis
      });
    }

    res.status(200).json({
      success: true,
      message: 'Avis mis à jour avec succès',
      data: avis
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de l\'avis',
      error: error.message
    });
  }
};

// Supprimer un avis
exports.deleteAvis = async (req, res) => {
  try {
    const { avisId } = req.params;
    const acheteurProfileId = req.user.userId;

    // Trouver l'avis et vérifier qu'il appartient bien à l'acheteur
    const avis = await Avis.findOne({
      _id: avisId,
      acheteurProfile: acheteurProfileId
    });

    if (!avis) {
      return res.status(404).json({
        success: false,
        message: 'Avis non trouvé ou vous n\'êtes pas autorisé à le supprimer'
      });
    }

    const type = avis.type;
    const targetId = type === 0 ? avis.produit : avis.boutiqueProfile;

    // Supprimer l'avis
    await avis.remove();

    // Mettre à jour la note moyenne
    if (type === 0 && targetId) {
      const productRating = await Avis.calculateProductAverageRating(targetId);
      await Produit.findByIdAndUpdate(targetId, {
        noteMoyenne: productRating.averageNote,
        nombreAvis: productRating.totalAvis
      });
    } else if (type === 1 && targetId) {
      const boutiqueRating = await Avis.calculateBoutiqueAverageRating(targetId);
      await Boutique.findByIdAndUpdate(targetId, {
        noteMoyenne: boutiqueRating.averageNote,
        nombreAvis: boutiqueRating.totalAvis
      });
    }

    res.status(200).json({
      success: true,
      message: 'Avis supprimé avec succès'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de l\'avis',
      error: error.message
    });
  }
};

// Récupérer tous les avis d'un produit avec pagination
exports.getProductAvis = async (req, res) => {
  try {
    const { produitId } = req.params;
    const { page = 1, limit = 10, sort = '-createdAt' } = req.query;
    
    // Options de pagination
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sort,
      populate: {
        path: 'acheteurProfile',
        select: 'nom avatar' // Sélectionner les champs de l'acheteur à afficher
      }
    };

    // Vérifier si le produit existe
    const produit = await Produit.findById(produitId);
    if (!produit) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé'
      });
    }

    // Récupérer les avis avec pagination
    const avis = await Avis.find({ produit: produitId })
      .populate('acheteurProfile', 'nom avatar')
      .sort(sort)
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    // Compter le nombre total d'avis pour ce produit
    const totalAvis = await Avis.countDocuments({ produit: produitId });

    // Calculer la note moyenne
    const productRating = await Avis.calculateProductAverageRating(produitId);

    res.status(200).json({
      success: true,
      data: {
        avis,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalAvis / parseInt(limit)),
          totalItems: totalAvis,
          itemsPerPage: parseInt(limit)
        },
        stats: {
          averageNote: productRating.averageNote,
          totalAvis: productRating.totalAvis
        }
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des avis',
      error: error.message
    });
  }
};

// Vérifier si un acheteur a déjà un avis sur un produit
exports.checkUserProductAvis = async (req, res) => {
  try {
    const { produitId } = req.params;
    const acheteurProfileId = req.user.userId;

    // Vérifier si le produit existe
    const produit = await Produit.findById(produitId);
    if (!produit) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé'
      });
    }

    // Rechercher si un avis existe déjà
    const existingAvis = await Avis.findOne({
      acheteurProfile: acheteurProfileId,
      produit: produitId
    }).populate('acheteurProfile', 'nom prenom email');

    if (existingAvis) {
      return res.status(200).json({
        success: true,
        hasAvis: true,
        message: 'L\'utilisateur a déjà donné un avis sur ce produit',
        data: {
          avis: existingAvis,
          peutModifier: true,
          peutSupprimer: true
        }
      });
    } else {
      return res.status(200).json({
        success: true,
        hasAvis: false,
        message: 'L\'utilisateur n\'a pas encore donné d\'avis sur ce produit',
        data: {
          avis: null,
          peutAjouter: true
        }
      });
    }

  } catch (error) {
    console.error('Erreur checkUserProductAvis:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la vérification de l\'avis',
      error: error.message
    });
  }
};

// Vérifier si un acheteur a déjà un avis sur une boutique
exports.checkUserBoutiqueAvis = async (req, res) => {
  try {
    const { boutiqueId } = req.params;
    const acheteurProfileId = req.user.userId;

    // Vérifier si la boutique existe
    const boutique = await Boutique.findById(boutiqueId);
    if (!boutique) {
      return res.status(404).json({
        success: false,
        message: 'Boutique non trouvée'
      });
    }

    // Rechercher si un avis existe déjà
    const existingAvis = await Avis.findOne({
      acheteurProfile: acheteurProfileId,
      boutiqueProfile: boutiqueId
    }).populate('acheteurProfile', 'nom prenom email');

    if (existingAvis) {
      return res.status(200).json({
        success: true,
        hasAvis: true,
        message: 'L\'utilisateur a déjà donné un avis sur cette boutique',
        data: {
          avis: existingAvis,
          peutModifier: true,
          peutSupprimer: true
        }
      });
    } else {
      return res.status(200).json({
        success: true,
        hasAvis: false,
        message: 'L\'utilisateur n\'a pas encore donné d\'avis sur cette boutique',
        data: {
          avis: null,
          peutAjouter: true
        }
      });
    }

  } catch (error) {
    console.error('Erreur checkUserBoutiqueAvis:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la vérification de l\'avis',
      error: error.message
    });
  }
};