const express = require('express');
const router = express.Router();
const produitController = require('../controllers/produitController');
const upload = require('../config/multerConfig');
const { addProduitImage } = require('../controllers/produitController');


// Routes publiques
router.get('/categorie/:idCategorie', produitController.getListProduitWhitCategorie);
router.get('/listProduitBoutique/:idBoutique', produitController.getListProduitWhitBoutique);
router.get('/', produitController.getAllProduits);
router.get('/:id', produitController.detailProduit);

// Routes protégées
router.delete('/:id/removeCart', produitController.removeCartProduit);
router.put('/:id/updateCart', produitController.updateCartProduit);

// Ajout produit avec image
router.post('/add', upload.single('image'), addProduitImage);

module.exports = router;