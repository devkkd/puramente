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
  },

  // New FAQs
  {
    question: "Do you offer wholesale jewellery?",
    answer: "Of course, Puramente International offers to wholesale jewellery retailers, jewellery boutiques, jewellery brands and professional jewellery buyers internationally."
  },
  {
    question: "What is the minimum order quantity (MOQ) for wholesale orders?",
    answer: "The MOQ for a project will depend on the designs, materials and customization requirements. For wholesale order quantities please contact our team."
  },
  {
    question: "How can I request wholesale pricing?",
    answer: "Please call Puramente International with your needs, your chosen designs and quantity to receive a bespoke wholesale quotation."
  },
  {
    question: "Do you provide a wholesale jewellery catalogue?",
    answer: "Absolutely wholesale buyers are welcome to access our jewellery collections and product catalogue for sourcing and bulk orders."
  },
  {
    question: "Can retailers order jewellery in bulk?",
    answer: "Yes you can order in bulk from our range of collections with retailers, boutiques, online stores and jewellery brands."
  },
  {
    question: "Can I order multiple designs in one wholesale order?",
    answer: "Yes, wholesale buyers can select multiple jewelry designs according to stock, amount, and the needs of the order."
  },
  {
    question: "How can I become a wholesale buyer?",
    answer: "Contact your business and ask about wholesale collaboration and ordering with Puramente International."
  },
  {
    question: "Is your jewellery made with 925 sterling silver?",
    answer: "Yes, Puramente International does have jewellery in high quality 925 sterling silver as well as other chosen jewellery materials."
  },
  {
    question: "Is your sterling silver hallmarked?",
    answer: "The truth is that Puramente International incorporates stamped 925 sterling silver in its jewellery making and quality."
  },
  {
    question: "What materials are used to make your jewellery?",
    answer: "Puramente International uses high-quality brass, silver certified 925 and gemstones for its jewellery."
  },
  {
    question: "What types of gemstones do you use?",
    answer: "We carry a variety of gems including moonstone, labradorite and a selection of other stones which have been hand picked for our jewellery collections."
  },
  {
    question: "Are your gemstones ethically sourced?",
    answer: "Puramente International states that it works with ethical materials and responsible sourcing in its production of jewellery."
  },
  {
    question: "How many countries do you export to?",
    answer: "Puramente International ship to over 40 countries and are proud to serve retailers and jewellery buyers worldwide."
  },
  {
    question: "Do you provide export documentation (Certificate of Origin, Invoice, Packing List)?",
    answer: "With our team, you can discuss export documentation based on your order needs and applicable international shipping regulations based on the destination."
  },
  {
    question: "How is jewellery packaged for international shipping?",
    answer: "Jewellery is packaged with care to ensure that pieces are safe, and are packaged to ensure a fine presentation."
  },
  {
    question: "What fair-trade or ethical practices does Puramente follow?",
    answer: "Puramente takes pride in ethical sourcing, fair wages, artisan based production and responsible practices, backed up by its fair-trade commitments."
  },
  {
    question: "Do you provide private label jewellery?",
    answer: "Yes, Puramente International offers private label jewellery solutions for brands who want to come up with customized jewellery products under their own brand identity."
  },
  {
    question: "Do you provide custom packaging and branding?",
    answer: "Yes, private label and bespoke jewellery needs can be discussed about custom packaging and branding."
  },
  {
    question: "Is Puramente Jewel a jewellery manufacturer or wholesaler?",
    answer: "Puramente Jewel is a jewellery manufacturer and wholesaler, offering to jewellery retailers, brands, boutiques and trade buyers."
  },
  {
    question: "What types of jewellery does Puramente Jewel offer?",
    answer: "Puramente Jewel is an excellent jewellery retailer supplying rings, earrings, necklaces, bracelets, statement jewellery and bespoke rings for jewellery buyers worldwide."
  },
  {
    question: "Can brands order custom jewellery in bulk?",
    answer: "Yes, brands can order custom jewellery in bulk, where the designs are created based on their needs and brand identity."
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