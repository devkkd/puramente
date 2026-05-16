"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

export default function AddToCartButton({ productId, variant = "card" }) {
  const { addToCart } = useCart();
  const router = useRouter();

  const handleRequest = (e) => {
    e.preventDefault(); 
    e.stopPropagation();

    // 1. Auth Check
    const userToken = typeof window !== "undefined" ? localStorage.getItem("userToken") : null;
    if (!userToken) {
      router.push("/account");
      return; 
    }

    // 2. Add To Cart
    const metalType = typeof window !== "undefined" ? localStorage.getItem("puramente_metal") || "925 SILVER" : "925 SILVER";
    const customFinish = typeof window !== "undefined" ? localStorage.getItem("puramente_finish") || "GOLD PLATED" : "GOLD PLATED";
    
    addToCart(productId, metalType, customFinish);
  };

  const buttonStyle = variant === "detail" 
    ? "w-full max-w-lg bg-[#00a3c4] text-white py-4 text-sm font-bold hover:bg-[#0082a4] transition-colors shadow-md"
    : "w-full py-3 px-4 border border-gray-100 text-[#00a3c4] text-xs sm:text-sm font-medium hover:bg-[#00a3c4] hover:text-white hover:border-[#00a3c4] transition-all duration-300 z-10 relative bg-white";

  return (
    <button onClick={handleRequest} className={buttonStyle}>
      + Add to Collection Request
    </button>
  );
}