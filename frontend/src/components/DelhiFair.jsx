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

  // The Header block extracted so we can position it smartly on mobile vs desktop
  const HeaderBlock = () => (
    <div className={isExhibitionPage ? "flex flex-col items-center text-center mb-8 lg:mb-12" : "mb-6 lg:mb-10"}>
      {!isExhibitionPage && (
        <div className="flex items-center gap-3 lg:gap-4 text-[#00a3c4] text-xs sm:text-sm lg:text-base font-normal tracking-widest uppercase mb-4 lg:mb-6">
          <span className="w-12 sm:w-16 lg:w-24 h-px bg-[#00a3c4]"></span>
          <span>World-Class Exhibitions</span>
        </div>
      )}
      
      <h2 className={`font-playfair font-bold text-gray-900 mb-3 lg:mb-4 ${isExhibitionPage ? 'text-3xl lg:text-4xl' : 'text-3xl lg:text-4xl'}`}>
        Upcoming Trade <span className="italic text-[#00a3c4] font-medium">Fairs</span>
      </h2>

      <p className={`text-sm font-normal text-gray-600 leading-relaxed ${isExhibitionPage ? 'max-w-2xl mx-auto' : 'max-w-2xl'}`}>
        Explore Extraordinary Art Exhibitions Discover groundbreaking exhibitions featuring the world's most innovative artists, designers, and creative minds.
      </p>
    </div>
  );

  return (
    <section className={`w-full bg-white font-mona overflow-hidden ${isExhibitionPage ? 'py-6 lg:py-8' : 'py-16 lg:py-24'}`}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Render header centered at the top if on the Exhibitions page */}
        {isExhibitionPage && <HeaderBlock />}

        {/* --- MOBILE FIX: Render header ABOVE the image on mobile for Homepage --- */}
        {!isExhibitionPage && (
          <div className="lg:hidden w-full">
            <HeaderBlock />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          
          {/* --- LEFT COLUMN: Exhibition Image --- */}
          <div className="w-full lg:col-span-5 relative min-h-[250px] sm:min-h-[350px] lg:min-h-full rounded-sm overflow-hidden group">
            <img 
              src="/images/home/delhiIMG.svg" 
              alt="Puramente International Exhibition Booth" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
          </div>

          {/* --- RIGHT COLUMN: Content & Event Widget --- */}
          <div className="w-full lg:col-span-7 flex flex-col justify-center">
            
            {/* --- DESKTOP FIX: Render header inside right column ONLY on desktop for Homepage --- */}
            {!isExhibitionPage && (
              <div className="hidden lg:block">
                <HeaderBlock />
              </div>
            )}

            {/* The Event Details Widget */}
            <div className="w-full space-y-6">
              
              <div className="rounded-sm overflow-hidden border border-gray-100">
                <img
                  src="/images/home/delhi-fairs.jpeg" 
                  alt="IHGF Delhi Fair Autumn 2026"
                  className="w-full object-cover h-auto"
                />
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">

                {/* Left: Info Cards */}
                <div className="xl:col-span-3 space-y-4 lg:space-y-5">
                  <div className="bg-white rounded-sm shadow-sm p-5 lg:p-6 border border-gray-100 border-l-4 border-l-[#00a3c4]">
                    <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-2">
                      Welcome to IHGF Delhi Fair Autumn 2026
                    </h2>
                    <div className="bg-gradient-to-r from-[#00a3c4] to-[#00a3c4]/20 h-1 w-16 lg:w-24 mb-4 rounded-full" />
                    
                    <p className="text-gray-600 text-[13px] lg:text-sm leading-relaxed mb-3">
                      We are excited to announce our participation in the <span className="font-semibold text-[#00a3c4]">IHGF Delhi Fair – Autumn 2026</span>, one of Asia's leading trade shows.
                    </p>
                    <p className="text-gray-600 text-[13px] lg:text-sm leading-relaxed mb-6">
                      At Puramente International, we specialize in exporting premium-quality jewellery that blends craftsmanship with modern design. We look forward to connecting with global buyers.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4 mb-6">
                      <div className="bg-[#00a3c4]/5 p-4 rounded-sm border border-[#00a3c4]/20">
                        <h4 className="font-bold text-[13px] lg:text-sm text-gray-900 mb-2 flex items-center">
                          <span className="text-[#00a3c4] mr-2">✦</span> Exclusive Collection
                        </h4>
                        <p className="text-gray-600 text-xs leading-relaxed">
                          Discover our custom jewellery collection, crafted with precision and designed to match international trends.
                        </p>
                      </div>
                      <div className="bg-[#00a3c4] p-4 rounded-sm flex items-center justify-center">
                        <p className="font-medium text-white text-xs lg:text-sm text-center leading-relaxed">
                          We look forward to meeting you and presenting our latest designs and export-ready collections.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {[
                        { title: 'Venue', line1: 'India Expo Centre', line2: 'Greater Noida' },
                        { title: 'Dates', line1: '13 – 17 Oct 2026', line2: 'Autumn Edition' },
                        { title: 'Hours', line1: '9 AM – 6 PM', line2: 'Daily' },
                      ].map(({ title, line1, line2 }) => (
                        <div key={title} className="rounded-sm p-3 border border-gray-100 bg-gray-50/80">
                          <h4 className="font-bold text-xs mb-1 text-[#00a3c4] uppercase tracking-wider">{title}</h4>
                          <p className="text-gray-900 font-semibold text-[11px]">{line1}</p>
                          <p className="text-gray-500 text-[10px] mt-0.5">{line2}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Countdown & Organizer */}
                <div className="xl:col-span-2 flex flex-col gap-4 lg:gap-5">
                  <div className="bg-gray-900 rounded-sm shadow-sm p-5 text-white h-full flex flex-col justify-center">
                    <div className="text-center mb-6">
                      <span className="bg-[#00a3c4] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">Autumn 2026</span>
                      <h3 className="text-base lg:text-lg font-playfair font-bold mt-4 tracking-wide">Countdown to the Fair</h3>
                    </div>

                    <div className="flex items-start justify-center gap-2 lg:gap-3 mb-6">
                      {timeUnits.map(({ label, value }, i) => (
                        <React.Fragment key={label}>
                          <div className="flex flex-col items-center">
                            <div className="bg-white rounded-sm w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center shadow-sm border-b-2 border-[#00a3c4]">
                              <span className="text-base lg:text-xl font-bold text-gray-900">{fmt(value)}</span>
                            </div>
                            <p className="text-gray-400 text-[8px] lg:text-[9px] font-bold uppercase tracking-widest mt-2">{label}</p>
                          </div>
                          {i < timeUnits.length - 1 && <span className="text-[#00a3c4] font-bold text-lg lg:text-xl mt-1.5 lg:mt-2 opacity-80">:</span>}
                        </React.Fragment>
                      ))}
                    </div>

                    <div className="text-center bg-white/5 border border-white/10 rounded-sm p-3 mt-auto">
                      <p className="text-gray-300 text-[11px] tracking-wide">Fair opens: Oct 13, 2026 at 9:00 AM</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-sm shadow-sm p-4 lg:p-5 border border-gray-100">
                    <h4 className="font-bold mb-1 text-[10px] lg:text-[11px] uppercase tracking-widest text-[#00a3c4]">Organized By</h4>
                    <p className="text-xs sm:text-sm font-bold text-gray-900 mb-2 mt-1">Export Promotion Council for Handicrafts</p>
                    <div className="bg-[#00a3c4]/5 p-2.5 rounded-sm border border-[#00a3c4]/10 text-[11px] text-gray-600 leading-relaxed font-medium">
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