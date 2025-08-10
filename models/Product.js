const mongoose = require('mongoose');

const frenchAddressRegex = /^[0-9]{1,5}\s[A-Za-zÀ-ÿ0-9\s\-\,\.\;]+(?:,\s\d{5}\s[A-Za-zÀ-ÿ\s\-]+)$/;

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  quantityInStock: { type: Number, required: true, min: 0 },
  category: { type: String, required: true },
  images: [{ type: String }], // Stocke des URLs d'images
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

// Vérifier si le modèle 'Product' existe déjà avant de le définir
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

module.exports = Product;
