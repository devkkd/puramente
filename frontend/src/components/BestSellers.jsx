"use client";

import React, { useState, useEffect, useRef } from "react";
import ProductCard from "./ProductCard";
import { getProducts } from "@/lib/api";

export default function BestSellers() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false); // For scroll animation
  const scrollContainerRef = useRef(null);
  const sectionRef = useRef(null); // Ref for intersection observer

  // Fetch, filter for Best Sellers, randomize, and limit to 10
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();

        if (response.success && response.data) {
          const bestSellersData = response.data.filter(
            (item) => item.bestSeller === true
          );

          const shuffled = bestSellersData.sort(() => 0.5 - Math.random());

          setProducts(shuffled.slice(0, 10));
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Intersection Observer to trigger the pop-up animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          // Only trigger once
          // observer.unobserve(sectionRef.current); 
        }
      },
      { threshold: 0.1 } // Triggers when 10% of the section is visible
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  // Sync custom progress bar with scroll position
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      const totalScroll = scrollWidth - clientWidth;

      if (totalScroll > 0) {
        const progress = (scrollLeft / totalScroll) * 100;
        setScrollProgress(progress);
      } else {
        setScrollProgress(0);
      }
    }
  };

  // Arrow button navigation (Sliding a full page/view of cards)
  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;

      // Scroll by the full visible width of the container, revealing all new cards
      const scrollAmount = container.clientWidth;

      if (direction === "left") {
        container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  return (
    <section className="w-full py-10 lg:py-16 bg-white overflow-hidden" ref={sectionRef}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">

        {/* --- HEADER SECTION --- */}
        {/* Wrapped in an animation div */}
        <div className={`flex flex-col items-center transform transition-all duration-1000 w-full px-2 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {/* Top Subheading */}
          <div className="flex items-center gap-3 lg:gap-4 text-[#00a3c4] text-xs sm:text-sm lg:text-base font-normal tracking-widest uppercase mb-4 lg:mb-6">
            <span className="w-12 sm:w-16 lg:w-24 h-px bg-[#00a3c4]"></span>
            <span>Curated For You</span>
            <span className="w-12 sm:w-16 lg:w-24 h-px bg-[#00a3c4]"></span>
          </div>

          {/* Main Heading */}
          <h2 className="font-playfair text-3xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-8 lg:mb-16 text-center leading-tight">
            <span className="italic text-[#00a3c4] font-medium pr-1">Best</span> Sellers
          </h2>
        </div>

        {/* --- CAROUSEL SECTION --- */}
        {loading ? (
          <div className="w-full py-16 lg:py-20 flex justify-center text-gray-400 text-sm tracking-widest uppercase animate-pulse">
            Loading best sellers...
          </div>
        ) : (
          <div className="w-full flex flex-col items-center">

            {/* Scrollable Products Track */}
            <div
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className="w-full flex overflow-x-auto gap-4 lg:gap-6 pb-6 lg:pb-12 snap-x snap-mandatory hide-scrollbar pt-2 lg:pt-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {products.length > 0 ? (
                products.map((product, index) => {
                  // Calculate staggered animation delay
                  const animationDelay = `${index * 100}ms`;

                  return (
                    // Width adjusted to precisely fit 5 cards on large screens, and slightly narrower on mobile to hint swiping
                    <div
                      key={product._id}
                      className={`snap-start shrink-0 w-[220px] sm:w-[240px] md:w-[250px] lg:w-[calc(20%-19.2px)] transform transition-all duration-1000 ease-out
                        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}
                      `}
                      style={{ transitionDelay: isVisible ? animationDelay : '0ms' }}
                    >
                      <ProductCard product={product} />
                    </div>
                  );
                })
              ) : (
                <div className="w-full py-10 text-center text-gray-400">No best sellers found.</div>
              )}
            </div>

            {/* --- NAVIGATION CONTROLS --- */}
            {products.length > 0 && (
              <div className={`flex items-center gap-4 lg:gap-6 mt-2 lg:mt-4 w-full max-w-xl px-2 lg:px-4 transform transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                {/* Left Arrow */}
                <button
                  onClick={() => scroll('left')}
                  className="text-[#00a3c4] hover:opacity-70 transition-opacity p-2"
                  aria-label="Scroll left"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 lg:w-6 lg:h-6">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                </button>

                {/* Progress Bar */}
                <div className="flex-grow h-px bg-[#dceef2] relative overflow-hidden">
                  <div
                    className="absolute left-0 top-0 bottom-0 bg-[#00a3c4] transition-all duration-150 ease-out"
                    style={{
                      width: '20%', // Size of the progress thumb
                      transform: `translateX(${(scrollProgress / 100) * (100 / 0.2 - 100)}%)`
                    }}
                  ></div>
                </div>

                {/* Right Arrow */}
                <button
                  onClick={() => scroll('right')}
                  className="text-[#00a3c4] hover:opacity-70 transition-opacity p-2"
                  aria-label="Scroll right"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 lg:w-6 lg:h-6">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              </div>
            )}

          </div>
        )}
      </div>

      {/* Global style to hide default scrollbar for the carousel */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </section>
  );
}