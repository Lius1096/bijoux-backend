const express = require('express');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} = require('../controllers/cartController');
const { authenticateToken } = require('../middlewares/authMiddleware'); // Import du middleware d'authentification

const router = express.Router();

// Route pour obtenir le panier de l'utilisateur
router.get('/', authenticateToken, getCart);

// Route pour ajouter un produit au panier
router.post('/', authenticateToken, addToCart);

// Route pour mettre à jour un produit du panier (quantité)
router.put('/:id', authenticateToken, updateCartItem);

// Route pour supprimer un produit du panier
router.delete('/:id', authenticateToken, removeFromCart);

// Route pour vider tout le panier
router.delete('/', authenticateToken, clearCart);

module.exports = router;
