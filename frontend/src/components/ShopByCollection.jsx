"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 
import Link from "next/link"; 
import { getCategories, getProducts } from "@/lib/api"; 

export default function ShopByCollection() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [productCounts, setProductCounts] = useState({}); 
  const [activeIndex, setActiveIndex] = useState(0);

  // --- RESPONSIVE STATE ---
  const [windowWidth, setWindowWidth] = useState(1400);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize(); // Set on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch categories and products simultaneously 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catResponse, prodResponse] = await Promise.all([
          getCategories(),
          getProducts()
        ]);
        
        if (catResponse.success && catResponse.data) {
          setCategories(catResponse.data);
        }

        if (prodResponse.success && prodResponse.data) {
          const counts = {};
          prodResponse.data.forEach((product) => {
            const catId = product.category?._id || product.category;
            if (catId) {
              counts[catId] = (counts[catId] || 0) + 1;
            }
          });
          setProductCounts(counts);
        }
      } catch (error) {
        console.error("Error fetching shop section dataset:", error);
      }
    };

    fetchData();
  }, []);

  // Navigation Handlers
  const handleNext = () => {
    if (activeIndex < categories.length - 1) {
      setActiveIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      setActiveIndex((prev) => prev - 1);
    }
  };

  // Card Click Handler
  const handleCardClick = (index, categoryName) => {
    if (index === activeIndex) {
      router.push(`/store/${categoryName.toLowerCase()}`);
    } else {
      setActiveIndex(index);
    }
  };

  // --- RESPONSIVE LUXURY STACK MATH ---
  const getCardStyle = (index) => {
    const diff = index - activeIndex;
    const isActive = index === activeIndex;
    
    // Check if desktop (fallback to true on server to prevent hydration jump)
    const isDesktop = !isMounted || windowWidth >= 1024;

    let fixedTranslateX;
    let scale;

    if (isDesktop) {
      // --- ORIGINAL EXACT DESKTOP MATH (UNCHANGED) ---
      fixedTranslateX = index * 210; 
      scale = isActive ? 1 : Math.max(1 - Math.abs(diff) * 0.12, 0.64);
    } else {
      // --- MODERN MOBILE MATH ---
      // Instead of locking to index, we slide the cards based on the difference from the active card
      // This ensures the active card is ALWAYS centered perfectly on the mobile screen.
      const spread = windowWidth < 640 ? 90 : 140; 
      const baseOffset = windowWidth < 640 ? 45 : 80; 
      
      fixedTranslateX = (diff * spread) + baseOffset;
      scale = isActive ? 1 : Math.max(1 - Math.abs(diff) * 0.15, 0.60);
    }

    const zIndex = 50 - Math.abs(diff);

    return {
      left: "0px",
      transform: `translateX(${fixedTranslateX}px) scale(${scale})`,
      zIndex,
      opacity: 1, 
      transformOrigin: "center center",
      pointerEvents: "auto", 
      transition: "transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1), z-index 0.8s",
    };
  };

  // Calculate Progress Bar Thumb Layout
  const thumbWidth = 30; 
  const maxTranslate = 100 - thumbWidth;
  const progressLeft = categories.length > 1 
    ? (activeIndex / (categories.length - 1)) * maxTranslate 
    : 0;

  const activeCategory = categories[activeIndex];
  const activeLinkUrl = activeCategory
    ? `/store/${activeCategory.name.toLowerCase()}` 
    : "#";

  return (
    <section className="w-full py-12 bg-white overflow-hidden max-w-[100vw]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-10 lg:gap-8 relative">
        
        {/* --- LEFT COLUMN: TEXT CONTENT --- */}
        <div className="w-full lg:w-[25%] flex flex-col items-center lg:items-start text-center lg:text-left shrink-0 z-49 bg-white/80 backdrop-blur-sm lg:bg-transparent rounded-xl relative lg:pr-8">
          <div className="flex items-center gap-4 text-[#4fa3b9] text-sm md:text-md font-normal tracking-widest uppercase mb-4 lg:mb-6">
            <span className="w-12 md:w-16 h-px bg-[#4fa3b9] hidden lg:block"></span>
            <span>Explore</span>
            <span className="w-12 h-px bg-[#4fa3b9] lg:hidden"></span>
          </div>

          <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 lg:mb-8 leading-tight">
            Shop by <br className="hidden lg:block" />
            <span className="italic text-[#4fa3b9] font-medium lg:pr-2">Categories</span>
          </h2>

          <p className="text-sm md:text-base font-normal text-gray-700 mb-6 md:mb-8 max-w-2xl text-center lg:text-start leading-relaxed">
            From Everyday Elegance To Statement Jewels, Every Piece Tells A Story Of Indian Craft Meeting Global Taste.
          </p>
        </div>

        {/* --- RIGHT COLUMN: SHOWCASE --- */}
        {/* Added mb-12 on mobile to give room for the navigation buttons below the cards */}
        <div className="w-full lg:w-[75%] flex flex-col relative h-[380px] sm:h-[450px] lg:h-[520px] z-30 lg:-ml-4 mb-12 lg:mb-0">
          
          {/* overflow-hidden on mobile prevents page stretching, overflow-visible on desktop allows wide stacking */}
          <div className="relative w-full h-full overflow-hidden lg:overflow-visible">
            {categories.length > 0 ? (
              categories.map((category, index) => {
                const isActive = index === activeIndex;
                const styleCount = productCounts[category._id] || 0;

                return (
                  <div 
                    key={category._id} 
                    onClick={() => handleCardClick(index, category.name)}
                    // Dynamic width for mobile/tablet/desktop
                    className={`absolute top-0 w-[240px] sm:w-[280px] lg:w-[340px] h-full cursor-pointer rounded-md overflow-hidden ${isActive ? 'shadow-2xl' : 'shadow-xl'}`}
                    style={getCardStyle(index)}
                  >
                    <img 
                      src={category.homeImageUrl} 
                      alt={category.homeName} 
                      className="w-full h-full object-cover"
                    />

                    <div className={`absolute inset-0 transition-colors duration-700 ${isActive ? 'bg-black/0' : 'bg-black/40'}`}></div>

                    <div className={`absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-6 lg:p-8 text-center text-white transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0 lg:opacity-100'}`}>
                      <h3 className="text-xl md:text-2xl font-medium mb-1 font-sans">{category.homeName}</h3>
                      <p className="text-[10px] md:text-xs text-gray-200 uppercase tracking-widest">
                        {styleCount} STYLES 
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                Loading collections...
              </div>
            )}
          </div>

          {/* Custom Navigation Controls */}
          {/* Pulled down safely on mobile (-bottom-12) */}
          <div className="absolute -bottom-12 lg:-bottom-6 left-0 lg:left-4 right-0 lg:right-auto w-full lg:w-[340px] flex items-center gap-6 px-4 lg:px-0 z-49">
            <button 
              onClick={handlePrev} 
              disabled={activeIndex === 0}
              className={`p-2 transition-opacity ${activeIndex === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-[#4fa3b9] hover:opacity-70'}`}
              aria-label="Previous"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </button>

            <div className="flex-grow h-px bg-[#dceef2] relative overflow-hidden">
              <div 
                className="absolute top-0 bottom-0 bg-[#4fa3b9] transition-all duration-700 ease-out"
                style={{ 
                  width: `${thumbWidth}%`, 
                  left: `${progressLeft}%` 
                }}
              ></div>
            </div>

            <button 
              onClick={handleNext} 
              disabled={activeIndex === categories.length - 1}
              className={`p-2 transition-opacity ${activeIndex === categories.length - 1 ? 'text-gray-300 cursor-not-allowed' : 'text-[#4fa3b9] hover:opacity-70'}`}
              aria-label="Next"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}