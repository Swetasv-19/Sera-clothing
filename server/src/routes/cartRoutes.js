const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require("../controller/cartController");

const router = express.Router();

// Require user to be logged in for all cart routes
router.use(protect);

router.route("/").get(getCart).post(addToCart).delete(clearCart);

router.route("/:itemId").put(updateCartItem).delete(removeFromCart);

module.exports = router;
