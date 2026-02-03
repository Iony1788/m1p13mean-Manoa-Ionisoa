const Produit = require('../models/Produit');
const Boutique = require('../models/Boutique');
const Categorie = require('../models/Categorie');

exports.getAllProduits = async (req, res) => {
  try {
    const produits = await Produit.find()
      .populate('id_boutique', 'nom adresse')
      .populate('idCategorie', 'nom description');

    if (!produits || produits.length === 0) {
      return res.status(404).json({ message: "Aucun produit trouvé" });
    }

    res.status(200).json(produits);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des produits" });
  }
};
