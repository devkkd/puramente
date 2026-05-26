"use client";

import React, { useState } from "react";

// Timeline Data Structure
const journeyData = [
  {
    year: "2005",
    title: "The Foundation",
    description: "Puramente Jewel is established with a singular mission: to provide jewelry professionals worldwide with a reliable, creative, and high-quality manufacturing partner. Our first atelier opens in India, uniting traditional craft with contemporary design sensibility.",
  },
  {
    year: "2008",
    title: "Global Expansion",
    description: "We expanded our operations to serve luxury boutiques in Europe and North America, scaling our production capabilities while maintaining the hand-finished quality our early partners came to trust.",
  },
  {
    year: "2013",
    title: "Innovating Craft",
    description: "Embracing the future of design, we integrated advanced 3D modeling and sustainable sourcing into our supply chain, ensuring ethical practices without compromising on artistic integrity.",
  },
  {
    year: "2018",
    title: "Bespoke Excellence",
    description: "Our custom design studio launched, offering 100% bespoke capabilities for private label brands. This marked a shift from just manufacturing to becoming full creative partners.",
  },
  {
    year: "2026",
    title: "Two Decades Strong",
    description: "Celebrating over 20 years of craftsmanship, we continue to push the boundaries of fashion jewelry, serving over 19 countries with the same dedication we had on day one.",
  },
];

