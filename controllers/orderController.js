const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// Créer une nouvelle commande
const createOrder = async (req, res) => {
  try {
    const { cart } = req.body;
    const user = req.user;

    // Vérifier que le panier contient des produits
    if (!cart || cart.length === 0) {
      return res.status(400).json({ error: 'Le panier est vide' });
    }

    // Récupérer les produits du panier
    const products = await Product.find({ '_id': { $in: cart } });

    if (products.length !== cart.length) {
      return res.status(400).json({ error: 'Certains produits du panier ne sont pas valides' });
    }

    // Calculer le montant total
    const totalAmount = products.reduce((sum, product) => sum + product.price, 0);

    // Créer une nouvelle commande
    const newOrder = new Order({
      user: user._id,
      products: products.map(product => product._id),
      totalAmount,
      status: 'pending', // Commande en attente avant le paiement
      paymentStatus: 'unpaid', // Statut de paiement non payé
      deliveryAddress: user.address,
    });

    await newOrder.save();

    res.status(201).json(newOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la création de la commande' });
  }
};

// Récupérer toutes les commandes d'un utilisateur
const getUserOrders = async (req, res) => {
  try {
    const user = req.user;
    const orders = await Order.find({ user: user._id }).populate('products');

    if (!orders) {
      return res.status(404).json({ message: 'Aucune commande trouvée pour cet utilisateur' });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération des commandes' });
  }
};

// Récupérer une commande spécifique
const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate('products');

    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération de la commande' });
  }
};

// Mettre à jour le statut de la commande (ex : payé, annulé, etc.)
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, paymentStatus, paymentDetails } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    // Si le statut de paiement est mis à jour, on peut aussi mettre à jour les détails du paiement
    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
      if (paymentDetails) {
        order.paymentDetails = paymentDetails;
      }
    }

    // Mettre à jour le statut de la commande
    if (status) {
      order.status = status;
    }

    await order.save();

    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la commande' });
  }
};

// Supprimer une commande (ex: pour annuler une commande avant paiement)
const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findByIdAndDelete(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    res.status(200).json({ message: 'Commande supprimée avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la suppression de la commande' });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
};
