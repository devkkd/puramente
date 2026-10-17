const express = require("express");
const router = express.Router();
const { upload } = require("../utils/upload");
const { protect, admin } = require("../middleware/authMiddleware"); // <-- Added Security
const { createCategory, getCategories, getCategoryById, updateCategory, updateCategorySeo, deleteCategory } = require("../controllers/categoryController");

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
router.put("/:id/seo", protect, admin, updateCategorySeo);
router.put("/:id", protect, admin, uploadFields, updateCategory);
router.delete("/:id", protect, admin, deleteCategory);

module.exports = router;

