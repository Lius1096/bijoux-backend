/*const { RecaptchaV3 } = require('express-recaptcha');

// Remplacez par vos clés reCAPTCHA obtenues depuis Google reCAPTCHA Admin Console
const recaptcha = new RecaptchaV3(
  process.env.RECAPTCHA_SITE_KEY,
  process.env.RECAPTCHA_SECRET_KEY
);

const verifyRecaptcha = async (req, res, next) => {
  recaptcha.verify(req, async (error, data) => {
    if (error || !data.success) {
      return res.status(400).json({ message: "Échec de la vérification reCAPTCHA." });
    }
    next();
  });
};

module.exports = verifyRecaptcha;
*/
