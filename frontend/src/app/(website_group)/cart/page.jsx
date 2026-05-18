"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext"; 
import { getUserProfile, submitOrderRequest } from "@/lib/api"; 
import { CheckCircle2, ShoppingBag, User } from "lucide-react"; 

export default function CartPage() {
  const { cart, loading, updateQuantity, removeFromCart, refreshCart, clearCart } = useCart();
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    companyName: "",
    companyWebsite: "",
    whatsappNo: "",
    country: "Select Country",
    message: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Safe authentication state check
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setLoggedInUserId(storedUserId);
    }
  }, []);

  // Auto-fill user details if they are logged in
  useEffect(() => {
    if (loggedInUserId) {
      const fetchUserData = async () => {
        try {
          const res = await getUserProfile(loggedInUserId);
          if (res.success && res.data) {
            setFormData({
              fullName: res.data.fullName || "",
              email: res.data.email || "",
              companyName: res.data.companyName || "",
              companyWebsite: res.data.companyWebsite || "",
              whatsappNo: res.data.whatsappNo || "",
              country: res.data.country || "Select Country",
              message: "" 
            });
          }
        } catch (error) {
          console.error("Failed to fetch user profile for auto-fill", error);
        }
      };
      fetchUserData();
    }
  }, [loggedInUserId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!cart || cart.items.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    if (formData.country === "Select Country") {
      alert("Please select a country.");
      return;
    }

    if (!loggedInUserId) {
      alert("Please log in to submit a request.");
      return;
    }

    setIsSubmitting(true);
    setIsSuccess(false);

    try {
      const payload = {
        userId: loggedInUserId,
        contactDetails: formData
      };

      const res = await submitOrderRequest(payload);
      
      if (res.success) {
        setIsSuccess(true);
        if (clearCart) {
          clearCart(); // Completely clear UI cart immediately
        } else {
          refreshCart(); 
        }
        setFormData({ ...formData, message: "" }); 
      }
    } catch (error) {
      console.error(error);
      alert("Failed to submit request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Avoid hydration errors
  if (!isMounted) return null;

  if (loading) {
    return <div className="min-h-[60vh] flex items-center justify-center font-mona text-gray-500 text-sm uppercase tracking-widest animate-pulse">Loading cart...</div>;
  }

  // --- FULL PAGE SUCCESS UI ---
  if (isSuccess) {
    return (
      <main className="w-full bg-white font-mona pb-12 lg:pb-24 pt-6 lg:pt-10 min-h-[70vh] flex items-center justify-center px-4">
        <div className="flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-700 w-full max-w-lg">
          <div className="w-20 h-20 lg:w-24 lg:h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 size={40} className="text-green-600 lg:w-12 lg:h-12" strokeWidth={2.5} />
          </div>
          <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 lg:mb-4">
            Request <span className="italic text-[#00a3c4] font-medium">Submitted!</span>
          </h1>
          <p className="text-gray-600 text-sm lg:text-lg max-w-md mx-auto mb-8">
            Thank you for your inquiry. Our team will review your request and get back to you shortly.
          </p>
          <Link 
            href="/store/all" 
            className="bg-[#0082A4] text-white px-8 lg:px-10 py-3.5 text-xs lg:text-sm font-bold tracking-widest uppercase rounded-3xl hover:bg-[#006a85] transition-colors shadow-sm w-full sm:w-auto"
          >
            Explore More Collections
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full bg-white font-mona pb-12 lg:pb-24 pt-6 lg:pt-10 min-h-[70vh]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header / Breadcrumb */}
        <div className="flex items-center justify-center gap-3 lg:gap-4 text-[#00a3c4] text-xs lg:text-sm font-normal tracking-widest uppercase mb-8 lg:mb-16">
          <span className="w-12 sm:w-16 lg:w-24 h-px bg-[#00a3c4]"></span>
          <span>Cart</span>
          <span className="w-12 sm:w-16 lg:w-24 h-px bg-[#00a3c4]"></span>
        </div>

        {/* --- CONDITION 1: NOT LOGGED IN --- */}
        {!loggedInUserId ? (
          <div className="flex flex-col items-center justify-center py-12 lg:py-20 text-center">
            <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <User size={32} className="text-gray-400 lg:w-10 lg:h-10" strokeWidth={1.5} />
            </div>
            <h2 className="font-playfair text-2xl lg:text-3xl font-bold text-gray-900 mb-3 lg:mb-4">
              Please <span className="italic text-[#00a3c4] font-medium pr-1.5">Log In</span>
            </h2>
            <p className="text-gray-500 text-sm lg:text-base mb-8 max-w-sm mx-auto">You must be logged into your account to view and submit product requests.</p>
            <Link 
              href="/account" 
              className="bg-[#0082A4] text-white px-8 lg:px-10 py-3.5 text-xs lg:text-sm font-bold tracking-widest uppercase rounded-3xl hover:bg-[#006a85] transition-colors shadow-sm w-full sm:w-auto"
            >
              Log In / Register
            </Link>
          </div>
        ) 
        
        /* --- CONDITION 2: LOGGED IN BUT CART EMPTY --- */
        : !cart || !cart.items || cart.items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 lg:py-20 text-center">
            <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <ShoppingBag size={32} className="text-gray-400 lg:w-10 lg:h-10" strokeWidth={1.5} />
            </div>
            <h2 className="font-playfair text-2xl lg:text-3xl font-bold text-gray-900 mb-3 lg:mb-4">
              Your Cart is <span className="italic text-[#00a3c4] font-medium pr-1.5">Empty</span>
            </h2>
            <p className="text-gray-500 text-sm lg:text-base mb-8 max-w-sm mx-auto">Looks like you haven&apos;t added any collections to your request list yet.</p>
            <Link 
              href="/store/all" 
              className="bg-[#0082A4] text-white px-8 lg:px-10 py-3.5 text-xs lg:text-sm font-bold tracking-widest uppercase rounded-3xl hover:bg-[#006a85] transition-colors shadow-sm w-full sm:w-auto"
            >
              Explore Collections
            </Link>
          </div>
        ) 
        
        /* --- CONDITION 3: CART HAS ITEMS --- */
        : (
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-0 lg:divide-x lg:divide-gray-300">
            
            {/* --- LEFT COLUMN: CART ITEMS --- */}
            <div className="w-full lg:w-[55%] flex flex-col lg:pr-16">
              <h1 className="font-playfair text-2xl lg:text-3xl font-bold text-gray-900 mb-6 lg:mb-8">
                <span className="italic text-[#00a3c4] font-medium pr-1.5">Your</span> Cart
              </h1>

              <div className="flex flex-col">
                {cart.items.map((item, index) => (
                  <div key={item._id} className={`flex flex-col sm:flex-row gap-4 sm:gap-6 py-6 lg:py-8 ${index !== 0 ? 'border-t border-gray-200' : ''}`}>
                    
                    <div className="flex gap-4 sm:gap-6 w-full">
                      {/* Item Image */}
                      <div className="w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32 shrink-0 bg-white border border-gray-100 flex items-center justify-center p-1.5 sm:p-2">
                        <img 
                          src={item.product?.imageUrl} 
                          alt={item.product?.productName} 
                          className="w-full h-full object-contain"
                        />
                      </div>

                      {/* Item Details */}
                      <div className="flex flex-col flex-grow justify-center gap-1 sm:gap-2">
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">{item.product?.productName}</h3>
                        <p className="text-[#00a3c4] text-xs sm:text-sm">
                          {item.product?.category?.name || "Jewelry"} • Code: {item.product?.designCode}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-800 mt-0.5 sm:mt-1">Metal: {item.metalType}</p>
                        <p className="text-xs sm:text-sm text-gray-800">Finish: {item.customFinish}</p>
                        
                        {/* Hidden on mobile, shown on SM+ */}
                        <button 
                          onClick={() => removeFromCart(item._id)}
                          className="hidden sm:block text-xs font-medium text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md self-start mt-1 transition-colors border border-red-100"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    {/* Quantity & Mobile Remove Actions */}
                    <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center w-full sm:w-auto shrink-0 mt-2 sm:mt-0 gap-3">
                      {/* Shown only on mobile */}
                      <button 
                        onClick={() => removeFromCart(item._id)}
                        className="sm:hidden text-xs font-medium text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-2.5 rounded-md transition-colors border border-red-100"
                      >
                        Remove
                      </button>

                      <div className="relative w-full sm:w-auto">
                        <select 
                          value={item.quantityBand}
                          onChange={(e) => updateQuantity(item._id, e.target.value)}
                          className="appearance-none w-full sm:w-auto border border-gray-300 text-gray-900 font-medium text-[13px] sm:text-sm pl-3 sm:pl-4 pr-8 sm:pr-10 py-2.5 sm:py-3 bg-white focus:outline-none focus:border-[#00a3c4] cursor-pointer sm:min-w-[160px]"
                        >
                          <option value="1-10 Pieces">QTY : 1-10 Pieces</option>
                          <option value="20-50 Pieces">QTY : 20-50 Pieces</option>
                          <option value="50-100 Pieces">QTY : 50-100 Pieces</option>
                          <option value="100+ Pieces">QTY : 100+ Pieces</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 sm:px-3 text-gray-500">
                          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7"></path>
                          </svg>
                        </div>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </div>

            {/* --- RIGHT COLUMN: REQUEST FORM --- */}
            <div className="w-full lg:w-[45%] flex flex-col lg:pl-16 border-t lg:border-t-0 border-gray-200 pt-8 lg:pt-0">
              <h2 className="font-playfair text-2xl lg:text-3xl font-bold text-gray-900 mb-6 lg:mb-8">
                <span className="italic text-[#00a3c4] font-medium pr-1.5">Product</span> Price Request
              </h2>

              <form className="flex flex-col gap-4 lg:gap-6" onSubmit={handleFormSubmit}>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                  <div className="flex flex-col gap-1.5 lg:gap-2">
                    <label className="text-[13px] lg:text-sm text-gray-800">Full Name*</label>
                    <input name="fullName" value={formData.fullName} onChange={handleInputChange} type="text" placeholder="Enter your full name" className="w-full border border-gray-300 p-2.5 lg:p-3 text-[13px] lg:text-sm text-gray-900 focus:outline-none focus:border-[#00a3c4]" required />
                  </div>
                  <div className="flex flex-col gap-1.5 lg:gap-2">
                    <label className="text-[13px] lg:text-sm text-gray-800">Email Address*</label>
                    <input name="email" value={formData.email} onChange={handleInputChange} type="email" placeholder="Enter your email address" className="w-full border border-gray-300 p-2.5 lg:p-3 text-[13px] lg:text-sm text-gray-900 focus:outline-none focus:border-[#00a3c4]" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                  <div className="flex flex-col gap-1.5 lg:gap-2">
                    <label className="text-[13px] lg:text-sm text-gray-800">Company Name</label>
                    <input name="companyName" value={formData.companyName} onChange={handleInputChange} type="text" placeholder="Enter your company name" className="w-full border border-gray-300 p-2.5 lg:p-3 text-[13px] lg:text-sm text-gray-900 focus:outline-none focus:border-[#00a3c4]" />
                  </div>
                  <div className="flex flex-col gap-1.5 lg:gap-2">
                    <label className="text-[13px] lg:text-sm text-gray-800">Company Website</label>
                    <input name="companyWebsite" value={formData.companyWebsite} onChange={handleInputChange} type="url" placeholder="Enter your company website" className="w-full border border-gray-300 p-2.5 lg:p-3 text-[13px] lg:text-sm text-gray-900 focus:outline-none focus:border-[#00a3c4]" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                  <div className="flex flex-col gap-1.5 lg:gap-2">
                    <label className="text-[13px] lg:text-sm text-gray-800">Phone / WhatsApp*</label>
                    <input name="whatsappNo" value={formData.whatsappNo} onChange={handleInputChange} type="tel" placeholder="Enter your number" className="w-full border border-gray-300 p-2.5 lg:p-3 text-[13px] lg:text-sm text-gray-900 focus:outline-none focus:border-[#00a3c4]" required />
                  </div>
                  <div className="flex flex-col gap-1.5 lg:gap-2">
                    <label className="text-[13px] lg:text-sm text-gray-800">Country</label>
                    <div className="relative">
                      <select name="country" value={formData.country} onChange={handleInputChange} className="appearance-none w-full border border-gray-300 p-2.5 lg:p-3 text-[13px] lg:text-sm bg-white focus:outline-none focus:border-[#00a3c4] text-gray-900 cursor-pointer">
                        <option>Select Country</option>
                        <option>United States</option>
                        <option>United Kingdom</option>
                        <option>Australia</option>
                        <option>India</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 lg:gap-2">
                  <label className="text-[13px] lg:text-sm text-gray-800">Your Message*</label>
                  <textarea 
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="4" 
                    placeholder="Tell us about your requirements product types, materials, finish, gemstones, timeline, budget..." 
                    className="w-full border border-gray-300 p-2.5 lg:p-3 text-[13px] lg:text-sm text-gray-900 focus:outline-none focus:border-[#00a3c4] resize-none"
                    required
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className={`w-full sm:w-auto self-start text-white px-8 lg:px-10 py-3.5 text-xs lg:text-sm font-bold tracking-widest uppercase rounded-sm lg:rounded-3xl transition-colors mt-2 ${
                    isSubmitting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-[#0082A4] hover:bg-[#006a85]'
                  }`}
                >
                  {isSubmitting ? "Submitting..." : "Submit Request \u2192"}
                </button>
              </form>

            </div>
          </div>
        )}
      </div>
    </main>
  );
}