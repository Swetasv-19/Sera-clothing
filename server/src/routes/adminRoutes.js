const express = require("express");
const router = express.Router();
const {
  getDashboardStats,
  getAllUsers,
  updateUserStatus,
  deleteUser,
  createUser,
  updateUser,
  getAllOrders,
  updateOrderStatus,
} = require("../controller/adminController");
const {
  adminCreateProductWithImages,
} = require("../controller/productController");
const { uploadProductImages } = require("../middleware/upload");
const { protect } = require("../middleware/auth");
const { adminOnly } = require("../middleware/adminOnly");

// All routes here are protected and admin only
router.use(protect);
router.use(adminOnly);

router.get("/stats", getDashboardStats);

router.get("/users", getAllUsers);
router.post("/users", createUser);
router.put("/users/:id/status", updateUserStatus);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

router.get("/orders", getAllOrders);
router.put("/orders/:id/status", updateOrderStatus);

// Products (admin)
router.post(
  "/products",
  uploadProductImages,
  adminCreateProductWithImages,
);

module.exports = router;
