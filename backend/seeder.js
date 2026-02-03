const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Categorie = require('./models/Categorie');
const Produit = require('./models/Produit');
const BoutiqueUser = require('./models/BoutiqueUser');
const Boutique = require('./models/Boutique');

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connecté pour le seeding'))
  .catch(err => console.error('Erreur MongoDB :', err));

const seeder = async () => {
  try {
    await User.deleteMany();
    await Categorie.deleteMany();
    await Produit.deleteMany();
    await BoutiqueUser.deleteMany();
    await Boutique.deleteMany();

    const users = await User.insertMany([
      { nom: 'Ionisoa', prenom: 'Raya', email: 'ionisoa@example.com', password: '123456', role: 2 },
      { nom: 'Alex', prenom: 'Smith', email: 'alex@example.com', password: '123456', role: 2 },
      { nom: 'Maria', prenom: 'Lopez', email: 'maria@example.com', password: '123456', role: 1 },
      { nom: 'Admin', prenom: 'Centre', email: 'admin@example.com', password: 'admin123', role: 0 }
    ]);

    const boutiques = await Boutique.insertMany([
      { nom: 'Boutique Vetements', adresse: 'Ankorondrano', description: 'Vêtements homme et femme', telephone: '21234567' },
      { nom: 'Boutique Tech', adresse: 'Ankorondrano', description: 'Électronique et accessoires', telephone: '21234568' }
    ]);

    const categories = await Categorie.insertMany([
      { nom: 'T-shirts', description: 'T-shirts homme et femme', idProposeParBoutique: boutiques[0]._id },
      { nom: 'Pantalons', description: 'Jeans et pantalons', idProposeParBoutique: boutiques[0]._id },
      { nom: 'Robes', description: 'Robes modernes', idProposeParBoutique: boutiques[0]._id },
      { nom: 'Smartphones', description: 'Téléphones intelligents', idProposeParBoutique: boutiques[1]._id },
      { nom: 'Ordinateurs', description: 'PC portables et desktops', idProposeParBoutique: boutiques[1]._id },
      { nom: 'Accessoires', description: 'Casques, souris, chargeurs', idProposeParBoutique: boutiques[1]._id }
    ]);

    await Produit.insertMany([
      { nom: 'T-shirt blanc', description: 'T-shirt coton blanc', prix: 15, id_boutique: boutiques[0]._id, idCategorie: categories[0]._id, quantiteStock: 100 },
      { nom: 'T-shirt noir', description: 'T-shirt noir élégant', prix: 18, id_boutique: boutiques[0]._id, idCategorie: categories[0]._id, quantiteStock: 80 },
      { nom: 'Jean slim', description: 'Jean bleu slim', prix: 35, id_boutique: boutiques[0]._id, idCategorie: categories[1]._id, quantiteStock: 60 },
      { nom: 'Robe rouge', description: 'Robe élégante rouge', prix: 45, id_boutique: boutiques[0]._id, idCategorie: categories[2]._id, quantiteStock: 40 },
      { nom: 'iPhone 13', description: 'Apple iPhone 13', prix: 900, id_boutique: boutiques[1]._id, idCategorie: categories[3]._id, quantiteStock: 20 },
      { nom: 'Samsung Galaxy S22', description: 'Samsung haut de gamme', prix: 850, id_boutique: boutiques[1]._id, idCategorie: categories[3]._id, quantiteStock: 25 },
      { nom: 'Laptop HP', description: 'Ordinateur portable HP', prix: 1200, id_boutique: boutiques[1]._id, idCategorie: categories[4]._id, quantiteStock: 15 },
      { nom: 'Casque Bluetooth', description: 'Casque sans fil', prix: 80, id_boutique: boutiques[1]._id, idCategorie: categories[5]._id, quantiteStock: 50 },
      { nom: 'Souris gaming', description: 'Souris RGB gaming', prix: 45, id_boutique: boutiques[1]._id, idCategorie: categories[5]._id, quantiteStock: 70 }
    ]);

    await BoutiqueUser.insertMany([
      { id_user: users[2]._id, id_boutique: boutiques[0]._id, roleDansBoutique: 1 },
      { id_user: users[2]._id, id_boutique: boutiques[1]._id, roleDansBoutique: 1 },
      { id_user: users[3]._id, id_boutique: boutiques[0]._id, roleDansBoutique: 2 }
    ]);

    console.log('Seeding terminé avec succès !');
    mongoose.connection.close();
  } catch (err) {
    console.error('Erreur lors du seeding :', err.message);
  }
};

seeder();
