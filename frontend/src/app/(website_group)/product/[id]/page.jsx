"use client";

import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { useParams } from "next/navigation";
import { Heart, Share } from "lucide-react";
import { getProductById } from "@/lib/api"; 
import ProdOptions from "@/components/ProdOptions"; 
import AddToCartButton from "@/components/AddToCartButton";

export default function ProductDetailPage() {
  const params = useParams();
  const { id } = params;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // FIXED: Force the page to the top immediately upon entry.
  // We use useLayoutEffect to ensure it scrolls before the user sees the page.
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [selectedMetal, setSelectedMetal] = useState("");
  const [selectedFinish, setSelectedFinish] = useState("");

  // --- ZOOM STATE ---
  const containerRef = useRef(null);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [zoomScale] = useState(2.2); 

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedMetal = localStorage.getItem("puramente_metal");
      const savedFinish = localStorage.getItem("puramente_finish");
      if (savedMetal) setSelectedMetal(savedMetal);
      if (savedFinish) setSelectedFinish(savedFinish);
    }
  }, []);

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

  const handleMetalChange = (val) => {
    setSelectedMetal(val);
    localStorage.setItem("puramente_metal", val);
  };

  const handleFinishChange = (val) => {
    setSelectedFinish(val);
    localStorage.setItem("puramente_finish", val);
  };

  // --- ZOOM HANDLERS ---
  const handleMouseEnter = () => setIsZooming(true);
  const handleMouseLeave = () => setIsZooming(false);
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const container = containerRef.current.getBoundingClientRect();
    const x = e.clientX - container.left;
    const y = e.clientY - container.top;
    setZoomPosition({ x, y });
  };

  if (loading) {
    return <div className="w-full min-h-[70vh] flex items-center justify-center font-mona text-gray-500">Loading product details...</div>;
  }

  if (!product) {
    return <div className="w-full min-h-[70vh] flex items-center justify-center font-mona text-red-500">Product not found.</div>;
  }

  return (
    <main className="w-full bg-white font-mona pb-24 pt-10">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-12 lg:gap-20">
        
        {/* --- LEFT COLUMN: IMAGE --- */}
        <div className="w-full lg:w-1/2 flex items-center justify-center relative bg-white">
          <div
            ref={containerRef}
            className="w-full aspect-[4/5] sm:aspect-square lg:aspect-auto lg:h-[600px] relative flex items-center justify-center p-8 overflow-hidden group cursor-none"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
          >
            <img src={product.imageUrl} alt={product.productName} className="w-full h-full object-contain drop-shadow-sm" />
            
            {/* PERFECT PIXEL-LOCKED ZOOM LENS */}
            {isZooming && containerRef.current && (
              <div
                className="absolute pointer-events-none rounded-full border-[4px] border-gray-300 shadow-2xl bg-white overflow-hidden z-50"
                style={{
                  width: '260px', 
                  height: '260px',
                  left: `${zoomPosition.x - 130}px`, 
                  top: `${zoomPosition.y - 130}px`,
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    width: `${containerRef.current.offsetWidth}px`,
                    height: `${containerRef.current.offsetHeight}px`,
                    transform: `translate(${130 - zoomPosition.x * zoomScale}px, ${130 - zoomPosition.y * zoomScale}px) scale(${zoomScale})`,
                    transformOrigin: '0 0',
                  }}
                  className="flex items-center justify-center p-8"
                >
                  <img src={product.imageUrl} alt={product.productName} className="w-full h-full object-contain drop-shadow-sm" />
                </div>
              </div>
            )}
            
          </div>
        </div>

        {/* --- RIGHT COLUMN: PRODUCT DETAILS --- */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4 text-[#00a3c4] text-xs font-normal tracking-widest uppercase">
              <span className="w-12 h-px bg-[#00a3c4]"></span>
              <span>Product Details</span>
            </div>
          </div>

          <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 capitalize">
            {product.productName}
          </h1>
          <p className="text-[#00a3c4] text-lg lg:text-xl font-medium mb-8">
            {product.category?.name || "Jewelry"} • Design Code: {product.designCode}
          </p>

          <div className="mb-10 max-w-xl">
            <h4 className="text-sm font-bold text-gray-900 mb-2">Product Description:</h4>
            <p className="text-sm font-normal text-gray-600 leading-relaxed">
              {product.description || "Beautifully crafted jewelry piece perfect for wholesale collections and individual statements."}
            </p>
          </div>

          <ProdOptions 
            metal={selectedMetal} 
            finish={selectedFinish} 
            onMetalChange={handleMetalChange} 
            onFinishChange={handleFinishChange} 
          />

          <AddToCartButton 
            productId={product._id} 
            variant="detail" 
            metalType={selectedMetal} 
            customFinish={selectedFinish} 
          />

        </div>
      </div>
    </main>
  );
}