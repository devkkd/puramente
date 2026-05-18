"use client";

import React from "react";
import Link from "next/link";

// Data array for the 4 bespoke steps
const bespokeSteps = [
  {
    number: "01",
    description: "Share your inspiration via WhatsApp or form",
  },
  {
    number: "02",
    description: "Receive design sketch within 48 hours",
  },
  {
    number: "03",
    description: "Approve & your piece is crafted in Jaipur",
  },
  {
    number: "04",
    description: "Delivered to your door, beautifully packaged",
  },
];

export default function Bespoke() {
  return (
    <section className="w-full py-10 lg:py-12 bg-white font-mona overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col">
        
        {/* --- TOP SECTION: Headers & Intro --- */}
        <div className="flex flex-col items-center text-center w-full mb-8 lg:mb-16">
          {/* Top Subheading */}
          <div className="flex items-center gap-3 lg:gap-4 text-[#00a3c4] text-xs sm:text-sm lg:text-base font-normal tracking-widest uppercase mb-4 lg:mb-6">
            <span className="w-12 sm:w-16 lg:w-24 h-px bg-[#00a3c4]"></span>
            <span>Bespoke Service</span>
            <span className="w-12 sm:w-16 lg:w-24 h-px bg-[#00a3c4]"></span>
          </div>

          {/* Main Heading */}
          <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 lg:mb-6 leading-tight">
            <span className="italic text-[#00a3c4] font-medium pr-1.5">Your</span> 
            Vision, Our Craft
          </h2>

          {/* Content Text */}
          <p className="text-sm font-normal text-gray-700 lg:text-gray-800 max-w-3xl leading-relaxed px-2">
            Commission A One-of-a-kind Piece, For A Proposal, A Wedding, An Anniversary, Or Simply Because You Deserve Something Made Only For You. <br className="hidden sm:block" />
            We Work With Individuals And Brands Globally.
          </p>
        </div>

        {/* --- BOTTOM SECTION: 40% Left / 60% Right --- */}
        {/* Added flex-col-reverse so the image appears ABOVE the steps on mobile, but stays on the RIGHT on desktop */}
        <div className="flex flex-col-reverse lg:flex-row gap-8 lg:gap-12 items-stretch">
          
          {/* LEFT COLUMN: 40% (Steps) */}
          <div className="w-full lg:w-[40%] flex flex-col justify-between shrink-0">
            <div className="flex flex-col gap-3 lg:gap-4">
              {bespokeSteps.map((step, index) => (
                <div 
                  key={index} 
                  className="border border-[#00a3c4]/40 lg:border-[#00a3c4]/60 px-5 py-4 lg:px-6 lg:py-5 flex items-center gap-4 lg:gap-6 hover:bg-[#00a3c4]/5 transition-colors rounded-sm lg:rounded-none"
                >
                  <span className="text-xl md:text-2xl font-bold text-[#00a3c4] shrink-0">
                    {step.number}
                  </span>
                  <span className="text-[13px] sm:text-sm font-medium lg:font-normal text-gray-800">
                    {step.description}
                  </span>
                </div>
              ))}
            </div>

            {/* Bottom Action Link */}
            <div className="mt-6 lg:mt-8 flex justify-center lg:justify-start">
              <Link 
                href="/custom" 
                className="inline-block text-[#00a3c4] text-xs sm:text-sm font-medium lg:font-normal uppercase tracking-widest pb-1.5 lg:pb-2 border-b border-[#00a3c4]/40 hover:border-[#00a3c4] transition-colors"
              >
                Start Your Custom Piece &rarr;
              </Link>
            </div>
          </div>

          {/* RIGHT COLUMN: 60% (Image) */}
          <div className="w-full lg:w-[60%] flex">
            {/* Height scales intelligently from mobile to desktop */}
            <div className="relative w-full h-[300px] sm:h-[400px] lg:h-auto lg:min-h-[450px]">
              <img 
                src="/images/home/BESPOKE.png" 
                alt="Artisan working on a 3D printed wax mold tree" 
                className="absolute inset-0 w-full h-full object-cover rounded-sm"
              />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}