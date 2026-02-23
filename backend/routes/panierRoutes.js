const express = require('express');
const router = express.Router();
const panierController = require('../controllers/panierController');
const auth = require('../middleware/auth');
const verifyToken = require('../middleware/auth');

// Routes protégées
router.post('/:id/addCart', verifyToken, panierController.addCartProduit);
router.get('/listePanier',auth, panierController.getCartProduits);

module.exports = router;

