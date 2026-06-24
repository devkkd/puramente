const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware"); // <-- Added Security
const { submitOrder, getAllOrders, getOrderById, updateOrderStatus, deleteOrder } = require("../controllers/orderController");

// Public Route
router.post("/submit", submitOrder);

// Admin Routes (Protected)
router.get("/admin/all", protect, admin, getAllOrders);
router.get("/admin/:id", protect, admin, getOrderById);
router.put("/admin/:id/status", protect, admin, updateOrderStatus);
router.delete("/admin/:id", protect, admin, deleteOrder);

module.exports = router;