const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticateToken } = require('../middlewares/authMiddleware');

// Route pour créer une commande
router.post('/', authenticateToken, orderController.createOrder);

// Route pour récupérer les commandes d'un utilisateur
router.get('/:userId', authenticateToken, orderController.getUserOrders);

// Route pour mettre à jour le statut d'une commande
router.put('/:orderId/status', authenticateToken, orderController.updateOrderStatus);

module.exports = router;
