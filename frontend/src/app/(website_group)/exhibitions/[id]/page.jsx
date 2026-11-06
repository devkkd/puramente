"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Calendar, MapPin, Clock } from "lucide-react";

// ── Exhibition data per slug ──────────────────────────────────────────────────
const EXHIBITIONS = {
  "ihgf-autumn-2026": {
    title: "IHGF Delhi Fair Autumn 2026",
    subtitle: "Crafting Timeless Jewellery for a Conscious Tomorrow",
    image: "/images/New folder/past-2.jpeg",
    imageAlt: "IHGF Delhi Fair Autumn 2026",
    dateStart: "13 Oct 2026",
    dateEnd: "17 Oct 2026",
    location: "Hall No. 18, Booth No. K-02/14, India Expo Centre",
    locationFull: "India Expo Centre & Mart, Plot No. 23-25 & 27-29, Knowledge Park II, Greater Noida, Uttar Pradesh, India",
    hours: "10:00 AM – 6:00 PM (Daily)",
    about: [
      "IHGF Delhi Fair Autumn 2026 is one of Asia’s largest and most influential sourcing fairs for home, lifestyle, fashion, and gift products. The exhibition highlights India’s rich craftsmanship blended with contemporary design, sustainability, and global trends.",
      "The fair provides an exceptional opportunity for international buyers, retailers, importers, and designers to connect with trusted manufacturers, explore innovative collections, and discover export-ready products across multiple categories.",
    ],
    quote: "A globally renowned sourcing platform celebrating Indian craftsmanship, innovation, and sustainable design for international markets.",
    highlights: [
     " Asia’s leading sourcing platform for jewellery, home & lifestyle",
"Export-ready jewellery collections crafted by skilled artisans",
"Sustainable materials and contemporary, trend-led designs",
"Direct meetings with trusted Indian manufacturers",
"Meaningful business connections with global buyers and importers",
    ],
  },

  "ihgf-spring-2026": {
    title: "IHGF Delhi Fair Spring 2026",
    subtitle: "Elevate Your Collection with Intentional Craftsmanship",
    image: "/images/New folder/past events.svg",
    imageAlt: "IHGF Delhi Fair Spring 2026",
    dateStart: "13 Feb 2026",
    dateEnd: "17 Feb 2026",
    location: "Stand No E7/12 Hall No 3, India Expo Mart & Center",
    locationFull: "India Expo Centre & Mart, Plot No. 23-25 & 27-29, Knowledge Park II, Greater Noida, Uttar Pradesh, India",
    hours: "10:00 AM – 6:00 PM (Daily)",
    about: [
      "IHGF Delhi Fair Spring 2026 is one of Asia's largest and most influential sourcing fairs for home, lifestyle, fashion, and gift products. The exhibition highlights India's rich craftsmanship blended with contemporary design, sustainability, and global trends.",
      "The fair provided an exceptional opportunity for international buyers, retailers, importers, and designers to connect with trusted manufacturers, explore innovative collections, and discover export-ready products across multiple categories.",
    ],
    quote: "A globally renowned sourcing platform celebrating Indian craftsmanship, innovation, and sustainable design for international markets.",
    highlights: [
      "Global sourcing platform for home & lifestyle products",
      "Export-ready handcrafted collections",
      "Sustainable & design-led innovations",
      "Direct access to Indian manufacturers",
      "Networking with international buyers",
    ],
  },
};

export default function ExhibitionDetailsPage() {
  const { id } = useParams();
  const data = EXHIBITIONS[id];

  // 404-style fallback if slug not found
  if (!data) {
    return (
      <main className="w-full bg-white font-mona pb-24 pt-16">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/exhibitions" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#0082A4] text-sm font-medium transition-colors mb-8">
            <ArrowLeft size={16} /> Back to Exhibitions
          </Link>
          <p className="text-gray-500 text-sm mt-12">Exhibition not found.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full bg-white font-mona pb-24 pt-16">

      {/* Back Button */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <Link href="/exhibitions" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#0082A4] text-sm font-medium transition-colors">
          <ArrowLeft size={16} /> Back to Exhibitions
        </Link>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* --- TOP GRID: HERO & DETAILS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border border-gray-200 shadow-sm mb-16 bg-white overflow-hidden rounded-sm">

          {/* Image */}
          <div className="w-full lg:col-span-7 xl:col-span-8 bg-[#F4F1EC] relative min-h-[350px] lg:min-h-[450px] flex items-center justify-center p-6 md:p-12">
            <img
              src={data.image}
              alt={data.imageAlt}
              className="w-full h-full max-h-[500px] object-contain object-center"
            />
          </div>

          {/* Details */}
          <div className="lg:col-span-5 xl:col-span-4 p-8 md:p-10 flex flex-col justify-center border-l border-gray-100">
            <p className="text-[#00a3c4] text-xs md:text-sm font-medium mb-3">
              {data.subtitle}
            </p>

            <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-8 leading-tight">
              {data.title}
            </h1>

            <div className="space-y-4 w-full text-sm">
              {/* Date */}
              <div className="bg-[#E6FDF9] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <Calendar size={18} className="text-[#0082A4]" />
                  <span className="text-gray-800 font-medium">Date: {data.dateStart}</span>
                </div>
                <span className="text-gray-800 font-medium">Ended: {data.dateEnd}</span>
              </div>

              {/* Location */}
              <div className="bg-[#E6FDF9] p-5 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <MapPin size={18} className="text-[#0082A4]" />
                  <span className="text-gray-800 font-medium">Location</span>
                </div>
                <p className="font-bold text-gray-900 text-sm">{data.location}</p>
                <p className="text-gray-700 leading-relaxed font-normal text-xs md:text-sm">{data.locationFull}</p>
              </div>

              {/* Hours */}
              <div className="bg-[#E6FDF9] p-5 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <Clock size={18} className="text-[#0082A4]" />
                  <span className="text-gray-800 font-medium">Hours</span>
                </div>
                <p className="font-bold text-gray-900 text-sm">{data.hours}</p>
              </div>
            </div>
          </div>
        </div>

        {/* --- BOTTOM GRID: ABOUT & CURATED BY --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

          {/* Left: Description */}
          <div>
            <h2 className="font-playfair text-2xl md:text-3xl font-bold text-gray-900 mb-6">About the Exhibition</h2>
            <div className="space-y-4 font-normal text-gray-700 text-sm leading-relaxed mb-8">
              {data.about.map((para, i) => <p key={i}>{para}</p>)}
            </div>

            <div className="border-2 border-[#00a3c4] bg-[#E6FDF9]/50 p-6 mb-12">
              <p className="text-gray-800 text-sm leading-relaxed font-medium">{data.quote}</p>
            </div>
          </div>

          {/* Right: Curated By */}
          <div className="space-y-12">
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
          </div>

        </div>

        {/* Highlights */}
        <h2 className="font-playfair text-2xl md:text-3xl font-bold text-gray-900 mb-6 mt-8">Exhibition Highlights</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {data.highlights.map((item, i) => (
            <div key={i} className="border border-[#00a3c4]/50 p-5 text-sm font-normal text-gray-700 bg-white hover:shadow-sm transition-shadow">
              {item}
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
