import Lot from '../models/Lot.js'; 
import User from '../models/User.js'; 

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


