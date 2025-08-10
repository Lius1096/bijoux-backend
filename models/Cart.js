const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, default: 1, min: 1 },
  priceAtAdd: { type: Number, required: true }, // prix au moment ajout (pour garder trace)
  updatedAt: { type: Date, default: Date.now }
});

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [cartItemSchema],
  status: { type: String, enum: ['active', 'ordered', 'cancelled'], default: 'active' },
  updatedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

// **AJOUTE CETTE LIGNE**
module.exports = mongoose.model('Cart', cartSchema);
