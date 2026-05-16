"use client";

import React from "react";
import Image from "next/image";
import { 
  TreeDeciduous, 
  Banknote, 
  Search, 
  Users, 
  Factory, 
  Globe 
} from "lucide-react";

// --- DATA ---
const principles = [
  {
    id: "01.",
    title: "Create Opportunities for Economically Disadvantaged Producers",
    description: "We open doors for artisans and mining communities that have historically been excluded from global markets, ensuring dignified access to trade.",
    image: "/images/New folder/trade1.png",
  },
  {
    id: "02.",
    title: "Transparency & Accountability",
    description: "Every gram of gold we use is traceable. We publish our sourcing practices and submit to independent audits, so you always know the story behind your jewellery.",
    image: "/images/New folder/trade2.png",
  },
  {
    id: "03.",
    title: "Fair Payment",
    description: "Miners and craftspeople receive a guaranteed minimum price that reflects the true value of their labour — protecting them from market volatility and exploitation.",
    image: "/images/New folder/trade3.png",
  },
  {
    id: "04.",
    title: "No Child Labour, No Forced Labour",
    description: "We maintain an absolute zero-tolerance policy. Every supply chain partner is verified and audited to ensure these standards are upheld without exception.",
    image: "/images/New folder/trade4.png",
  },
  {
    id: "05.",
    title: "No Discrimination, Gender Equity & Freedom of Association",
    description: "We champion inclusive workplaces where workers are free to organise, speak up, and participate equally — regardless of gender, background, or belief.",
    image: "/images/New folder/trade5.png",
  },
  {
    id: "06.",
    title: "Good Working Conditions",
    description: "Safe equipment, reasonable hours, fair contracts. We hold our partners to conditions we would be proud to work in ourselves.",
    image: "/images/New folder/trade6.png",
  },
  {
    id: "07.",
    title: "Capacity Building",
    description: "We invest in training, tools, and knowledge so that producers can grow their skills, improve their processes, and build long-term independence.",
    image: "/images/New folder/trade7.png",
  },
  {
    id: "08.",
    title: "Respect for the Environment",
    description: "Our sourcing standards restrict toxic chemicals, protect natural habitats, and push for progressively greener practices across every link in our chain.",
    image: "/images/New folder/trade8.png",
  },
  {
    id: "09.",
    title: "Community Development",
    description: "The Fairtrade premium we pay goes directly into community-chosen projects schools, healthcare, clean water, and infrastructure that outlasts any single transaction.",
    image: "/images/New folder/trade9.png",
  }
];

const passions = [
  {
    icon: TreeDeciduous,
    title: "Empower, Uplift, Prosper",
    desc: "Create opportunities for producers to thrive and grow with dignity."
  },
  {
    icon: Banknote,
    title: "Financial Support",
    desc: "Providing resources to ensure sustainable growth and stability for producers."
  },
  {
    icon: Search,
    title: "Transparency & Accountability",
    desc: "Building trust through clear and honest financial and ethical practices."
  },
  {
    icon: Users,
    title: "Equality, Equity & Freedom",
    desc: "Fostering inclusivity and justice for all in the trade ecosystem."
  },
  {
    icon: Factory,
    title: "Good Working Conditions",
    desc: "Guaranteeing safe, healthy, and fair workplaces for everyone involved."
  },
  {
    icon: Globe,
    title: "Respect for the Environment",
    desc: "Committing to sustainable practices that protect our shared planet."
  }
];

