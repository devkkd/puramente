"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link"; 
import { useRouter } from "next/navigation"; 
import { getCategories, getProducts } from "@/lib/api"; 
import ProductCard from "@/components/ProductCard"; 
import { ArrowUp } from "lucide-react"; // <-- Added for Back to Top

export default function NewArrivalsPage() {
  const router = useRouter();

  // State for data
  const [categories, setCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  
  // State for UI
  const [activeTab, setActiveTab] = useState("ALL NEW ARRIVALS");
  const [loading, setLoading] = useState(true);
  
  // --- Load More & Auth State ---
  const [visibleCount, setVisibleCount] = useState(25);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Tab definitions
  const TABS = [
    "ALL NEW ARRIVALS",
    "ADORNED WITH GEMSTONE",
    "PLAIN WITHOUT GEMSTONE",
  ];

  // Check auth status on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("userToken");
      setIsLoggedIn(!!token);
    }
  }, []);

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

  // Reset visible count back to 25 when switching tabs
  useEffect(() => {
    setVisibleCount(25);
  }, [activeTab]);

  // Filter products based on the currently selected tab
  const filteredProducts = allProducts.filter((product) => {
    if (activeTab === "ALL NEW ARRIVALS") return true;

    const option = product.option?.toLowerCase() || "";

    if (activeTab === "PLAIN WITHOUT GEMSTONE") {
      return option.includes("without");
    }

    if (activeTab === "ADORNED WITH GEMSTONE") {
      return !option.includes("without") && option.includes("with");
    }

    return true;
  });

  // --- Slice the array based on visibleCount ---
  const displayedProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = filteredProducts.length > visibleCount;

  // --- Handle Load More Click ---
  const handleLoadMore = () => {
    if (!isLoggedIn) {
      router.push("/account"); 
      return;
    }
    setVisibleCount((prev) => prev + 25);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
          <div className="flex items-center gap-4 text-[#00a3c4] text-xs md:text-sm font-normal tracking-widest uppercase mb-4">
            <span className="w-12 md:w-20 h-px bg-[#00a3c4]"></span>
            <span>Just Landed</span>
            <span className="w-12 md:w-20 h-px bg-[#00a3c4]"></span>
          </div>

          <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            <span className="italic text-[#00a3c4] font-medium pr-1.5">New</span> Arrivals
          </h1>

          <p className="text-sm font-normal text-gray-700 max-w-2xl leading-relaxed">
            Fresh From Our Jaipur Atelier, Pieces That Just Completed Their Journey From The Artisan's Hands To Yours.
          </p>
        </div>

        {/* --- 2. CATEGORIES GRID --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-20 lg:mb-24">
          {categories.slice(0, 4).map((category) => (
            <Link 
              href={`/store/${category.name.toLowerCase()}`} 
              key={category._id} 
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="relative w-full aspect-square bg-[#005e5e] overflow-hidden mb-4 shadow-sm">
                <img
                  src={category.imageUrl} 
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
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
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-black"></span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* --- 4. PRODUCTS GRID --- */}
        {displayedProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-10">
              {displayedProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {/* --- 5. PAGINATION & BACK TO TOP (Synced from StorePage) --- */}
            <div className="mt-20 flex flex-col items-center justify-center gap-6 border-t border-gray-100 pt-12">
              
              {hasMore && (
                <button 
                  onClick={handleLoadMore}
                  className="bg-[#0082A4] text-white px-10 py-3.5 text-sm font-bold uppercase tracking-widest hover:bg-[#006a85] transition-colors shadow-sm rounded-sm"
                >
                  {isLoggedIn ? "Load More Products" : "Log In to View More"}
                </button>
              )}

              {(visibleCount > 25 || !hasMore) && displayedProducts.length > 10 && (
                <button 
                  onClick={scrollToTop}
                  className="flex items-center gap-2 text-gray-500 hover:text-[#0082A4] text-sm font-medium transition-colors uppercase tracking-widest"
                >
                  <ArrowUp size={16} />
                  Back to Top
                </button>
              )}

              {!hasMore && displayedProducts.length > 25 && (
                <p className="text-gray-400 text-xs uppercase tracking-widest mt-2">
                  You've viewed all products in this collection
                </p>
              )}

            </div>
          </>
        ) : (
          <div className="w-full py-16 text-center text-gray-400">
            No products found for this filter.
          </div>
        )}

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </main>
  );
}