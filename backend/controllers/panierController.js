import Produit from '../models/Produit.js';
import Panier from '../models/Panier.js';

export const addCartProduit = async (req, res) => {
  try {
    const id_produit = req.params.id;
    const id_user = req.user.userId;
    const { quantite } = req.body;

    const produit = await Produit.findById(id_produit);
    if (!produit) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }

    let panier = await Panier.findOne({ acheteurProfile: id_user });

    const quantityToAdd = quantite || 1;

    if (!panier) {
    
      panier = new Panier({
        acheteurProfile: id_user,
        produitsSnapshot: [{
          produitId: produit._id,
          nom: produit.nom,
          prix: produit.prix,
          image: produit.image || "",
          quantite: quantityToAdd,
          subtotal: quantityToAdd * produit.prix
        }]
      });

    } else {

      const produitExistant = panier.produitsSnapshot.find(
        p => p.produitId.toString() === id_produit.toString()
      );

      if (produitExistant) {
        produitExistant.quantite += quantityToAdd;
        produitExistant.subtotal = produitExistant.quantite * produitExistant.prix;
      } else {
        panier.produitsSnapshot.push({
          produitId: produit._id,
          nom: produit.nom,
          prix: produit.prix,
          image: produit.image || "",
          quantite: quantityToAdd,
          subtotal: quantityToAdd * produit.prix
        });
      }
    }

    await panier.save();

    res.status(200).json({
      success: true,
      message: "Produit ajouté ou mis à jour avec succès",
      data: panier
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