"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link"; // Added Link import
import { getCategories, getProducts } from "@/lib/api"; // Adjust path if necessary
import ProductCard from "@/components/ProductCard"; // Adjust path to your ProductCard component

export default function NewArrivalsPage() {
  // State for data
  const [categories, setCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  
  // State for UI
  const [activeTab, setActiveTab] = useState("ALL NEW ARRIVALS");
  const [loading, setLoading] = useState(true);

  // Tab definitions
  const TABS = [
    "ALL NEW ARRIVALS",
    "ADORNED WITH GEMSTONE",
    "PLAIN WITHOUT GEMSTONE",
  ];

  // Fetch Categories & Products concurrently on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, productsRes] = await Promise.all([
          getCategories(),
          getProducts(),
        ]);

        if (categoriesRes?.success && categoriesRes?.data) {
          setCategories(categoriesRes.data);
        }

        if (productsRes?.success && productsRes?.data) {
          // Filter out ONLY products marked as newArrival directly from the full list
          const newArrivals = productsRes.data.filter(
            (product) => product.newArrival === true
          );
          setAllProducts(newArrivals);
        }
      } catch (error) {
        console.error("Error fetching data for New Arrivals page:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter products based on the currently selected tab
  const filteredProducts = allProducts.filter((product) => {
    if (activeTab === "ALL NEW ARRIVALS") return true;

    // Safely grab the option string (e.g., "without gem", "with gem")
    const option = product.option?.toLowerCase() || "";

    if (activeTab === "PLAIN WITHOUT GEMSTONE") {
      return option.includes("without");
    }

    if (activeTab === "ADORNED WITH GEMSTONE") {
      // Exclude "without" just to be safe, and check for "with" or assume any non-plain item fits
      return !option.includes("without") && option.includes("with");
    }

    return true;
  });

  if (loading) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center font-mona text-gray-500">
        Loading new arrivals...
      </div>
    );
  }

  return (
    <main className="w-full bg-white font-mona pb-24">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        
        {/* --- 1. HEADER SECTION --- */}
        <div className="flex flex-col items-center text-center w-full mb-12">
          {/* Top Subheading */}
          <div className="flex items-center gap-4 text-[#00a3c4] text-xs md:text-sm font-normal tracking-widest uppercase mb-4">
            <span className="w-12 md:w-20 h-px bg-[#00a3c4]"></span>
            <span>Just Landed</span>
            <span className="w-12 md:w-20 h-px bg-[#00a3c4]"></span>
          </div>

          {/* Main Heading */}
          <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            <span className="italic text-[#00a3c4] font-medium pr-1.5">New</span> Arrivals
          </h1>

          {/* Description Text */}
          <p className="text-sm font-normal text-gray-700 max-w-2xl leading-relaxed">
            Fresh From Our Jaipur Atelier, Pieces That Just Completed Their Journey From The Artisan&apos;s Hands To Yours.
          </p>
        </div>

        {/* --- 2. CATEGORIES GRID --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-20 lg:mb-24">
          {categories.slice(0, 4).map((category) => (
            // Changed from div to Link to navigate to the store page
            <Link 
              href={`/store/${category.name.toLowerCase()}`} 
              key={category._id} 
              className="flex flex-col items-center group cursor-pointer"
            >
              {/* Category Image (Square) */}
              <div className="relative w-full aspect-square bg-[#005e5e] overflow-hidden mb-4 shadow-sm">
                <img
                  src={category.imageUrl} // Using the image from the velvet background
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              {/* Category Name */}
              <h3 className="text-base font-medium text-gray-900">
                {category.name}
              </h3>
            </Link>
          ))}
        </div>

        {/* --- 3. SUB-CATEGORIES / TABS --- */}
        <div className="w-full flex justify-center mb-10 border-b border-gray-200">
          <div className="flex items-center space-x-6 md:space-x-12 overflow-x-auto hide-scrollbar">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative pb-4 text-[13px] md:text-sm uppercase tracking-wide transition-colors whitespace-nowrap ${
                  activeTab === tab
                    ? "text-black font-bold"
                    : "text-gray-400 font-medium hover:text-gray-600"
                }`}
              >
                {tab}
                {/* Active Indicator Line */}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-black"></span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* --- 4. PRODUCTS GRID --- */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-10">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="w-full py-16 text-center text-gray-400">
            No products found for this filter.
          </div>
        )}

      </div>

      {/* Global style for hiding scrollbars on mobile tabs if needed */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </main>
  );
}