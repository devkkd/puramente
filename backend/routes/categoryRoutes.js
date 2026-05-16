const express = require("express");
const router = express.Router();
const { upload } = require("../utils/upload");
const { protect, admin } = require("../middleware/authMiddleware"); // <-- Added Security
const { createCategory, getCategories, getCategoryById, updateCategory } = require("../controllers/categoryController");

const uploadFields = upload.fields([
  { name: "homeImage", maxCount: 1 },
  { name: "image", maxCount: 1 },
  { name: "storeBannerImage", maxCount: 1 }
]);

// Public Routes
router.get("/", getCategories);
router.get("/:id", getCategoryById); // Made public so the frontend store can fetch a specific category

// Admin Routes (Protected)
router.post("/", protect, admin, uploadFields, createCategory);
router.put("/:id", protect, admin, uploadFields, updateCategory);

module.exports = router;