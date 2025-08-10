


const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');  // il manquait cet import pour jwt
const User = require('../models/User');
const fs = require('fs');
const path = require('path');

const register = async (req, res) => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      username,
      dob,
      gender,
      streetNumber,
      streetName,
      postalCode,
      city,
      country,
      role,
    } = req.body;

    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(409).json({ message: 'Email ou nom d’utilisateur déjà utilisé' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const address = {
      streetNumber,
      streetName,
      postalCode,
      city,
      country,
    };

    let profilePicturePath = null;
    if (req.file) {
      profilePicturePath = req.file.filename;
    }

    const newUser = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      username,
      dob,
      gender,
      address,
      profilePicture: profilePicturePath,
      role: role || 'user',
    });

    await newUser.save();

    return res.status(201).json({ message: 'Utilisateur créé avec succès' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};



const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }]
    });

    if (!user) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(200).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    console.error('Erreur login:', error);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
};

const getMe = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    return res.json(user);
  } catch (error) {
    console.error('Erreur récupération utilisateur:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

const verifyToken = (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ valid: false, message: 'Authorization header manquant' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ valid: false, message: 'Token manquant' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).json({ valid: true, userId: decoded.userId, role: decoded.role });
  } catch (error) {
    return res.status(401).json({ valid: false, message: 'Token invalide ou expiré' });
  }
};

module.exports = {
  register,
  login,
  getMe,
  verifyToken,
};