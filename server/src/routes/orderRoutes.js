const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getOrders, getOrderById } = require('../controller/orderController');

const router = express.Router();

router.use(protect);

router.get('/', getOrders);
router.get('/:id', getOrderById);

module.exports = router;
