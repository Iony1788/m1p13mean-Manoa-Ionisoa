const express = require('express');
const router = express.Router();
const upload = require('../config/multerConfig');
const produitController = require('../controllers/produitController');

router.get('/categorie/:idCategorie', produitController.getListProduitWhitCategorie);
router.get('/', produitController.getAllProduits);
router.post('/addProduit', produitController.addProduit);
router.get('/getAllCategorie', produitController.getAllCategorie);
router.post('/updateProduct', upload.single('image'), produitController.updateProduct);
router.delete('/delete/:id',  produitController.deleteProduct);
router.get('/recherche', produitController.rechercherProduit);
//to be the latest get
router.get('/:id', produitController.detailProduit);


// Routes protégées

router.delete('/:id/removeCart', produitController.removeCartProduit);
router.put('/:id/updateCart', produitController.updateCartProduit);


// Ajout produit avec image
router.post('/addProduitImage', upload.single('image'), produitController.addProduitImage);


module.exports = router;