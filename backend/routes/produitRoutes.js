const express = require('express');
const router = express.Router();
const produitController = require('../controllers/produitController');
const upload = require('../config/multerConfig');
const { addProduit } = require('../controllers/produitController');


router.get('/categorie/:idCategorie', produitController.getListProduitWhitCategorie);


router.get('/', produitController.getAllProduits);
router.get('/:id', produitController.detailProduit);


router.post('/:id/addCart', produitController.addCartProduit);
router.delete('/:id/removeCart', produitController.removeCartProduit);
router.put('/:id/updateCart', produitController.updateCartProduit);


router.post('/add', upload.single('image'), addProduit);

router.get('/listProduitBoutique/:idBoutique', produitController.getListProduitWhitBoutique);


module.exports = router;
