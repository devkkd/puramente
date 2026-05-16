"use client";

import React, { useState, useEffect } from 'react';

const DelhiFair = ({ isExhibitionPage = false }) => {
  const targetDate = new Date('2026-10-13T09:00:00').getTime();
  const [timeLeft, setTimeLeft] = useState({ months: 0, days: 0, hours: 0, minutes: 0 });

  const calculateTimeLeft = () => {
    const now = new Date().getTime();
    const difference = targetDate - now;
    if (difference > 0) {
      const totalDays = Math.floor(difference / (1000 * 60 * 60 * 24));
      return {
        months: Math.floor(totalDays / 30),
        days: totalDays % 30,
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      };
    }
    return { months: 0, days: 0, hours: 0, minutes: 0 };
  };

  useEffect(() => {
    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fmt = (n) => String(n).padStart(2, '0');

  const timeUnits = [
    { label: 'Months',  value: timeLeft.months },
    { label: 'Days',    value: timeLeft.days },
    { label: 'Hours',   value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
  ];

  // The Header block that moves based on the page layout
  const HeaderBlock = () => (
    <div className={isExhibitionPage ? "flex flex-col items-center text-center mb-12" : "mb-10"}>
      {!isExhibitionPage && (
        <div className="flex items-center gap-4 text-[#00a3c4] text-base font-normal tracking-widest uppercase mb-6">
          <span className="w-16 h-px bg-[#00a3c4]"></span>
          <span>World-Class Exhibitions</span>
        </div>
      )}
      
      <h2 className={`font-playfair font-bold text-gray-900 mb-4 ${isExhibitionPage ? 'text-3xl md:text-4xl' : 'text-2xl md:text-3xl lg:text-4xl'}`}>
        Upcoming Trade <span className="italic text-[#00a3c4] font-medium">Fairs</span>
      </h2>

      <p className={`text-sm font-normal text-gray-800 leading-relaxed ${isExhibitionPage ? 'max-w-2xl mx-auto' : 'max-w-2xl'}`}>
        Explore Extraordinary Art Exhibitions Discover groundbreaking exhibitions featuring the world's most innovative artists, designers, and creative minds.
      </p>
    </div>
  );

  return (
    <section className={`w-full bg-white font-mona overflow-hidden ${isExhibitionPage ? 'py-4' : 'py-8'}`}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Render header centered at the top if on the Exhibitions page */}
        {isExhibitionPage && <HeaderBlock />}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          
          {/* --- LEFT COLUMN: Exhibition Image --- */}
          <div className="w-full lg:col-span-5 relative min-h-[400px] lg:min-h-full rounded-xl overflow-hidden shadow-sm">
            <img 
              src="/images/home/delhiIMG.svg" 
              alt="Puramente International Exhibition Booth" 
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>

          {/* --- RIGHT COLUMN: Content & Event Widget --- */}
          <div className="w-full lg:col-span-7 flex flex-col justify-center">
            
            {/* Render header inside the right column if on the Homepage */}
            {!isExhibitionPage && <HeaderBlock />}

            {/* The Event Details Widget */}
            <div className="w-full space-y-6">
              
              <div className="rounded-xl overflow-hidden shadow-sm border border-gray-100">
                <img
                  src="/images/home/delhi-fairs.jpeg" 
                  alt="IHGF Delhi Fair Autumn 2026"
                  className="w-full object-cover h-auto"
                />
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">

                {/* Left: Info Cards */}
                <div className="xl:col-span-3 space-y-5">
                  <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-[#c28680]">
                    <h2 className="text-xl font-bold text-[#1e4d8b] mb-2">
                      Welcome to IHGF Delhi Fair Autumn 2026
                    </h2>
                    <div className="bg-gradient-to-r from-[#c28680] to-[#f4a582] h-1 w-24 mb-4 rounded-full" />
                    <p className="text-gray-700 text-sm leading-relaxed mb-3">
                      We are excited to announce our participation in the <span className="font-semibold text-[#1e4d8b]">IHGF Delhi Fair – Autumn 2026</span>, one of Asia's leading trade shows.
                    </p>
                    <p className="text-gray-700 text-sm leading-relaxed mb-6">
                      At Puramente International, we specialize in exporting premium-quality jewellery that blends craftsmanship with modern design. We look forward to connecting with global buyers.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                      <div className="bg-blue-50/50 p-4 rounded-xl border border-[#1e4d8b]/20">
                        <h4 className="font-bold text-sm text-[#1e4d8b] mb-2 flex items-center">
                          <span className="text-[#c28680] mr-2">✦</span> Exclusive Collection
                        </h4>
                        <p className="text-gray-700 text-xs leading-relaxed">
                          Discover our custom jewellery collection, crafted with precision and designed to match international trends.
                        </p>
                      </div>
                      <div className="bg-[#de9891] p-4 rounded-xl flex items-center justify-center">
                        <p className="font-medium text-white text-sm text-center leading-relaxed">
                          We look forward to meeting you and presenting our latest designs and export-ready collections.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { color: '#1e4d8b', title: 'Venue', line1: 'India Expo Centre', line2: 'Greater Noida' },
                        { color: '#c28680', title: 'Dates', line1: '13 – 17 Oct 2026', line2: 'Autumn Edition' },
                        { color: '#1e4d8b', title: 'Hours', line1: '9 AM – 6 PM', line2: 'Daily' },
                      ].map(({ color, title, line1, line2 }) => (
                        <div key={title} className="rounded-xl p-3 border border-gray-100 bg-gray-50/50">
                          <h4 className="font-bold text-xs mb-1" style={{ color }}>{title}</h4>
                          <p className="text-gray-900 font-semibold text-[11px]">{line1}</p>
                          <p className="text-gray-500 text-[10px] mt-0.5">{line2}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Countdown & Organizer */}
                <div className="xl:col-span-2 flex flex-col gap-5">
                  <div className="bg-[#2c5b96] rounded-xl shadow-lg p-5 text-white h-full flex flex-col justify-center">
                    <div className="text-center mb-5">
                      <span className="bg-[#c28680] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">Autumn 2026</span>
                      <h3 className="text-lg font-bold mt-3">Countdown to the Fair</h3>
                    </div>

                    <div className="flex items-start justify-center gap-2 mb-5">
                      {timeUnits.map(({ label, value }, i) => (
                        <React.Fragment key={label}>
                          <div className="flex flex-col items-center">
                            <div className="bg-white rounded-lg w-10 h-10 flex items-center justify-center shadow border-b-2 border-[#c28680]">
                              <span className="text-lg font-bold text-[#1e4d8b]">{fmt(value)}</span>
                            </div>
                            <p className="text-blue-100 text-[8px] font-bold uppercase tracking-wide mt-2">{label}</p>
                          </div>
                          {i < timeUnits.length - 1 && <span className="text-white font-bold text-lg mt-1.5 opacity-50">:</span>}
                        </React.Fragment>
                      ))}
                    </div>

                    <div className="text-center bg-white/10 rounded-lg p-2.5 mt-auto">
                      <p className="text-blue-50 text-[11px]">Fair opens: Oct 13, 2026 at 9:00 AM</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
                    <h4 className="font-bold text-gray-800 mb-1 text-[11px] uppercase tracking-wide text-[#c28680]">Organized By</h4>
                    <p className="text-xs sm:text-sm font-bold text-[#1e4d8b] mb-2 mt-1">Export Promotion Council for Handicrafts</p>
                    <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100 text-[10px] text-gray-500 leading-relaxed">
                      Asia's premier trade fair for home, lifestyle & textiles
                    </div>
                  </div>
                </div>

              </div>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
};

export default DelhiFair;