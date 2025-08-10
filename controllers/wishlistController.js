const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const { verifyCaptcha } = require('../utils/recaptcha');

// Ajouter un produit à la wishlist
const addToWishlist = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId, captchaToken } = req.body;

    if (!await verifyCaptcha(captchaToken)) {
      return res.status(400).json({ message: 'reCAPTCHA invalide' });
    }
    if (!productId) return res.status(400).json({ message: 'productId est requis' });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Produit non trouvé' });

    let wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      wishlist = new Wishlist({ userId, products: [] });
    }

    if (wishlist.products.includes(productId)) {
      return res.status(400).json({ message: 'Produit déjà dans la wishlist' });
    }

    wishlist.products.push(productId);
    await wishlist.save();

    return res.status(200).json({ message: 'Produit ajouté à la wishlist', wishlist });
  } catch (error) {
    console.error('Erreur addToWishlist:', error);
    return res.status(500).json({ message: 'Erreur serveur lors de l\'ajout à la wishlist' });
  }
};

// Retirer un produit de la wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId, captchaToken } = req.body;

    if (!await verifyCaptcha(captchaToken)) {
      return res.status(400).json({ message: 'reCAPTCHA invalide' });
    }
    if (!productId) return res.status(400).json({ message: 'productId est requis' });

    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) return res.status(404).json({ message: 'Wishlist non trouvée' });

    const index = wishlist.products.indexOf(productId);
    if (index === -1) return res.status(404).json({ message: 'Produit non trouvé dans la wishlist' });

    wishlist.products.splice(index, 1);
    await wishlist.save();

    return res.status(200).json({ message: 'Produit retiré de la wishlist', wishlist });
  } catch (error) {
    console.error('Erreur removeFromWishlist:', error);
    return res.status(500).json({ message: 'Erreur serveur lors de la suppression de la wishlist' });
  }
};

// Récupérer la wishlist
const getWishlist = async (req, res) => {
  try {
    const userId = req.user.userId;

    const wishlist = await Wishlist.findOne({ userId })
      .populate('products', 'name price imageUrl')
      .lean();

    if (!wishlist) {
      return res.status(200).json({ products: [] });
    }

    return res.status(200).json(wishlist);
  } catch (error) {
    console.error('Erreur getWishlist:', error);
    return res.status(500).json({ message: 'Erreur serveur lors de la récupération de la wishlist' });
  }
};

module.exports = {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
};
