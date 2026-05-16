"use client";

import React from "react";
import Link from "next/link";

// Data for Video Testimonials
const videoTestimonials = [
  {
    id: 1,
    quote: '"Beautiful craftsmanship and reliable wholesale partner!"',
    author: "Anna, UK",
  },
  {
    id: 2,
    quote: '"Where fine craftsmanship meets reliable wholesale excellence."',
    author: "Todd, New Zealand",
  },
];

// Data for Text Testimonials
const textTestimonials = [
  {
    id: 1,
    quote: '"The Moonstone ring I ordered looks even better in person. The craftsmanship is incredible – you can tell each piece has been made with real care. This is my third purchase from Puramente and every time I\'m blown away."',
    author: "Priya Sharma, Dubai, UAE",
  },
  {
    id: 2,
    quote: '"Got the labradorite hoops as a gift for my sister\'s birthday. She hasn\'t taken them off since. The packaging is gorgeous too – felt truly luxurious. Will 100% be back for more."',
    author: "Aakanksha Reddy, Sydney, Australia",
  },
  {
    id: 3,
    quote: '"Ordered custom gold-plated jewelry for our boutique in London. The quality exceeded expectations, delivery was seamless, and their team was incredibly responsive. Perfect wholesale partner."',
    author: "Sarah Mitchell, London, UK",
  },
];

export default function Testimonials() {
  return (
    <section className="w-full py-24 bg-white font-mona overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        
        {/* --- HEADER SECTION --- */}
        <div className="flex flex-col items-center text-center mb-16 w-full">
          {/* Top Subheading */}
          <div className="flex items-center gap-4 text-[#00a3c4] text-base font-normal tracking-widest uppercase mb-6">
            <span className="w-12 md:w-24 h-px bg-[#00a3c4]"></span>
            <span>Trade Partner Testimonials</span>
            <span className="w-12 md:w-24 h-px bg-[#00a3c4]"></span>
          </div>

          {/* Main Heading */}
          <h2 className="font-playfair text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
            <span className="italic text-[#00a3c4] font-medium pr-2">What</span> 
            Our Partners Say
          </h2>
        </div>

        {/* --- SPLIT LAYOUT SECTION --- */}
        <div className="w-full flex flex-col lg:flex-row gap-10 lg:gap-12 items-stretch">
          
          {/* LEFT COLUMN: 40% (Video Testimonials) */}
          <div className="w-full lg:w-[40%] grid grid-cols-1 sm:grid-cols-2 gap-6 shrink-0">
            {videoTestimonials.map((testimonial) => (
              <div key={testimonial.id} className="flex flex-col group cursor-pointer">
                
                {/* Video Thumbnail Container (Portrait 9:16 aspect ratio) */}
                <div className="relative w-full aspect-[9/16] bg-gray-100 overflow-hidden mb-5 rounded-sm shadow-sm">
                  <img 
                    src="" 
                    alt={`Video testimonial from ${testimonial.author}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/5 group-hover:bg-black/20 transition-colors duration-300">
                    <button className="w-12 h-12 bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/50 group-hover:bg-white/50 transition-colors">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg" className="ml-1">
                        <path d="M5 3L19 12L5 21V3Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Video Quote & Author */}
                <div className="flex flex-col gap-1">
                  <p className="text-[13px] sm:text-sm font-normal text-gray-800 leading-relaxed">
                    {testimonial.quote}
                  </p>
                  <p className="text-[13px] sm:text-sm font-bold text-gray-900 mt-1">
                    {testimonial.author}
                  </p>
                </div>

              </div>
            ))}
          </div>

          {/* RIGHT COLUMN: 60% (Text Testimonials) */}
          <div className="w-full lg:w-[60%] flex flex-col justify-between">
            <div className="flex flex-col gap-6">
              {textTestimonials.map((testimonial) => (
                <div 
                  key={testimonial.id} 
                  className="border border-[#00a3c4]/30 p-6 sm:p-8 flex flex-col gap-4 bg-white shadow-sm"
                >
                  <p className="text-sm font-normal text-gray-800 leading-relaxed">
                    {testimonial.quote}
                  </p>
                  <p className="text-sm font-bold text-gray-900">
                    {testimonial.author}
                  </p>
                </div>
              ))}
            </div>

            {/* View All Link */}
            <div className="mt-8 lg:mt-6">
              <Link 
                href="/testimonials" 
                className="inline-flex items-center text-[#00a3c4] text-sm font-normal pb-1 border-b border-[#00a3c4]/40 hover:border-[#00a3c4] transition-colors"
              >
                See All What Our Customers Say &rarr;
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}