"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Heart, Share } from "lucide-react";
import { getProductById } from "@/lib/api"; 
import ProdOptions from "@/components/ProdOptions"; 
import AddToCartButton from "@/components/AddToCartButton"; // <-- IMPORT THE BUTTON

export default function ProductDetailPage() {
  const params = useParams();
  const { id } = params;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // This state holds the UI snapshot of what is selected
  const [selectedOptions, setSelectedOptions] = useState({
    metal: "925 SILVER",
    finish: "GOLD PLATED"
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductById(id);
        if (response.success && response.data) {
          const productData = Array.isArray(response.data) ? response.data[0] : response.data;
          setProduct(productData);
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="w-full min-h-[70vh] flex items-center justify-center font-mona text-gray-500">
        Loading product details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="w-full min-h-[70vh] flex items-center justify-center font-mona text-red-500">
        Product not found.
      </div>
    );
  }

  return (
    <main className="w-full bg-white font-mona pb-24 pt-10">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-12 lg:gap-20">
        
        {/* --- LEFT COLUMN: IMAGE --- */}
        <div className="w-full lg:w-1/2 flex items-center justify-center relative bg-white">
          <div className="w-full aspect-[4/5] sm:aspect-square lg:aspect-auto lg:h-[600px] relative flex items-center justify-center p-8">
            <img 
              src={product.imageUrl} 
              alt={product.productName} 
              className="w-full h-full object-contain drop-shadow-sm"
            />
            {/* Wishlist Icon */}
            <button className="absolute bottom-6 left-6 text-[#00a3c4] hover:text-[#0082a4] transition-colors">
              <Heart size={28} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* --- RIGHT COLUMN: PRODUCT DETAILS --- */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center py-6">
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4 text-[#00a3c4] text-xs font-normal tracking-widest uppercase">
              <span className="w-12 h-px bg-[#00a3c4]"></span>
              <span>Product Details</span>
            </div>
            <button className="flex items-center gap-2 text-gray-800 text-sm hover:text-[#00a3c4] transition-colors font-medium">
              <Share size={18} strokeWidth={1.5} /> SHARE
            </button>
          </div>

          <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 capitalize">
            {product.productName}
          </h1>
          <p className="text-[#00a3c4] text-lg lg:text-xl font-medium mb-8">
            {product.category?.name || "Jewelry"} • Design Code: {product.designCode}
          </p>

          <div className="mb-10 max-w-xl">
            <h4 className="text-sm font-bold text-gray-900 mb-2">Product Description:</h4>
            <p className="text-sm font-normal text-gray-800 leading-relaxed">
              {product.description || "Beautifully crafted jewelry piece perfect for wholesale collections and individual statements."}
            </p>
          </div>

          <ProdOptions onOptionsChange={setSelectedOptions} />

          {/* Unified Add To Cart Button passed with variant="detail" */}
          <AddToCartButton productId={product._id} variant="detail" />

        </div>

      </div>
    </main>
  );
}