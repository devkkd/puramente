"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    console.log("Subscribed:", email);
  };

  return (
    <footer className="w-full font-mona">
      {/* --- TOP SECTION: Social Follow (White Background) --- */}
      <div className="w-full bg-white py-6 md:py-10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
          <h3 className="font-playfair text-xl md:text-2xl italic text-[#0082A4]">
            Follow us
          </h3>
          
          <div className="hidden md:block h-px bg-gray-300 w-full max-w-[200px] lg:max-w-[300px]"></div>

          <div className="flex items-center gap-3">
            {/* Instagram */}
            <a href="#" className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:shadow-md transition-shadow">
              <img src="https://upload.wikimedia.org/wikipedia/commons/9/95/Instagram_logo_2022.svg" alt="Instagram" className="w-4 h-4" />
            </a>
            {/* Facebook */}
            <a href="#" className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:shadow-md transition-shadow">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 12.073C24 5.405 18.627 0 12 0C5.373 0 0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24V15.562H7.078V12.073H10.125V9.412C10.125 6.407 11.916 4.75 14.657 4.75C15.97 4.75 17.343 4.984 17.343 4.984V7.937H15.83C14.341 7.937 13.875 8.861 13.875 9.814V12.073H17.203L16.671 15.562H13.875V24C19.612 23.094 24 18.1 24 12.073Z" />
              </svg>
            </a>
            {/* YouTube */}
            <a href="#" className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:shadow-md transition-shadow">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#FF0000" xmlns="http://www.w3.org/2000/svg">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* --- MAIN FOOTER SECTION (#E2FFF9 Background) --- */}
      <div className="w-full bg-[#E2FFF9] pt-10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col">
          
          {/* Logo Center */}
          <div className="flex justify-center mb-4">
            <img 
              src="/images/logo/puramenteLogoDark.png" 
              alt="Puramente International" 
              className="h-8 md:h-10 w-auto object-contain"
            />
          </div>

          {/* Newsletter Section */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-4">
            <div className="w-full lg:w-1/2">
              <h2 className="font-playfair text-xl md:text-2xl lg:text-3xl font-bold text-black mb-2">
                Stay Ahead in Jewelry <span className="italic text-[#0082A4] font-medium">Trends</span>
              </h2>
              <p className="text-sm font-normal text-gray-800 max-w-md leading-relaxed">
                Get exclusive access to new collections, wholesale pricing insights, and trend forecasts—crafted for retailers and jewelry brands worldwide.
              </p>
            </div>
            
            <div className="w-full lg:w-1/2 flex justify-start lg:justify-end">
              <form onSubmit={handleSubscribe} className="flex w-full max-w-md shadow-sm">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="flex-grow border border-gray-300 border-r-0 px-4 py-2.5 text-sm focus:outline-none focus:border-[#0082A4] bg-white text-gray-900"
                />
                <button
                  type="submit"
                  className="bg-[#0082A4] text-white px-5 py-2.5 text-sm font-medium hover:bg-[#006a85] transition-colors whitespace-nowrap"
                >
                  Subscribe Now &rarr;
                </button>
              </form>
            </div>
          </div>

          <hr className="border-[#c4eee5] my-4" />

          {/* Links Grid Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="flex flex-col gap-1.5">
              <h4 className="font-bold text-sm text-black mb-1">Collections</h4>
              <Link href="/rings" className="text-[13px] font-normal text-gray-700 hover:text-[#0082A4]">Rings</Link>
              <Link href="/earrings" className="text-[13px] font-normal text-gray-700 hover:text-[#0082A4]">Earrings</Link>
              <Link href="/necklaces" className="text-[13px] font-normal text-gray-700 hover:text-[#0082A4]">Necklaces</Link>
              <Link href="/bracelets" className="text-[13px] font-normal text-gray-700 hover:text-[#0082A4]">Bracelets</Link>
              <Link href="/new-arrivals" className="text-[13px] font-normal text-gray-700 hover:text-[#0082A4]">New Arrivals</Link>
            </div>

            <div className="flex flex-col gap-1.5">
              <h4 className="font-bold text-sm text-black mb-1">Company</h4>
              <Link href="/our-story" className="text-[13px] font-normal text-gray-700 hover:text-[#0082A4]">Our Story</Link>
              <Link href="/craftsmanship" className="text-[13px] font-normal text-gray-700 hover:text-[#0082A4]">Craftsmanship</Link>
              <Link href="/sustainability" className="text-[13px] font-normal text-gray-700 hover:text-[#0082A4]">Sustainability</Link>
              <Link href="/visit-studio" className="text-[13px] font-normal text-gray-700 hover:text-[#0082A4]">Visit Jaipur Studio</Link>
              <Link href="/blogs" className="text-[13px] font-normal text-gray-700 hover:text-[#0082A4]">Blogs</Link>
            </div>

            <div className="flex flex-col gap-1.5">
              <h4 className="font-bold text-sm text-black mb-1">Support</h4>
              <Link href="/custom-jewelry" className="text-[13px] font-normal text-gray-700 hover:text-[#0082A4]">Custom Jewelry</Link>
              <Link href="/contact" className="text-[13px] font-normal text-gray-700 hover:text-[#0082A4]">Contact Us</Link>
              <Link href="/faqs" className="text-[13px] font-normal text-gray-700 hover:text-[#0082A4]">FAQ&apos;s</Link>
              <Link href="/privacy-policy" className="text-[13px] font-normal text-gray-700 hover:text-[#0082A4]">Privacy Policy</Link>
            </div>

            <div className="flex flex-col gap-1.5">
              <h4 className="font-bold text-sm text-black mb-1">Contact Us</h4>
              <p className="text-[13px] font-normal text-gray-700 leading-relaxed">
                83/B-1 , Ground Floor Chetak Marg,<br />
                Sector-8, Sanganer, Pratap Nagar,<br />
                Jaipur, Rajasthan 302033
              </p>
              <p className="text-[13px] font-normal text-gray-700 mt-1">
                +91 9314 346 148
              </p>
              <p className="text-[13px] font-normal text-gray-700 mt-0.5">
                info@puramentejewel.com
              </p>
            </div>

          </div>

          <hr className="border-[#c4eee5] my-4" />

          {/* Copyright, Admin Link & Credits */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-2">
            <p className="text-[13px] font-normal text-gray-700 text-center md:text-left flex-1">
              © 2025 Puramente International - All Rights Reserved!
            </p>
            
            {/* --- ADMIN DASHBOARD LINK ADDED HERE --- */}
            <Link 
              href="/admin" 
              className="text-[11px] font-bold uppercase tracking-widest text-[#0082A4] hover:text-black transition-colors px-4 py-1.5 border border-[#0082A4]/20 rounded hover:border-black/20"
            >
              Admin Portal
            </Link>

            <p className="text-[13px] font-normal text-gray-700 text-center md:text-right flex-1">
              Developed By: <span className="font-bold text-black">Kontent Kraft Digital</span>
            </p>
          </div>

          <hr className="border-[#c4eee5] my-4" />

          {/* Butterfly Feature Bottom */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 pb-4 mt-4">
            <div className="w-full md:w-[35%] flex justify-center md:justify-end">
              <img 
                src="/images/logo/Butterfly.png" 
                alt="Blue Morpho Butterfly" 
                className="w-40 md:w-56 object-contain drop-shadow-xl"
              />
            </div>
            
            <div className="w-full md:w-[65%] flex flex-col text-center md:text-left max-w-2xl">
              <h2 className="font-playfair text-xl md:text-2xl lg:text-3xl font-bold text-black mb-2">
                <span className="italic text-[#0082A4] font-medium pr-1.5">Inspired</span> 
                By Nature - Morpho Butterfly
              </h2>
              <p className="text-[13px] font-normal text-gray-800 leading-relaxed">
                Inspired By The Radiant Wings Of The Morpho Butterfly, We Create Timeless Jewellery That Reflects Beauty, Transformation, And Grace. Every Piece Is Designed To Capture The Brilliance Of Nature In Every Detail.
              </p>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}