const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  checkWishlistStatus,
  moveWishlistToCart
} = require('../controller/wishlistController');

const router = express.Router();

router.use(protect);

// GET /api/wishlist - Get user's wishlist
router.get('/', getWishlist);

// POST /api/wishlist - Add product to wishlist
router.post('/', addToWishlist);

// DELETE /api/wishlist/:productId - Remove product from wishlist
router.delete('/:productId', removeFromWishlist);

// DELETE /api/wishlist - Clear entire wishlist
router.delete('/', clearWishlist);

// GET /api/wishlist/check/:productId - Check if product is in wishlist
router.get('/check/:productId', checkWishlistStatus);

// POST /api/wishlist/move-to-cart - Move product from wishlist to cart
router.post('/move-to-cart', moveWishlistToCart);

module.exports = router;
