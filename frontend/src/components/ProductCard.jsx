"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
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
        scroll={false}
      >
        <div className="relative w-full aspect-square mb-5 bg-white flex items-center justify-center h-[320px]">
          <Image
            src={product.imageUrl}
            alt={product.productName}
            fill
            sizes="(max-width: 640px) 220px, (max-width: 768px) 240px, (max-width: 1024px) 250px, 20vw"
            className="object-contain"
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