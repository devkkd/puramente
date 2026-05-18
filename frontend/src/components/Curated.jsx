"use client";

import React from "react";
import Link from "next/link";

export default function Curated() {
  return (
    <section 
      // Removed the invalid `px-25` which breaks mobile width, replaced with proper responsive padding
      className="relative w-full min-h-[400px] md:min-h-[600px] bg-cover bg-[center_top_20%] md:bg-center bg-no-repeat font-mona flex items-end overflow-hidden"
      style={{ backgroundImage: "url('/images/home/curated.png')" }}
    >
      {/* Container uses flex-col. 
        On desktop: min-h-[600px] keeps text at top, absolute button at bottom right.
        On mobile: padding adjusted for a modern, clean look without overflow.
      */}
      <div className="relative w-full max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-8 h-full min-h-[400px] md:min-h-[600px] flex flex-col justify-between py-10 md:py-5">
        
        {/* --- LEFT TEXT BLOCK --- */}
        <div className="flex flex-col max-w-md">
          
          {/* Top Subheading */}
          <div className="flex items-center gap-3 md:gap-4 text-black text-xs sm:text-sm md:text-base font-normal tracking-widest uppercase mb-4 md:mb-6">
            <span className="w-10 md:w-16 h-px bg-black"></span>
            <span>Curated</span>
          </div>

          {/* Main Heading */}
          <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-4 md:mb-6 leading-tight">
            The Collections That,<br />
            <span className="italic font-medium pr-1">Define</span> Puramente
          </h2>

          {/* Content Text */}
          <p className="text-sm md:text-base font-normal text-black leading-relaxed max-w-[280px] md:max-w-[320px]">
            Three Worlds Of Jewelry, Each With Its Own Soul. Find The ONE That Speaks To Yours.
          </p>
          
        </div>

        {/* --- RIGHT BUTTON BLOCK --- */}
        {/* Kept desktop absolute positioning exactly the same, fixed mobile alignment */}
        <div className="mt-8 md:mt-0 flex justify-start md:justify-end md:absolute md:bottom-5 md:right-8 lg:right-8">
          <Link 
            href="/products" 
            className="inline-flex items-center justify-center bg-[#111111] text-white text-xs sm:text-sm font-medium px-8 py-3.5 rounded-xl hover:bg-black hover:scale-105 transition-all duration-300 shadow-xl"
          >
            See All Products <span className="ml-2">&rarr;</span>
          </Link>
        </div>

      </div>
    </section>
  );
}