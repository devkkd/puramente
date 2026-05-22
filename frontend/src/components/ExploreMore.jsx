"use client";

import React from "react";
import Link from "next/link";
import { Gem, BookOpen, ShieldCheck, Landmark } from "lucide-react";

export default function ExploreMore() {
  const exploreLinks = [
    {
      title: "Jewelry Designs",
      description: "Uncover stunning jewelry that fuses timeless elegance with innovative craftsmanship, crafted to enchant.",
      // Replaced fixed size with responsive Tailwind classes
      icon: <Gem className="w-6 h-6 md:w-7 md:h-7" strokeWidth={1.5} />,
      href: "/new-in",
    },
    {
      title: "About Us",
      description: "We are dedicated craftsmen weaving narratives through jewelry, merging tradition with creativity.",
      icon: <BookOpen className="w-6 h-6 md:w-7 md:h-7" strokeWidth={1.5} />,
      href: "/ourStory",
    },
    {
      title: "Fair Trade",
      description: "Fair trade is a social and economic movement aimed at ensuring ethical and sustainable practices in global trade.",
      icon: <ShieldCheck className="w-6 h-6 md:w-7 md:h-7" strokeWidth={1.5} />,
      href: "/fair-trade",
    },
    {
      title: "Visit Jaipur",
      description: "Start your exquisite journey from Jaipur jewelry manufactures, where rich heritage and master craftsmanship reside.",
      icon: <Landmark className="w-6 h-6 md:w-7 md:h-7" strokeWidth={1.5} />,
      href: "/visit-studio",
    },
  ];

  return (
    <section className="w-full bg-[#fcfcfc] py-16 md:py-20 lg:py-28 font-mona border-t border-gray-100">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center w-full mb-10 md:mb-16">
          <div className="flex items-center gap-2 md:gap-4 text-[#00a3c4] text-[10px] sm:text-xs md:text-sm font-normal tracking-widest uppercase mb-3 md:mb-4">
            <span className="w-8 sm:w-12 md:w-20 h-px bg-[#00a3c4]/50"></span>
            <span>Discover Puramente</span>
            <span className="w-8 sm:w-12 md:w-20 h-px bg-[#00a3c4]/50"></span>
          </div>
          <h2 className="font-playfair text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 capitalize">
            <span className="italic text-[#00a3c4] font-medium pr-1 md:pr-2">Explore</span> 
            More
          </h2>
        </div>

        {/* Cards Grid: Changed to grid-cols-2 for mobile */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
          {exploreLinks.map((item, index) => (
            <Link 
              key={index} 
              href={item.href}
              // Scaled down padding on mobile
              className="group flex flex-col items-center text-center bg-white p-4 sm:p-6 md:p-8 lg:p-10 rounded-xl md:rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#00a3c4]/30 transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Icon Container: Scaled down circle size for mobile */}
              <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-[#E6FDF9] text-[#0082a4] rounded-full flex items-center justify-center mb-4 md:mb-6 group-hover:bg-[#00a3c4] group-hover:text-white transition-colors duration-300">
                {item.icon}
              </div>
              
              {/* Text Content: Adjusted font sizes for mobile */}
              <h3 className="font-playfair text-[15px] sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-2 md:mb-3 group-hover:text-[#00a3c4] transition-colors">
                {item.title}
              </h3>
              <p className="text-[11px] sm:text-xs md:text-sm text-gray-600 leading-relaxed font-normal">
                {item.description}
              </p>
              
              {/* Subtle visual indicator: Visible on mobile, hidden on desktop until hover */}
              <div className="mt-auto pt-4 md:pt-6 flex items-center gap-1.5 md:gap-2 text-[#00a3c4] text-[10px] sm:text-xs font-bold uppercase tracking-widest opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
                Learn More <span className="text-sm md:text-lg leading-none">&rarr;</span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}