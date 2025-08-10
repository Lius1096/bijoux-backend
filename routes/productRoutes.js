const express = require('express');
const router = express.Router();

// Assurez-vous que le contrôleur est correctement importé
const { createProduct, getAllProducts, getProductDetails } = require('../controllers/productController');

// Définition des routes pour les produits
router.post('/', createProduct); // Cette ligne doit appeler la fonction createProduct
router.get('/', getAllProducts); 
router.get('/:id', getProductDetails);

module.exports = router;
