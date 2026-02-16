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

