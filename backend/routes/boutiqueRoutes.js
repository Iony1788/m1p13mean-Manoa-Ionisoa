const express = require('express');
const router = express.Router();
const boutiqueController = require('../controllers/boutiqueController');

// GET all boutiques
router.get('/listBoutiques', boutiqueController.getAllBoutiques);

router.get('/listProduitBoutique/:id', boutiqueController.getListProduitWhitBoutique);

module.exports = router;