import React from "react";

export default function Certifications() {
  return (
    <section className="w-full py-8 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        
        {/* Top Subheading */}
        <div className="flex items-center gap-4 text-[#4fa3b9] text-base font-normal tracking-widest uppercase mb-6 font-mona">
          <span className="w-16 md:w-24 h-px bg-[#4fa3b9]"></span>
          <span>Certifications</span>
          <span className="w-16 md:w-24 h-px bg-[#4fa3b9]"></span>
        </div>

        {/* Main Heading */}
        <h2 className="font-playfair text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
          <span className="italic text-[#4fa3b9] font-medium pr-2">Our</span>
          Certifications & Accreditations
        </h2>

        {/* Subtext Content */}
        <p className="text-sm font-normal text-gray-800 mb-16 max-w-2xl">
          Recognized for excellence, quality, and compliance across global standards
        </p>

        {/* Logos SVG Container */}
        <div className="w-full flex justify-center items-center px-4">
          <img 
            src="/images/home/CERTIFICATIONS.svg" 
            alt="SMETA Sedex, EPCH, and Directorate General of Foreign Trade Certifications" 
            className="w-full max-w-4xl h-auto object-contain"
          />
        </div>

      </div>
    </section>
  );
}