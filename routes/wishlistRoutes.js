const express = require('express');
const router = express.Router();
const { addToWishlist, removeFromWishlist, getWishlist } = require('../controllers/wishlistController');
const  { authenticateToken }= require('../middlewares/authMiddleware'); // middleware pour vérifier token et mettre req.user

router.use(authenticateToken);


router.post('/add', addToWishlist);
router.post('/remove', removeFromWishlist);
router.get('/', getWishlist);

module.exports = router;
