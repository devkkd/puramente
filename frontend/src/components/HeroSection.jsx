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
      className="absolute left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/30 text-white rounded-full flex items-center justify-center hover:bg-black/60 transition-colors"
      aria-label="Previous banner"
    >
      <ArrowLeft size={24} />
    </button>
  );
};

const SampleNextArrow = (props) => {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/30 text-white rounded-full flex items-center justify-center hover:bg-black/60 transition-colors"
      aria-label="Next banner"
    >
      <ArrowRight size={24} />
    </button>
  );
};

export default function HeroSection() {
  
  // Slider Configuration
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    prevArrow: <SamplePrevArrow />,
    nextArrow: <SampleNextArrow />,
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
      {/* ✅ ADDED: flex and flex-col to force the slider to behave as a block without text-node spacing */}
      <div className="w-full relative bg-white hero-slider-container flex flex-col">
        {/* ✅ REMOVED: overflow-hidden from here, React-slick handles its own overflow usually */}
        <Slider {...settings} className="relative w-full">
          {banners.map((banner) => (
            <div key={banner.id} className="relative w-full h-[50vh] md:h-[70vh] lg:h-[80vh] !block leading-none">
              {/* ✅ MOVED COMMENT HERE: Inside the div to prevent JSX implicit return errors */}
              <Image
                src={banner.imagePath}
                alt={banner.altText}
                fill
                className="object-cover !block" // Forces block display to remove tiny baseline gaps
                priority
              />
            </div>
          ))}
        </Slider>
      </div>

      {/* 2. SLIDING MARQUEE BANNER */}
      {/* ✅ REMOVED: border-t which could have been rendering as the "white line" depending on how your browser handles transparency/colors */}
      {/* ✅ ADDED: -mt-[1px] as a fail-safe to pull the black bar up 1 pixel, completely hiding any ghost line */}
      <div className="w-full bg-[#111111] text-[#E2FCFF] py-3 overflow-hidden flex relative z-20 -mt-[1px]">
        <div className="animate-scroll flex items-center">
          
          {/* Render the list twice to create a seamless infinite loop */}
          {[...features, ...features].map((feature, index) => (
            <div key={index} className="flex items-center space-x-6 mx-6 whitespace-nowrap">
              {/* The Sparkle Icon */}
              <svg 
                className="w-4 h-4 text-white" 
                viewBox="0 0 24 24" 
                fill="currentColor"
              >
                <path d="M12 2l2.4 7.6h8l-6.4 4.7 2.4 7.7-6.4-4.8-6.4 4.8 2.4-7.7-6.4-4.7h8z"/>
              </svg>
              <span className="text-sm md:text-base font-medium tracking-wide">
                {feature}
              </span>
            </div>
          ))}
          
        </div>
      </div>
    </section>
  );
}