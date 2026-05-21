"use client";

import React from "react";
import Link from "next/link";
import AddToCartButton from "./AddToCartButton";

export default function ProductCard({ product, onCardClick }) {
  const handleNavigationIntercept = () => {
    if (onCardClick) {
      onCardClick(product._id);
    }
  };

  return (
    <div 
      id={`prod-card-${product._id}`} 
      className="flex flex-col group w-full relative"
    >
      <Link 
        href={`/product/${product._id}`} 
        className="flex flex-col"
        onClick={handleNavigationIntercept}
        scroll={false} // <-- CRUCIAL: Prevents App Router top-reset
      >
        <div className="relative w-full aspect-square mb-5 bg-white flex items-center justify-center h-[320px]">
          <img 
            src={product.imageUrl} 
            alt={product.productName} 
            className="w-full h-full object-contain"
            loading="lazy"
          />
        </div>

        <div className="flex flex-col items-center text-center px-2 mb-6">
          <h3 className="text-base font-bold text-gray-900 mb-1">{product.productName}</h3>
          <p className="text-xs text-gray-400">
            {product.category?.name || "Earrings"} • SKU: {product.designCode}
          </p>
        </div>
      </Link>

      <AddToCartButton productId={product._id} />
    </div>
  );
}