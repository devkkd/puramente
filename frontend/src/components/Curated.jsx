"use client";

import React from "react";
import Link from "next/link";

export default function Curated() {
  return (
    <section 
      className="px-25 relative w-full min-h-[500px] md:min-h-[600px] bg-cover bg-center bg-no-repeat font-mona flex items-end overflow-hidden"
      style={{ backgroundImage: "url('/images/home/curated.png')" }}
    >
      {/* Container using flex-col to easily push the button to the bottom right 
        while keeping the text block at the top left 
      */}
      <div className="relative w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-between py-3 md:py-5">
        
        {/* --- LEFT TEXT BLOCK --- */}
        <div className="flex flex-col max-w-md">
          
          {/* Top Subheading */}
          <div className="flex items-center gap-4 text-black text-base font-normal tracking-widest uppercase mb-6">
            <span className="w-12 md:w-16 h-px bg-black"></span>
            <span>Curated</span>
          </div>

          {/* Main Heading */}
          <h2 className="font-playfair text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-6 leading-tight">
            The Collections That,<br />
            <span className="italic font-medium pr-1">Define</span> Puramente
          </h2>

          {/* Content Text */}
          <p className="text-sm font-normal text-black leading-relaxed max-w-[320px]">
            Three Worlds Of Jewelry, Each With Its Own Soul. Find The ONE That Speaks To Yours.
          </p>
          
        </div>

        {/* --- RIGHT BUTTON BLOCK --- */}
        <div className="mt-12 md:mt-0 flex justify-start md:justify-end md:absolute md:bottom-5 md:right-8 lg:right-8">
          <Link 
            href="/products" 
            className="inline-flex items-center justify-center bg-[#111111] text-white text-sm font-normal px-8 py-3.5 rounded-xl hover:bg-black hover:scale-105 transition-all duration-300 shadow-xl"
          >
            See All Products <span className="ml-2">&rarr;</span>
          </Link>
        </div>

      </div>
    </section>
  );
}