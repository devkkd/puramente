const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware"); // <-- Added Security
const { 
  submitEnquiry, 
  getAllEnquiries, 
  updateEnquiryStatus,
  deleteEnquiry
} = require("../controllers/contactController");

// Public Route
router.post("/submit", submitEnquiry);

// Admin Routes (Protected)
router.get("/admin/all", protect, admin, getAllEnquiries);
router.put("/admin/:id/status", protect, admin, updateEnquiryStatus);
router.delete("/admin/:id", protect, admin, deleteEnquiry);

module.exports = router;