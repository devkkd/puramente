"use client";

import Image from "next/image";
import Slider from "react-slick";
import { ArrowLeft, ArrowRight } from "lucide-react";

// --- CUSTOM ARROW COMPONENTS ---
const SamplePrevArrow = (props) => {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      // Hidden on mobile (swipe is better), visible on sm (tablets) and up
      className="hidden sm:flex absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 bg-black/30 text-white rounded-full items-center justify-center hover:bg-black/60 transition-colors backdrop-blur-sm"
      aria-label="Previous banner"
    >
      <ArrowLeft size={20} className="md:w-6 md:h-6" />
    </button>
  );
};

const SampleNextArrow = (props) => {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      // Hidden on mobile (swipe is better), visible on sm (tablets) and up
      className="hidden sm:flex absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 bg-black/30 text-white rounded-full items-center justify-center hover:bg-black/60 transition-colors backdrop-blur-sm"
      aria-label="Next banner"
    >
      <ArrowRight size={20} className="md:w-6 md:h-6" />
    </button>
  );
};

export default function HeroSection() {
  
  // Slider Configuration
  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: false, // Keeps it moving smoothly
    prevArrow: <SamplePrevArrow />,
    nextArrow: <SampleNextArrow />,
    // Optional: Hide dots on mobile if they clutter the screen
    responsive: [
      {
        breakpoint: 640,
        settings: {
          dots: false, 
        }
      }
    ]
  };

  const banners = [
    {
      id: 1,
      imagePath: "/images/home/heroBanner.svg",
      altText: "Puramente International New Collection",
    },
  ];

  // Data for the sliding marquee
  const features = [
    "Crafted in Jaipur, India",
    "Quote within 24 Business Hours",
    "Hallmarked 925 Sterling Silver",
    "Ships to 40+ Countries",
    "Private Label Jewelry India",
    "OEM Jewelry Manufacturer",
    "Wholesale Silver Jewelry"
  ];

  return (
    <section className="w-full flex flex-col">
      {/* 1. HERO SLIDER */}
      <div className="w-full relative bg-gray-100 hero-slider-container flex flex-col">
        <Slider {...settings} className="relative w-full">
          {banners.map((banner) => (
            // Responsive heights: 55vh mobile, 65vh tablet, 85vh desktop
            <div key={banner.id} className="relative w-full h-[55vh] sm:h-[65vh] lg:h-[85vh] !block leading-none outline-none">
              <Image
                src={banner.imagePath}
                alt={banner.altText}
                fill
                className="object-cover object-center !block" 
                priority
              />
            </div>
          ))}
        </Slider>
      </div>

      {/* 2. SLIDING MARQUEE BANNER */}
      {/* Responsive padding: py-2.5 on mobile, py-3.5 on larger screens */}
      <div className="w-full bg-[#111111] text-[#E2FCFF] py-2.5 md:py-3.5 overflow-hidden flex relative z-20 -mt-[1px]">
        <div className="animate-scroll flex items-center">
          
          {/* Render the list twice to create a seamless infinite loop */}
          {[...features, ...features].map((feature, index) => (
            <div key={index} className="flex items-center space-x-4 md:space-x-6 mx-4 md:mx-6 whitespace-nowrap">
              {/* The Sparkle Icon - scales slightly on desktop */}
              <svg 
                className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" 
                viewBox="0 0 24 24" 
                fill="currentColor"
              >
                <path d="M12 2l2.4 7.6h8l-6.4 4.7 2.4 7.7-6.4-4.8-6.4 4.8 2.4-7.7-6.4-4.7h8z"/>
              </svg>
              {/* Responsive text sizing */}
              <span className="text-xs sm:text-sm md:text-base font-medium tracking-wide">
                {feature}
              </span>
            </div>
          ))}
          
        </div>
      </div>
    </section>
  );
}