const express = require('express');
const router = express.Router();

const {
  getProducts,
  getProduct,
  getFeaturedProducts,
  getProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controller/productController');

const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/adminOnly');

// ── Public routes ─────────────────────────────────────────────────────────────
router.get('/', getProducts);                            // GET /api/products
router.get('/featured', getFeaturedProducts);            // GET /api/products/featured
router.get('/category/:category', getProductsByCategory); // GET /api/products/category/:category
router.get('/:id', getProduct);                         // GET /api/products/:id

// ── Admin-only routes ─────────────────────────────────────────────────────────
router.post('/', protect, adminOnly, createProduct);       // POST /api/products
router.put('/:id', protect, adminOnly, updateProduct);     // PUT  /api/products/:id
router.delete('/:id', protect, adminOnly, deleteProduct);  // DELETE /api/products/:id

module.exports = router;
