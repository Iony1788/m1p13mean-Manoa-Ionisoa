const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const produitRoutes = require('./routes/produitRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: '*',
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

if (!process.env.MONGO_URI) {
  console.error("MONGO_URI non défini !");
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connecté avec succès"))
.catch(err => {
  console.error("Erreur de connexion MongoDB :", err);
  process.exit(1);
});

app.get('/', (req, res) => {
  res.send('Backend fonctionne et MongoDB est connecté !');
});

app.use('/api/produits', produitRoutes);

app.use((err, req, res, next) => {
  console.error("Erreur globale :", err);
  res.status(500).json({ message: "Erreur serveur", error: err.message || err });
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
