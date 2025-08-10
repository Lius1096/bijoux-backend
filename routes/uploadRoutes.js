const express = require('express');
const User = require('../models/User'); // Importer le modèle User
const upload = require('../config/uploadConfig'); // Importer la configuration de Multer

const router = express.Router();

// Middleware pour vérifier l'authentification de l'utilisateur
const isAuthenticated = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];  // Extraire le token du header

  if (!token) {
    return res.status(401).json({ error: 'Non autorisé, token manquant' });
  }

  // Vérifier le token (vous pouvez utiliser JWT ici)
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;  // Ajouter l'ID de l'utilisateur dans la requête
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Token invalide ou expiré' });
  }
};

// Route pour télécharger la photo de profil
router.put('/user/:userId/uploadProfilePicture', isAuthenticated, upload.single('profilePicture'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Aucun fichier téléchargé' });
  }

  const profilePictureUrl = `/uploads/${req.file.filename}`;  // URL de l'image stockée

  // Vérifier si l'utilisateur est bien celui qui a envoyé la demande
  if (req.userId !== req.params.userId) {
    return res.status(403).json({ error: 'Vous ne pouvez pas modifier cette photo de profil' });
  }

  // Mettre à jour l'URL de la photo de profil dans la base de données
  User.findByIdAndUpdate(req.params.userId, { profilePicture: profilePictureUrl }, { new: true })
    .then(user => {
      res.json({ message: 'Photo de profil mise à jour avec succès', profilePicture: user.profilePicture });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Erreur lors de la mise à jour de la photo de profil' });
    });
});

module.exports = router;
