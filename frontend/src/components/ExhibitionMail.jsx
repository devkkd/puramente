"use client";

import React, { useState } from "react";

export default function ExhibitionMail() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Subscribed with:", email);
    // Future API route for newsletter subscription goes here
  };

  return (
    <section className="w-full py-8 lg:py-8 bg-white font-mona border-t border-gray-100">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-16">
        
        {/* --- LEFT COLUMN: Text Content --- */}
        <div className="w-full lg:w-1/2 flex flex-col items-center text-center lg:items-start lg:text-left">
          <h2 className="font-playfair text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 lg:mb-4 leading-tight">
            Never Miss an <span className="italic text-[#00a3c4] font-medium pr-1">Exhibition</span>
          </h2>
          <p className="text-sm font-normal text-gray-600 lg:text-gray-800 leading-relaxed max-w-lg">
            Subscribe to our newsletter for exclusive previews, artist interviews, early access to tickets, and behind-the-scenes content.
          </p>
        </div>

        {/* --- RIGHT COLUMN: Newsletter Form --- */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end mt-2 lg:mt-0">
          <form 
            onSubmit={handleSubmit} 
            className="flex w-full max-w-xl shadow-sm"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="flex-grow w-full border border-gray-300 border-r-0 rounded-none px-4 lg:px-5 py-3.5 lg:py-4 text-xs sm:text-sm focus:outline-none focus:border-[#00a3c4] focus:ring-1 focus:ring-[#00a3c4] text-gray-800 placeholder-gray-400 bg-transparent transition-colors"
            />
            <button
              type="submit"
              className="bg-[#00a3c4] text-white px-5 sm:px-6 lg:px-8 py-3.5 lg:py-4 text-xs sm:text-sm font-medium hover:bg-[#0082a4] transition-colors whitespace-nowrap flex items-center justify-center rounded-none shrink-0"
            >
              {/* Shorten text on very small screens to prevent overflow */}
              <span className="hidden sm:inline">Subscribe Now</span>
              <span className="sm:hidden">Subscribe</span>
              <span className="ml-1.5 sm:ml-2 font-serif text-base sm:text-lg leading-none">&rarr;</span>
            </button>
          </form>
        </div>

      </div>
    </section>
  );
}