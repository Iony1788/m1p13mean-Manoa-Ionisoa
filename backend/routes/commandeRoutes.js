const express = require('express');
const router = express.Router();
const { validerCommande, getCommandesParBoutique } = require('../controllers/commandeController');
const auth = require('../middleware/auth');

router.post('/valider', auth, validerCommande);

router.get('/boutique/:boutiqueId', auth, getCommandesParBoutique);

module.exports = router;