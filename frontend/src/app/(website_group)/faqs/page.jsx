"use client";

import React from "react";

// --- FAQ DATA ---
const faqs = [
  {
    question: "What sets Puramente International apart as a jewelry manufacturer?",
    answer: "Puramente International stands out due to its commitment to craftsmanship, innovative designs, and sustainable practices. We blend traditional techniques with modern technology to create unique and high-quality fashion jewelry."
  },
  {
    question: "Do you offer customization for your jewelry designs?",
    answer: "Yes, we offer comprehensive customization services! Our expert design team works closely with you to create personalized pieces that reflect your unique style and vision."
  },
  {
    question: "What types of materials do you use in your jewelry manufacturing?",
    answer: "We use premium materials including 925 sterling silver, gold, platinum, and ethically sourced gemstones. All materials are selected for durability, quality, and ethical sourcing standards."
  },
  {
    question: "Can I purchase your jewelry as a wholesaler?",
    answer: "Absolutely! We specialize in wholesale partnerships. Contact our dedicated sales team for bulk order pricing, catalog access, and partnership opportunities."
  },
  {
    question: "Is Puramente International committed to sustainable practices?",
    answer: "Yes, sustainability is core to our ethos. We use recycled metals, ethically sourced gemstones, and eco-friendly packaging while maintaining zero-waste manufacturing processes."
  },
  {
    question: "How can I contact Puramente International for inquiries or orders?",
    answer: "Reach us via our contact form, email at info@puramentejewel.com, or phone at +91 9314 346 148. Our team responds within 24 hours."
  }
];

export default function FAQPage() {
  return (
    <main className="w-full bg-white font-mona pb-32 pt-16">
      
      {/* --- HERO SECTION --- */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 flex flex-col items-center text-center">
        <div className="flex items-center gap-4 text-[#00a3c4] text-xs md:text-sm font-normal tracking-widest uppercase mb-4">
          <span className="w-12 md:w-20 h-px bg-[#00a3c4]/50"></span>
          <span>FAQ'S</span>
          <span className="w-12 md:w-20 h-px bg-[#00a3c4]/50"></span>
        </div>

        <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight mb-6">
          <span className="italic text-[#00a3c4] font-medium pr-1.5">Frequently</span> Asked Questions
        </h1>

        <p className="text-sm font-normal text-gray-700 max-w-2xl leading-relaxed">
          Find answers to common questions about our jewelry manufacturing, customization, and sustainability practices.
        </p>
      </section>

      {/* --- FAQ LIST SECTION --- */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col border-t border-gray-200">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-12 py-8 md:py-10 border-b border-gray-200 hover:bg-gray-50/50 transition-colors"
            >
              {/* Question (Left Column - 4/12) */}
              <div className="md:col-span-4 lg:col-span-4">
                <h3 className="font-bold text-base md:text-lg text-gray-900 leading-snug pr-4">
                  {faq.question}
                </h3>
              </div>
              
              {/* Answer (Right Column - 8/12) */}
              <div className="md:col-span-8 lg:col-span-8 flex items-center">
                <p className="text-sm font-normal text-gray-700 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}