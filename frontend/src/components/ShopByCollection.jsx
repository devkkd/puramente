"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 
import Link from "next/link"; 
import { getCategories } from "@/lib/api"; 

export default function ShopByCollection() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  // Fetch categories using centralized Axios API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        
        // The interceptor already returns the parsed JSON payload
        if (response.success && response.data) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
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
      // If clicking the active card, navigate to the store page with the gemstone tab
      router.push(`/store/${categoryName.toLowerCase()}?tab=gemstone`);
    } else {
      // If clicking a background card, bring it to the front
      setActiveIndex(index);
    }
  };

  // --- UPGRADED STATIC LUXURY STACK MATH ---
  const getCardStyle = (index) => {
    const diff = index - activeIndex;

    // 1. FIXED X POSITION: Every card stays permanently at its assigned slot.
    // 170px spread with 340px cards creates a perfect 50% overlap.
    // This prevents the stack from overflowing off the right edge of the screen.
    const fixedTranslateX = index * 210; 

    // 2. SCALE: Only depth changes. No lateral sliding.
    // Active = 1. Non-active progressively shrink: 0.88, 0.76, 0.64
    const isActive = index === activeIndex;
    const scale = isActive ? 1 : Math.max(1 - Math.abs(diff) * 0.12, 0.64);

    // 3. Z-INDEX: Active card dominates at the top of the stack
    const zIndex = 50 - Math.abs(diff);

    return {
      left: "0px",
      transform: `translateX(${fixedTranslateX}px) scale(${scale})`,
      zIndex,
      opacity: 1, // FIX: Past cards no longer disappear. They stay visible on the left.
      // Scaling from the center keeps the overlap mathematically balanced on both left and right sides
      transformOrigin: "center center",
      pointerEvents: "auto", 
      // Premium transition focusing purely on zoom, shadow, and z-index layering. No X/Y sliding.
      transition: "transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1), z-index 0.8s",
    };
  };

  // Calculate Progress Bar Thumb
  const thumbWidth = 30; // 30% width for the progress thumb
  const maxTranslate = 100 - thumbWidth;
  const progressLeft = categories.length > 1 
    ? (activeIndex / (categories.length - 1)) * maxTranslate 
    : 0;

  // Determine the dynamic URL for the text link based on the currently active category
  const activeCategory = categories[activeIndex];
  const activeLinkUrl = activeCategory 
    ? `/store/${activeCategory.name.toLowerCase()}?tab=gemstone` 
    : "#";

  return (
    <section className="w-full py-12 bg-white overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12 lg:gap-8 relative">
        
        {/* --- LEFT COLUMN: TEXT CONTENT (Reduced to 25% width) --- */}
        <div className="w-full lg:w-[25%] flex flex-col items-center lg:items-start text-center lg:text-left shrink-0 z-50 bg-white/80 backdrop-blur-sm lg:bg-transparent p-4 lg:p-0 rounded-xl relative lg:pr-8">
          {/* Subtitle */}
          <div className="flex items-center gap-4 text-[#4fa3b9] text-sm md:text-md font-normal tracking-widest uppercase mb-6">
            <span className="w-12 md:w-16 h-px bg-[#4fa3b9] hidden lg:block"></span>
            <span>Explore</span>
            <span className="w-12 h-px bg-[#4fa3b9] lg:hidden"></span>
          </div>

          {/* Heading */}
          <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-8 leading-tight">
            Shop by <br className="hidden lg:block" />
            <span className="italic text-[#4fa3b9] font-medium lg:pr-2">Collection</span>
          </h2>

          {/* Bottom Link */}
          <Link 
            href={activeLinkUrl} 
            className="text-[#4fa3b9] text-sm md:text-md font-normal tracking-widest uppercase hover:text-[#3d8395] transition-colors"
          >
            Adorned With Gemstone
          </Link>
        </div>

        {/* --- RIGHT COLUMN: STATIC LUXURY SHOWCASE (Expanded to 75% width) --- */}
        <div className="w-full lg:w-[75%] flex flex-col relative h-[450px] lg:h-[520px] z-30 lg:-ml-4">
          
          <div className="relative w-full h-full overflow-visible">
            {categories.length > 0 ? (
              categories.map((category, index) => {
                const isActive = index === activeIndex;

                return (
                  <div 
                    key={category._id} 
                    onClick={() => handleCardClick(index, category.name)}
                    // Decreased max-width to 340px to prevent right-side overflow and create better proportions
                    className={`absolute top-0 w-[240px] sm:w-[280px] lg:w-[340px] h-full cursor-pointer rounded-sm overflow-hidden ${isActive ? 'shadow-2xl' : 'shadow-xl'}`}
                    style={getCardStyle(index)}
                  >
                    <img 
                      src={category.homeImageUrl} 
                      alt={category.homeName} 
                      className="w-full h-full object-cover"
                    />

                    {/* Subtle Overlay: Bright when active, dimmed when resting */}
                    <div className={`absolute inset-0 transition-colors duration-700 ${isActive ? 'bg-black/0' : 'bg-black/40'}`}></div>

                    {/* Gradient & Text */}
                    <div className={`absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-8 text-center text-white transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0 lg:opacity-100'}`}>
                      <h3 className="text-xl md:text-2xl font-medium mb-1 font-sans">{category.homeName}</h3>
                      <p className="text-[10px] md:text-xs text-gray-200 uppercase tracking-widest">
                        386 STYLES
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

          {/* Custom Navigation Controls (Bottom Right) */}
          <div className="absolute -bottom-16 lg:-bottom-6 left-0 lg:left-4 right-0 lg:right-auto w-full lg:w-[340px] flex items-center gap-6 px-4 lg:px-0 z-50">
            {/* Left Arrow */}
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

            {/* Progress Bar Container */}
            <div className="flex-grow h-px bg-[#dceef2] relative overflow-hidden">
              <div 
                className="absolute top-0 bottom-0 bg-[#4fa3b9] transition-all duration-700 ease-out"
                style={{ 
                  width: `${thumbWidth}%`, 
                  left: `${progressLeft}%` 
                }}
              ></div>
            </div>

            {/* Right Arrow */}
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