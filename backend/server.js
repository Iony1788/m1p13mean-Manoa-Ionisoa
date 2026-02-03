const produitRoutes = require('./routes/produitRoutes'); 

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connexion à MongoDB 
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connecté avec succès "))
  .catch(err => console.error("Erreur de connexion MongoDB :", err));

// Route de test
app.get('/', (req, res) => {
  res.send('Backend fonctionne et MongoDB est connecté !');
});


app.use('/api/produits', produitRoutes);

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
