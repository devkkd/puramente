"use client";

import React, { createContext, useState, useEffect, useContext } from "react";
import { getCart, addToCart as apiAddToCart, updateCartItem as apiUpdateCart, removeFromCart as apiRemoveFromCart } from "@/lib/api";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);

  const getAuthPayload = () => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      return { userId: storedUserId || null };
    }
    return { userId: null };
  };

  const fetchCart = async () => {
    const { userId } = getAuthPayload();
    
    // If no user is logged in, immediately clear the cart and stop loading
    if (!userId) {
      setCart({ items: [] });
      setLoading(false);
      return;
    }

    try {
      const res = await getCart({ userId });
      if (res.success && res.data) setCart(res.data);
    } catch (err) {
      console.error("Failed to fetch cart", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCart(); }, []);

  const addToCart = async (productId, metalType, customFinish) => {
    const { userId } = getAuthPayload();
    
    // Block guest users from adding to cart
    if (!userId) {
      alert("Please log in to add items to your cart.");
      window.location.href = "/account";
      return;
    }

    try {
      const res = await apiAddToCart({ userId, productId, metalType, customFinish });
      if (res.success && res.data) {
        setCart(res.data);
        alert("Added to cart successfully!");
      }
    } catch (err) {
      alert("Failed to add item to cart.");
    }
  };

  const updateQuantity = async (itemId, quantityBand) => {
    try {
      const res = await apiUpdateCart({ ...getAuthPayload(), itemId, quantityBand });
      if (res.success && res.data) setCart(res.data);
    } catch (err) {
      console.error("Failed to update cart", err);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const res = await apiRemoveFromCart({ ...getAuthPayload(), itemId });
      if (res.success && res.data) setCart(res.data);
    } catch (err) {
      console.error("Failed to remove from cart", err);
    }
  };

  // Easily wipe the cart state on logout
  const clearCart = () => {
    setCart({ items: [] });
  };

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, updateQuantity, removeFromCart, refreshCart: fetchCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);