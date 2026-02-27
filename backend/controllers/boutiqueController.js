import Boutique from '../models/Boutique.js';
import Produit from '../models/Produit.js';

export const getAllBoutiques = async (req, res) => {
  try {
    const boutiques = await Boutique.find();
    res.status(200).json(boutiques);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur', error: err });
  } 
};

export const getListProduitWhitBoutique = async (req, res) => {
    try {
    const id_boutique = req.params.id;  
    const produits = await Produit.find({ id_boutique:id_boutique})
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

export const updateBoutique = async (req, res) =>  {
  try {
    const userId = req.user.userId; // récupéré via authMiddleware
    const { nom, adresse, description, telephone } = req.body;

    // Trouver la boutique associée à cet utilisateur
    const boutique = await Boutique.findOne({ userId });

    if (!boutique) {
      return res.status(404).json({ success: false, message: "Boutique non trouvée pour cet utilisateur" });
    }

    // Mettre à jour seulement les champs fournis
    if (nom) boutique.nom = nom;
    if (adresse) boutique.adresse = adresse;
    if (description) boutique.description = description;
    if (telephone) boutique.telephone = telephone;

    await boutique.save();

    res.status(200).json({
      success: true,
      message: "Boutique mise à jour avec succès",
      data: boutique
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
  }
};

// Récupérer la boutique de l'utilisateur connecté
export const getBoutiqueConnectee = async (req, res) => {
  try {
    const userId = req.user.userId;

    const boutique = await Boutique.findOne({ userId });

    if (!boutique) {
      return res.status(404).json({ message: 'Boutique non trouvée pour cet utilisateur' });
    }

    res.status(200).json(boutique);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};




