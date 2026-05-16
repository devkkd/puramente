"use client";

import React from "react";

// --- PRIVACY POLICY DATA ---
const policies = [
  {
    title: "Welcome to Puramente International's Privacy Policy",
    content: "This page outlines our commitment to ensuring the privacy and security of your personal information when you use our website. Please take a moment to review the following details:",
    isNumbered: false
  },
  {
    title: "1. Information We Collect",
    content: "We may collect personal information, such as your name, contact details, and preferences, when you interact with our website or make a design selection. This information is used to fulfill your orders, provide personalized services, and enhance your overall experience.",
    isNumbered: true
  },
  {
    title: "2. How We Use Your Information",
    content: "Your information is used for order processing, personalized communication, and to improve our products and services. We do not sell, trade, or transfer your personally identifiable information to outside parties without your consent.",
    isNumbered: true
  },
  {
    title: "3. Security Measures",
    content: "Puramente International employs industry-standard security measures to safeguard your personal information. We use secure servers and regularly update our protocols to protect against unauthorized access, disclosure, or alteration of your information.",
    isNumbered: true
  },
  {
    title: "4. Cookies and Tracking",
    content: "Our website uses cookies to enhance your browsing experience. These cookies are small data files stored on your device that help us analyze website traffic and tailor our services to your preferences. You can choose to accept or decline cookies through your browser settings.",
    isNumbered: true
  },
  {
    title: "5. Third-Party Links",
    content: "Our website may contain links to external sites. Please note that we are not responsible for the privacy practices of these third-party websites. We encourage you to review their privacy policies before providing any personal information.",
    isNumbered: true
  },
  {
    title: "6. Updates to Privacy Policy",
    content: "Puramente International reserves the right to update this Privacy Policy periodically. Any changes will be reflected on this page. We recommend checking this page regularly to stay informed about our privacy practices.",
    isNumbered: true
  },
  {
    title: "7. Your Consent",
    content: "By using our website, you consent to the terms outlined in this Privacy Policy. If you have any concerns or questions regarding the handling of your personal information, please contact us.",
    isNumbered: true
  },
  {
    title: "8. Contact Us",
    content: "Inquiries regarding our Privacy Policy, please contact us at info@puramenteinternational.com.",
    isNumbered: true
  }
];

export default function PrivacyPolicyPage() {
  return (
    <main className="w-full bg-white font-mona pb-32 pt-16">
      
      {/* --- HERO SECTION --- */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 flex flex-col items-center text-center">
        <div className="flex items-center gap-4 text-[#00a3c4] text-xs md:text-sm font-normal tracking-widest uppercase mb-4">
          <span className="w-12 md:w-20 h-px bg-[#00a3c4]/50"></span>
          <span>Privacy Policy</span>
          <span className="w-12 md:w-20 h-px bg-[#00a3c4]/50"></span>
        </div>

        <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight mb-6">
          <span className="italic text-[#00a3c4] font-medium pr-1.5">Our</span> Privacy Policy
        </h1>

        <p className="text-sm font-normal text-gray-700 max-w-2xl leading-relaxed">
          Your privacy is our priority at Puramente International.
        </p>
      </section>

      {/* --- POLICY LIST SECTION --- */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="flex flex-col border-t border-gray-200">
          {policies.map((policy, index) => (
            <div 
              key={index} 
              className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-12 py-8 md:py-10 border-b border-gray-200 hover:bg-gray-50/50 transition-colors"
            >
              {/* Title (Left Column - 4/12) */}
              <div className="md:col-span-4 lg:col-span-4">
                <h3 className="font-bold text-base md:text-lg text-gray-900 leading-snug pr-4 flex items-start gap-2">
                  {policy.isNumbered && <span>🔒</span>}
                  <span>{policy.title}</span>
                </h3>
              </div>
              
              {/* Content (Right Column - 8/12) */}
              <div className="md:col-span-8 lg:col-span-8 flex items-center">
                <p className="text-sm font-normal text-gray-700 leading-relaxed">
                  {policy.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- FOOTER NOTE SECTION --- */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-sm font-normal text-gray-700 leading-relaxed space-y-6">
          <p>
            Thank you for trusting Puramente International. Your privacy is important to us, and we are dedicated to maintaining the confidentiality and security of your information.
          </p>
          <p>
            Last updated: November 20, 2025
          </p>
        </div>
      </section>

    </main>
  );
}