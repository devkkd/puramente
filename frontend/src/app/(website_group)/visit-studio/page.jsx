"use client";

import React from "react";
import Image from "next/image";

export default function StudioVisitPage() {
  return (
    <main className="w-full bg-white font-mona pb-24 pt-16">
      
      {/* --- HERO SECTION --- */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20 flex flex-col items-center text-center">
        <div className="flex items-center gap-4 text-[#00a3c4] text-xs md:text-sm font-normal tracking-widest uppercase mb-4">
          <span className="w-12 md:w-20 h-px bg-[#00a3c4]/50"></span>
          <span>Craftsmanship</span>
          <span className="w-12 md:w-20 h-px bg-[#00a3c4]/50"></span>
        </div>

        <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight mb-6">
          <span className="italic text-[#00a3c4] font-medium pr-1.5">Step Inside</span> The World of Jaipur Craftsmanship
        </h1>

        <p className="text-sm font-normal text-gray-700 max-w-3xl leading-relaxed">
          Experience the art of jewellery making firsthand inside Puramente Jewel's historic Jaipur studio, where generations of craftsmanship come to life.
        </p>
      </section>

      {/* --- QUOTE & INTRO SECTION --- */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-0 items-stretch">
          
          {/* Left Quote Box */}
          <div className="bg-[#E6FDF9] p-10 md:p-16 lg:p-20 flex items-center justify-center text-center rounded-sm">
            <p className="font-playfair text-2xl md:text-3xl lg:text-4xl text-[#00a3c4] italic leading-snug">
              "Come not just to buy jewellery, but to<br/>understand what makes it extraordinary."
            </p>
          </div>

          {/* Right Text Box */}
          <div className="py-10 md:py-16 lg:py-20 lg:pl-16 bg-white flex flex-col justify-center">
            <h2 className="font-playfair text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Visit Jaipur Studio
            </h2>
            <div className="space-y-6 text-sm font-normal text-gray-700 leading-relaxed">
              <p>
                The Puramente Jewel studio sits in the heart of Jaipur's historic jewellery district a living workshop where visitors are invited to step inside the creative process and witness jewellery being made exactly as it has been for generations.
              </p>
              <p>
                A studio visit is not a showroom experience. It is a rare and intimate encounter with authentic craft.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* --- WHAT TO EXPECT SECTION --- */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        
        {/* Header Split */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-12 mb-10">
          <div className="md:w-1/2">
            <h2 className="font-playfair text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
              <span className="italic text-[#00a3c4] font-medium pr-1.5">What</span> To Expect
            </h2>
          </div>
          <div className="md:w-1/2">
            <p className="text-sm font-normal text-gray-700 leading-relaxed pb-1 md:text-right">
              A typical studio visit at Puramente lasts between 90 minutes and three hours, and includes:
            </p>
          </div>
        </div>

        {/* Large Image */}
        <div className="w-full h-[40vh] md:h-[60vh] lg:h-[70vh] bg-gray-100 mb-16 rounded-sm overflow-hidden shadow-sm">
          {/* Note: Update the src to match where you save your Hawa Mahal image */}
          <img 
            src="/images/New folder/hawa3.png" 
            alt="Hawa Mahal Jaipur" 
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=2070&auto=format&fit=crop"; }} // Fallback if image not yet added
          />
        </div>

        {/* --- GRID: WHAT TO EXPECT --- */}
        {/* Top Row: 3 Items */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200 border-b border-gray-200 pb-12 mb-12">
          
          <div className="px-6 py-8 md:py-0 flex flex-col items-center text-center">
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Workshop Tour</h3>
            <p className="text-sm font-normal text-gray-700 leading-relaxed max-w-sm">
              A guided walk through the working studio where you will observe karigars at each stage of production from wax modelling and casting to stone setting and final polishing.
            </p>
          </div>

          <div className="px-6 py-8 md:py-0 flex flex-col items-center text-center">
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Gemstone Demonstration</h3>
            <p className="text-sm font-normal text-gray-700 leading-relaxed max-w-sm">
              Watch as a master gem-cutter works with raw stones, explaining the art of faceting and how different cuts affect a gemstone's character.
            </p>
          </div>

          <div className="px-6 py-8 md:py-0 flex flex-col items-center text-center">
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Meenakari Experience</h3>
            <p className="text-sm font-normal text-gray-700 leading-relaxed max-w-sm">
              A short, hands-on introduction to enamel work under the guidance of a Meenakari specialist. (available on selected visits).
            </p>
          </div>

        </div>

        {/* Bottom Row: 2 Items Centered */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200 max-w-4xl mx-auto">
          
          <div className="px-6 py-8 md:py-0 flex flex-col items-center text-center">
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Private Collection Viewing</h3>
            <p className="text-sm font-normal text-gray-700 leading-relaxed max-w-sm">
              Browse Puramente's full archive collection including one-of-a-kind pieces and seasonal limited editions not available online.
            </p>
          </div>

          <div className="px-6 py-8 md:py-0 flex flex-col items-center text-center">
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Bespoke Consultation</h3>
            <p className="text-sm font-normal text-gray-700 leading-relaxed max-w-sm">
              Meet with the design team to commission a custom piece built entirely around your vision, timeline, and budget.
            </p>
          </div>

        </div>

      </section>

      {/* --- PRACTICAL INFORMATION SECTION --- */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 border-t border-gray-200 pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          
          {/* Left Heading */}
          <div className="lg:col-span-4">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-gray-900">
              <span className="italic text-[#00a3c4] font-medium pr-1.5">Practical</span> Information
            </h2>
          </div>

          {/* Right Information List */}
          <div className="lg:col-span-8 flex flex-col">
            
            {/* Item 1 */}
            <div className="flex flex-col md:flex-row py-6 border-b border-gray-200">
              <div className="md:w-1/3 mb-2 md:mb-0 flex items-center font-bold text-gray-900 text-base">
                <span className="mr-3 text-lg">📍</span> Studio Location
              </div>
              <div className="md:w-2/3 text-sm text-gray-700 leading-relaxed">
                83/B-1, Ground Floor Chetak Marg, Sector-8, Sanganer, Pratap Nagar, Jaipur, Rajasthan 302033
              </div>
            </div>

            {/* Item 2 */}
            <div className="flex flex-col md:flex-row py-6 border-b border-gray-200">
              <div className="md:w-1/3 mb-2 md:mb-0 flex items-center font-bold text-gray-900 text-base">
                <span className="mr-3 text-lg">🕘</span> Studio Hours
              </div>
              <div className="md:w-2/3 text-sm text-gray-700 leading-relaxed">
                Monday - Saturday: 10:00 AM - 6:00 PM<br/>
                Sunday: By appointment only
              </div>
            </div>

            {/* Item 3 */}
            <div className="flex flex-col md:flex-row py-6 border-b border-gray-200">
              <div className="md:w-1/3 mb-2 md:mb-0 flex items-center font-bold text-gray-900 text-base">
                <span className="mr-3 text-lg">📅</span> Booking
              </div>
              <div className="md:w-2/3 text-sm text-gray-700 leading-relaxed">
                Advance appointment required — walk-ins welcome subject to availability
              </div>
            </div>

            {/* Item 4 */}
            <div className="flex flex-col md:flex-row py-6 border-b border-gray-200">
              <div className="md:w-1/3 mb-2 md:mb-0 flex items-center font-bold text-gray-900 text-base">
                <span className="mr-3 text-lg">⏱️</span> Visit Duration
              </div>
              <div className="md:w-2/3 text-sm text-gray-700 leading-relaxed">
                90 minutes (standard) · Up to 3 hours (bespoke consultation)
              </div>
            </div>

            {/* Item 5 */}
            <div className="flex flex-col md:flex-row py-6 border-b border-gray-200">
              <div className="md:w-1/3 mb-2 md:mb-0 flex items-center font-bold text-gray-900 text-base">
                <span className="mr-3 text-lg">💰</span> Visit Fee
              </div>
              <div className="md:w-2/3 text-sm text-gray-700 leading-relaxed">
                Complimentary — no charge for studio tour or consultation
              </div>
            </div>

          </div>
        </div>
      </section>

    </main>
  );
}