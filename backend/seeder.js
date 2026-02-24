// seeder.js
const mongoose = require('mongoose');
require('dotenv').config();
const bcrypt = require('bcrypt');

const User = require('./models/User');
const Categorie = require('./models/Categorie');
const Produit = require('./models/Produit');
const Boutique = require('./models/Boutique');
const Lot = require('./models/lot');

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connecté pour le seeding'))
  .catch(err => console.error('Erreur MongoDB :', err));

const seeder = async () => {
  try {
    // ------------------ Vider les collections ------------------
    await User.deleteMany();
    await Categorie.deleteMany();
    await Produit.deleteMany();
    await Boutique.deleteMany();
    await Lot.deleteMany();

    // ------------------ Créer les boutiques ------------------
    const boutiques = await Boutique.insertMany([
      { nom: 'Boutique Vetements', adresse: 'Ankorondrano', description: 'Vêtements homme et femme', telephone: '21234567' },
      { nom: 'Boutique Tech', adresse: 'Ankorondrano', description: 'Électronique et accessoires', telephone: '21234568' }
    ]);

 

    // ------------------ Créer les catégories ------------------
    const categories = await Categorie.insertMany([
      { nom: 'T-shirts', description: 'T-shirts homme et femme', idProposeParBoutique: boutiques[0]._id },
      { nom: 'Pantalons', description: 'Jeans et pantalons', idProposeParBoutique: boutiques[0]._id },
      { nom: 'Robes', description: 'Robes modernes', idProposeParBoutique: boutiques[0]._id },
      { nom: 'Smartphones', description: 'Téléphones intelligents', idProposeParBoutique: boutiques[1]._id },
      { nom: 'Ordinateurs', description: 'PC portables et desktops', idProposeParBoutique: boutiques[1]._id },
      { nom: 'Accessoires', description: 'Casques, souris, chargeurs', idProposeParBoutique: boutiques[1]._id }
    ]);

    // ------------------ Créer les utilisateurs ------------------
    const hashedPassword = await bcrypt.hash('123456', 10); // mot de passe commun pour le seeding
    const users = await User.insertMany([
      { nom: 'Ionisoa', prenom: 'Raya', email: 'raya@example.com', password: hashedPassword, role: 'acheteur' },
      { nom: 'John', prenom: 'Doe', email: 'john@example.com', password: hashedPassword, role: 'acheteur' },
      { nom: 'BoutiqueAdmin', prenom: 'Alice', email: 'alice@boutique.com', password: hashedPassword, role: 'boutique' },
      { nom: 'BoutiqueUser', prenom: 'Bob', email: 'bob@boutique.com', password: hashedPassword, role: 'boutique' },
      // Ajouter un utilisateur admin
      { nom: 'Admin',prenom: 'System',email: 'admin@example.com',password: hashedPassword,role: 'admin'}
    ]);

    // ------------------ Lots ------------------
        const lots = await Lot.insertMany([
      { nom_lot: 'Lot A1', superficie: 50, prix_location: 500, niveau: 'Rez-de-chaussée', etape: 'libre', description: 'Lot proche entrée principale', id_boutique: boutiques[0]._id },
      { nom_lot: 'Lot A2', superficie: 40, prix_location: 400, niveau: 'Rez-de-chaussée', etape: 'occupé', description: 'Lot côté gauche', id_boutique: boutiques[0]._id },
      { nom_lot: 'Lot B1', superficie: 60, prix_location: 600, niveau: '1er étage', etape: 'libre', description: 'Lot avec grande vitrine', id_boutique: boutiques[0]._id },
      { nom_lot: 'Lot B2', superficie: 55, prix_location: 550, niveau: '1er étage', etape: 'réservé', description: 'Lot côté escalier', id_boutique: boutiques[0]._id },
      { nom_lot: 'Lot C1', superficie: 70, prix_location: 700, niveau: '2ème étage', etape: 'libre', description: 'Lot central', id_boutique: boutiques[1]._id },
      { nom_lot: 'Lot C2', superficie: 65, prix_location: 650, niveau: '2ème étage', etape: 'occupé', description: 'Lot près des toilettes', id_boutique: boutiques[1]._id },
      { nom_lot: 'Lot D1', superficie: 80, prix_location: 800, niveau: '3ème étage', etape: 'libre', description: 'Lot avec balcon', id_boutique: boutiques[1]._id },
      { nom_lot: 'Lot D2', superficie: 75, prix_location: 750, niveau: '3ème étage', etape: 'réservé', description: 'Lot côté gauche', id_boutique: boutiques[1]._id }
    ]);
    

    // ------------------ Créer les produits ------------------
    await Produit.insertMany([
      { nom: 'T-shirt blanc', description: 'T-shirt coton blanc', prix: 15, id_boutique: boutiques[0]._id, idCategorie: categories[0]._id, quantiteStock: 100, image: '/uploads/glosse.jpg' },
      { nom: 'T-shirt noir', description: 'T-shirt noir élégant', prix: 18, id_boutique: boutiques[0]._id, idCategorie: categories[0]._id, quantiteStock: 80, image: '/uploads/tshirt-noir.jpg' },
      { nom: 'Jean slim', description: 'Jean bleu slim', prix: 35, id_boutique: boutiques[0]._id, idCategorie: categories[1]._id, quantiteStock: 60, image: '/uploads/maquillage.jpg' },
      { nom: 'Robe rouge', description: 'Robe élégante rouge', prix: 45, id_boutique: boutiques[0]._id, idCategorie: categories[2]._id, quantiteStock: 40, image: '/uploads/rougeLevre.jpg' },
      { nom: 'iPhone 13', description: 'Apple iPhone 13', prix: 900, id_boutique: boutiques[1]._id, idCategorie: categories[3]._id, quantiteStock: 20, image: '/uploads/iphone13.jpg' },
      { nom: 'Samsung Galaxy S22', description: 'Samsung haut de gamme', prix: 850, id_boutique: boutiques[1]._id, idCategorie: categories[3]._id, quantiteStock: 25, image: '/uploads/galaxy-s22.jpg' },
      { nom: 'Laptop HP', description: 'Ordinateur portable HP', prix: 1200, id_boutique: boutiques[1]._id, idCategorie: categories[4]._id, quantiteStock: 15, image: '/uploads/laptop-hp.jpg' },
      { nom: 'Casque Bluetooth', description: 'Casque sans fil', prix: 80, id_boutique: boutiques[1]._id, idCategorie: categories[5]._id, quantiteStock: 50, image: '/uploads/vichy.jpg' },
      { nom: 'Souris gaming', description: 'Souris RGB gaming', prix: 45, id_boutique: boutiques[1]._id, idCategorie: categories[5]._id, quantiteStock: 70, image: '/uploads/camera.jpg' }
    ]);

    console.log('Seeding terminé avec succès !');
    mongoose.connection.close();

  } catch (err) {
    console.error('Erreur lors du seeding :', err.message);
    mongoose.connection.close();
  }
};
seeder();
