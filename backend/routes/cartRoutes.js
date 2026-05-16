const express = require("express");
const router = express.Router();
const { 
  getCart, 
  addToCart, 
  updateCartItem, 
  removeFromCart 
} = require("../controllers/cartController");

// Note: Using POST for 'getCart' right now to easily pass userId/sessionId in the body
router.post("/view", getCart);
router.post("/add", addToCart);
router.put("/update", updateCartItem);
router.post("/remove", removeFromCart); // Using POST or DELETE with body

module.exports = router;