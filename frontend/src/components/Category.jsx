"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { getCategories, getProducts } from "@/lib/api"; 

export default function Category() {
  const [categories, setCategories] = useState([]);
  const [productCounts, setProductCounts] = useState({}); 
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  // Fetch categories and products simultaneously
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          getCategories(),
          getProducts()
        ]);
        
        if (catRes.success && catRes.data) {
          setCategories(catRes.data);
        }

        // Calculate how many products are in each category
        if (prodRes.success && prodRes.data) {
          const counts = {};
          prodRes.data.forEach(product => {
            const catId = product.category?._id || product.category;
            if (catId) {
              counts[catId] = (counts[catId] || 0) + 1;
            }
          });
          setProductCounts(counts);
        }
        
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Intersection Observer to trigger the animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  return (
    <section className="w-full py-10 md:py-16 bg-white font-mona overflow-hidden" ref={sectionRef}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        
        {/* --- HEADER SECTION --- */}
        <div className={`flex flex-col items-center transform transition-all duration-1000 w-full ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="flex items-center gap-3 md:gap-4 text-[#4fa3b9] text-xs sm:text-sm font-normal tracking-widest uppercase mb-4 md:mb-6">
            <span className="w-12 sm:w-16 md:w-24 h-px bg-[#4fa3b9]"></span>
            <span>Category</span>
            <span className="w-12 sm:w-16 md:w-24 h-px bg-[#4fa3b9]"></span>
          </div>

          <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 text-center leading-tight">
            Find Your <span className="italic text-[#4fa3b9] font-medium pr-1">Signature</span> Piece
          </h2>

          <p className="text-sm md:text-base font-normal text-gray-700 mb-6 md:mb-8 max-w-2xl text-center px-4 leading-relaxed">
            From Everyday Elegance To Statement Jewels, Every Piece Tells A Story Of Indian Craft Meeting Global Taste.
          </p>

          <div className="text-[#4fa3b9] text-xs sm:text-sm md:text-base font-medium tracking-widest uppercase mb-10 md:mb-16 hover:text-[#3d8395] transition-colors pb-1 border-b border-transparent hover:border-[#3d8395]">
            Plain Without Gemstone
          </div>
        </div>

        {/* --- GRID SECTION --- */}
        {loading ? (
          <div className="w-full py-20 flex justify-center text-gray-400 text-sm tracking-widest uppercase animate-pulse">
            Loading categories...
          </div>
        ) : (
          /* Switched to grid-cols-2 on mobile for a more premium e-commerce look */
          <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {categories.map((category, index) => {
              const animationDelay = `${index * 150}ms`;
              const styleCount = productCounts[category._id] || 0;

              return (
                <Link 
                  key={category._id} 
                  href={`/store/${category.name.toLowerCase()}?tab=plain`}
                  className={`flex flex-col group cursor-pointer transform transition-all duration-1000 ease-out
                    ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}
                  `}
                  style={{ transitionDelay: isVisible ? animationDelay : '0ms' }}
                >
                  
                  <div className="relative w-full aspect-[4/5] overflow-hidden mb-3 sm:mb-5 rounded-sm shadow-sm">
                    <img 
                      src={category.imageUrl} 
                      alt={category.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 sm:opacity-90 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="absolute bottom-4 sm:bottom-6 inset-x-0 text-center flex items-center justify-center gap-1.5 sm:gap-2 px-2">
                      <span className="text-white text-base sm:text-lg font-medium truncate">{category.name}</span>
                      <svg 
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white transform group-hover:translate-x-1 transition-transform shrink-0" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                  </div>
                  
                  <p className="text-center text-[10px] sm:text-xs md:text-sm font-normal text-gray-500 group-hover:text-gray-900 transition-colors uppercase tracking-widest">
                    {styleCount} STYLES
                  </p>
                  
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}