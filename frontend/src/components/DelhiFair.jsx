"use client";

import React, { useState, useEffect } from 'react';

const DelhiFair = ({ isExhibitionPage = false }) => {
  const targetDate = new Date('2027-03-15T09:00:00').getTime();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const calculateTimeLeft = () => {
    const now = new Date().getTime();
    const difference = targetDate - now;
    if (difference > 0) {
      const totalDays = Math.floor(difference / (1000 * 60 * 60 * 24));
      return {
        days: totalDays,
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      };
    }
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  };

  useEffect(() => {
    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fmt = (n) => String(n).padStart(2, '0');

  const timeUnits = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ];

  const HeaderBlock = () => (
    <div className={isExhibitionPage ? "flex flex-col items-center text-center mb-12" : "mb-10"}>
      {!isExhibitionPage && (
        <div className="flex items-center gap-4 text-[#d4763b] text-base font-normal tracking-widest uppercase mb-6">
          <span className="w-16 h-px bg-[#d4763b]"></span>
          <span>World-Class Exhibitions</span>
        </div>
      )}

      <h2 className={`font-playfair font-bold text-gray-900 mb-4 ${isExhibitionPage ? 'text-3xl md:text-4xl' : 'text-2xl md:text-3xl lg:text-4xl'}`}>
        Upcoming Trade <span className="italic text-[#d4763b] font-medium">Fairs</span>
      </h2>

      <p className={`text-sm font-normal text-gray-800 leading-relaxed ${isExhibitionPage ? 'max-w-2xl mx-auto' : 'max-w-2xl'}`}>
        Explore Extraordinary Art Exhibitions Discover groundbreaking exhibitions featuring the world's most innovative artists, designers, and creative minds.
      </p>
    </div>
  );

  return (
    <section className={`w-full bg-white font-mona overflow-hidden ${isExhibitionPage ? 'py-4' : 'py-8'}`}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">

        {isExhibitionPage && <HeaderBlock />}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">

          {/* LEFT COLUMN: Exhibition Image */}
          <div className="w-full lg:col-span-5 relative min-h-[400px] lg:min-h-full rounded-xl overflow-hidden">
            <img
              src="/images/home/Delhi-2027.png"
              alt="Puramente International Exhibition Booth"
              className="hidden lg:block absolute inset-0 w-full h-full object-contain"
            />
            <img
              src="/images/home/mobile-delhi-2027.png"
              alt="Puramente International Exhibition Booth"
              className="block lg:hidden absolute inset-0 w-full h-full object-contain"
            />
          </div>

          {/* RIGHT COLUMN: Content & Event Widget */}
          <div className="w-full lg:col-span-7 flex flex-col justify-center">

            {!isExhibitionPage && <HeaderBlock />}

            <div className="w-full space-y-6">

              <div className="rounded-xl overflow-hidden shadow-sm border border-orange-100">
                <img
                  src="/images/home/delhi-fairs-2027.png"
                  alt="IHGF Delhi Fair Spring 2027"
                  className="w-full object-cover h-auto sm:h-46"
                />
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">

                {/* Left: Info Cards */}
                <div className="xl:col-span-3 space-y-5">
                  <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-[#d4763b]">
                    <h2 className="text-xl font-bold text-[#d4763b] mb-2">
                      Welcome to IHGF Delhi Fair Spring 2027
                    </h2>
                    <div className="bg-gradient-to-r from-[#f0a96a] to-[#f7d98a] h-1 w-24 mb-4 rounded-full" />
                    <p className="text-gray-600 text-sm leading-relaxed mb-3">
                      We are excited to announce our participation in the <span className="font-semibold text-[#d4763b]">IHGF Delhi Fair – Spring 2027</span>, one of Asia's leading trade shows.
                    </p>
                    <p className="text-gray-600 text-sm leading-relaxed mb-6">
                      At Puramente International, we specialize in exporting premium-quality jewellery that blends craftsmanship with modern design. We look forward to connecting with global buyers.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                      <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                        <h4 className="font-bold text-sm text-[#d4763b] mb-2 flex items-center">
                          <span className="text-[#f0a96a] mr-2">&#10022;</span> Exclusive Collection
                        </h4>
                        <p className="text-gray-600 text-xs leading-relaxed">
                          Discover our custom jewellery collection, crafted with precision and designed to match international trends.
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-[#d4763b] to-[#f0a96a] p-4 rounded-xl flex items-center justify-center">
                        <p className="font-medium text-white text-sm text-center leading-relaxed">
                          We look forward to meeting you and presenting our latest designs and export-ready collections.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { color: '#d4763b', title: 'Venue', line1: 'India Expo Centre', line2: 'Greater Noida' },
                        { color: '#d4943b', title: 'Dates', line1: '15 – 19 Mar 2027', line2: 'Spring Edition' },
                        // { color: '#d4763b', title: 'Booth', line1: 'Hall No. 18', line2: 'Booth No. K-02/14' },
                      ].map(({ color, title, line1, line2 }) => (
                        <div key={title} className="rounded-xl p-3 border border-orange-100 bg-orange-50/40">
                          <h4 className="font-bold text-xs mb-1" style={{ color }}>{title}</h4>
                          <p className="text-gray-800 font-semibold text-[11px]">{line1}</p>
                          <p className="text-gray-500 text-[10px] mt-0.5">{line2}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Countdown & Organizer */}
                <div className="xl:col-span-2 flex flex-col gap-5">
                  <div className="bg-gradient-to-b from-[#f5e6d3] to-[#fdf3e7] rounded-xl shadow-sm border border-orange-100 p-5 text-gray-800 h-full flex flex-col justify-center">
                    <div className="text-center mb-5">
                      <span className="bg-[#d4763b] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">Spring 2027</span>
                      <h3 className="text-lg font-bold mt-3 text-[#a85520]">Countdown to the Fair</h3>
                    </div>

                    <div className="flex items-start justify-center gap-2 mb-5">
                      {timeUnits.map(({ label, value }, i) => (
                        <React.Fragment key={label}>
                          <div className="flex flex-col items-center">
                            <div className="bg-white rounded-lg w-10 h-10 flex items-center justify-center shadow-sm border border-orange-200">
                              <span className="text-lg font-bold text-[#d4763b]">{fmt(value)}</span>
                            </div>
                            <p className="text-[#c4855a] text-[8px] font-bold uppercase tracking-wide mt-2">{label}</p>
                          </div>
                          {i < timeUnits.length - 1 && <span className="text-[#d4943b] font-bold text-lg mt-1.5 opacity-60">:</span>}
                        </React.Fragment>
                      ))}
                    </div>

                    <div className="text-center bg-white/60 rounded-lg p-2.5 mt-auto border border-orange-100">
                      <p className="text-[#a85520] text-[11px]">Fair opens: Mar 15, 2027 at 9:00 AM</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm p-5 border border-orange-100">
                    <h4 className="font-bold mb-1 text-[11px] uppercase tracking-wide text-[#d4943b]">Organized By</h4>
                    <p className="text-xs sm:text-sm font-bold text-[#d4763b] mb-2 mt-1">Export Promotion Council for Handicrafts</p>
                    <div className="bg-orange-50 p-2.5 rounded-lg border border-orange-100 text-[10px] text-gray-500 leading-relaxed">
                      Asia's premier trade fair for home, lifestyle &amp; textiles
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
