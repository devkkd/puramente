"use client";

import React from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import AddToCartButton from "./AddToCartButton";

export default function ProductCard({ product }) {
  return (
    <div className="flex flex-col group w-full relative">
      
      {/* Link wrapping Image and Details for navigation */}
      <Link href={`/product/${product._id}`} className="flex flex-col">
        {/* Image Container */}
        <div className="relative w-full aspect-square mb-5 bg-white flex items-center justify-center h-[320px]">
          <img 
            src={product.imageUrl} 
            alt={product.productName} 
            className="w-full h-full object-contain"
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-col items-center text-center px-2 mb-6">
          <h3 className="text-base font-bold text-gray-900 mb-1">{product.productName}</h3>
          <p className="text-xs text-gray-400">
            {/* Fallback to "Earrings" if option/category is null */}
            {product.category?.name || "Earrings"} • SKU: {product.designCode}
          </p>
        </div>
      </Link>

      {/* Wishlist Icon (Absolutely positioned over the image container) */}
      <button 
        className="absolute top-[280px] left-4 text-[#00a3c4] hover:text-[#0082a4] transition-colors z-10"
        onClick={(e) => {
          e.preventDefault(); // Prevents navigation
          console.log("Added to wishlist!");
        }}
      >
      </button>

      {/* Action Button */}
      <AddToCartButton productId={product._id} designCode={product.designCode} />
      
    </div>
  );
}