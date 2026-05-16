"use client";

import React, { useState } from "react";
import Link from "next/link";
import DelhiFair from "@/components/DelhiFair";
import { Calendar, MapPin, Ticket } from "lucide-react";

export default function ExhibitionsPage() {
  const [activeTab, setActiveTab] = useState("UPCOMING");

  return (
    <main className="w-full bg-white font-mona pb-24">
      
      {/* --- HERO SECTION --- */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 flex flex-col items-center text-center">
        <div className="flex items-center gap-4 text-[#00a3c4] text-xs md:text-sm font-normal tracking-widest uppercase mb-4">
          <span className="w-12 md:w-20 h-px bg-[#00a3c4]/50"></span>
          <span>Exhibitions</span>
          <span className="w-12 md:w-20 h-px bg-[#00a3c4]/50"></span>
        </div>

        <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight mb-4">
          <span className="italic text-[#00a3c4] font-medium pr-1.5">Where</span>
          Art Becomes Eternal
        </h1>

        <p className="text-sm font-normal text-gray-700 max-w-2xl leading-relaxed mb-12">
          Curated Exhibitions At The Intersection Of Fine Jewellery, Sculpture, And Contemporary Vision. Each Show A Singular Encounter With Beauty.
        </p>

        {/* --- TABS --- */}
        <div className="flex w-full max-w-3xl border-b border-gray-200">
          <button 
            onClick={() => setActiveTab("UPCOMING")}
            className={`flex-1 pb-4 text-center text-[13px] md:text-sm uppercase tracking-wide transition-colors ${activeTab === "UPCOMING" ? "text-black font-bold border-b-2 border-black" : "text-gray-400 font-medium hover:text-gray-600"}`}
          >
            UPCOMING EXHIBITIONS
          </button>
          <button 
            onClick={() => setActiveTab("PAST")}
            className={`flex-1 pb-4 text-center text-[13px] md:text-sm uppercase tracking-wide transition-colors ${activeTab === "PAST" ? "text-black font-bold border-b-2 border-black" : "text-gray-400 font-medium hover:text-gray-600"}`}
          >
            PAST EXHIBITIONS
          </button>
        </div>
      </section>

      {/* --- TAB CONTENT --- */}
      <div className="w-full">
        {activeTab === "UPCOMING" && (
          <div className="animate-in fade-in duration-500">
            <DelhiFair isExhibitionPage={true} />
          </div>
        )}

        {activeTab === "PAST" && (
          <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
            
            {/* Past Event Card - DECREASED BOX SIZE AND FIXED IMAGE CROPPING */}
            <div className="grid grid-cols-1 lg:grid-cols-2 border border-gray-200 shadow-sm bg-white overflow-hidden rounded-xl">
              
              {/* Event Image - Using object-contain and flex-center to ensure the entire SVG shows */}
              <div className="w-full bg-[#f8f5f1] relative flex items-center justify-center p-6 min-h-[300px] lg:min-h-[400px]">
                <img 
                  src="/images/New folder/past events.svg" 
                  alt="IHGF Delhi Fair Spring 2026" 
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Event Details */}
              <div className="p-8 md:p-10 flex flex-col justify-center">
                <p className="text-[#00a3c4] text-xs md:text-sm font-medium mb-3">
                  Elevate Your Collection with Intentional Craftsmanship
                </p>
                
                <h3 className="font-playfair text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  IHGF Delhi Fair Spring 2026
                </h3>
                
                <p className="text-sm font-normal text-gray-700 leading-relaxed mb-8">
                  IHGF Delhi Fair Spring 2026 is a premier international trade fair showcasing world-class home, lifestyle, fashion, and handcrafted products, bringing together global buyers and Indian manufacturers under one platform.
                </p>
                
                <div className="space-y-4 mb-8 text-sm text-gray-700">
                  <div className="flex items-center gap-3">
                    <Calendar size={18} className="text-[#00a3c4]" />
                    <span>2026-02-13</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="text-[#00a3c4] shrink-0 mt-0.5" />
                    <span className="leading-relaxed">Stand No E7/12 Hall No 3 India Expo Mart and Center</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Ticket size={18} className="text-[#00a3c4]" />
                    <span>By Invitation / Buyer Registration Only</span>
                  </div>
                </div>

                <div className="flex flex-col gap-6">
                  <div className="flex gap-3 flex-wrap">
                    <span className="bg-[#E6FDF9] text-gray-800 text-xs px-4 py-2 rounded-full">IHGF Delhi Fair</span>
                    <span className="bg-[#E6FDF9] text-gray-800 text-xs px-4 py-2 rounded-full">IHGF Spring 2026</span>
                  </div>
                  
                  <Link 
                    href="/exhibitions/ihgf-spring-2026"
                    className="bg-[#0082A4] text-white px-8 py-3 text-sm text-center font-bold tracking-wide hover:bg-[#006a85] transition-colors w-fit rounded-sm"
                  >
                    See Event Details →
                  </Link>
                </div>
              </div>

            </div>

          </section>
        )}
      </div>

    </main>
  );
}