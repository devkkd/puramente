"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, MapPin, Clock } from "lucide-react";

export default function ExhibitionDetailsPage() {
  return (
    <main className="w-full bg-white font-mona pb-24 pt-16">
      
      {/* Back Button */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <Link href="/exhibitions" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#0082A4] text-sm font-medium transition-colors">
          <ArrowLeft size={16} /> Back to Exhibitions
        </Link>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* --- TOP GRID: HERO & MINIMAL DETAILS (FIXED FOR LANDSCAPE IMAGE) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border border-gray-200 shadow-sm mb-16 bg-white overflow-hidden rounded-sm">
          
          {/* Image Left (Takes 7/12 or 8/12 columns) - PERFECTLY CENTERED & CONTAINED */}
          <div className="w-full lg:col-span-7 xl:col-span-8 bg-[#F4F1EC] relative min-h-[350px] lg:min-h-[450px] flex items-center justify-center p-6 md:p-12">
            <img 
              src="/images/New folder/past events.svg" 
              alt="IHGF Delhi Fair Spring 2026" 
              className="w-full h-full max-h-[500px] object-contain object-center"
            />
          </div>

          {/* Details Right (Takes remaining columns) */}
          <div className="lg:col-span-5 xl:col-span-4 p-8 md:p-10 flex flex-col justify-center border-l border-gray-100">
            
            <p className="text-[#00a3c4] text-xs md:text-sm font-medium mb-3">
              Elevate Your Collection with Intentional Craftsmanship
            </p>

            <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-8 leading-tight">
              IHGF Delhi Fair Spring 2026
            </h1>

            <div className="space-y-4 w-full text-sm">
              {/* Date Box */}
              <div className="bg-[#E6FDF9] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <Calendar size={18} className="text-[#0082A4]" />
                  <span className="text-gray-800 font-medium">Date : 2026-02-13</span>
                </div>
                <span className="text-gray-800 font-medium">Ended: 2026-02-17</span>
              </div>

              {/* Location Box */}
              <div className="bg-[#E6FDF9] p-5 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <MapPin size={18} className="text-[#0082A4]" />
                  <span className="text-gray-800 font-medium">Location</span>
                </div>
                <p className="font-bold text-gray-900 text-sm">Stand No E7/12 Hall No 3 India Expo Mart & Center</p>
                <p className="text-gray-700 leading-relaxed font-normal text-xs md:text-sm">
                  India Expo Centre & Mart, Plot No. 23-25 & 27-29, Knowledge Park II, Greater Noida, Uttar Pradesh, India
                </p>
              </div>

              {/* Hours Box */}
              <div className="bg-[#E6FDF9] p-5 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <Clock size={18} className="text-[#0082A4]" />
                  <span className="text-gray-800 font-medium">Hours</span>
                </div>
                <p className="font-bold text-gray-900 text-sm">10:00 AM - 6:00 PM (Daily)</p>
              </div>
            </div>
          </div>
        </div>

        {/* --- BOTTOM GRID: ABOUT, HIGHLIGHTS, CURATOR, TAGS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          
          {/* Left Column: Description & Highlights */}
          <div>
            <h2 className="font-playfair text-2xl md:text-3xl font-bold text-gray-900 mb-6">About the Exhibition</h2>
            <div className="space-y-4 font-normal text-gray-700 text-sm leading-relaxed mb-8">
              <p>
                IHGF Delhi Fair Spring 2026 is one of Asia's largest and most influential sourcing fairs for home, lifestyle, fashion, and gift products. The exhibition highlights India's rich craftsmanship blended with contemporary design, sustainability, and global trends.
              </p>
              <p>
                The fair provides an exceptional opportunity for international buyers, retailers, importers, and designers to connect with trusted manufacturers, explore innovative collections, and discover export-ready products across multiple categories.
              </p>
            </div>
            
            <div className="border-2 border-[#00a3c4] bg-[#E6FDF9]/50 p-6 mb-12">
              <p className="text-gray-800 text-sm leading-relaxed font-medium">
                A globally renowned sourcing platform celebrating Indian craftsmanship, innovation, and sustainable design for international markets.
              </p>
            </div>

            <h2 className="font-playfair text-2xl md:text-3xl font-bold text-gray-900 mb-6">Exhibition Highlights</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border border-[#00a3c4]/50 p-5 text-sm font-normal text-gray-700 bg-white hover:shadow-sm transition-shadow">Global sourcing platform for home & lifestyle products</div>
              <div className="border border-[#00a3c4]/50 p-5 text-sm font-normal text-gray-700 bg-white hover:shadow-sm transition-shadow">Export-ready handcrafted collections</div>
              <div className="border border-[#00a3c4]/50 p-5 text-sm font-normal text-gray-700 bg-white hover:shadow-sm transition-shadow">Sustainable & design-led innovations</div>
              <div className="border border-[#00a3c4]/50 p-5 text-sm font-normal text-gray-700 bg-white hover:shadow-sm transition-shadow">Direct access to Indian manufacturers</div>
              <div className="border border-[#00a3c4]/50 p-5 text-sm font-normal text-gray-700 bg-white hover:shadow-sm transition-shadow">Networking with international buyers</div>
            </div>
          </div>

          {/* Right Column: Curated By & Tags */}
          <div className="space-y-12">
            
            {/* Curated By */}
            <div>
              <h2 className="font-playfair text-2xl md:text-3xl font-bold text-gray-900 mb-6">Curated by</h2>
              <div className="mb-6">
                <img src="/images/New folder/EPCH.svg" alt="EPCH Logo" className="h-16 object-contain mb-4" onError={(e) => e.target.style.display = 'none'} />
                <h3 className="font-bold text-lg md:text-xl text-gray-900 mb-3">Export Promotion Council for Handicrafts (EPCH)</h3>
                <p className="font-normal text-gray-700 text-sm leading-relaxed">
                  EPCH is a leading organization promoting Indian handicrafts and facilitating global trade connections.
                </p>
              </div>
            </div>

            <div className="w-full h-px bg-gray-200"></div>

            {/* Tags */}
            <div>
              <h2 className="font-playfair text-2xl md:text-3xl font-bold text-gray-900 mb-6">Tags</h2>
              <div className="flex flex-wrap gap-3">
                {["IHGF Delhi Fair", "IHGF Spring 2026", "Indian Handicrafts", "Export Fair", "Indian Craftsmanship", "Home & Lifestyle Expo"].map(tag => (
                  <span key={tag} className="bg-[#E6FDF9] text-gray-800 text-xs font-medium px-4 py-2.5 rounded-full border border-[#00a3c4]/20 hover:bg-[#00a3c4] hover:text-white cursor-default transition-colors">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}