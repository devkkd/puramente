const express = require("express");
const router = express.Router();
const { upload } = require("../utils/upload");
const { protect, admin } = require("../middleware/authMiddleware"); // <-- Added Security
const { 
  submitCustomRequest, 
  getAllCustomRequests,
  updateCustomRequestStatus,
  deleteCustomRequest
} = require("../controllers/customRequestController");

// Public Route
router.post("/submit", upload.single("referenceImage"), submitCustomRequest);

// Admin Routes (Protected)
router.get("/admin/all", protect, admin, getAllCustomRequests);
router.put("/admin/:id/status", protect, admin, updateCustomRequestStatus); 
router.delete("/admin/:id", protect, admin, deleteCustomRequest);

module.exports = router;