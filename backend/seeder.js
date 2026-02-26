// seeder.js
const mongoose = require('mongoose');
require('dotenv').config();
const bcrypt = require('bcrypt');

const User = require('./models/User');
const Categorie = require('./models/Categorie');
const Produit = require('./models/Produit');
const Boutique = require('./models/Boutique');
const Lot = require('./models/Lot');
const Panier = require('./models/Panier');

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connecté pour le seeding'))
  .catch(err => console.error('Erreur MongoDB :', err));

const seeder = async () => {
  try {
    // ------------------ Nettoyage ------------------
    await User.deleteMany();
    await Categorie.deleteMany();
    await Produit.deleteMany();
    await Boutique.deleteMany();
    await Panier.deleteMany();
    await Lot.deleteMany();

    // ------------------ Boutiques ------------------
    const boutiques = await Boutique.insertMany([
      { 
        nom: "Aigle d'Or", 
        adresse: "2ème étage - La City Ivandry, Antananarivo", 
        description: "Mode homme et femme tendance", 
        telephone: "0341234567" 
      },
      { 
        nom: "SphoElle", 
        adresse: "1er étage - La City Ivandry, Antananarivo", 
        description: "High-tech et accessoires modernes", 
        telephone: "0339876543" 
      }
    ]);

    // ------------------ Catégories ------------------
    const categories = await Categorie.insertMany([
      { nom: 'T-shirts', description: 'T-shirts homme et femme', idProposeParBoutique: boutiques[0]._id },
      { nom: 'Pantalons', description: 'Jeans et pantalons', idProposeParBoutique: boutiques[0]._id },
      { nom: 'Robes', description: 'Robes modernes', idProposeParBoutique: boutiques[0]._id },
      { nom: 'Smartphones', description: 'Téléphones intelligents', idProposeParBoutique: boutiques[1]._id },
      { nom: 'Ordinateurs', description: 'PC portables et desktops', idProposeParBoutique: boutiques[1]._id },
      { nom: 'Accessoires', description: 'Casques, souris, chargeurs', idProposeParBoutique: boutiques[1]._id }
    ]);

    // ------------------ Utilisateurs ------------------
    const hashedPassword = await bcrypt.hash('123456', 10);

    await User.insertMany([
      { nom: 'Ionisoa', prenom: 'Raya', email: 'raya@example.com', password: hashedPassword, role: 'acheteur' },
      { nom: 'John', prenom: 'Doe', email: 'john@example.com', password: hashedPassword, role: 'acheteur' },
      { nom: 'Alice', prenom: 'BoutiqueAdmin', email: 'alice@boutique.com', password: hashedPassword, role: 'boutique' },
      { nom: 'Bob', prenom: 'BoutiqueUser', email: 'bob@boutique.com', password: hashedPassword, role: 'boutique' },
      { nom: 'Admin', prenom: 'System', email: 'admin@example.com', password: hashedPassword, role: 'admin' }
    ]);

    // ------------------ Lots ------------------
    await Lot.insertMany([
      { nom_lot: 'Lot A1', superficie: 50, prix_location: 800000, niveau: 'Rez-de-chaussée', etape: 'libre', description: 'Lot proche entrée principale', id_boutique: boutiques[0]._id },
      { nom_lot: 'Lot B1', superficie: 60, prix_location: 950000, niveau: '1er étage', etape: 'libre', description: 'Lot avec grande vitrine', id_boutique: boutiques[1]._id }
    ]);

    // ------------------ Produits (ARIARY) ------------------
    await Produit.insertMany([

      // Aigle d'Or - Produits avec images fixes
      { nom: 'Rouge à lèvres Glosse', description: 'Rouge à lèvres glamour', prix: 35000, id_boutique: boutiques[0]._id, idCategorie: categories[5]._id, quantiteStock: 100, image: '/uploads/glosse.jpg' },
      { nom: 'T-shirt noir', description: 'T-shirt noir élégant', prix: 45000, id_boutique: boutiques[0]._id, idCategorie: categories[0]._id, quantiteStock: 80, image: '/uploads/tshirt-noir.jpg' },
      { nom: 'Rouge à lèvres Maquillage', description: 'Rouge à lèvres longue tenue', prix: 120000, id_boutique: boutiques[0]._id, idCategorie: categories[5]._id, quantiteStock: 60, image: '/uploads/maquillage.jpg' },
      { nom: 'Rouge à lèvres RougeLevre', description: 'Rouge à lèvres vibrant', prix: 150000, id_boutique: boutiques[0]._id, idCategorie: categories[5]._id, quantiteStock: 40, image: '/uploads/rougeLevre.jpg' },

      // SphoElle - High tech
      { nom: 'iPhone 13', description: 'Apple iPhone 13', prix: 4200000, id_boutique: boutiques[1]._id, idCategorie: categories[3]._id, quantiteStock: 20, image: '/uploads/iphone13.jpg' },
      { nom: 'Samsung Galaxy S22', description: 'Samsung haut de gamme', prix: 3900000, id_boutique: boutiques[1]._id, idCategorie: categories[3]._id, quantiteStock: 25, image: '/uploads/galaxy-s22.jpg' },
      { nom: 'Laptop HP', description: 'Ordinateur portable HP', prix: 6500000, id_boutique: boutiques[1]._id, idCategorie: categories[4]._id, quantiteStock: 15, image: '/uploads/laptop-hp.jpg' },
      { nom: 'Casque Bluetooth JBL', description: 'Casque sans fil', prix: 250000, id_boutique: boutiques[1]._id, idCategorie: categories[5]._id, quantiteStock: 50, image: '/uploads/vichy.jpg' },
      { nom: 'Caméra HD', description: 'Caméra HD pour vidéos et photos', prix: 120000, id_boutique: boutiques[1]._id, idCategorie: categories[5]._id, quantiteStock: 70, image: '/uploads/camera.jpg' }

    ]);

    console.log('Seeding terminé avec succès 🇲🇬');
    mongoose.connection.close();

  } catch (err) {
    console.error('Erreur lors du seeding :', err.message);
    mongoose.connection.close();
  }
};

seeder();