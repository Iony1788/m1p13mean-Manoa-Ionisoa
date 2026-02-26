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




