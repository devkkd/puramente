"use client";

import React from "react";
import Image from "next/image";

export default function CraftsmanshipPage() {
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
          <span className="italic text-[#00a3c4] font-medium pr-1.5">Purely</span> Handcrafted Purely Timeless
        </h1>

        <p className="text-sm font-normal text-gray-700 max-w-2xl leading-relaxed">
          Handcrafted In Jaipur, Puramente Jewel Blends Generations Of Artisanal Heritage With Contemporary Design.
        </p>
      </section>

      {/* --- QUOTE & STORY SECTION --- */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-0 h-full  overflow-hidden">
          
          {/* Left Quote Box */}
          <div className="bg-[#E6FDF9] p-10 md:p-16 lg:p-20 flex items-center justify-center text-center">
            <p className="font-playfair text-2xl md:text-3xl lg:text-4xl text-[#00a3c4] italic leading-snug">
              "A piece of jewellery should carry a story.<br/>Ours carries centuries."
            </p>
          </div>

          {/* Right Text Box */}
          <div className="p-10 md:p-16 lg:p-20 bg-white flex flex-col justify-center">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              Craftsmanship
            </h2>
            <div className="space-y-6 text-sm font-normal text-gray-700 leading-relaxed">
              <p>
                At Puramente Jewel, every piece is a conversation between centuries-old tradition and contemporary vision. Born in Jaipur India's Pink City and the world capital of gemstone cutting and jewellery artistry each creation carries the fingerprints of master karigars (artisans) who have inherited their skills through generations of family practice.
              </p>
              <p>
                The word 'Puramente' means 'purely' in Italian a name that speaks to the brand's unwavering commitment to authentic handcraft, honest materials, and jewellery made with singular intention.
              </p>
              <p>
                Here, nothing is rushed. Nothing is mass-produced. Every ring, pendant, and earring is born slowly and deliberately.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* --- THE ART OF THE KARIGAR SECTION --- */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-24 items-start">
          
          {/* Left Heading */}
          <div className="lg:pr-8">
            <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              <span className="italic text-[#00a3c4] font-medium pr-1.5">The</span> Art of the Karigar
            </h2>
          </div>

          {/* Right Text */}
          <div className="space-y-6 text-sm font-normal text-gray-700 leading-relaxed">
            <p>
              Jaipur's jewellery tradition stretches back to the founding of the city in 1727, when Maharaja Sawai Jai Singh II invited master craftspeople from across the subcontinent to build his new capital. Nearly 300 years later, that generational wisdom endures in the hands of Puramente's artisans.
            </p>
            <p>
              Each karigar at Puramente Jewel specialises in a distinct discipline of the craft:
            </p>
          </div>

        </div>
      </section>

      {/* --- LARGE IMAGE SECTION --- */}
      <section className="w-full bg-gray-100 mb-20">
        <div className="w-full h-[40vh] md:h-[60vh] lg:h-[70vh] relative">
          <img 
            src="/images/New folder/craft.png" 
            alt="Jewelry tools and gemstones on a workbench" 
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* --- TECHNIQUES GRID SECTION --- */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-32">
        
        {/* Top Row: 3 Items */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200 border-b border-gray-200 pb-12 mb-12">
          
          <div className="px-6 py-8 md:py-0 flex flex-col items-center text-center">
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Kundan Setting</h3>
            <p className="text-sm font-normal text-gray-700 leading-relaxed max-w-sm">
              An ancient Mughal technique in which pure gold foil is pressed around gemstones to create seamless, bezel-less settings of extraordinary elegance.
            </p>
          </div>

          <div className="px-6 py-8 md:py-0 flex flex-col items-center text-center">
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Meenakari (Enamel Work)</h3>
            <p className="text-sm font-normal text-gray-700 leading-relaxed max-w-sm">
              Vibrant, fired enamel applied to gold or silver surfaces to produce the vivid floral and geometric patterns Jaipur is renowned for worldwide.
            </p>
          </div>

          <div className="px-6 py-8 md:py-0 flex flex-col items-center text-center">
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Jadau Craftsmanship</h3>
            <p className="text-sm font-normal text-gray-700 leading-relaxed max-w-sm">
              The intricate embedding of uncut (polki) diamonds and precious stones into a gold framework a labour-intensive technique requiring weeks per single piece.
            </p>
          </div>

        </div>

        {/* Bottom Row: 2 Items Centered */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200 max-w-4xl mx-auto">
          
          <div className="px-6 py-8 md:py-0 flex flex-col items-center text-center">
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Filigree & Wire Work</h3>
            <p className="text-sm font-normal text-gray-700 leading-relaxed max-w-sm">
              Delicate metalwork in which thin threads of gold or silver are twisted and woven into lace-like structures, demanding extraordinary patience and precision.
            </p>
          </div>

          <div className="px-6 py-8 md:py-0 flex flex-col items-center text-center">
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Gemstone Faceting</h3>
            <p className="text-sm font-normal text-gray-700 leading-relaxed max-w-sm">
              Expert cutting and polishing of precious and semi-precious stones sapphires, emeralds, rubies, tourmalines to bring out maximum brilliance and depth.
            </p>
          </div>

        </div>

      </section>

      {/* --- THE MAKING OF A PURAMENTE PIECE SECTION --- */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-12 items-end">
          <div className="lg:col-span-6">
            <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              <span className="italic text-[#00a3c4] font-medium pr-1.5">The</span> Making of a Puramente Piece
            </h2>
          </div>
          <div className="lg:col-span-6">
            <p className="text-sm font-normal text-gray-700 leading-relaxed pb-2">
              The journey from raw material to finished jewellery follows a time-honoured sequence, with each stage completed entirely by hand:
            </p>
          </div>
        </div>

        {/* Alternating Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          
          {/* 1. Design Conception (Mint) */}
          <div className="bg-[#E6FDF9] p-10 md:p-12 flex flex-col items-center text-center rounded-sm">
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-6">Design Conception</h3>
            <p className="text-sm font-normal text-gray-700 leading-relaxed">
              Sketched by hand on paper, often inspired by Rajasthani architecture, miniature paintings, and the natural world.
            </p>
          </div>

          {/* 2. Wax Modelling (White Border) */}
          <div className="bg-white border border-gray-200 p-10 md:p-12 flex flex-col items-center text-center rounded-sm shadow-sm">
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-6">Wax Modelling</h3>
            <p className="text-sm font-normal text-gray-700 leading-relaxed">
              A three-dimensional wax prototype is shaped by the modeller, allowing proportions and stone placement to be refined before casting.
            </p>
          </div>

          {/* 3. Casting (Mint) */}
          <div className="bg-[#E6FDF9] p-10 md:p-12 flex flex-col items-center text-center rounded-sm">
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-6">Casting</h3>
            <p className="text-sm font-normal text-gray-700 leading-relaxed">
              The wax model is used to create a mould. Molten precious metal is poured in and cooled, forming the base structure.
            </p>
          </div>

          {/* 4. Filing & Polishing (White Border) */}
          <div className="bg-white border border-gray-200 p-10 md:p-12 flex flex-col items-center text-center rounded-sm shadow-sm">
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-6">Filing & Polishing</h3>
            <p className="text-sm font-normal text-gray-700 leading-relaxed">
              The raw cast piece is refined over many hours, its edges smoothed and its surfaces brought to a mirror finish.
            </p>
          </div>

          {/* 5. Stone Setting (Mint) */}
          <div className="bg-[#E6FDF9] p-10 md:p-12 flex flex-col items-center text-center rounded-sm">
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-6">Stone Setting</h3>
            <p className="text-sm font-normal text-gray-700 leading-relaxed">
              Gemstones are hand-set by dedicated setters who work under magnification, securing each stone with precision.
            </p>
          </div>

          {/* 6. Finishing & Quality Check (White Border) */}
          <div className="bg-white border border-gray-200 p-10 md:p-12 flex flex-col items-center text-center rounded-sm shadow-sm">
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-6">Finishing & Quality Check</h3>
            <p className="text-sm font-normal text-gray-700 leading-relaxed">
              A final polish and thorough inspection ensures every piece meets Puramente's exacting standards before it leaves the studio.
            </p>
          </div>

        </div>

      </section>

    </main>
  );
}