export default function FairTradePage() {
  return (
    <main className="w-full bg-white font-mona pb-24">
      
      {/* --- HERO SECTION --- */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 flex flex-col items-center text-center border-b border-gray-100">
        <div className="flex items-center gap-4 text-[#00a3c4] text-xs md:text-sm font-normal tracking-widest uppercase mb-4">
          <span className="w-12 md:w-20 h-px bg-[#00a3c4]/50"></span>
          <span>Fair Trade Practicing</span>
          <span className="w-12 md:w-20 h-px bg-[#00a3c4]/50"></span>
        </div>

        <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight mb-4">
          <span className="italic text-[#00a3c4] font-medium pr-1.5">Supporting</span>
          Fair Trade, Spreading Hope
        </h1>

        <p className="text-sm font-normal text-gray-700 max-w-3xl leading-relaxed">
          At Puramente Jewel, We Believe That Beauty Should Never Come At Someone Else's Expense.<br/>
          Our Commitment To Fairtrade Is Not A Certification It Is The Foundation Of Every Piece We Craft, Every Partnership We Build, And Every Decision We Make.
        </p>
      </section>

      {/* --- OUR PRINCIPLES INTRO --- */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        <div className="flex items-center gap-4 text-[#00a3c4] text-xs md:text-sm font-normal tracking-widest uppercase mb-4">
          <span className="w-12 md:w-20 h-px bg-[#00a3c4]/50"></span>
          <span>Our Principles</span>
        </div>
        <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-12">
          <span className="italic text-[#00a3c4] font-medium pr-1.5">Building</span>
          A Sustainable And Equitable Future Through Ethical Practices
        </h2>
      </section>

      {/* --- THE 9 PRINCIPLES (Alternating Layout) --- */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-32 space-y-16 lg:space-y-24">
        {principles.map((principle, index) => {
          const isEven = index % 2 === 0;

          return (
            <div key={principle.id} className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-center">
              
              {/* If EVEN: Image -> Title -> Desc */}
              {isEven ? (
                <>
                  <div className="order-1 lg:order-1 w-full aspect-[3/2] overflow-hidden">
                    <img src={principle.image} alt={principle.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="order-2 lg:order-2 flex gap-4 items-start">
                    <span className="text-lg md:text-xl text-gray-700 mt-0.5 font-medium shrink-0">({principle.id})</span>
                    <h3 className="font-bold text-xl md:text-2xl text-gray-900 leading-snug">{principle.title}</h3>
                  </div>
                  <div className="order-3 lg:order-3">
                    <p className="text-sm font-normal text-gray-700 leading-relaxed">
                      {principle.description}
                    </p>
                  </div>
                </>
              ) : (
                /* If ODD: Title -> Desc -> Image */
                <>
                  <div className="order-2 lg:order-1 flex gap-4 items-start">
                    <span className="text-lg md:text-xl text-gray-700 mt-0.5 font-medium shrink-0">({principle.id})</span>
                    <h3 className="font-bold text-xl md:text-2xl text-gray-900 leading-snug">{principle.title}</h3>
                  </div>
                  <div className="order-3 lg:order-2">
                    <p className="text-sm font-normal text-gray-700 leading-relaxed">
                      {principle.description}
                    </p>
                  </div>
                  <div className="order-1 lg:order-3 w-full aspect-[3/2] overflow-hidden">
                    <img src={principle.image} alt={principle.title} className="w-full h-full object-cover" />
                  </div>
                </>
              )}
              
            </div>
          );
        })}
      </section>

      {/* --- OUR PASSION GRID SECTION --- */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 border-t border-gray-100 pt-20">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="flex items-center gap-4 text-[#00a3c4] text-xs md:text-sm font-normal tracking-widest uppercase mb-4">
            <span className="w-12 md:w-20 h-px bg-[#00a3c4]/50"></span>
            <span>Our Passion</span>
            <span className="w-12 md:w-20 h-px bg-[#00a3c4]/50"></span>
          </div>
          <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            <span className="italic text-[#00a3c4] font-medium pr-1.5">Our</span> Passion For Fair Trade
          </h2>
          <p className="text-sm font-normal text-gray-700 max-w-2xl leading-relaxed">
            We're Dedicated To A Sustainable Future Empowering Producers, Fostering Ethical Practices, And Creating Lasting Positive Change.
          </p>
        </div>

        {/* 3x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {passions.map((item, index) => {
            // Calculate borders to perfectly match the reference image's internal grid lines
            const isTopRow = index < 3;
            const isLeftOrMiddleCol = index % 3 !== 2;
            
            return (
              <div 
                key={index} 
                className={`p-10 flex flex-col items-center text-center 
                  ${isTopRow ? 'border-b border-gray-200' : ''} 
                  ${isLeftOrMiddleCol ? 'lg:border-r border-gray-200' : ''}
                  ${index % 2 === 0 ? 'md:border-r lg:border-r-0 border-gray-200' : ''} // Mobile/Tablet grid adjustment
                `}
              >
                <div className="mb-6 text-[#00d2b9]">
                  <item.icon size={64} strokeWidth={1.5} />
                </div>
                <h3 className="font-bold text-lg md:text-xl text-gray-900 mb-3">{item.title}</h3>
                <p className="text-sm font-normal text-gray-700 leading-relaxed max-w-[260px]">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

      </section>

    </main>
  );
}