"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

// Data for the 2x2 feature grid
const features = [
  {
    title: "Artisan Crafted",
    description: "Hand-finished by master craftspeople in our Jaipur atelier",
  },
  {
    title: "BIS Hallmarked",
    description: "Certified 925 sterling silver, guaranteed purity with every piece",
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
      { threshold: 0.1 } // Lowered to 10% so it triggers smoothly on smaller mobile screens
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  return (
    <section className="w-full py-10 lg:py-16 bg-white font-mona overflow-hidden" ref={sectionRef}>
      {/* flex-col ensures image is perfectly placed at the top on mobile, flex-row keeps it on the left for desktop */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-6 lg:gap-16 items-center lg:items-start">
        
        {/* --- LEFT COLUMN: 40% (Image) --- */}
        <div 
          className={`w-full lg:w-[40%] shrink-0 transform transition-all duration-1000 ease-out 
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}
          `}
        >
          {/* Adjusted mobile aspect ratio to save vertical space, desktop stays 3/4 */}
          <div className="relative w-full aspect-square sm:aspect-[4/5] lg:aspect-[3/4] bg-gray-50/50 lg:bg-white flex items-center justify-center p-0 lg:p-4 rounded-xl lg:rounded-none overflow-hidden">
            <img 
              src="/images/home/OurStory.png" 
              alt="Gold necklace with flower pendant" 
              className="w-full h-full object-cover lg:object-contain"
            />
          </div>
        </div>

        {/* --- RIGHT COLUMN: 60% (Content) --- */}
        <div className="w-full lg:w-[60%] flex flex-col pt-2 lg:pt-8">
          
          {/* Header & Text wrapper (Animates in slightly after the image) */}
          <div 
            className={`flex flex-col transform transition-all duration-1000 delay-200 ease-out
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}
            `}
          >
            {/* Top Subheading */}
            <div className="flex items-center gap-3 sm:gap-4 text-[#00a3c4] text-xs sm:text-sm md:text-base font-normal uppercase mb-4 lg:mb-6 tracking-wide">
              <span className="w-12 sm:w-16 h-px bg-[#00a3c4]"></span>
              <span>Our Story</span>
            </div>

            {/* Main Heading */}
            <h2 className="font-playfair text-3xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 lg:mb-8 leading-tight">
              Rooted in Jaipur, Worn <span className="italic text-[#00a3c4] font-medium">Worldwide</span>
            </h2>

            {/* Paragraphs */}
            <div className="flex flex-col gap-3 lg:gap-6 text-sm font-normal text-gray-700 lg:text-gray-800 leading-relaxed mb-8 lg:mb-10 max-w-2xl">
              <p>
                In the labyrinthine lanes of Jaipur&apos;s Johari Bazaar, a tradition of gemstone artistry has flourished for centuries. Puramente Jewel was born from a deep reverence for this heritage marrying ancient craft with a modern, global aesthetic.
              </p>
              <p>
                Every piece carries the fingerprint of a skilled artisan, the warmth of ethically sourced materials, and a story that travels far beyond its origin.
              </p>
            </div>
          </div>

          {/* Features 2x2 Grid (Staggered cascading animation) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 mb-8 lg:mb-12 max-w-2xl">
            {features.map((feature, index) => {
              // Calculate a staggered delay so they pop up one by one after the text
              const animationDelay = `${400 + index * 150}ms`;

              return (
                <div 
                  key={index} 
                  className={`border border-[#00a3c4]/30 lg:border-[#00a3c4] p-5 lg:p-6 flex flex-col gap-2 lg:gap-3 hover:bg-[#00a3c4]/5 transform transition-all duration-700 ease-out rounded-xl lg:rounded-none
                    ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}
                  `}
                  style={{ transitionDelay: isVisible ? animationDelay : '0ms' }}
                >
                  <h3 className="text-base lg:text-lg font-bold text-[#00a3c4] tracking-wide">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm font-normal text-gray-600 lg:text-gray-700 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Bottom Link (Fades in last) */}
          <div 
            className={`transform transition-all duration-1000 ease-out pb-4
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}
            `}
            style={{ transitionDelay: isVisible ? '1000ms' : '0ms' }}
          >
            <Link 
              href="/ourStory" 
              className="inline-flex items-center text-[#00a3c4] text-xs sm:text-sm uppercase tracking-widest hover:text-[#0082a4] transition-colors pb-1 border-b border-[#00a3c4]/30 hover:border-[#0082a4]"
            >
              Discover Our Story &rarr;
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}