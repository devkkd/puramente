"use client";

import React from "react";
import Link from "next/link";

export default function ExhibitionCTA() {
  return (
    <section className="w-full py-10 lg:py-12 bg-white font-mona border-t border-gray-100">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-16">
        
        {/* --- LEFT COLUMN: Text Content --- */}
        <div className="w-full lg:w-1/2 flex flex-col items-center text-center lg:items-start lg:text-left">
          <h2 className="font-playfair text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 lg:mb-4 leading-tight">
            Discover Our <span className="italic text-[#00a3c4] font-medium pr-1">Exhibitions</span>
          </h2>
          <p className="text-sm font-normal text-gray-600 lg:text-gray-800 leading-relaxed max-w-lg">
            Explore our curated world-class exhibitions featuring extraordinary designs, exclusive previews, and creative minds from around the globe.
          </p>
        </div>

        {/* --- RIGHT COLUMN: Redirection Button --- */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end mt-4 lg:mt-0">
          <Link 
            href="/exhibitions"
            className="group flex items-center justify-center gap-3 bg-[#00a3c4] text-white px-8 py-4 text-xs sm:text-sm font-semibold uppercase tracking-widest hover:bg-[#00839d] transition-colors duration-300 rounded-sm shadow-sm"
          >
            View All Exhibitions
            {/* Arrow subtly slides to the right on hover */}
            <span className="transform transition-transform duration-300 group-hover:translate-x-1 font-serif text-lg leading-none">
              &rarr;
            </span>
          </Link>
        </div>

      </div>
    </section>
  );
}