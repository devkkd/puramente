"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export default function SEOContentSection() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  const seoContent = {
    intro: "Puramente International specializes in premium jewelry collections for retailers and brands worldwide. Our handcrafted pieces combine traditional craftsmanship with contemporary design, offering wholesale solutions, custom designs, and market-leading insights.",
    sections: [
      {
        title: "Premium Jewelry Collections for Discerning Retailers",
        description: "At Puramente International, we specialize in creating premium jewelry collections that combine traditional craftsmanship with contemporary design. Our extensive catalog includes rings, earrings, necklaces, bracelets, and custom designs tailored to meet the unique needs of jewelry retailers and brands across the globe."
      },
      {
        title: "Wholesale Jewelry Solutions for Your Business",
        description: "As a leading wholesale jewelry supplier, we offer competitive pricing, bulk order capabilities, and flexible payment terms. Whether you're a boutique retailer or an established jewelry brand, our wholesale jewelry solutions are designed to enhance your inventory and maximize profitability. We work directly with retailers to ensure you get the best quality pieces at the most competitive rates."
      },
      {
        title: "Handcrafted Jewelry Designs with Exceptional Quality",
        description: "Each piece in our collection is meticulously handcrafted by skilled artisans with decades of combined experience. We use premium materials including certified gemstones, precious metals, and sustainable materials to ensure every piece meets our rigorous quality standards. Our commitment to excellence ensures that every item you purchase reflects the highest standards of jewelry craftsmanship."
      },
      {
        title: "Customizable Jewelry Designs for Your Brand",
        description: "Looking for custom jewelry designs? Our design team specializes in creating bespoke collections that align with your brand identity and market demands. From concept to completion, we work collaboratively to bring your vision to life, offering full customization options for metals, gemstones, dimensions, and finishing touches."
      },
      {
        title: "Jewelry Trends and Market Insights",
        description: "Stay ahead of the curve with Puramente's exclusive access to the latest jewelry trends, market forecasts, and wholesale pricing insights. Our team continuously monitors industry trends and consumer preferences to help you make informed decisions about your inventory. We provide regular market reports and trend analysis to keep your business competitive."
      },
      {
        title: "Sustainable and Ethical Jewelry Practices",
        description: "We believe in responsible jewelry manufacturing and sustainable practices. Our commitment to ethical sourcing, fair labor practices, and environmental consciousness ensures that our pieces are not only beautiful but also responsibly made. We're proud to be part of the movement towards more sustainable jewelry industry practices."
      },
      {
        title: "Why Choose Puramente for Your Jewelry Needs?",
        description: "With over a decade of experience in the jewelry industry, Puramente International stands out as a trusted partner for retailers and brands. We offer exceptional customer service, competitive pricing, reliable delivery, and a commitment to quality that's unmatched in the industry. Our Jaipur-based studio is equipped with state-of-the-art facilities and staffed by experienced craftspeople dedicated to perfection."
      }
    ]
  };

  return (
    <section className="w-full py-12 md:py-16 bg-white font-mona" ref={sectionRef}>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Intro Section */}
        <div className={`mb-8 md:mb-12 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-5 md:mb-6 leading-tight">
            Premium Jewelry for
            <span className="block italic text-[#0082A4] font-medium">Retailers & Brands</span>
          </h2>
          
          <p className="text-base md:text-lg font-normal text-gray-700 leading-relaxed max-w-3xl mb-8">
            {seoContent.intro}
          </p>

          {/* Read More Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`inline-flex items-center gap-2 text-[#0082A4] font-bold text-base md:text-lg hover:text-[#006a85] transition-all duration-300 group`}
          >
            {isExpanded ? "Show Less" : "Read More"}
            <ChevronDown 
              size={20} 
              className={`transition-transform duration-500 ${isExpanded ? 'rotate-180' : 'rotate-0'}`}
            />
          </button>
        </div>

        {/* Expanded Content - Simple Clean Design */}
        <div 
          className={`overflow-hidden transition-all duration-700 ease-out
            ${isExpanded ? "max-h-[4000px] opacity-100" : "max-h-0 opacity-0"}
          `}
        >
          <div className="space-y-10 md:space-y-12">
            {seoContent.sections.map((section, index) => (
              <div 
                key={index}
                className="opacity-0 animate-fadeInUp"
                style={{
                  animation: `fadeInUp 0.7s ease-out forwards`,
                  animationDelay: `${index * 0.08}s`
                }}
              >
                {/* Section Heading */}
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">
                  {section.title}
                </h3>
                
                {/* Section Description */}
                <p className="text-base md:text-lg font-normal text-gray-700 leading-relaxed">
                  {section.description}
                </p>

                {/* Subtle divider between sections (except last) */}
                {index < seoContent.sections.length - 1 && (
                  <div className="mt-8 md:mt-10 border-t border-gray-100"></div>
                )}
              </div>
            ))}

            {/* CTA Section */}
            <div className="mt-10 md:mt-12 pt-8 md:pt-10 border-t border-gray-100 flex flex-col sm:flex-row gap-4 justify-start">
              <a 
                href="/custom"
                className="inline-flex items-center justify-center px-8 md:px-10 py-3 md:py-3.5 bg-[#0082A4] text-white font-bold text-base md:text-lg rounded-lg hover:bg-[#006a85] transition-all duration-300 hover:shadow-lg"
              >
                Design Your Jewelry
              </a>
              <a 
                href="/contact"
                className="inline-flex items-center justify-center px-8 md:px-10 py-3 md:py-3.5 border-2 border-[#0082A4] text-[#0082A4] font-bold text-base md:text-lg rounded-lg hover:bg-[#E2FCFF] transition-all duration-300"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
