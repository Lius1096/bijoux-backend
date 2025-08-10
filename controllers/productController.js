const Product = require('../models/Product');
  const mongoose = require('mongoose');  // Importez mongoose
// controllers/productController.js

exports.createProduct = async (req, res) => {
  try {
    // Exemple de création de produit
    const { name, description, price } = req.body;
    const newProduct = new Product({ name, description, price });

    await newProduct.save();
    res.status(201).json({ message: 'Produit créé avec succès', product: newProduct });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création du produit', error });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des produits', error });
  }
};

exports.getProductDetails = async (req, res) => {
  const { id } = req.params;

  // Vérifier si l'ID est valide
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID de produit invalide' });
  }

  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: 'Produit non trouvé' });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération du produit', error });
  }
};