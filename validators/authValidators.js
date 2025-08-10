const { body, validationResult } = require('express-validator');

const registerValidationRules = () => [
  body('email').isEmail().withMessage('Email invalide'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Le mot de passe doit contenir au moins 6 caractères'),
  body('confirmPassword')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Les mots de passe ne correspondent pas'),
  body('firstName').notEmpty().withMessage('Le prénom est requis'),
  body('lastName').notEmpty().withMessage('Le nom est requis'),
  body('username').notEmpty().withMessage("Le nom d'utilisateur est requis"),
  body('dob').optional().isDate().withMessage('Date de naissance invalide'),
  body('gender').optional().isIn(['male', 'female', 'other', '']).withMessage('Genre invalide'),
  body('streetNumber').notEmpty().withMessage('Numéro de rue requis'),
  body('streetName').notEmpty().withMessage('Nom de rue requis'),
  body('postalCode')
    .matches(/^\d{5}$/)
    .withMessage('Code postal invalide'),
  body('city')
    .matches(/^[A-Za-zÀ-ÿ\s\-]+$/)
    .withMessage('Ville invalide'),
  body('country')
    .matches(/^[A-Za-zÀ-ÿ\s\-]+$/)
    .withMessage('Pays invalide'),
  // tu peux ajouter d'autres validations si besoin
];

const loginValidationRules = () => [
  body('identifier')
    .notEmpty().withMessage('Identifiant requis (email ou nom d\'utilisateur)')
    .isString(),
  body('password')
    .notEmpty().withMessage('Mot de passe requis')
    .isString(),
];

// Fonction middleware pour vérifier les erreurs et retourner un format simple
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  return res.status(400).json({
    errors: errors.array().map(e => ({ field: e.param, message: e.msg })),
  });
};

module.exports = {
  registerValidationRules,
  loginValidationRules,
  validate,
};
