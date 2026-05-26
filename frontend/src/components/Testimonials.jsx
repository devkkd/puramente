"use client";

import React, { useRef } from "react";
import Link from "next/link";

// Data for Video Testimonials
const videoTestimonials = [
  {
    id: 1,
    quote: '"Beautiful craftsmanship and reliable wholesale partner!"',
    author: "Anna, UK",
    thumbnail: "/images/home/girl testi.png",
    videoUrl: "/images/Anna .mp4", 
  },
  {
    id: 2,
    quote: '"Where fine craftsmanship meets reliable wholesale excellence."',
    author: "Todd, New Zealand",
    thumbnail: "/images/home/boy testi.png",
    videoUrl: "/images/Todd.mp4",
  },
];

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
    <section className="w-full py-10 lg:py-24 bg-white font-mona overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        
        {/* --- HEADER SECTION --- */}
        <div className="flex flex-col items-center text-center mb-8 lg:mb-16 w-full">
          <div className="flex items-center gap-3 lg:gap-4 text-[#00a3c4] text-xs sm:text-sm lg:text-base font-normal tracking-widest uppercase mb-4 lg:mb-6">
            <span className="w-12 sm:w-16 lg:w-24 h-px bg-[#00a3c4]"></span>
            <span>Trade Partner Testimonials</span>
            <span className="w-12 sm:w-16 lg:w-24 h-px bg-[#00a3c4]"></span>
          </div>
          <h2 className="font-playfair text-3xl lg:text-4xl font-bold text-gray-900">
            <span className="italic text-[#00a3c4] font-medium pr-1.5 lg:pr-2">What</span> 
            Our Partners Say
          </h2>
        </div>

        {/* --- SPLIT LAYOUT SECTION --- */}
        <div className="w-full flex flex-col lg:flex-row gap-8 lg:gap-12 items-stretch">
          
          {/* LEFT COLUMN: Video Testimonials */}
          <div className="w-full lg:w-[40%] grid grid-cols-2 gap-4 lg:gap-6 shrink-0">
            {videoTestimonials.map((testimonial) => (
              <div key={testimonial.id} className="flex flex-col">
                
                {/* Video Container */}
                <div className="relative w-full aspect-[9/16] bg-gray-900 overflow-hidden mb-3 lg:mb-5 rounded-lg lg:rounded-sm shadow-sm">
                  <video
                    src={testimonial.videoUrl}
                    poster={testimonial.thumbnail}
                    controls
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Video Quote & Author */}
                <div className="flex flex-col gap-1">
                  <p className="text-[11px] sm:text-[13px] lg:text-sm font-normal text-gray-700 lg:text-gray-800 leading-relaxed line-clamp-3">
                    {testimonial.quote}
                  </p>
                  <p className="text-xs sm:text-[13px] lg:text-sm font-bold text-gray-900 mt-0.5 lg:mt-1">
                    {testimonial.author}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT COLUMN: Text Testimonials */}
          <div className="w-full lg:w-[60%] flex flex-col justify-between mt-2 lg:mt-0">
            <div className="flex flex-col gap-4 lg:gap-6">
              {textTestimonials.map((testimonial) => (
                <div 
                  key={testimonial.id} 
                  className="border border-[#00a3c4]/30 p-5 lg:p-8 flex flex-col gap-3 lg:gap-4 bg-white shadow-sm rounded-xl lg:rounded-none"
                >
                  <p className="text-[13px] lg:text-sm font-normal text-gray-700 lg:text-gray-800 leading-relaxed">
                    {testimonial.quote}
                  </p>
                  <p className="text-xs lg:text-sm font-bold text-gray-900">
                    {testimonial.author}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 lg:mt-6 flex justify-center lg:justify-start">
              <Link 
                href="/testimonials" 
                className="inline-flex items-center text-[#00a3c4] text-xs lg:text-sm font-medium uppercase tracking-widest border-b border-[#00a3c4]/40 hover:border-[#00a3c4] transition-colors"
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