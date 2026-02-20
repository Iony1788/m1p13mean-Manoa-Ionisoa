exports.getCartProduits = async (req, res) => {
  try {
    const { id_user } = req.params;

    const panier = await Panier.findOne({ acheteurProfile: id_user });

    if (!panier) {
      return res.status(404).json({
        success: false,
        message: "Panier introuvable"
      });
    }

    const produits = panier.produitsSnapshot || [];

    // 🔢 Quantité totale réelle
    const totalQuantity = produits.reduce((total, produit) => {
      return total + (produit.quantite || 0);
    }, 0);

    // 💰 Prix total
    const totalPrice = produits.reduce((total, produit) => {
      return total + ((produit.prix || 0) * (produit.quantite || 0));
    }, 0);

    res.status(200).json({
      success: true,
      message: "Panier récupéré avec succès",
      data: {
        userId: id_user,
        totalItems: produits.length, // nombre de produits différents
        totalQuantity,              // quantité totale
        totalPrice,                 // prix total
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
