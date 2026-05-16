"use client";

import React from "react";

export default function VideoSection() {
  return (
    <section className="w-full py-6 md:py-8 bg-white">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Video Wrapper */}
        <div className="relative w-full aspect-video overflow-hidden shadow-sm group cursor-pointer">
          
          {/* Thumbnail Image */}
          <img 
            src="/images/home/video.png" 
            alt="Jewelry making process - Behind the scenes" 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />

          {/* Subtle Overlay (Darkens slightly on hover to make play button pop) */}
          <div className="absolute inset-0 bg-black/5 group-hover:bg-black/20 transition-colors duration-500"></div>

          {/* Centered Play Button */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <button 
              className="w-16 h-16 md:w-20 md:h-20 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 pointer-events-auto group-hover:bg-white/40 group-hover:scale-110 transition-all duration-300"
              aria-label="Play Video"
            >
              {/* Play Triangle Icon */}
              <svg 
                className="w-6 h-6 md:w-8 md:h-8 ml-1 md:ml-1.5" 
                viewBox="0 0 24 24" 
                fill="white" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M5 3L19 12L5 21V3Z" 
                  stroke="white" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

        </div>
        
      </div>
    </section>
  );
}