const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { verifyCaptcha } = require('../utils/recaptcha'); // à adapter selon ton projet

// Ajouter un produit au panier (déjà donné)
const addToCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId, quantity, captchaToken } = req.body;

    if (!await verifyCaptcha(captchaToken)) {
      return res.status(400).json({ message: 'reCAPTCHA invalide' });
    }

    if (!productId || !quantity || quantity < 1) {
      return res.status(400).json({ message: 'productId et quantity valides sont requis' });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Produit non trouvé' });
    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Quantité demandée supérieure au stock disponible' });
    }

    let cart = await Cart.findOne({ userId, status: 'active' });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(item => item.productId.equals(productId));
    if (itemIndex > -1) {
      const newQty = cart.items[itemIndex].quantity + quantity;
      if (newQty > product.stock) {
        return res.status(400).json({ message: 'Quantité totale dépasse le stock disponible' });
      }
      cart.items[itemIndex].quantity = newQty;
      cart.items[itemIndex].priceAtAdd = product.price;
      cart.items[itemIndex].updatedAt = new Date();
    } else {
      cart.items.push({
        productId,
        quantity,
        priceAtAdd: product.price,
        updatedAt: new Date()
      });
    }

    cart.updatedAt = new Date();
    await cart.save();

    return res.status(200).json({ message: 'Produit ajouté au panier', cart });
  } catch (error) {
    console.error('Erreur addToCart:', error);
    return res.status(500).json({ message: 'Erreur serveur lors de l\'ajout au panier' });
  }
};

// Mettre à jour la quantité d'un produit dans le panier
const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId, quantity, captchaToken } = req.body;

    if (!await verifyCaptcha(captchaToken)) {
      return res.status(400).json({ message: 'reCAPTCHA invalide' });
    }

    if (!productId || !quantity || quantity < 1) {
      return res.status(400).json({ message: 'productId et quantity valides sont requis' });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Produit non trouvé' });
    if (quantity > product.stock) {
      return res.status(400).json({ message: 'Quantité demandée supérieure au stock disponible' });
    }

    const cart = await Cart.findOne({ userId, status: 'active' });
    if (!cart) return res.status(404).json({ message: 'Panier non trouvé' });

    const itemIndex = cart.items.findIndex(item => item.productId.equals(productId));
    if (itemIndex === -1) return res.status(404).json({ message: 'Produit non trouvé dans le panier' });

    cart.items[itemIndex].quantity = quantity;
    cart.items[itemIndex].priceAtAdd = product.price;
    cart.items[itemIndex].updatedAt = new Date();
    cart.updatedAt = new Date();

    await cart.save();

    return res.status(200).json({ message: 'Quantité mise à jour', cart });
  } catch (error) {
    console.error('Erreur updateCartItem:', error);
    return res.status(500).json({ message: 'Erreur serveur lors de la mise à jour du panier' });
  }
};

// Supprimer un produit du panier
const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId, captchaToken } = req.body;

    if (!await verifyCaptcha(captchaToken)) {
      return res.status(400).json({ message: 'reCAPTCHA invalide' });
    }

    if (!productId) {
      return res.status(400).json({ message: 'productId est requis' });
    }

    const cart = await Cart.findOne({ userId, status: 'active' });
    if (!cart) return res.status(404).json({ message: 'Panier non trouvé' });

    const itemIndex = cart.items.findIndex(item => item.productId.equals(productId));
    if (itemIndex === -1) return res.status(404).json({ message: 'Produit non trouvé dans le panier' });

    cart.items.splice(itemIndex, 1);
    cart.updatedAt = new Date();

    await cart.save();

    return res.status(200).json({ message: 'Produit retiré du panier', cart });
  } catch (error) {
    console.error('Erreur removeFromCart:', error);
    return res.status(500).json({ message: 'Erreur serveur lors de la suppression du produit' });
  }
};

// Vider complètement le panier
const clearCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { captchaToken } = req.body;

    if (!await verifyCaptcha(captchaToken)) {
      return res.status(400).json({ message: 'reCAPTCHA invalide' });
    }

    const cart = await Cart.findOne({ userId, status: 'active' });
    if (!cart) return res.status(404).json({ message: 'Panier non trouvé' });

    cart.items = [];
    cart.updatedAt = new Date();

    await cart.save();

    return res.status(200).json({ message: 'Panier vidé', cart });
  } catch (error) {
    console.error('Erreur clearCart:', error);
    return res.status(500).json({ message: 'Erreur serveur lors de la suppression du panier' });
  }
};

// Récupérer le panier actif de l'utilisateur
const getCart = async (req, res) => {
  try {
    const userId = req.user?.userId; // Sécurité en cas de token absent
    if (!userId) {
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }

    const cart = await Cart.findOne({ userId, status: 'active' })
      .populate('items.productId', 'name imageUrl price') // uniquement les champs utiles
      .lean(); // retourne un objet JS pur (plus rapide)

    if (!cart) {
      return res.status(200).json({ items: [] }); // pas d'erreur, juste panier vide
    }

    return res.status(200).json(cart);
  } catch (error) {
    console.error('Erreur getCart:', error);
    return res.status(500).json({ message: 'Erreur serveur lors de la récupération du panier' });
  }
};


module.exports = {
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getCart,
};