export default function OurStoryPage() {
  // State for the interactive timeline
  const [activeIndex, setActiveIndex] = useState(0);
  
  // State for the video player
  const [isPlaying, setIsPlaying] = useState(false);

  const handleNext = () => {
    if (activeIndex < journeyData.length - 1) {
      setActiveIndex(activeIndex + 1);
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  return (
    <main className="w-full bg-white pb-16 font-mona">
      {/* --- HERO SECTION --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10 flex flex-col items-center text-center">
        <div className="flex items-center gap-4 text-[#4fa3b9] text-base font-normal tracking-widest uppercase mb-4">
          <span className="w-16 h-px bg-gray-300"></span>
          <span>Our Story</span>
          <span className="w-16 h-px bg-gray-300"></span>
        </div>

        <h1 className="font-playfair text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight mb-4">
          <span className="italic text-[#4fa3b9] font-medium pr-2">Where</span>
          Artistry Becomes Your Brand
        </h1>

        <p className="max-w-3xl text-gray-800 text-sm font-normal leading-relaxed">
          Two Decades Of Crafting Exquisite Fashion Jewelry For The World's Most Discerning Retailers, Boutiques, And Luxury Brands From The Heart Of India To Over 19 Countries.
        </p>
      </section>

      {/* --- HERO IMAGE --- */}
      <section className="w-full bg-gray-100">
        <img
          src="/images/New folder/our story.png"
          alt="Fashion jewelry modeled on neck"
          className="w-full h-full object-contain"
        />
      </section>

      {/* --- WHO WE ARE SECTION --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-b border-gray-100">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-4 text-[#4fa3b9] text-base font-normal tracking-widest uppercase mb-4">
              <span className="w-16 h-px bg-gray-300"></span>
              <span>Who We Are</span>
            </div>

            <h2 className="font-playfair text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              <span className="italic text-[#4fa3b9] font-medium pr-2">A Legacy</span>
              Built On Craftsmanship
            </h2>

            <div className="space-y-4 text-gray-700 text-sm font-normal leading-relaxed">
              <p>
                <strong>Since 2005</strong>, we have served luxury high street boutiques, online retailers, private label brands, and wholesale buyers across more than 19 countries. Our clients trust us not only for our craftsmanship, but for our ability to translate vision into reality consistently, beautifully, and at scale.
              </p>
              <p>
                We specialize in brass and 925 sterling silver jewelry, offering an extensive open-line collection alongside fully bespoke custom design services. Every collection we produce is informed by the latest global fashion trends and every custom piece is a reflection of our partner brand's unique identity.
              </p>
              <p>
                What truly sets us apart are the hands behind the work: skilled artisans, many of them women from rural villages, whose dedication, precision, and heritage craft have been central to Puramente's reputation from our very first year.
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col justify-center">
            <div className="grid grid-cols-2 relative mb-8">
              <div className="absolute top-0 bottom-0 left-1/2 w-px bg-gray-200 -translate-x-1/2"></div>
              <div className="absolute left-0 right-0 top-1/2 h-px bg-gray-200 -translate-y-1/2"></div>

              <div className="p-6 lg:p-10 pl-0 flex flex-col justify-center">
                <h3 className="font-playfair text-3xl lg:text-4xl font-bold text-gray-900 mb-1">2005</h3>
                <p className="text-gray-600 text-sm font-normal">Year Founded</p>
              </div>

              <div className="p-6 lg:p-10 pr-0 flex flex-col justify-center">
                <h3 className="font-playfair text-3xl lg:text-4xl font-bold text-gray-900 mb-1">19+</h3>
                <p className="text-gray-600 text-sm font-normal">Countries Served</p>
              </div>

              <div className="p-6 lg:p-10 pl-0 flex flex-col justify-center">
                <h3 className="font-playfair text-3xl lg:text-4xl font-bold text-gray-900 mb-1">925</h3>
                <p className="text-gray-600 text-sm font-normal">Sterling Silver Grade</p>
              </div>

              <div className="p-6 lg:p-10 pr-0 flex flex-col justify-center">
                <h3 className="font-playfair text-3xl lg:text-4xl font-bold text-gray-900 mb-1">100%</h3>
                <p className="text-gray-600 text-sm font-normal">Custom Capability</p>
              </div>
            </div>

            <p className="text-gray-900 font-bold text-sm leading-snug">
              Puramente Jewel Is A Premier B2B Jewelry Manufacturer And Wholesale Supplier A One-stop Partner For Fashion Jewelry Professionals Worldwide.
            </p>
          </div>
        </div>
      </section>

      {/* --- OUR JOURNEY TIMELINE SECTION --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Journey Header */}
        <div className="mb-10">
          <div className="flex items-center gap-4 text-[#4fa3b9] text-base font-normal tracking-widest uppercase mb-4">
            <span className="w-16 h-px bg-gray-300"></span>
            <span>Our Journey</span>
          </div>

          <h2 className="font-playfair text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
            <span className="italic text-[#4fa3b9] font-medium pr-2">Two</span>
            Decades of Excellence
          </h2>
        </div>

        {/* The Timeline Data */}
        <div className="flex flex-col gap-8">
          
          {/* Years Row - Scrollbar Hidden */}
          <div className="flex overflow-x-auto gap-8 sm:gap-12 pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {journeyData.map((item, index) => (
              <button
                key={item.year}
                onClick={() => setActiveIndex(index)}
                className={`text-5xl md:text-6xl lg:text-7xl font-bold transition-colors duration-300 shrink-0 ${
                  activeIndex === index
                    ? "text-gray-900"
                    : "text-[#dceef2] hover:text-[#bde0e8]"
                }`}
              >
                {item.year}
              </button>
            ))}
          </div>

          {/* Content & Navigation Row */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            
            {/* Dynamic Text Content */}
            <div className="max-w-xl">
              <h3 className="font-playfair text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                {journeyData[activeIndex].title}
              </h3>
              <p className="text-gray-700 text-md font-normal leading-relaxed">
                {journeyData[activeIndex].description}
              </p>
            </div>

            {/* Navigation Arrows */}
            <div className="flex gap-4 self-end md:self-start">
              <button
                onClick={handlePrev}
                disabled={activeIndex === 0}
                className={`p-3 rounded-full border border-gray-300 transition-colors ${
                  activeIndex === 0 ? "opacity-50 cursor-not-allowed" : "hover:border-[#4fa3b9] hover:bg-[#4fa3b9]/5"
                }`}
                aria-label="Previous Year"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4fa3b9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
              </button>
              
              <button
                onClick={handleNext}
                disabled={activeIndex === journeyData.length - 1}
                className={`p-3 rounded-full border border-[#4fa3b9] transition-colors ${
                  activeIndex === journeyData.length - 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-[#4fa3b9]/5"
                }`}
                aria-label="Next Year"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4fa3b9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* --- VIDEO / WORKSHOP IMAGE SECTION --- */}
      <section className="w-full h-[50vh] md:h-[70vh] relative bg-gray-100 overflow-hidden">
        {!isPlaying ? (
          /* --- CUSTOM THUMBNAIL FACADE --- */
          <div 
            className="absolute inset-0 w-full h-full group cursor-pointer"
            onClick={() => setIsPlaying(true)}
          >
            {/* Thumbnail Image */}
            <img 
              src="/images/home/video.png" 
              alt="Hands working on jewelry" 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />

            {/* Subtle Overlay */}
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-500"></div>

            {/* Centered Play Button */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <button 
                className="w-16 h-16 md:w-20 md:h-20 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 pointer-events-auto group-hover:bg-white/40 group-hover:scale-110 transition-all duration-300 shadow-lg"
                aria-label="Play Video"
              >
                {/* Play Triangle Icon */}
                <svg 
                  className="w-6 h-6 md:w-8 md:h-8 ml-1 md:ml-1.5" 
                  viewBox="0 0 24 24" 
                  fill="white" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    d="M5 3L19 12L5 21V3Z" 
                    stroke="white" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          /* --- YOUTUBE IFRAME --- */
          <iframe 
            className="absolute inset-0 w-full h-full"
            src="https://www.youtube.com/embed/VQ0yrr-pPhE?autoplay=1&rel=0" 
            title="YouTube video player" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
          ></iframe>
        )}
      </section>

      {/* --- OUR PILLARS SECTION --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="flex items-center gap-4 text-[#4fa3b9] text-base font-normal tracking-widest uppercase mb-4">
            <span className="w-16 h-px bg-gray-300"></span>
            <span>Our Pillars</span>
            <span className="w-16 h-px bg-gray-300"></span>
          </div>
          
          <h2 className="font-playfair text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
            <span className="italic text-[#4fa3b9] font-medium pr-2">Why</span> 
            The world's Best Brands Choose us
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-0 md:divide-x divide-gray-200">
          <div className="md:pr-10 lg:pr-16 flex flex-col">
            <span className="font-playfair font-bold text-xl mb-3 text-gray-900">01</span>
            <h3 className="font-playfair text-xl md:text-2xl font-bold text-gray-900 mb-3">Custom Design Mastery</h3>
            <p className="text-gray-600 text-sm font-normal leading-relaxed">
              Your vision is our brief. From initial sketch to final sample, our in-house design team works in close collaboration with your brand to produce pieces that are unmistakably yours and unmistakably exceptional.
            </p>
          </div>
          
          <div className="md:px-10 lg:px-16 flex flex-col pt-6 md:pt-0 border-t md:border-t-0 border-gray-200">
            <span className="font-playfair font-bold text-xl mb-3 text-gray-900">02</span>
            <h3 className="font-playfair text-xl md:text-2xl font-bold text-gray-900 mb-3">Materials of Distinction</h3>
            <p className="text-gray-600 text-sm font-normal leading-relaxed">
              We work exclusively with premium brass and certified 925 sterling silver — materials chosen for their durability, their beauty, and their ability to hold intricate detail across every finish and plating technique.
            </p>
          </div>
          
          <div className="md:pl-10 lg:pl-16 flex flex-col pt-6 md:pt-0 border-t md:border-t-0 border-gray-200">
            <span className="font-playfair font-bold text-xl mb-3 text-gray-900">03</span>
            <h3 className="font-playfair text-xl md:text-2xl font-bold text-gray-900 mb-3">True One-Stop Partnership</h3>
            <p className="text-gray-600 text-sm font-normal leading-relaxed">
              Design. Sampling. Production. Quality control. Packaging. Logistics. We manage every stage, so our partners can focus entirely on growing their brand not managing a supply chain.
            </p>
          </div>
        </div>
      </section>

      {/* --- ARTISANS / THE HUMAN TOUCH SECTION --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left Block - Mint Background */}
          <div className="bg-[#E6FDF9] p-8 md:p-12 flex flex-col justify-center">
            <p className="font-playfair text-xl md:text-2xl lg:text-3xl text-[#4fa3b9] italic font-normal leading-relaxed mb-8">
              "Jewelry is not made in factories. It is made in hands and the hands behind Puramente carry generations of mastery."
            </p>
            <p className="font-playfair text-xl text-[#4fa3b9] italic font-normal">
              Founding Philosophy
            </p>
          </div>
          
          {/* Right Block - Content */}
          <div className="p-8 md:p-12 lg:pr-0 flex flex-col justify-center">
            <div className="flex items-center gap-4 text-[#4fa3b9] text-base font-normal tracking-widest uppercase mb-4">
              <span className="w-16 h-px bg-gray-300"></span>
              <span>The Human Touch</span>
            </div>
            
            <h2 className="font-playfair text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              <span className="italic text-[#4fa3b9] font-medium pr-2">Artisans</span> 
              At Our Heart
            </h2>
            
            <div className="space-y-4 text-gray-700 text-sm font-normal leading-relaxed">
              <p>
                Long before CAD technology entered our studio, skill lived in the fingers of our craftspeople. We went beyond the cities into villages, into communities to find hands with an extraordinary gift for this work.
              </p>
              <p>
                Today, many of these artisans, a large number of them women, form the irreplaceable core of our production. Their mastery in filigree work, stone setting, enameling, and surface finishing gives every Puramente piece its character something no machine can replicate.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- ROOTED IN JAIPUR SECTION --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-gray-100">
        <div className="flex flex-col items-center text-center mb-12 max-w-4xl mx-auto">
          <h2 className="font-playfair text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-6">
            <span className="italic text-[#4fa3b9] font-medium pr-2">Rooted</span> 
            In Jaipur, Worn Worldwide
          </h2>
          
          <div className="space-y-4 text-gray-700 text-sm font-normal leading-relaxed">
            <p>
              In the labyrinthine lanes of Jaipur's Johari Bazaar, a tradition of gemstone artistry has flourished for centuries. Puramente Jewel was born from a deep reverence for this heritage marrying ancient craft with a modern, global aesthetic.
            </p>
            <p>
              Every piece carries the fingerprint of a skilled artisan, the warmth of ethically sourced materials, and a story that travels far beyond its origin.
            </p>
          </div>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="border border-[#4fa3b9]/50 p-6 flex flex-col hover:bg-[#F4f9fa] transition-colors rounded-sm">
            <h3 className="text-[#4fa3b9] font-bold text-xl mb-3">Artisan Crafted</h3>
            <p className="text-gray-700 text-sm font-normal leading-relaxed">
              Hand-finished by master craftspeople in our Jaipur atelier
            </p>
          </div>
          
          <div className="border border-[#4fa3b9]/50 p-6 flex flex-col hover:bg-[#F4f9fa] transition-colors rounded-sm">
            <h3 className="text-[#4fa3b9] font-bold text-xl mb-3">Fair Trade</h3>
            <p className="text-gray-700 text-sm font-normal leading-relaxed">
              Ethical sourcing and fair wages for every artisan in our chain
            </p>
          </div>
          
          <div className="border border-[#4fa3b9]/50 p-6 flex flex-col hover:bg-[#F4f9fa] transition-colors rounded-sm">
            <h3 className="text-[#4fa3b9] font-bold text-xl mb-3">Global Export</h3>
            <p className="text-gray-700 text-sm font-normal leading-relaxed">
              Trusted by retailers and collectors in 40+ countries worldwide.
            </p>
          </div>
        </div>
      </section>

    </main>
  );
}