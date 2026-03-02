import Lot from '../models/Lot.js'; 
import User from '../models/User.js'; 
import Location from '../models/Location.js';

export const getAllLots = async (req, res) => {
  try {
    const lots = await Lot.find();
    res.status(200).json(lots);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur', error: err });
  } 
};


export const getAllLotsStats = async (req, res) => {
      try {

    const stats = await Lot.aggregate([
      {
        $group: {
          _id: "$etape",
          count: { $sum: 1 }
        }
      }
    ]);

    const result = {
      total: await Lot.countDocuments(),
      libres: 0,
      reserves: 0,
      occupes: 0
    };

    stats.forEach(item => {
      if (item._id === 'libre') result.libres = item.count;
      if (item._id === 'réservé') result.reserves = item.count;
      if (item._id === 'occupé') result.occupes = item.count;
    });

    res.json(result);

  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

 export const getClientStats = async (req, res) => {
  try {
    const total = await User.countDocuments({ role: 'acheteur' });

    res.json({ total });
  } catch (error) {
    console.error('Erreur getClientStats:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};




// Ajouter un lot
export const ajouterLot = async (req, res) => {
  try {
    const { nom_lot, superficie, prix_location, niveau, etape, description, id_boutique } = req.body;

    const nouveauLot = new Lot({
      nom_lot,
      superficie,
      prix_location,
      niveau,
      etape,
      description,
      id_boutique
    });

    const savedLot = await nouveauLot.save();
    res.status(201).json(savedLot);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de l\'ajout du lot', error });
  }
};

// Modifier un lot
export const modifierLot = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body; // les champs à modifier

    const lotModifie = await Lot.findByIdAndUpdate(id, updates, { new: true });
    if (!lotModifie) {
      return res.status(404).json({ message: 'Lot non trouvé' });
    }

    res.status(200).json(lotModifie);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la modification du lot', error });
  }
};

// Supprimer un lot
export const supprimerLot = async (req, res) => {
  try {
    const { id } = req.params;

    const lotSupprime = await Lot.findByIdAndDelete(id);
    if (!lotSupprime) {
      return res.status(404).json({ message: 'Lot non trouvé' });
    }

    res.status(200).json({ message: 'Lot supprimé avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la suppression du lot', error });
  }
};



export const louerLot = async (req, res) => {
  try {
    const { idLot, idBoutique } = req.body;

    if (!idLot || !idBoutique) {
      return res.status(400).json({ message: "idLot et idBoutique sont requis" });
    }

    const lot = await Lot.findById(idLot);
    if (!lot) return res.status(404).json({ message: "Lot introuvable" });
    if (lot.statut !== 'libre') return res.status(400).json({ message: "Lot déjà occupé" });

    const location = await Location.create({
      idLot,
      idBoutique,
      montant: lot.prix_location
    });
    console.log('Reçu body:', req.body);

    lot.statut = 'occupe';
    await lot.save();

    res.status(201).json({ message: "Lot loué avec succès", location });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};