const express = require('express');
const router = express.Router();
const { validerCommande } = require('../controllers/commandeController');
const auth = require('../middleware/auth');

router.post('/valider', auth, validerCommande);

module.exports = router;