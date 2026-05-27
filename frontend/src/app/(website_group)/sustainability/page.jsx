"use client";

import React from "react";
import Image from "next/image";

export default function SustainabilityPage() {
  return (
    <main className="w-full bg-white font-mona pb-24 pt-16">
      
      {/* --- HERO SECTION --- */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20 flex flex-col items-center text-center">
        <div className="flex items-center gap-4 text-[#00a3c4] text-xs md:text-sm font-normal tracking-widest uppercase mb-4">
          <span className="w-12 md:w-20 h-px bg-[#00a3c4]/50"></span>
          <span>Sustainability</span>
          <span className="w-12 md:w-20 h-px bg-[#00a3c4]/50"></span>
        </div>

        <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight mb-6">
          <span className="italic text-[#00a3c4] font-medium pr-1.5">Sustainability</span> Woven into Every Creation
        </h1>

        <p className="text-sm font-normal text-gray-700 max-w-3xl leading-relaxed">
          Puramente Jewel Creates Consciously Crafted Jewellery Through Ethical Sourcing, Sustainable Practices, And Enduring Support For Artisan Communities.
        </p>
      </section>

      {/* --- INTRO / QUOTE SECTION --- */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-0 items-stretch">
          
          {/* Left Text Box */}
          <div className="py-10 md:py-16 lg:py-20 lg:pr-16 bg-white flex flex-col justify-center">
            <h2 className="font-playfair text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Sustainability
            </h2>
            <p className="text-sm font-normal text-gray-700 leading-relaxed">
              Puramente Jewel was founded on the belief that beauty and responsibility are not opposing values they are inseparable ones. The brand's sustainability framework is built on three pillars: ethical sourcing of materials, environmentally conscious production, and the long-term empowerment of the artisan community.
            </p>
          </div>

          {/* Right Quote Box */}
          <div className="bg-[#E6FDF9] p-10 md:p-16 flex items-center justify-center text-center rounded-sm">
            <p className="font-playfair text-2xl md:text-3xl lg:text-4xl text-[#00a3c4] italic leading-snug">
              "We do not borrow from the earth.<br/>We borrow from the future."
            </p>
          </div>

        </div>
      </section>

      {/* --- ETHICAL SOURCING SECTION --- */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        
        {/* Header Split */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 lg:gap-12 mb-12">
          <div className="lg:w-1/2">
            <h2 className="font-playfair text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
              <span className="italic text-[#00a3c4] font-medium pr-1.5">Ethical</span> Material Sourcing
            </h2>
          </div>
          <div className="lg:w-1/2">
            <p className="text-sm font-normal text-gray-700 leading-relaxed pb-1">
              Every material that enters the Puramente studio is traced to its origin. The brand works exclusively with suppliers who meet rigorous standards for both environmental practice and human rights.
            </p>
          </div>
        </div>

        {/* Large Image */}
        <div className="w-full h-[40vh] md:h-[60vh] lg:h-[70vh] bg-gray-100 mb-16 rounded-sm overflow-hidden shadow-sm">
          <img 
            src="/images/New folder/hawa1.png" 
            alt="Hand sketching jewelry designs alongside finished gold pieces" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* 4-Column Text Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:gap-y-12 sm:divide-x divide-gray-200">
          
          <div className="px-4 py-8 sm:py-0 lg:px-8 flex flex-col items-center text-center">
            <h3 className="text-base md:text-lg font-bold text-gray-900 mb-4 min-h-[56px] flex items-center justify-center">Recycled Precious Metals</h3>
            <p className="text-sm font-normal text-gray-700 leading-relaxed">
              Gold and silver are sourced from certified post-consumer recycled streams, eliminating the need for destructive new mining and significantly reducing the carbon footprint of each piece.
            </p>
          </div>

          <div className="px-4 py-8 sm:py-0 lg:px-8 flex flex-col items-center text-center">
            <h3 className="text-base md:text-lg font-bold text-gray-900 mb-4 min-h-[56px] flex items-center justify-center">Conflict-Free Gemstones</h3>
            <p className="text-sm font-normal text-gray-700 leading-relaxed">
              All diamonds, rubies, sapphires, and other precious stones are sourced through suppliers compliant with the Kimberley Process and, wherever possible, from Fairtrade-certified mines.
            </p>
          </div>

          <div className="px-4 py-8 sm:py-0 lg:px-8 flex flex-col items-center text-center">
            <h3 className="text-base md:text-lg font-bold text-gray-900 mb-4 min-h-[56px] flex items-center justify-center">Ethically Mined Coloured Gems</h3>
            <p className="text-sm font-normal text-gray-700 leading-relaxed">
              For Jaipur's characteristic semi-precious stones tourmaline, iolite, moonstone, labradorite Puramente partners directly with small-scale mining cooperatives in India and East Africa that guarantee fair wages and safe conditions.
            </p>
          </div>

          <div className="px-4 py-8 sm:py-0 lg:px-8 flex flex-col items-center text-center">
            <h3 className="text-base md:text-lg font-bold text-gray-900 mb-4 min-h-[56px] flex items-center justify-center">Natural & Recycled Packaging</h3>
            <p className="text-sm font-normal text-gray-700 leading-relaxed">
              All Puramente packaging is made from unbleached recycled paper, seed paper (which can be planted after use), and organic cotton pouches zero plastic across the entire unboxing experience.
            </p>
          </div>

        </div>

      </section>

      {/* --- RESPONSIBLE PRODUCTION SECTION --- */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        
        {/* Header Split */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 lg:gap-12 mb-12">
          <div className="lg:w-1/2">
            <h2 className="font-playfair text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
              <span className="italic text-[#00a3c4] font-medium pr-1.5">Responsible</span> Production
            </h2>
          </div>
          <div className="lg:w-1/2">
            <p className="text-sm font-normal text-gray-700 leading-relaxed pb-1">
              Sustainability at Puramente is not limited to sourcing – it permeates every stage of the production process within the Jaipur studio.
            </p>
          </div>
        </div>

        {/* Top Row: 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          
          <div className="border border-gray-200 p-8 lg:p-12 flex flex-col items-center text-center rounded-sm hover:shadow-sm transition-shadow bg-white">
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-6">Solar Energy</h3>
            <p className="text-sm font-normal text-gray-700 leading-relaxed">
              The studio operates on a partially solar-powered electrical supply, reducing dependence on fossil fuel-generated electricity.
            </p>
          </div>

          <div className="border border-gray-200 p-8 lg:p-12 flex flex-col items-center text-center rounded-sm hover:shadow-sm transition-shadow bg-white">
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-6">Water Recycling</h3>
            <p className="text-sm font-normal text-gray-700 leading-relaxed">
              All water used in the polishing and rinsing processes is filtered and recycled through a closed-loop system within the workshop.
            </p>
          </div>

          <div className="border border-gray-200 p-8 lg:p-12 flex flex-col items-center text-center rounded-sm hover:shadow-sm transition-shadow bg-white">
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-6">Chemical Minimisation</h3>
            <p className="text-sm font-normal text-gray-700 leading-relaxed">
              Puramente uses non-toxic, low-impact finishing agents and plating solutions, protecting both the artisans who work with them and the local water table.
            </p>
          </div>

        </div>

        {/* Bottom Row: 2 Cards (Centered) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          
          <div className="border border-gray-200 p-8 lg:p-12 flex flex-col items-center text-center rounded-sm hover:shadow-sm transition-shadow bg-white">
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-6">Zero-Waste Metalwork</h3>
            <p className="text-sm font-normal text-gray-700 leading-relaxed">
              Metal filings and off-cuts are collected and returned to the refiner for recycling nothing is sent to landfill.
            </p>
          </div>

          <div className="border border-gray-200 p-8 lg:p-12 flex flex-col items-center text-center rounded-sm hover:shadow-sm transition-shadow bg-white">
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-6">Small-Batch Production</h3>
            <p className="text-sm font-normal text-gray-700 leading-relaxed">
              By making only what is ordered or planned, the brand avoids the overproduction that plagues the jewellery industry.
            </p>
          </div>

        </div>

      </section>

    </main>
  );
}