"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

// Data for the feature grid
const features = [
  {
    title: "Artisan Crafted",
    description: "Hand-finished by master craftspeople in our Jaipur atelier",
  },
  {
    title: "Fair Trade",
    description: "Ethical sourcing and fair wages for every artisan in our chain",
  },
  {
    title: "Global Export",
    description: "Trusted by retailers and collectors in 40+ countries worldwide.",
  },
];

export default function OurStory() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  // Intersection Observer to trigger the pop-up animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 } // Triggers early on mobile
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  return (
    <section className="w-full py-16 lg:py-24 bg-white font-mona overflow-hidden" ref={sectionRef}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* --- MAIN LAYOUT: 50/50 Split --- */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
          
          {/* --- LEFT COLUMN: Image --- */}
          <div 
            className={`w-full lg:w-1/2 shrink-0 transform transition-all duration-1000 ease-out 
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}
            `}
          >
            {/* Image container scales nicely, maintaining an elegant portrait aspect ratio */}
            <div className="relative w-full aspect-[4/5] sm:aspect-square lg:aspect-[4/5] bg-[#f9f9f9] overflow-hidden rounded-sm group">
              <img 
                src="/images/home/OurStory.png" 
                alt="Gold necklace with flower pendant" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
            </div>
          </div>

          {/* --- RIGHT COLUMN: Content --- */}
          <div className="w-full lg:w-1/2 flex flex-col pt-2 lg:pt-0">
            
            {/* Header & Text wrapper */}
            <div 
              className={`flex flex-col transform transition-all duration-1000 delay-200 ease-out
                ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}
              `}
            >
              {/* Top Subheading */}
              <div className="flex items-center gap-3 sm:gap-4 text-[#00a3c4] text-xs sm:text-sm font-normal uppercase mb-4 lg:mb-6 tracking-widest">
                <span className="w-12 sm:w-16 h-px bg-[#00a3c4]"></span>
                <span>Our Story</span>
              </div>

              {/* Main Heading */}
              <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 lg:mb-8 leading-tight">
                Rooted in Jaipur, <br className="hidden lg:block"/>Worn <span className="italic text-[#00a3c4] font-medium">Worldwide</span>
              </h2>

              {/* Paragraphs */}
              <div className="flex flex-col gap-4 text-sm sm:text-base font-normal text-gray-600 leading-relaxed mb-10 max-w-xl">
                <p>
                  In the labyrinthine lanes of Jaipur&apos;s Johari Bazaar, a tradition of gemstone artistry has flourished for centuries. Puramente Jewel was born from a deep reverence for this heritage—marrying ancient craft with a modern, global aesthetic.
                </p>
                <p>
                  Every piece carries the fingerprint of a skilled artisan, the warmth of ethically sourced materials, and a story that travels far beyond its origin.
                </p>
              </div>
            </div>

            {/* Features Grid (Intelligent arrangement for 3 items) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 mb-10 max-w-xl">
              {features.map((feature, index) => {
                const animationDelay = `${400 + index * 150}ms`;
                // If it's the 3rd item, make it span both columns on tablet/desktop to avoid an empty gap
                const isLastOddItem = index === 2; 

                return (
                  <div 
                    key={index} 
                    className={`border border-[#00a3c4]/20 p-5 lg:p-6 flex flex-col justify-center gap-2 hover:bg-[#00a3c4]/5 hover:border-[#00a3c4]/50 transition-all duration-700 ease-out rounded-sm
                      ${isLastOddItem ? 'sm:col-span-2 sm:flex-row sm:items-center sm:gap-6' : ''}
                      ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}
                    `}
                    style={{ transitionDelay: isVisible ? animationDelay : '0ms' }}
                  >
                    <h3 className={`text-base font-bold text-[#00a3c4] tracking-wide ${isLastOddItem ? 'sm:w-1/3 sm:shrink-0' : ''}`}>
                      {feature.title}
                    </h3>
                    <p className="text-xs sm:text-sm font-normal text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Bottom Link */}
            <div 
              className={`transform transition-all duration-1000 ease-out
                ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}
              `}
              style={{ transitionDelay: isVisible ? '800ms' : '0ms' }}
            >
              <Link 
                href="/ourStory" 
                className="inline-flex items-center gap-2 text-[#00a3c4] text-xs sm:text-sm font-semibold uppercase tracking-widest pb-1.5 border-b-2 border-[#00a3c4]/20 hover:border-[#00a3c4] transition-colors"
              >
                Discover Our Story 
                <span className="text-lg leading-none">&rarr;</span>
              </Link>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}