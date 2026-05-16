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
    <section className="w-full py-6 md:py-8 bg-white font-mona border-t border-gray-100">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16">
        
        {/* --- LEFT COLUMN: Text Content --- */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <h2 className="font-playfair text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Never Miss an <span className="italic text-[#00a3c4] font-medium pr-1">Exhibition</span>
          </h2>
          <p className="text-sm font-normal text-gray-800 leading-relaxed max-w-lg">
            Subscribe to our newsletter for exclusive previews, artist interviews, early access to tickets, and behind-the-scenes content.
          </p>
        </div>

        {/* --- RIGHT COLUMN: Newsletter Form --- */}
        <div className="w-full lg:w-1/2 flex justify-start lg:justify-end">
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
              className="flex-grow border border-gray-300 border-r-0 rounded-none px-5 py-4 text-sm focus:outline-none focus:border-[#00a3c4] focus:ring-1 focus:ring-[#00a3c4] text-gray-800 placeholder-gray-400 bg-transparent transition-colors"
            />
            <button
              type="submit"
              className="bg-[#00a3c4] text-white px-6 md:px-8 py-4 text-sm font-medium hover:bg-[#0082a4] transition-colors whitespace-nowrap flex items-center rounded-none"
            >
              Subscribe Now <span className="ml-2 font-serif text-lg leading-none">&rarr;</span>
            </button>
          </form>
        </div>

      </div>
    </section>
  );
}