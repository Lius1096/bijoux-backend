const mongoose = require('mongoose');
const { isURL } = require('validator');

// Regex pour valider une adresse française
const frenchAddressRegex = /^[0-9]{1,5}\s[A-Za-zÀ-ÿ0-9\s\-\,\.\;]+(?:,\s?\d{5}\s[A-Za-zÀ-ÿ\s\-]+)?$/;

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, unique: true, required: true },
  email: {
    type: String,
    unique: true,
    required: true,
    match: [/\S+@\S+\.\S+/, 'Email invalide'],
  },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  address: {
    streetNumber: { type: String, required: true }, // Numéro de rue
    streetName: { type: String, required: true },   // Nom de la rue
    city: { type: String, required: true },          // Ville
    postalCode: { type: String, match: [/^\d{5}$/, 'Code postal invalide'] }, // Code postal
    country: { type: String, required: true },       // Pays
  },
  phone: { type: String, match: [/^\+?\d{10,15}$/, 'Téléphone invalide'] },
  profilePicture: { 
    type: String, 
    validate: [isURL, 'URL invalide'], // Validation de l'URL de l'image
  },
  dob: { type: Date },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  ordersHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  cart: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      image: { type: String },
      description: { type: String },
    }
  ],
}, { timestamps: true });

// Virtual pour obtenir le nom complet de l'utilisateur
userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model('User', userSchema);
