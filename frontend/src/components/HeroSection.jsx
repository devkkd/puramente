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
    pauseOnHover: false,
    prevArrow: <SamplePrevArrow />,
    nextArrow: <SampleNextArrow />,
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
      desktopImage: "/images/home/banner-1.png",
      mobileImage: "/images/home/mobilebanner2.png",
      altText: "Puramente International New Collection 1",
    },
    {
      id: 2,
      desktopImage: "/images/home/heroBanner2.png", 
      mobileImage: "/images/home/mobileBanner3.png", 
      altText: "Puramente International New Collection 2",
    },
    {
      id: 3,
      desktopImage: "/images/home/heroBanner3.png", 
      mobileImage: "/images/home/mobilebanner2.png", 
      altText: "Puramente International New Collection 3",
    },
    {
      id: 4,
      desktopImage: "/images/home/heroBanner4.png", 
      mobileImage: "/images/home/mobileBanner4.png", 
      altText: "Puramente International New Collection 4",
    },
  ];

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
      
      {/* GLOBAL OVERRIDE TO STRIP REACT-SLICK'S INVISIBLE GAPS */}
      <style dangerouslySetInnerHTML={{__html: `
        .hero-slick-wrapper .slick-slider { margin-bottom: 0 !important; }
        .hero-slick-wrapper .slick-slide > div { display: block; line-height: 0; font-size: 0; }
      `}} />

      {/* 1. HERO SLIDER */}
      <div className="w-full relative bg-gray-100 flex flex-col overflow-hidden leading-none hero-slick-wrapper">
        <Slider {...settings} className="w-full m-0 p-0">
          {banners.map((banner, index) => (
            <div key={banner.id} className="outline-none focus:outline-none block w-full m-0 p-0">
              
              {/* Aspect Ratio Container ensures no gaps */}
              <div className="relative w-full aspect-[390/370] sm:aspect-[1500/630] overflow-hidden bg-gray-100">
                
                {/* 🔴 FIX: Mobile Image Wrapper (Controls visibility perfectly) */}
                <div className="block sm:hidden absolute inset-0 w-full h-full">
                  <Image
                    src={banner.mobileImage}
                    alt={banner.altText}
                    fill
                    className="object-cover object-center"
                    priority={index === 0}
                  />
                </div>

                {/* 🔴 FIX: Desktop Image Wrapper (Controls visibility perfectly) */}
                <div className="hidden sm:block absolute inset-0 w-full h-full">
                  <Image
                    src={banner.desktopImage}
                    alt={banner.altText}
                    fill
                    className="object-cover object-center"
                    priority={index === 0}
                  />
                </div>

              </div>

            </div>
          ))}
        </Slider>
      </div>

      {/* 2. SLIDING MARQUEE BANNER */}
      <div className="w-full bg-[#111111] text-[#E2FCFF] py-2.5 md:py-3.5 overflow-hidden flex relative z-20">
        <div className="animate-scroll flex items-center">
          
          {[...features, ...features].map((feature, index) => (
            <div key={index} className="flex items-center space-x-4 md:space-x-6 mx-4 md:mx-6 whitespace-nowrap">
              <svg 
                className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" 
                viewBox="0 0 24 24" 
                fill="currentColor"
              >
                <path d="M12 2l2.4 7.6h8l-6.4 4.7 2.4 7.7-6.4-4.8-6.4 4.8 2.4-7.7-6.4-4.7h8z"/>
              </svg>
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