const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const chalk = require('chalk'); // Importation de chalk
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cartRoutes = require('./routes/cartRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');


// Charger les variables d'environnement à partir du fichier .env
require('dotenv').config();

const app = express();
app.use(express.json());

// Connexion à la base de données
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log(chalk.green('Base de données connectée avec succès')); // Message en vert
  })
  .catch((error) => {
    console.error(chalk.red('Erreur de connexion à la base de données :'), error); // Message en rouge
  });

// Configuration CORS
const corsOptions = {
  origin: 'http://localhost:3000', // URL de votre frontend
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization', 'user-id'], credentials: true
   // Ajouter 'user-id' ici
};

app.use(cors(corsOptions)); // Appliquer le middleware CORS

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);


// Route par défaut pour les chemins non définis
app.use((req, res) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

// Démarrer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(chalk.blue(`Serveur en cours d'exécution sur le port ${PORT}`)); // Message en bleu
});
