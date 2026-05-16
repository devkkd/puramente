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
    <section className="w-full py-8 bg-white font-mona">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col">
        
        {/* --- TOP SECTION: Headers & Intro --- */}
        <div className="flex flex-col items-center text-center w-full mb-16">
          {/* Top Subheading */}
          <div className="flex items-center gap-4 text-[#00a3c4] text-base font-normal tracking-widest uppercase mb-6">
            <span className="w-16 md:w-24 h-px bg-[#00a3c4]"></span>
            <span>Bespoke Service</span>
            <span className="w-16 md:w-24 h-px bg-[#00a3c4]"></span>
          </div>

          {/* Main Heading */}
          <h2 className="font-playfair text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            <span className="italic text-[#00a3c4] font-medium pr-2">Your</span> 
            Vision, Our Craft
          </h2>

          {/* Content Text */}
          <p className="text-sm font-normal text-gray-800 max-w-3xl leading-relaxed">
            Commission A One-of-a-kind Piece, For A Proposal, A Wedding, An Anniversary, Or Simply Because You Deserve Something Made Only For You. <br className="hidden sm:block" />
            We Work With Individuals And Brands Globally.
          </p>
        </div>

        {/* --- BOTTOM SECTION: 40% Left / 60% Right --- */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-12 items-stretch">
          
          {/* LEFT COLUMN: 40% (Steps) */}
          <div className="w-full lg:w-[40%] flex flex-col justify-between shrink-0">
            <div className="flex flex-col gap-4">
              {bespokeSteps.map((step, index) => (
                <div 
                  key={index} 
                  className="border border-[#00a3c4]/60 px-6 py-5 flex items-center gap-6 hover:bg-[#00a3c4]/5 transition-colors"
                >
                  <span className="text-xl md:text-2xl font-bold text-[#00a3c4]">
                    {step.number}
                  </span>
                  <span className="text-sm font-normal text-gray-800">
                    {step.description}
                  </span>
                </div>
              ))}
            </div>

            {/* Bottom Action Link */}
            <div className="mt-8">
              <Link 
                href="/custom" 
                className="inline-block text-[#00a3c4] text-sm font-normal pb-2 border-b border-[#00a3c4]/40 hover:border-[#00a3c4] transition-colors"
              >
                Start Your Custom Piece &rarr;
              </Link>
            </div>
          </div>

          {/* RIGHT COLUMN: 60% (Image) */}
          <div className="w-full lg:w-[60%] flex">
            <div className="relative w-full h-[350px] lg:h-auto min-h-[400px]">
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