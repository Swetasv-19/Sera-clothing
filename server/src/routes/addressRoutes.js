const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  getAddressById
} = require('../controller/addressController');

const router = express.Router();

router.use(protect);

// GET /api/addresses - Get all user addresses
router.get('/', getAddresses);

// POST /api/addresses - Add new address
router.post('/', addAddress);

// GET /api/addresses/:id - Get specific address
router.get('/:id', getAddressById);

// PUT /api/addresses/:id - Update address
router.put('/:id', updateAddress);

// PUT /api/addresses/:id/default - Set as default address
router.put('/:id/default', setDefaultAddress);

// DELETE /api/addresses/:id - Delete address
router.delete('/:id', deleteAddress);

module.exports = router;
