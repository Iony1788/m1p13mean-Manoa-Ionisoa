const express = require('express');
const router = express.Router();
const upload = require('../config/multerConfig');
const produitController = require('../controllers/produitController');

router.get('/categorie/:idCategorie', produitController.getListProduitWhitCategorie);
router.get('/', produitController.getAllProduits);
router.get('/:id', produitController.detailProduit);

// Routes protégées
router.delete('/:id/removeCart', produitController.removeCartProduit);
router.put('/:id/updateCart', produitController.updateCartProduit);

// Ajout produit avec image
router.post('/add', upload.single('image'), produitController.addProduitImage);

module.exports = router;