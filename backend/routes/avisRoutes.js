const express = require('express');
const router = express.Router();
const avisController = require('../controllers/avisController');
const auth = require('../middleware/auth');

router.post(
  '/boutique/:boutiqueId',
  auth,
  avisController.createBoutiqueAvis
);

router.post(
  '/produit/:produitId',
  auth,
  avisController.createProductAvis
);

router.get(
  '/produit/:produitId/notes',
  avisController.getProductRating
);

router.get(
  '/boutique/:boutiqueId/notes',
  avisController.getBoutiqueRating
);

router.put(
  '/:avisId',
  auth,
  avisController.updateAvis
);

router.get(
  '/produit/:produitId',
  avisController.getProductAvis
);

router.get(
  '/check/produit/:produitId', 
  auth, 
  avisController.checkUserProductAvis
);

router.get(
  '/check/boutique/:boutiqueId', 
  auth, 
  avisController.checkUserBoutiqueAvis
);

module.exports = router;
