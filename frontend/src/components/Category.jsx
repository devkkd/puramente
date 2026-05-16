"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { getCategories } from "@/lib/api"; 

export default function Category() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  // Fetch categories using centralized Axios API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        
        if (response.success && response.data) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Intersection Observer to trigger the animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // When the section comes into view, set visible to true
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          // Optional: unobserve after triggering once if you only want the animation once
          // observer.unobserve(sectionRef.current);
        }
      },
      {
        threshold: 0.1, // Trigger when 10% of the section is visible
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  return (
    <section className="w-full py-16 bg-white font-mona" ref={sectionRef}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        
        {/* --- HEADER SECTION --- */}
        <div className={`flex flex-col items-center transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="flex items-center gap-4 text-[#4fa3b9] text-base font-normal tracking-widest uppercase mb-6">
            <span className="w-16 md:w-24 h-px bg-[#4fa3b9]"></span>
            <span>Category</span>
            <span className="w-16 md:w-24 h-px bg-[#4fa3b9]"></span>
          </div>

          <h2 className="font-playfair text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-5 text-center">
            Find Your <span className="italic text-[#4fa3b9] font-medium pr-1">Signature</span> Piece
          </h2>

          <p className="text-sm font-normal text-gray-800 mb-8 max-w-3xl text-center">
            From Everyday Elegance To Statement Jewels Every Piece Tells A Story Of Indian Craft Meeting Global Taste.
          </p>

          <button className="text-[#4fa3b9] text-base font-medium tracking-widest uppercase mb-16 hover:text-[#3d8395] transition-colors">
            Plain Without Gemstone
          </button>
        </div>

        {/* --- GRID SECTION --- */}
        {loading ? (
          <div className="w-full py-20 flex justify-center text-gray-400">Loading categories...</div>
        ) : (
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 overflow-hidden">
            {categories.map((category, index) => {
              // Calculate a staggered delay based on the index (0.1s, 0.2s, 0.3s, etc.)
              const animationDelay = `${index * 150}ms`;

              return (
                <Link 
                  key={category._id} 
                  href={`/store/${category.name.toLowerCase()}?tab=plain`}
                  // The animation classes: starts translated down and transparent, transitions to normal
                  className={`flex flex-col group cursor-pointer transform transition-all duration-1000 ease-out
                    ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}
                  `}
                  style={{ transitionDelay: isVisible ? animationDelay : '0ms' }}
                >
                  
                  <div className="relative w-full aspect-[4/5] overflow-hidden mb-5">
                    <img 
                      src={category.imageUrl} 
                      alt={category.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="absolute bottom-6 inset-x-0 text-center flex items-center justify-center gap-2">
                      <span className="text-white text-lg font-medium">{category.name}</span>
                      <svg 
                        className="w-4 h-4 text-white transform group-hover:translate-x-1 transition-transform" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                  </div>
                  
                  <p className="text-center text-sm font-normal text-gray-700 uppercase tracking-widest">
                    386 STYLES
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