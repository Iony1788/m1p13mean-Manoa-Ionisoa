const express = require('express');
const router = express.Router();
const lotController = require('../controllers/lotController');

router.get('/listlot', lotController.getAllLots);

router.get('/stats', lotController.getAllLotsStats);

router.get('/stats/client', lotController.getClientStats);
module.exports = router;

