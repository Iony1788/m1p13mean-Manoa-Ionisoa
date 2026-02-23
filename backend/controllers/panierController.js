import Produit from '../models/Produit.js';
import Panier from '../models/Panier.js';

export const addCartProduit = async (req, res) => {
  try {
    const id_produit = req.params.id;
    const id_user = req.user.userId;
    const { quantite } = req.body;

    const produit = await Produit.findById(id_produit);
    if (!produit) return res.status(404).json({ message: "Produit non trouvé" });

    const produitSnapshot = {
      produitId: produit._id,
      nom: produit.nom,
      prix: produit.prix,
      image: produit.image || "",
      quantite: quantite || 1,
      subtotal: (quantite || 1) * produit.prix
    };

    let panier = await Panier.findOne({ acheteurProfile: id_user });

    if (!panier) {
      panier = new Panier({
        acheteurProfile: id_user,
        produitsSnapshot: [produitSnapshot]
      });
    } else {
      panier.produitsSnapshot.push(produitSnapshot);
    }

    await panier.save();

    res.status(200).json({
      success: true,
      message: 'Produit ajouté au panier avec succès',
      data: panier
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: err.message
    });
  }
};


export const getCartProduits = async (req, res) => {
  try {
    const id_user = req.user.userId; 

    const panier = await Panier.findOne({ acheteurProfile: id_user });

    if (!panier) {
      return res.status(404).json({
        success: false,
        message: "Panier introuvable" + id_user,
      });
    }

    const produits = panier.produitsSnapshot || [];

    const totalQuantity = produits.reduce((total, produit) => {
      return total + (produit.quantite || 0);
    }, 0);

    const totalPrice = produits.reduce((total, produit) => {
      return total + ((produit.prix || 0) * (produit.quantite || 0));
    }, 0);

    res.status(200).json({
      success: true,
      message: "Panier récupéré avec succès",
      data: {
        userId: id_user,
        totalItems: produits.length,
        totalQuantity,
        totalPrice,
        produits
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error: err.message
    });
  }
};