const express = require("express");
const router = express.Router();
const { upload } = require("../utils/upload");
const { protect, admin } = require("../middleware/authMiddleware"); // <-- Added Security
const { 
  createBlog, 
  getBlogs, 
  getBlogBySlug, 
  getBlogById, 
  updateBlog, 
  deleteBlog 
} = require("../controllers/blogController");

// Public Routes
router.get("/", getBlogs);
router.get("/slug/:slug", getBlogBySlug);

// Admin Routes (Protected)
router.post("/", protect, admin, upload.single("image"), createBlog);
router.get("/:id", protect, admin, getBlogById);
router.put("/:id", protect, admin, upload.single("image"), updateBlog);
router.delete("/:id", protect, admin, deleteBlog);

module.exports = router;