const express = require("express");
const router = express.Router();
const { upload } = require("../utils/upload");
const { protect, admin } = require("../middleware/authMiddleware"); // <-- Import the new locks

const { 
  createProduct, 
  getProducts, 
  getProductById, 
  getProductBySlug, 
  updateProduct, 
  deleteProduct,
  bulkUploadProducts,
  updateProductSeo
} = require("../controllers/productController");

// --- PUBLIC ROUTES (No token required) ---
router.get("/", getProducts);

// IMPORTANT: slug route must come before /:id
router.get("/slug/:slug", getProductBySlug);

router.get("/:id", getProductById);

// --- PROTECTED ADMIN ROUTES (Requires valid Token + Admin status) ---
const handleUpload = (multerMiddleware) => {
  return (req, res, next) => {
    multerMiddleware(req, res, (err) => {
      if (err) {
        console.error("Multer upload error:", err);
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  };
};

router.post("/bulk-upload", protect, admin, handleUpload(upload.any()), bulkUploadProducts);
router.post("/", protect, admin, handleUpload(upload.single("image")), createProduct);
router.put("/:id/seo", protect, admin, updateProductSeo);
router.put("/:id", protect, admin, handleUpload(upload.single("image")), updateProduct);
router.delete("/:id", protect, admin, deleteProduct);

module.exports = router;