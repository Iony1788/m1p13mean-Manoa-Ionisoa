const express = require('express');
const router = express.Router();
const boutiqueController = require('../controllers/boutiqueController');
const auth = require('../middleware/auth');

// GET all boutiques
router.get('/listBoutiques', boutiqueController.getAllBoutiques);

router.get('/listProduitBoutique/:id', boutiqueController.getListProduitWhitBoutique);

router.put('/update', auth, boutiqueController.updateBoutique);

router.get('/me', auth, boutiqueController.getBoutiqueConnectee);

module.exports = router;