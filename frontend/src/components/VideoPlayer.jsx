"use client";

import React, { useState } from "react";
import Image from "next/image";

export default function VideoSection() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="w-full py-6 md:py-8 bg-white">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Video Wrapper */}
        <div className="relative w-full aspect-video overflow-hidden shadow-sm rounded-sm bg-gray-100">
          
          {!isPlaying ? (
            /* --- CUSTOM THUMBNAIL FACADE --- */
            <div 
              className="absolute inset-0 w-full h-full group cursor-pointer"
              onClick={() => setIsPlaying(true)}
            >
              {/* Thumbnail Image */}
              <Image
                src="/images/home/video.png"
                alt="Jewelry making process - Behind the scenes"
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 1100px"
              />

              {/* Subtle Overlay */}
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-500"></div>

              {/* Centered Play Button */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <button 
                  className="w-16 h-16 md:w-20 md:h-20 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 pointer-events-auto group-hover:bg-white/40 group-hover:scale-110 transition-all duration-300"
                  aria-label="Play Video"
                >
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
          ) : (
            /* --- YOUTUBE IFRAME --- */
            <iframe 
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/VQ0yrr-pPhE?autoplay=1&rel=0" 
              title="YouTube video player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          )}

        </div>
        
      </div>
    </section>
  );
}