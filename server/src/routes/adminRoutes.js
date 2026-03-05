const express = require("express");
const router = express.Router();
const {
  getDashboardStats,
  getAllUsers,
  updateUserStatus,
  deleteUser,
  getAllOrders,
  updateOrderStatus,
} = require("../controller/adminController");
const { protect } = require("../middleware/auth");
const { adminOnly } = require("../middleware/adminOnly");

// All routes here are protected and admin only
router.use(protect);
router.use(adminOnly);

router.get("/stats", getDashboardStats);

router.get("/users", getAllUsers);
router.put("/users/:id/status", updateUserStatus);
router.delete("/users/:id", deleteUser);

router.get("/orders", getAllOrders);
router.put("/orders/:id/status", updateOrderStatus);

module.exports = router;
