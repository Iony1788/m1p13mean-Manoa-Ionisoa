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




exports.addProduitImage = async (req, res) => {
    try {
        const { nom, description, prix, quantiteStock, idCategorie, id_boutique } = req.body;
        const image = req.file ? `/uploads/${req.file.filename}` : '';

        const produit = await Produit.create({
            nom,
            description,
            prix,
            quantiteStock,
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




exports.addProduit = async (req, res) => {
    try {
        console.log("NODE ADD PRODUCT", JSON.stringify(req.body));

        const { nom, description, prix, quantiteStock, idCategorie, id_boutique } = req.body;
        let image = '';
        if (req.file) {
            image = `/uploads/${req.file.filename}`;
        }


        // const id_boutique = req.user.id_boutique;

        const nouveauProduit = new Produit({
            nom,
            description,
            prix,
            quantiteStock: quantiteStock || 0,
            idCategorie,
            id_boutique,
            image,
            disponible: true
        });

        await nouveauProduit.save();

        res.status(201).json({
            message: 'Produit ajouté avec succès',
            produit: nouveauProduit
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erreur serveur', error: err.message });
    }
};


exports.getAllCategorie = async (req, res) => {
    try {
        console.log("Récupération des categorie...");

        const categories = await Categorie.find();


        res.status(200).json(categories);
    } catch (err) {
        console.error("Erreur complète :", err);
        res.status(500).json({
            message: "Erreur serveur lors de la récupération des categories",
            error: err.message || err
        });
    }
};

exports.updateProduct = async (req, res) => {
  try {
    console.log("UPDATE PRODUCT BODY", req.body);

    const { _id, ...updates } = req.body;

    if (!_id) {
      return res.status(400).json({ message: "ID requis" });
    }

    // Convert numbers
    if (updates.prix) updates.prix = Number(updates.prix);
    if (updates.quantiteStock) updates.quantiteStock = Number(updates.quantiteStock);

    // Remove invalid idCategorie
    if (updates.idCategorie === "undefined" || !updates.idCategorie) {
      delete updates.idCategorie;
    }

    // Update image if exists
    if (req.file) {
      updates.image = `/uploads/${req.file.filename}`;
    }

    console.log("FINAL UPDATES:", updates);

    const updatedProduit = await Produit.findByIdAndUpdate(
      _id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedProduit) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }

    res.json(updatedProduit);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "ID requis" });
    }

    const deletedProduit = await Produit.findByIdAndDelete(id);

    if (!deletedProduit) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }

    res.json({ message: "Produit supprimé avec succès" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur", error });
  }
};


exports.rechercherProduit = async (req, res) => {
  try {
    const { mot } = req.query; // on récupère le mot clé depuis l'URL, exemple: ?mot=rouge

    if (!mot) {
      return res.status(400).json({
        success: false,
        message: "Mot clé requis pour la recherche"
      });
    }

    // Recherche dans le nom et la description, uniquement les produits disponibles
    const produits = await Produit.find({
      disponible: true,
      $or: [
        { nom: { $regex: mot, $options: "i" } },          // recherche insensible à la casse
        { description: { $regex: mot, $options: "i" } }
      ]
    });

    res.status(200).json({
      success: true,
      totalProduits: produits.length,
      produits
    });

  } catch (error) {
    console.error("Erreur recherche produits :", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la recherche des produits",
      error: error.message
    });
  }
};