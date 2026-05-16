const Cart = require("../models/Cart");

// Get the user's cart
exports.getCart = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(200).json({ success: true, data: { items: [] } });

    let cart = await Cart.findOne({ userId }).populate("items.product", "productName designCode imageUrl");

    if (!cart) {
      cart = { items: [] }; 
    }

    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ error: "Server error fetching cart" });
  }
};

// Add an item to the cart
exports.addToCart = async (req, res) => {
  try {
    const { userId, productId, metalType, customFinish } = req.body;
    
    if (!userId) return res.status(401).json({ error: "Please log in to add items to your cart." });

    let cart = await Cart.findOne({ userId });

    // If no cart exists, create one
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(
      (item) => 
        item.product.toString() === productId && 
        item.metalType === metalType && 
        item.customFinish === customFinish
    );

    if (existingItemIndex > -1) {
      return res.status(200).json({ success: true, message: "Item combination already in cart", data: cart });
    } else {
      cart.items.push({
        product: productId,
        metalType,
        customFinish,
        quantityBand: "1-10 Pieces"
      });
    }

    await cart.save();
    await cart.populate("items.product", "productName designCode imageUrl");

    res.status(200).json({ success: true, message: "Added to cart", data: cart });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ error: "Server error adding to cart" });
  }
};

// Update item quantity band
exports.updateCartItem = async (req, res) => {
  try {
    const { userId, itemId, quantityBand } = req.body;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    let cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const item = cart.items.id(itemId);
    if (item) {
      item.quantityBand = quantityBand;
      await cart.save();
      await cart.populate("items.product", "productName designCode imageUrl");
      res.status(200).json({ success: true, data: cart });
    } else {
      res.status(404).json({ error: "Item not found in cart" });
    }
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ error: "Server error updating cart" });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { userId, itemId } = req.body; 
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    let cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.items = cart.items.filter(item => item._id.toString() !== itemId);
    
    await cart.save();
    await cart.populate("items.product", "productName designCode imageUrl");

    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({ error: "Server error removing from cart" });
  }
};