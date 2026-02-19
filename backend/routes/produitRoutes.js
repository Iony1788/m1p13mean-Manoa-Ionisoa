const express = require('express');
const router = express.Router();
const produitController = require('../controllers/produitController');
const parser = require('../config/cloudinaryConfig').parser;


router.get('/categorie/:idCategorie', produitController.getListProduitWhitCategorie);


router.get('/', produitController.getAllProduits);
router.get('/:id', produitController.detailProduit);


router.post('/:id/addCart', produitController.addCartProduit);
router.delete('/:id/removeCart', produitController.removeCartProduit);
router.put('/:id/updateCart', produitController.updateCartProduit);


router.post('/add', parser.single('image'), produitController.addProduit);

router.get('/listProduitBoutique/:idBoutique', produitController.getListProduitWhitBoutique);


module.exports = router;
