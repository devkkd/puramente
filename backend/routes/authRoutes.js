const express = require("express");
const router = express.Router();
const { registerUser, loginUser, loginAdmin, forgotPassword, resetPassword } = require("../controllers/authController");
const User = require("../models/User");
const Cart = require("../models/Cart"); // <-- Added for admin cart counts

// ==========================================
// PUBLIC AUTH ROUTES
// ==========================================
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/admin-login", loginAdmin);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);
// Fetch logged-in user profile
router.get("/me/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ success: false, error: "User not found" });
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error" });
  }
});


// ==========================================
// ADMIN ROUTES
// ==========================================

// Get all users with their cart item count
router.get("/admin/users", async (req, res) => {
  try {
    const users = await User.find().select("-password").lean().sort({ createdAt: -1 });
    const carts = await Cart.find({ userId: { $in: users.map(u => u._id) } });

    // Attach cart info to each user
    const usersWithCart = users.map(user => {
      const userCart = carts.find(c => c.userId?.toString() === user._id.toString());
      return {
        ...user,
        cartItemCount: userCart ? userCart.items.length : 0
      };
    });

    res.status(200).json({ success: true, data: usersWithCart });
  } catch (error) { 
    res.status(500).json({ success: false, error: "Failed to fetch users" }); 
  }
});

// Get a specific user's active cart
router.get("/admin/users/:id/cart", async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.id }).populate("items.product");
    res.status(200).json({ success: true, data: cart });
  } catch (error) { 
    res.status(500).json({ success: false, error: "Failed to fetch user cart" }); 
  }
});

module.exports = router;