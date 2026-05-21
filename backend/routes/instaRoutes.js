const express = require("express");
const router = express.Router();
const { getInstaPosts, addInstaPost, deleteInstaPost } = require("../controllers/instaController");
const { upload } = require("../utils/upload");
const { protect, admin } = require("../middleware/authMiddleware");

router.get("/", getInstaPosts); // Public
router.post("/", protect, admin, upload.single("media"), addInstaPost); // Admin only
router.delete("/:id", protect, admin, deleteInstaPost); // Admin only

module.exports = router;