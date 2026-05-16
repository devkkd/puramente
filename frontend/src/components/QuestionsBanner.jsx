"use client";

import React from "react";
import Link from "next/link";

export default function QuestionsBanner() {
  return (
    <section className="w-full py-8 md:py-10 bg-[#E2FFF9] font-mona">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-10 lg:gap-14">
        
        {/* --- TOP ROW: Text & Button --- */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
          
          {/* Left: Text Content */}
          <div className="flex flex-col w-full md:w-3/5">
            {/* Subheading */}
            <div className="flex items-center gap-4 text-[#0082A4] text-base font-normal tracking-widest uppercase mb-4">
              <span className="w-16 h-px bg-[#0082A4]"></span>
              <span>Questions</span>
            </div>

            {/* Main Heading */}
            <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Still have <span className="italic text-[#0082A4] font-medium pr-1">questions?</span>
            </h2>

            {/* Description */}
            <p className="text-sm font-normal text-gray-800 leading-relaxed max-w-xl">
              Our expert team is ready to help you with custom designs, wholesale inquiries, or any other questions.
            </p>
          </div>

          {/* Right: Action Button */}
          <div className="w-full md:w-auto flex flex-col items-start md:items-center shrink-0">
            <Link 
              href="/contact" 
              className="bg-[#0082A4] text-white text-sm font-medium px-10 py-4 hover:bg-[#006a85] transition-colors flex items-center justify-center min-w-[260px] shadow-sm"
            >
              Contact Our Team <span className="ml-2">&rarr;</span>
            </Link>
            <p className="text-xs text-gray-700 mt-3 font-normal">
              Typically responds within 2 hours
            </p>
          </div>
          
        </div>

        {/* --- BOTTOM ROW: Contact Information --- */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-12 w-full text-center">
          
          {/* Phone */}
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-black tracking-wide">
            CALL: +91 9314 346 148
          </h3>
          
          {/* Vertical Divider (Hidden on mobile, visible on large screens) */}
          <div className="hidden lg:block h-10 w-px bg-gray-400/60"></div>
          
          {/* Email */}
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-black tracking-wide">
            EMAIL: info@puramentejewel.com
          </h3>
          
        </div>

      </div>
    </section>
  );
}