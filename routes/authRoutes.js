// const express = require('express');
// const { register, login, getAuthenticatedUser } = require('../controllers/authController');
// const { validateRegister, validateLogin } = require('../middlewares/validationMiddleware');
// const { authenticateToken } = require('../middlewares/authMiddleware');
// const { registerValidationRules, loginValidationRules } = require('../validators/authValidators');

// const router = express.Router();

// // Route d'inscription avec validation des données
// router.post('/register', registerValidationRules, validateRegister, register);

// // Route de connexion avec validation des données
// router.post('/login', loginValidationRules, validateLogin, login);

// // Route pour obtenir les informations de l'utilisateur connecté
// router.get('/me', authenticateToken, getAuthenticatedUser);

// module.exports = router;


const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { registerValidationRules, loginValidationRules, validate } = require('../validators/authValidators');
const { register,login, getMe, verifyToken} = require('../controllers/authController');
const { authenticateToken } = require('../middlewares/authMiddleware');  // <-- ici

// Config multer pour upload image
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/profile-pictures'); // dossier à créer dans ton backend
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Seules les images sont acceptées'));
    }
    cb(null, true);
  },
});

router.post(
  '/register',
  upload.single('profilePicture'),
  registerValidationRules(),
  validate,
  register
);

router.post('/login', loginValidationRules(), validate, login);
router.get('/me', authenticateToken, getMe);
router.get('/verify-token', verifyToken);



module.exports = router;
