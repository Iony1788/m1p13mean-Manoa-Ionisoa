const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const produitRoutes = require('./routes/produitRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ------------------ MIDDLEWARES ------------------
// CORS
app.use(cors({
  origin: '*', // Pour tester, sinon mettre l'URL du frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parser JSON
app.use(express.json());

// Logger simple pour chaque requête
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Servir les fichiers statiques (images, uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ------------------ VERIFICATION ENV ------------------
if (!process.env.MONGO_URI) {
  console.error("MONGO_URI non défini !");
  process.exit(1);
}

// ------------------ CONNEXION MONGODB ------------------
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connecté avec succès !"))
  .catch(err => {
    console.error("Erreur de connexion MongoDB :", err);
    process.exit(1);
  });

// ------------------ ROUTES ------------------
// Route test simple
app.get('/', (req, res) => {
  res.send('Backend fonctionne et MongoDB est connecté !');
});

// Routes produits
app.use('/api/produits', produitRoutes);

// ------------------ GESTION GLOBALE DES ERREURS ------------------
app.use((err, req, res, next) => {
  console.error("Erreur globale :", err);
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({ message: "Erreur serveur", error: err.message || err });
});

const authRoutes = require('./routes/auth'); 
app.use('/api/auth', authRoutes);

// ------------------ DEMARRAGE SERVEUR ------------------
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
