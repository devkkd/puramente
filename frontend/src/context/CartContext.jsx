"use client";

import React, { createContext, useState, useEffect, useContext } from "react";
import { getCart, addToCart as apiAddToCart, updateCartItem as apiUpdateCart, removeFromCart as apiRemoveFromCart } from "@/lib/api";
import { CheckCircle2, AlertCircle } from "lucide-react"; 

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  
  // --- Global Toast State ---
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" });

  // --- NEW: Flying Dots State ---
  const [flyingDots, setFlyingDots] = useState([]);

  const showToast = (message, type = "success") => {
    setToast({ visible: true, message, type });
    setTimeout(() => {
      setToast({ visible: false, message: "", type: "success" });
    }, 3000); 
  };

  const getAuthPayload = () => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      return { userId: storedUserId || null };
    }
    return { userId: null };
  };

  const fetchCart = async () => {
    const { userId } = getAuthPayload();
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

  // --- NEW: Fly Animation Logic ---
  const triggerFlyAnimation = (startX, startY) => {
    // Find the cart button in the header dynamically
    const cartIcon = document.querySelector('a[href="/cart"]');
    let targetX = window.innerWidth - 50; 
    let targetY = 50; 

    if (cartIcon) {
      const rect = cartIcon.getBoundingClientRect();
      targetX = rect.left + rect.width / 2 - 8; // Center of cart button (-8px for dot center)
      targetY = rect.top + rect.height / 2 - 8;
    }

    const newDot = { id: Date.now(), startX: startX - 8, startY: startY - 8, targetX, targetY, active: false };
    setFlyingDots((prev) => [...prev, newDot]);

    // Next frame: Activate the transition to fly to target
    setTimeout(() => {
      setFlyingDots((prev) =>
        prev.map((dot) => (dot.id === newDot.id ? { ...dot, active: true } : dot))
      );
    }, 50);

    // After flight completes (700ms): Remove dot and bump cart icon
    setTimeout(() => {
      setFlyingDots((prev) => prev.filter((dot) => dot.id !== newDot.id));
      if (cartIcon) {
        cartIcon.classList.add("cart-bump-animation");
        setTimeout(() => cartIcon.classList.remove("cart-bump-animation"), 300);
      }
    }, 750);
  };

  // --- UPDATED addToCart signature to accept coordinates ---
  const addToCart = async (productId, metalType, customFinish, coords = null) => {
    const { userId } = getAuthPayload();
    
    if (!userId) {
      showToast("Please log in to add items to your request.", "error");
      setTimeout(() => { window.location.href = "/account"; }, 1500);
      return;
    }

    try {
      const res = await apiAddToCart({ userId, productId, metalType, customFinish });
      if (res.success && res.data) {
        setCart(res.data);
        showToast("Added to Price Request successfully!"); 
        
        // Trigger the visual flying dot if coordinates were provided
        if (coords) {
          triggerFlyAnimation(coords.x, coords.y);
        }
      }
    } catch (err) {
      showToast("Failed to add item to request.", "error"); 
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
      if (res.success && res.data) {
        setCart(res.data);
        showToast("Item removed from request.", "success");
      }
    } catch (err) {
      console.error("Failed to remove from cart", err);
    }
  };

  const clearCart = () => {
    setCart({ items: [] });
  };

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, updateQuantity, removeFromCart, refreshCart: fetchCart, clearCart, showToast }}>
      {children}
      
      {/* --- INJECT CUSTOM CSS FOR CART BUMP --- */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes cartBump {
          0% { transform: scale(1); }
          50% { transform: scale(1.15); color: #00a3c4; }
          100% { transform: scale(1); }
        }
        .cart-bump-animation {
          animation: cartBump 0.3s ease-out;
        }
      `}} />

      {/* --- GLOBAL TOAST UI --- */}
      {toast.visible && (
        <div className="fixed top-20 right-4 sm:top-24 sm:right-8 z-[100] animate-in slide-in-from-right-8 fade-in duration-300">
          <div className={`flex items-center gap-3 px-5 py-4 rounded-xl shadow-xl border ${
            toast.type === "success" 
              ? "bg-[#E6FDF9] border-[#00a3c4]/30 text-[#0082a4]" 
              : "bg-red-50 border-red-200 text-red-600"
          }`}>
            {toast.type === "success" ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <p className="text-sm font-bold tracking-wide">{toast.message}</p>
          </div>
        </div>
      )}

      {/* --- FLYING DOTS RENDERER --- */}
      {flyingDots.map((dot) => (
        <div
          key={dot.id}
          className="fixed z-[9999] w-4 h-4 rounded-full bg-[#00a3c4] shadow-lg pointer-events-none"
          style={{
            left: dot.active ? dot.targetX : dot.startX,
            top: dot.active ? dot.targetY : dot.startY,
            opacity: dot.active ? 0 : 1,
            transform: dot.active ? "scale(0.3)" : "scale(1)",
            // The cubic-bezier gives it a nice "swoop" feel instead of a robotic straight line
            transition: "all 0.7s cubic-bezier(0.25, 1, 0.5, 1)",
          }}
        />
      ))}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);