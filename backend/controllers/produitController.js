const Produit = require('../models/Produit');
const Boutique = require('../models/Boutique');
const Categorie = require('../models/Categorie');
const Panier = require('../models/Panier');

exports.getAllProduits = async (req, res) => {
  try {
    console.log("Récupération des produits...");

    const produits = await Produit.find();
    console.log("Produits bruts :", produits);

    const produitsPop = await Produit.find()
      .populate('id_boutique', 'nom adresse')
      .populate('idCategorie', 'nom description');
    
    console.log("Produits peuplés :", produitsPop);

    if (!produitsPop || produitsPop.length === 0) {
      return res.status(404).json({ message: "Aucun produit trouvé" });
    }

    res.status(200).json(produitsPop);
  } catch (err) {
    console.error("Erreur complète :", err);
    res.status(500).json({
      message: "Erreur serveur lors de la récupération des produits",
      error: err.message || err
    });
  }
};


exports.detailProduit = async (req, res) => {
  try {
    const produit = await Produit.findById(req.params.id)
      .populate('id_boutique', 'nom adresse')
      .populate('idCategorie', 'nom description');  
    if (!produit) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }
    res.status(200).json(produit);
  }
    catch (err) { 
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur', error: err });
  }
};


exports.removeCartProduit = async (req, res) => {
  try {
    const { id_user, id_produit } = req.body;
    res.json({ message: 'Produit retiré du panier avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur', error: err });
  } 
};

exports.updateCartProduit = async (req, res) => { 
  try {
    const id_produit = req.params.id;  
    const { id_user, quantite } = req.body; 
    res.json({ 
      message: 'Quantité du produit mise à jour dans le panier avec succès',
      id_produit,
      id_user,
      quantite
    });
  } catch (err) {   
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur', error: err });
  } 
};


exports.getListProduitWhitCategorie = async (req, res) => {
  try {
    const produits = await Produit.find({ idCategorie: req.params.idCategorie })
      .populate('id_boutique', 'nom adresse')
      .populate('idCategorie', 'nom description');    
    if (!produits || produits.length === 0) {
      return res.status(404).json({ message: "Aucun produit trouvé pour cette catégorie" });
    }
    res.status(200).json(produits);
  } catch (err) { 
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur', error: err });
  }
};


exports.getListProduitWhitBoutique = async (req, res) => {
  try {
    const produits = await Produit.find({ id_boutique: req.params.idBoutique })
      .populate('id_boutique', 'nom adresse')
      .populate('idCategorie', 'nom description');  
    if (!produits || produits.length === 0) {
      return res.status(404).json({ message: "Aucun produit trouvé pour cette boutique" });
    }
    res.status(200).json(produits);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur', error: err });
  }
};


//image multer
exports.addProduitImage = async (req, res) => {
  try {
    const { nom, description, prix, idCategorie, id_boutique } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : '';

    const produit = await Produit.create({
      nom,
      description,
      prix,
      idCategorie,
      id_boutique,
      image
    });

    res.status(201).json(produit);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur', error: err });
  }
};

// Récupérer tous les produits triés par note moyenne (du plus élevé au plus bas)
exports.getProduitsTriesParNote = async (req, res) => {
  try {
    console.log("Récupération des produits triés par note moyenne...");

    // Récupérer tous les produits avec leurs informations de base
    const produits = await Produit.find()
      .populate('id_boutique', 'nom adresse')
      .populate('idCategorie', 'nom description');
    
    if (!produits || produits.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: "Aucun produit trouvé" 
      });
    }

    // Pour chaque produit, calculer sa note moyenne à partir des avis
    const produitsAvecNotes = await Promise.all(
      produits.map(async (produit) => {
        // Importer le modèle Avis (à faire en haut du fichier)
        const Avis = require('../models/Avis');
        
        // Calculer la note moyenne du produit
        const productRating = await Avis.calculateProductAverageRating(produit._id);
        
        // Convertir le produit en objet pour pouvoir ajouter des propriétés
        const produitObj = produit.toObject();
        
        // Ajouter les informations de note
        produitObj.noteMoyenne = productRating.averageNote;
        produitObj.nombreAvis = productRating.totalAvis;
        
        return produitObj;
      })
    );

    // Trier les produits par note moyenne décroissante
    // Les produits sans note (noteMoyenne = 0) seront placés à la fin
    const produitsTries = produitsAvecNotes.sort((a, b) => {
      // Priorité aux produits avec des notes
      if (a.noteMoyenne === 0 && b.noteMoyenne > 0) return 1;
      if (b.noteMoyenne === 0 && a.noteMoyenne > 0) return -1;
      // Sinon tri par note décroissante
      return b.noteMoyenne - a.noteMoyenne;
    });

    res.status(200).json({
      success: true,
      count: produitsTries.length,
      data: produitsTries
    });

  } catch (error) {
    console.error("Erreur lors du tri des produits par note:", error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des produits triés',
      error: error.message
    });
  }
};