const axios = require('axios');
const qs = require('qs'); 

async function verifyCaptcha(token) {
  if (!token) return false;
  try {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    const data = qs.stringify({
      secret: secretKey,
      response: token,
    });

    const response = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      data,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    return response.data.success === true;
  } catch (error) {
    console.error('Erreur lors de la vérification reCAPTCHA:', error);
    return false;
  }
}


module.exports = { verifyCaptcha };
