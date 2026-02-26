const Commande = require('../models/Commande');
const Panier = require('../models/Panier');

exports.validerCommande = async (req, res) => {
  try {
    const userId = req.user.userId;

   
    const panier = await Panier.findOne({ acheteurProfile: userId });

    if (!panier || panier.produitsSnapshot.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Panier vide"
      });
    }


    const totalPrix = panier.produitsSnapshot.reduce(
      (acc, item) => acc + item.subtotal,
      0
    );

    const totalQuantite = panier.produitsSnapshot.reduce(
      (acc, item) => acc + item.quantite,
      0
    );

    const nouvelleCommande = new Commande({
      acheteur: userId,                
      panier: panier._id,              
      totalPrix: totalPrix,           
      totalQuantite: totalQuantite,    
      produitsSnapshot: panier.produitsSnapshot
    });

    await nouvelleCommande.save();

    // 4️⃣ Vider le panier
    panier.produitsSnapshot = [];
    await panier.save();

    res.status(201).json({
      success: true,
      message: "Commande enregistrée avec succès",
      data: nouvelleCommande
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error: error.message
    });
  }
};