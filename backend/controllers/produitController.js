const Produit = require('../models/Produit');
const Boutique = require('../models/Boutique');
const Categorie = require('../models/Categorie');

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



exports.addProduit = async (req, res) => {
  try {
    const { nom, description, prix, id_boutique, idCategorie, quantiteStock, disponible } = req.body;
    const imageUrl = req.file ? req.file.path : '';

    const produit = new Produit({
      nom,
      description,
      prix,
      image: imageUrl,       
      id_boutique,
      idCategorie,
      quantiteStock: quantiteStock || 0,
      disponible: disponible || true,
    });

    await produit.save();
    res.json({ message: 'Produit ajouté avec succès', produit });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur', error: err });
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


exports.addCartProduit = async (req, res) => {
  try {
    const id_produit = req.params.id;   
    const { id_user, quantite } = req.body;

    res.json({
      message: 'Produit ajouté au panier avec succès',
      id_produit,
      id_user,
      quantite
    });

  } catch (err) {
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
