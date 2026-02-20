const express = require('express');
const router = express.Router();
const panierController = require('../controllers/panier.controller');


router.get('/panier/:id', panierController.getCartProduits);

module.exports = router;
