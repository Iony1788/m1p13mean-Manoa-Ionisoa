import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Boutique from '../models/Boutique.js'; // <-- importer le modèle Boutique

const JWT_SECRET = process.env.JWT_SECRET; 

export const register = async (req, res) => {
  try {
    const { nom, prenom, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) 
      return res.status(400).json({ message: 'Email déjà utilisé' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ nom, prenom, email, password: hashedPassword, role });
    await user.save();

    let boutiqueId = null; 

    
    if (role === 'boutique') {
      const boutique = new Boutique({
        nom: 'Ma boutique',
        userId: user._id
      });

      await boutique.save();

      boutiqueId = boutique._id; 

      console.log("✅ Boutique créée avec ID :", boutiqueId); 
    }

    res.status(201).json({ 
      message: 'Utilisateur créé avec succès', 
      userId: user._id,
      boutiqueId 
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Mot de passe incorrect' });

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({ token, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};


export const logout = async (req, res) => {
  try {
    res.status(200).json({ message: 'Déconnecté avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};