import React from "react";

export default function Certifications() {
  return (
    <section className="w-full py-10 md:py-16 bg-white overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        
        {/* Top Subheading */}
        <div className="flex items-center gap-3 md:gap-4 text-[#4fa3b9] text-xs sm:text-sm md:text-base font-normal tracking-widest uppercase mb-3 md:mb-4 font-mona">
          <span className="w-12 sm:w-16 md:w-24 h-px bg-[#4fa3b9]"></span>
          <span>Certifications</span>
          <span className="w-12 sm:w-16 md:w-24 h-px bg-[#4fa3b9]"></span>
        </div>

        {/* Main Heading */}
        <h2 className="font-playfair text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
          <span className="italic text-[#4fa3b9] font-medium pr-2">Our</span>
          Certifications & Accreditations
        </h2>

        {/* Subtext Content */}
        <p className="text-sm md:text-base font-normal text-gray-600 mb-8 md:mb-12 max-w-2xl leading-relaxed">
          Recognized for excellence, quality, and compliance across global standards.
        </p>

        {/* Logos SVG Container */}
        {/* Removed redundant px-4, added a subtle hover scale for a modern touch */}
        <div className="w-full flex justify-center items-center">
          <img 
            src="/images/home/CERTIFICATIONS.svg" 
            alt="SMETA Sedex, EPCH, and Directorate General of Foreign Trade Certifications" 
            className="w-full max-w-sm md:max-w-2xl lg:max-w-4xl h-auto object-contain transition-transform duration-700 hover:scale-[1.02]"
          />
        </div>

      </div>
    </section>
  );
}