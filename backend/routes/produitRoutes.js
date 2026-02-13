const express = require('express');
const router = express.Router();
const produitController = require('../controllers/produitController');
const parser = require('../config/cloudinaryConfig').parser;

router.get('/', produitController.getAllProduits);

router.post('/add', parser.single('image'), produitController.addProduit);

module.exports = router;
