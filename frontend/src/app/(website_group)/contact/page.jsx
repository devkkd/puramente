"use client";

import React, { useState } from "react";
import { Plane, TrainFront, Car, CheckCircle2 } from "lucide-react";
import { submitContactEnquiry } from "@/lib/api";

export default function ContactUsPage() {
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    companyName: "",
    companyWebsite: "",
    phone: "",
    country: "Select Country",
    orderVolume: "Select Estimated Order Volume",
    message: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await submitContactEnquiry(formData);
      if (res.success) {
        setIsSuccess(true);
        // Clear form
        setFormData({
          fullName: "", email: "", companyName: "", companyWebsite: "",
          phone: "", country: "Select Country", orderVolume: "Select Estimated Order Volume", message: ""
        });
        // Scroll to top to see success message
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Hide success message after 5 seconds
        setTimeout(() => setIsSuccess(false), 5000);
      } else {
        alert(res.error || "Failed to send message.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-full bg-white font-mona pb-8 lg:pb-12 pt-8 lg:pt-10">

      {/* SUCCESS BANNER */}
      {isSuccess && (
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-6 lg:mb-8 animate-in slide-in-from-top-4 fade-in">
          <div className="bg-[#E6FDF9] border border-[#00a3c4]/30 rounded-xl p-4 flex items-center gap-3">
            <CheckCircle2 className="text-[#00a3c4] shrink-0" size={24} />
            <p className="text-[#00a3c4] font-bold text-sm lg:text-base">Message sent successfully! Our team will get back to you shortly.</p>
          </div>
        </div>
      )}

      {/* --- HERO SECTION --- */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 lg:pt-8 pb-10 lg:pb-16 flex flex-col items-center text-center">
        <div className="flex items-center gap-3 lg:gap-4 text-[#00a3c4] text-xs lg:text-sm font-normal tracking-widest uppercase mb-4">
          <span className="w-10 sm:w-12 md:w-20 h-px bg-[#00a3c4]/50"></span>
          <span>Contact Us</span>
          <span className="w-10 sm:w-12 md:w-20 h-px bg-[#00a3c4]/50"></span>
        </div>

        <h1 className="font-playfair text-3xl md:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight mb-4 lg:mb-6 leading-tight lg:leading-snug">
          <span className="italic text-[#00a3c4] font-medium pr-1.5">Let's</span> Build Something Together
        </h1>

        <p className="text-sm font-normal text-gray-600 lg:text-gray-700 max-w-3xl leading-relaxed">
          Whether You're Sourcing Jewelry For Your Boutique For The First Time, Requesting A Custom Oem Quote, Exploring Private Label Options,
          Or Scaling An Existing Relationship Our Team In Jaipur Is Ready To Respond. We Work Exclusively With Trade Buyers, Brands, And Wholesale Partners.
        </p>
      </section>

      {/* --- QUICK INFO BANNER --- */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-12 lg:mb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border border-gray-200 divide-y sm:divide-y-0 sm:gap-px sm:bg-gray-200 lg:divide-x lg:bg-transparent">

          <div className="p-5 lg:p-8 flex flex-col bg-white">
            <span className="text-xs lg:text-sm font-normal text-gray-700 mb-2 lg:mb-3">Call Us Directly</span>
            <span className="text-[#00a3c4] font-bold text-base lg:text-xl mb-2 lg:mb-3">+91 9314 346 148</span>
            <span className="text-[11px] lg:text-xs font-normal text-gray-500">Mon - Sat, 10:00 AM - 8:00 PM IST</span>
          </div>

          <div className="p-5 lg:p-8 flex flex-col bg-white">
            <span className="text-xs lg:text-sm font-normal text-gray-700 mb-2 lg:mb-3">Email Us</span>
            <span className="text-[#00a3c4] font-bold text-base lg:text-xl mb-2 lg:mb-3 truncate">info@puramentejewel.com</span>
            <span className="text-[11px] lg:text-xs font-normal text-gray-500">Response within 24 business hours</span>
          </div>

          <div className="p-5 lg:p-8 flex flex-col bg-white">
            <span className="text-xs lg:text-sm font-normal text-gray-700 mb-2 lg:mb-3">WhatsApp - Fastest</span>
            <span className="text-[#00a3c4] font-bold text-base lg:text-xl mb-2 lg:mb-3">+91 97991 68300</span>
            <span className="text-[11px] lg:text-xs font-normal text-gray-500">Typical response within 2 hours</span>
          </div>

          <div className="p-5 lg:p-8 flex flex-col bg-white">
            <span className="text-xs lg:text-sm font-normal text-gray-700 mb-2 lg:mb-3">Visit Our Atelier</span>
            <span className="text-[#00a3c4] font-bold text-base lg:text-xl mb-2 lg:mb-3">Jaipur</span>
            <span className="text-[11px] lg:text-xs font-normal text-gray-500">By appointment - factory visits welcome</span>
          </div>

        </div>
      </section>

      {/* --- MAIN CONTACT CONTENT --- */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-16 lg:mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 relative">

          {/* LEFT COLUMN: CONTACT DETAILS */}
          <div className="space-y-10 lg:space-y-16 lg:pr-8">

            {/* Call Us At */}
            <div className="flex flex-col md:flex-row gap-4 lg:gap-12">
              <div className="md:w-1/3 shrink-0">
                <h2 className="font-playfair text-2xl lg:text-3xl font-bold text-gray-900">Call Us At</h2>
              </div>
              <div className="md:w-2/3 space-y-4 lg:space-y-5">
                <div>
                  <p className="text-[13px] lg:text-sm font-normal text-gray-700 mb-1">Primary Line</p>
                  <p className="text-[#00a3c4] font-bold text-lg lg:text-xl mb-1.5 lg:mb-2">+91 9314 346 148</p>
                  <p className="text-[13px] lg:text-sm font-normal text-gray-700">Calls, WhatsApp, and SMS all accepted on this number</p>
                </div>
                <div className="bg-[#E6FDF9] p-4 lg:p-5 rounded-sm">
                  <p className="text-[13px] lg:text-sm font-normal text-gray-800 leading-relaxed">
                    <span className="mr-2">💡</span>
                    For trade enquiries, calling directly is the fastest way to speak with our export team. If you're calling from outside India, dial +91 first. For voice-to-voice calls across time zones, we're also available on WhatsApp audio and video calls - no roaming charges for you.
                  </p>
                </div>
              </div>
            </div>

            {/* Write to Us */}
            <div className="flex flex-col md:flex-row gap-4 lg:gap-12">
              <div className="md:w-1/3 shrink-0">
                <h2 className="font-playfair text-2xl lg:text-3xl font-bold text-gray-900">Write to Us</h2>
              </div>
              <div className="md:w-2/3 space-y-4 lg:space-y-5">
                <div>
                  <p className="text-[13px] lg:text-sm font-normal text-gray-700 mb-1">General & Trade Enquiries</p>
                  <p className="text-[#00a3c4] font-bold text-lg lg:text-xl mb-1.5 lg:mb-2 break-all sm:break-normal">info@puramentejewel.com</p>
                  <p className="text-[13px] lg:text-sm font-normal text-gray-700">Response within 24 business hours</p>
                </div>
                <div className="bg-[#E6FDF9] p-4 lg:p-5 rounded-sm">
                  <p className="text-[13px] lg:text-sm font-normal text-gray-800 leading-relaxed">
                    Catalogues, quotes, compliance docs, custom briefs
                  </p>
                </div>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="flex flex-col md:flex-row gap-4 lg:gap-12">
              <div className="md:w-1/3 shrink-0">
                <h2 className="font-playfair text-2xl lg:text-3xl font-bold text-gray-900">WhatsApp</h2>
              </div>
              <div className="md:w-2/3 space-y-4 lg:space-y-5">
                <div>
                  <p className="text-[13px] lg:text-sm font-normal text-gray-700 mb-1">For Urgent Queries</p>
                  <p className="text-[#00a3c4] font-bold text-lg lg:text-xl mb-1.5 lg:mb-2">+91 97991 68300 ,+91 9314 346 148</p>
                  <p className="text-[13px] lg:text-sm font-normal text-gray-700">Typical response within 2 hours</p>
                </div>
                <div className="bg-[#E6FDF9] p-4 lg:p-5 rounded-sm">
                  <p className="text-[13px] lg:text-sm font-normal text-gray-800 leading-relaxed">
                    Fastest response channel · Share photos, designs, references <br /><br />
                    When emailing, please include your company name, country, product interest, and approximate order quantity. This allows us to give you a relevant, accurate response on the first reply rather than a round of back-and-forth.
                  </p>
                </div>
              </div>
            </div>

            {/* Visit Our Atelier */}
            <div className="flex flex-col md:flex-row gap-4 lg:gap-12">
              <div className="md:w-1/3 shrink-0">
                <h2 className="font-playfair text-2xl lg:text-3xl font-bold text-gray-900">Visit Our<br className="hidden lg:block" /> Atelier</h2>
              </div>
              <div className="md:w-2/3">
                <h3 className="text-[#00a3c4] font-bold text-lg lg:text-xl mb-2 lg:mb-4">Manufacturing Atelier & Office</h3>
                <p className="text-[13px] lg:text-sm font-normal text-gray-700 leading-relaxed">
                  83/B-1, Ground Floor, Chetak Marg<br />
                  Sector-8, Sanganer, Pratap Nagar<br />
                  Jaipur, Rajasthan - 302033 India
                </p>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: CONTACT FORM */}
          <div className="lg:pl-8 lg:border-l lg:border-gray-200 mt-10 pt-10 border-t border-gray-200 lg:mt-0 lg:pt-0 lg:border-t-0">

            <div className="flex items-center gap-3 lg:gap-4 text-[#00a3c4] text-xs lg:text-sm font-normal tracking-widest uppercase mb-4">
              <span className="w-10 sm:w-12 h-px bg-[#00a3c4]/50"></span>
              <span>Send Us a Message</span>
            </div>

            <h2 className="font-playfair text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight mb-4 lg:mb-6">
              <span className="italic text-[#00a3c4] font-medium pr-1.5">Tell Us</span> What You're Looking For
            </h2>

            <p className="text-[13px] lg:text-sm font-normal text-gray-600 lg:text-gray-700 leading-relaxed mb-8 lg:mb-10">
              Fill In The Form Below And Our Export Team Will Respond With A Tailored Reply Not A Generic Autoresponse.<br className="hidden sm:block" />
              The More Detail You Include, The Faster And More Relevant Our Answer Will Be.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                <div>
                  <label className="block text-[13px] lg:text-sm font-normal text-gray-700 mb-1.5 lg:mb-2">Full Name*</label>
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required className="w-full border border-gray-300 p-3 lg:p-3.5 text-[13px] lg:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#00a3c4] rounded-sm" placeholder="Enter your full name" />
                </div>
                <div>
                  <label className="block text-[13px] lg:text-sm font-normal text-gray-700 mb-1.5 lg:mb-2">Email Address*</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full border border-gray-300 p-3 lg:p-3.5 text-[13px] lg:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#00a3c4] rounded-sm" placeholder="Enter your email address" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                <div>
                  <label className="block text-[13px] lg:text-sm font-normal text-gray-700 mb-1.5 lg:mb-2">Company Name</label>
                  <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} className="w-full border border-gray-300 p-3 lg:p-3.5 text-[13px] lg:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#00a3c4] rounded-sm" placeholder="Enter your company name" />
                </div>
                <div>
                  <label className="block text-[13px] lg:text-sm font-normal text-gray-700 mb-1.5 lg:mb-2">Company Website</label>
                  <input type="url" name="companyWebsite" value={formData.companyWebsite} onChange={handleChange} className="w-full border border-gray-300 p-3 lg:p-3.5 text-[13px] lg:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#00a3c4] rounded-sm" placeholder="Enter your company website" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                <div>
                  <label className="block text-[13px] lg:text-sm font-normal text-gray-700 mb-1.5 lg:mb-2">Phone / WhatsApp Number*</label>
                  <input type="text" name="phone" value={formData.phone} onChange={handleChange} required className="w-full border border-gray-300 p-3 lg:p-3.5 text-[13px] lg:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#00a3c4] rounded-sm" placeholder="Enter your number" />
                </div>
                <div>
                  <label className="block text-[13px] lg:text-sm font-normal text-gray-700 mb-1.5 lg:mb-2">Country</label>
                  <div className="relative">
                    <select name="country" value={formData.country} onChange={handleChange} className="w-full border border-gray-300 p-3 lg:p-3.5 text-[13px] lg:text-sm text-gray-900 focus:outline-none focus:border-[#00a3c4] bg-white appearance-none cursor-pointer rounded-sm">
                      <option disabled>Select Country</option>
                      <option>United States</option>
                      <option>United Kingdom</option>
                      <option>India</option>
                      <option>Australia</option>
                      <option>Europe (Other)</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[13px] lg:text-sm font-normal text-gray-700 mb-1.5 lg:mb-2">Estimated Order Volume</label>
                <div className="relative w-full sm:w-1/2">
                  <select name="orderVolume" value={formData.orderVolume} onChange={handleChange} className="w-full border border-gray-300 p-3 lg:p-3.5 text-[13px] lg:text-sm text-gray-900 focus:outline-none focus:border-[#00a3c4] bg-white appearance-none cursor-pointer rounded-sm">
                    <option disabled>Select Estimated Order Volume</option>
                    <option>Samples Only</option>
                    <option>50 - 200 pieces</option>
                    <option>200 - 500 pieces</option>
                    <option>500+ pieces</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[13px] lg:text-sm font-normal text-gray-700 mb-1.5 lg:mb-2">Your Message*</label>
                <textarea name="message" value={formData.message} onChange={handleChange} required rows="5" className="w-full border border-gray-300 p-3 lg:p-4 text-[13px] lg:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#00a3c4] resize-none rounded-sm" placeholder="Tell us about your requirements product types, materials, finish, gemstones, timeline, budget, private label needs, or any questions you have. The more you share, the more useful our reply will be."></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-[#0082A4] text-white px-8 py-3.5 text-xs lg:text-sm font-bold tracking-widest uppercase hover:bg-[#006a85] transition-colors w-full sm:w-auto disabled:opacity-50 flex items-center justify-center gap-2 rounded-3xl"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                    Sending...
                  </>
                ) : (
                  "Send Message →"
                )}
              </button>

              <p className="text-xs lg:text-sm font-normal text-gray-600 lg:text-gray-700 leading-relaxed mt-4 lg:mt-6 text-center sm:text-left">
                We respond to every trade enquiry personally - not with automated templates.<br className="hidden sm:block" />
                Your information is kept strictly confidential and never shared with third parties.
              </p>
            </form>

          </div>

        </div>
      </section>

      {/* --- MAP SECTION --- */}
      {/* --- MAP SECTION --- */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 border-t border-gray-200 pt-10 lg:pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

          <div className="pr-0 md:pr-12 lg:pr-24">
            <h2 className="font-playfair text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 lg:mb-10">How to Reach Us</h2>

            <div className="space-y-6 lg:space-y-8 text-[13px] lg:text-sm font-normal text-gray-700">
              <div>
                <h4 className="font-bold text-gray-900 text-sm lg:text-base mb-1.5 lg:mb-2 flex items-center gap-2">
                  <Plane size={18} className="text-[#00a3c4]" /> From Jaipur Airport:
                </h4>
                <p className="pl-6 lg:pl-0">Approximately 15–20 minutes by taxi. Request a prepaid taxi from the airport counter.</p>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 text-sm lg:text-base mb-1.5 lg:mb-2 flex items-center gap-2">
                  <TrainFront size={18} className="text-[#00a3c4]" /> From Jaipur Junction:
                </h4>
                <p className="pl-6 lg:pl-0">Approximately 20–25 minutes by auto-rickshaw or taxi.</p>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 text-sm lg:text-base mb-1.5 lg:mb-2 flex items-center gap-2">
                  <Car size={18} className="text-[#00a3c4]" /> Self-Drive:
                </h4>
                <p className="pl-6 lg:pl-0">Search "Puramente International" in Google Maps for live navigation.</p>
              </div>
            </div>
          </div>

          {/* Updated Functional Map Embed */}
          {/* Updated Functional Map Embed */}
          <div className="w-full h-[250px] sm:h-[350px] md:h-[450px] bg-gray-100 rounded-lg overflow-hidden shadow-inner border border-gray-200 mt-4 lg:mt-0">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3561.4018244199923!2d75.81357677521!3d26.804153976711586!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396dc9aecac14101%3A0x4ae9618d0a763441!2sPuramente%20International!5e0!3m2!1sen!2sin!4v1716720000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Puramente International Location Map"
            ></iframe>
          </div>

        </div>
      </section>

    </main>
  );
}