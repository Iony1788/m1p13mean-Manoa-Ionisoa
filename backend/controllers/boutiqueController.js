import Boutique from '../models/Boutique.js';

export const getAllBoutiques = async (req, res) => {
  try {
    const boutiques = await Boutique.find();
    res.status(200).json(boutiques);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur', error: err });
  } 
};




