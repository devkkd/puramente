"use client";

import React, { useState, useEffect, useRef } from "react";
import { UploadCloud, CheckCircle2 } from "lucide-react";
import { getUserProfile, submitCustomRequest, getCategories } from "@/lib/api"; 
import { COUNTRIES } from "@/lib/countries";

export default function CustomJewelryPage() {
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = useRef(null);

  // --- DYNAMIC DATA STATE ---
  const [categories, setCategories] = useState([]);

  // --- FORM STATE ---
  const [formData, setFormData] = useState({
    category: "",
    fullName: "",
    email: "",
    phone: "",
    country: "Select Country",
    state: "",
    address: "",
    length: "",
    width: "",
    metal: "",
    stoneType: "",
    stoneDetails: "",
    designNotes: ""
  });
  
  const [referenceImage, setReferenceImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Fetch Categories & Auto-fill User Data
  useEffect(() => {
    const fetchInitialData = async () => {
      // 1. Fetch Categories
      try {
        const catRes = await getCategories();
        if (catRes.success) setCategories(catRes.data);
      } catch (error) {
        console.error("Failed to fetch categories");
      }

      // 2. Fetch User Profile
      const userId = localStorage.getItem("userId");
      if (userId) {
        try {
          const res = await getUserProfile(userId);
          if (res.success && res.data) {
            setFormData(prev => ({
              ...prev,
              fullName: res.data.fullName || "",
              email: res.data.email || "",
              phone: res.data.whatsappNo || "",
              country: res.data.country || "Select Country",
            }));
          }
        } catch (error) {
          console.error("Failed to fetch user");
        }
      }
    };
    fetchInitialData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size exceeds 5MB limit.");
        return;
      }
      setReferenceImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!formData.category) return alert("Please select a Jewelry Category.");
    if (!formData.metal) return alert("Please select a Metal Type.");
    if (!formData.fullName || !formData.email || !formData.phone) return alert("Please complete Client Information.");

    setLoading(true);

    const submitData = new FormData();
    const userId = localStorage.getItem("userId");
    if (userId) submitData.append("userId", userId);
    
    Object.keys(formData).forEach(key => {
      submitData.append(key, formData[key]);
    });

    if (referenceImage) {
      submitData.append("referenceImage", referenceImage);
    }

    try {
      const res = await submitCustomRequest(submitData);
      if (res.success) {
        setIsSuccess(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        alert(res.error || "Failed to submit request.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred during submission.");
    } finally {
      setLoading(false);
    }
  };

  // --- METAL SELECTIONS (Using your local images mapped horizontally) ---
  const metals = [
    { name: "Gold", img: "/images/New folder/goldbar.png" },
    { name: "Silver", img: "/images/New folder/silverbar.png" },
    { name: "Brass", img: "/images/New folder/brassbar.png" },
    { name: "Custom specification", img: "/images/New folder/custombar.png" }
  ];

  const stones = ["Diamond", "Ruby", "Emerald", "Moissanite", "Amethyst", "Pearl", "Onyx", "Topaz"];

  if (isSuccess) {
    return (
      <main className="w-full bg-white font-mona pb-24 pt-20 min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-700">
          <div className="w-24 h-24 bg-[#E6FDF9] rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 size={48} className="text-[#00a3c4]" strokeWidth={2.5} />
          </div>
          <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Request <span className="italic text-[#00a3c4] font-medium">Submitted!</span>
          </h1>
          <p className="text-gray-700 text-sm md:text-base font-normal leading-relaxed max-w-md mx-auto mb-8">
            Your custom jewelry request has been received. Our master jewelers will review your specifications and contact you shortly.
          </p>
          <button onClick={() => window.location.reload()} className="bg-[#0082A4] text-white px-10 py-3.5 text-sm font-bold tracking-widest uppercase rounded-3xl hover:bg-[#006a85] transition-colors shadow-sm">
            Submit Another Request
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full bg-white font-mona pb-24">
      
      {/* --- HERO --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="flex flex-col items-center text-center mb-16">
          <div className="flex items-center gap-4 text-[#4fa3b9] text-xs md:text-sm font-normal tracking-widest uppercase mb-6">
            <span className="w-16 h-px bg-gray-300"></span>
            <span>Custom</span>
            <span className="w-16 h-px bg-gray-300"></span>
          </div>
          <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight mb-6">
            <span className="italic text-[#4fa3b9] font-medium pr-2">Jewellery</span> 
            Crafted to Your Exact Vision
          </h1>
          <p className="max-w-3xl text-sm font-normal text-gray-700 leading-relaxed">
            From Concept To Creation We Partner With Jewellery Brands, Retailers, And Designers Worldwide To Produce Bespoke Fine Jewellery Collections At Scale, Without Compromising Artisanal Quality.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0 border border-gray-100 shadow-sm rounded-xl overflow-hidden">
          <div className="p-8 md:p-12 bg-white flex flex-col justify-center">
            <h2 className="font-playfair text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              <span className="italic text-[#4fa3b9] font-medium pr-2">Create</span> a Bespoke Jewelry Piece
            </h2>
            <p className="text-sm font-normal text-gray-700 leading-relaxed mb-4">Commission A One-of-a-kind Design Tailored To Your Exact Specifications.</p>
            <p className="text-sm font-normal text-gray-700 leading-relaxed">Share Dimensions, Material Preferences, And Reference Visuals our Master Artisans Will Translate Your Concept Into A Finished Piece With Precision And Discretion.</p>
          </div>
          <div className="p-8 md:p-12 bg-[#E6FDF9] flex flex-col justify-center">
            <h2 className="font-playfair text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-8">
              <span className="italic text-[#4fa3b9] font-medium pr-2">Why</span> Work With Us
            </h2>
            <div className="grid grid-cols-3 gap-6 divide-x divide-[#4fa3b9]/20">
              <p className="text-sm font-normal text-gray-700">Precision-led Craftsmanship</p>
              <p className="text-sm font-normal text-gray-700 pl-6">Dedicated Expert Consultation</p>
              <p className="text-sm font-normal text-gray-700 pl-6">Assured Quality Standards</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- FORM SECTION --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative items-start">
          
          {/* LEFT: FORM FIELDS */}
          <div className="lg:col-span-2 space-y-16">
            
            {/* 00. Category Selection */}
            <div>
              <h2 className="font-playfair text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                <span className="italic text-[#4fa3b9] font-medium pr-1.5">Select</span> Jewelry Category
              </h2>
              <p className="text-sm font-normal text-gray-700 leading-relaxed mb-6">Choose the base format for your custom piece:</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {categories.length > 0 ? categories.map(cat => (
                  <div 
                    key={cat._id} 
                    onClick={() => setFormData({...formData, category: cat.name})}
                    className={`cursor-pointer border transition-all duration-200 bg-white ${formData.category === cat.name ? 'border-[#4fa3b9] shadow-md' : 'border-gray-200 hover:border-[#4fa3b9]/50'}`}
                  >
                    <div className="h-40 bg-[#F4f9fa] w-full overflow-hidden flex items-center justify-center">
                      {cat.imageUrl ? (
                         <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[#0082A4] font-bold text-sm">{cat.name} Image</span>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 text-sm md:text-base mb-1">{cat.name}</h3>
                      <p className="text-xs text-gray-500 leading-relaxed">{cat.homeName || "Custom design base"}</p>
                    </div>
                  </div>
                )) : (
                  <p className="col-span-4 text-sm text-gray-500">Loading categories...</p>
                )}
              </div>
            </div>

            <div className="w-full h-px bg-gray-200"></div>

            {/* 01. Client Info */}
            <div>
              <div className="flex justify-between items-end mb-6">
                <h2 className="font-playfair text-2xl md:text-3xl font-bold text-gray-900">
                  <span className="italic text-[#4fa3b9] font-medium pr-1.5">(01.)</span> Client Information
                </h2>
                <p className="text-sm font-normal text-gray-700 leading-relaxed hidden md:block">Provide your contact and delivery details:</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Full Name*</label>
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full border border-gray-300 p-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#4fa3b9]" placeholder="Enter your full name" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Email Address*</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border border-gray-300 p-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#4fa3b9]" placeholder="Enter your email address" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Phone / WhatsApp Number*</label>
                  <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full border border-gray-300 p-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#4fa3b9]" placeholder="Enter your phone / whatsapp number" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Country</label>
                  <select name="country" value={formData.country} onChange={handleChange} className="w-full border border-gray-300 p-3 text-sm text-gray-900 focus:outline-none focus:border-[#4fa3b9] bg-white appearance-none">
                    <option disabled>Select Country</option>
                    {COUNTRIES.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Delivery Address*</label>
                  <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full border border-gray-300 p-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#4fa3b9]" placeholder="100, abc street, abc city" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">State / Province*</label>
                  <input type="text" name="state" value={formData.state} onChange={handleChange} className="w-full border border-gray-300 p-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#4fa3b9]" placeholder="State / Province" />
                </div>
              </div>
            </div>

            <div className="w-full h-px bg-gray-200"></div>

            {/* 02. Dimensions */}
            <div>
              <div className="flex justify-between items-end mb-6">
                <h2 className="font-playfair text-2xl md:text-3xl font-bold text-gray-900">
                  <span className="italic text-[#4fa3b9] font-medium pr-1.5">(02.)</span> Dimensions
                </h2>
                <p className="text-sm font-normal text-gray-700 leading-relaxed hidden md:block">Provide exact measurements if known:</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Length (mm)*</label>
                  <div className="relative">
                    <input type="text" name="length" value={formData.length} onChange={handleChange} className="w-full border border-gray-300 p-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#4fa3b9]" placeholder="e.g., 25" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">MM</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Width (mm)*</label>
                  <div className="relative">
                    <input type="text" name="width" value={formData.width} onChange={handleChange} className="w-full border border-gray-300 p-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#4fa3b9]" placeholder="e.g., 15" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">MM</span>
                  </div>
                </div>
              </div>
              <div className="bg-[#E6FDF9] p-4 text-sm font-normal text-[#0082a4] leading-relaxed">
                Need assistance? Our specialists will guide you during consultation.
              </div>
            </div>

            <div className="w-full h-px bg-gray-200"></div>

            {/* 03. Metal Selection */}
            <div>
              <div className="flex justify-between items-end mb-6">
                <h2 className="font-playfair text-2xl md:text-3xl font-bold text-gray-900">
                  <span className="italic text-[#4fa3b9] font-medium pr-1.5">(03.)</span> Metal Selection
                </h2>
                <p className="text-sm font-normal text-gray-700 leading-relaxed hidden md:block">Choose your preferred base material:</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {metals.map(metal => (
                  <div 
                    key={metal.name}
                    onClick={() => setFormData({...formData, metal: metal.name})}
                    className={`cursor-pointer border p-4 text-center transition-all ${formData.metal === metal.name ? 'bg-[#E6FDF9] border-[#4fa3b9]' : 'bg-white border-gray-200 hover:border-gray-300'}`}
                  >
                    <div className="w-full h-12 mb-3 rounded shadow-sm overflow-hidden flex items-center justify-center relative bg-gray-50 border border-gray-100">
                      <img 
                        src={metal.img} 
                        alt={metal.name} 
                        className="w-[150%] h-[150%] object-contain -rotate-90"
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-800">{metal.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full h-px bg-gray-200"></div>

            {/* 04. Stone Specification */}
            <div>
              <div className="flex justify-between items-end mb-6">
                <h2 className="font-playfair text-2xl md:text-3xl font-bold text-gray-900">
                  <span className="italic text-[#4fa3b9] font-medium pr-1.5">(04.)</span> Stone Specification
                </h2>
                <p className="text-sm font-normal text-gray-700 leading-relaxed hidden md:block">Please specify the type of stone you want for your custom jewelry:</p>
              </div>
              
              <div className="flex flex-wrap gap-3 mb-6">
                {stones.map(stone => (
                  <button
                    key={stone}
                    onClick={() => setFormData({...formData, stoneType: stone})}
                    className={`px-5 py-2.5 text-sm border transition-colors ${formData.stoneType === stone ? 'bg-[#0082A4] text-white border-[#0082A4]' : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'}`}
                  >
                    {stone}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Specify type, cut, or any particular requirements</label>
                <input type="text" name="stoneDetails" value={formData.stoneDetails} onChange={handleChange} className="w-full border border-gray-300 p-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#4fa3b9]" placeholder="Enter specify type, cut, or any particular requirements" />
              </div>
            </div>

            <div className="w-full h-px bg-gray-200"></div>

            {/* 05. Design Notes */}
            <div>
              <div className="flex justify-between items-end mb-6">
                <h2 className="font-playfair text-2xl md:text-3xl font-bold text-gray-900">
                  <span className="italic text-[#4fa3b9] font-medium pr-1.5">(05.)</span> Design Notes / Instructions
                </h2>
              </div>
              
              <div className="mb-2 flex justify-between text-sm text-gray-700">
                <label className="font-normal">Describe your concept in detail:</label>
                <span className="font-normal">(Up to 1000 characters)</span>
              </div>
              <textarea 
                name="designNotes" 
                value={formData.designNotes} 
                onChange={handleChange} 
                rows="5"
                className="w-full border border-gray-300 p-4 text-sm font-normal text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#4fa3b9] resize-none leading-relaxed" 
                placeholder={`"Inspired by the attached reference, with reduced stone size"\n"Incorporate subtle floral detailing"\n"Minimalist interpretation with clean edges"`}
              ></textarea>
            </div>

            <div className="w-full h-px bg-gray-200"></div>

            {/* 06. Reference Uploads */}
            <div>
              <div className="flex justify-between items-end mb-6">
                <h2 className="font-playfair text-2xl md:text-3xl font-bold text-gray-900">
                  <span className="italic text-[#4fa3b9] font-medium pr-1.5">(06.)</span> Reference Uploads
                </h2>
              </div>
              
              <p className="text-sm font-normal text-gray-700 leading-relaxed mb-4">Sketches, inspiration images, or comparable designs</p>
              
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-gray-300 p-10 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageChange} 
                  accept="image/*" 
                  className="hidden" 
                />
                
                {imagePreview ? (
                  <div className="flex flex-col items-center">
                    <img src={imagePreview} alt="Preview" className="h-32 object-contain mb-4 shadow-sm" />
                    <span className="text-[#0082A4] text-sm font-medium">Click to change image</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 text-gray-500">
                    <UploadCloud size={24} className="text-[#84b9c7]" />
                    <span className="text-sm font-medium">Upload Image JPG, PNG, GIF, WebP | Max size: 5MB</span>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* RIGHT: STICKY ORDER OVERVIEW */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-[#E6FDF9] p-6 shadow-sm border border-[#4fa3b9]/10">
              <h2 className="font-playfair text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                <span className="italic text-[#4fa3b9] font-medium pr-1.5">Order</span> Overview
              </h2>

              <div className="bg-white p-5 mb-4 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-2 text-sm md:text-base">Custom Jewelry Request</h3>
                <p className="text-sm font-normal text-gray-700 leading-relaxed">Your submission will be reviewed and executed by our master jewelers in line with the provided specifications.</p>
              </div>

              <div className="divide-y divide-[#4fa3b9]/20 border-b border-[#4fa3b9]/20 mb-6">
                <div className="py-4 flex justify-between">
                  <span className="font-bold text-gray-900 text-sm">Jewelry Category</span>
                  <span className="text-sm text-gray-700">{formData.category || "-"}</span>
                </div>
                
                <div className="py-4">
                  <span className="font-bold text-gray-900 text-sm block mb-2">Client Information</span>
                  {formData.fullName ? (
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex justify-between"><span className="text-gray-400">Full Name</span> <span className="text-gray-900 font-medium">{formData.fullName}</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">Email</span> <span className="text-gray-900 font-medium truncate max-w-[150px]">{formData.email}</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">Country</span> <span className="text-gray-900 font-medium">{formData.country !== 'Select Country' ? formData.country : '-'}</span></div>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">-</span>
                  )}
                </div>

                <div className="py-4 flex justify-between">
                  <span className="font-bold text-gray-900 text-sm">Dimensions</span>
                  <span className="text-sm text-gray-700 font-medium">{formData.length && formData.width ? `${formData.length}x${formData.width} mm` : "-"}</span>
                </div>

                <div className="py-4 flex justify-between">
                  <span className="font-bold text-gray-900 text-sm">Metal Selection</span>
                  <span className="text-sm text-gray-700 font-medium">{formData.metal || "-"}</span>
                </div>

                <div className="py-4 flex justify-between">
                  <span className="font-bold text-gray-900 text-sm">Stone Selection</span>
                  <div className="text-right">
                    <span className="text-sm text-gray-700 font-medium block">{formData.stoneType || "-"}</span>
                    {formData.stoneDetails && (
                      <span className="text-xs text-gray-500 block max-w-[150px] truncate">{formData.stoneDetails}</span>
                    )}
                  </div>
                </div>

                <div className="py-4 flex flex-col">
                  <span className="font-bold text-gray-900 text-sm mb-1">Design Notes</span>
                  <span className="text-sm font-normal text-gray-700 italic line-clamp-2">
                    {formData.designNotes ? `"${formData.designNotes}"` : "-"}
                  </span>
                </div>
                
                <div className="py-4 flex justify-between items-center">
                  <span className="font-bold text-gray-900 text-sm">Reference Upload</span>
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-10 h-10 object-cover border border-gray-200" />
                  ) : (
                    <span className="text-sm text-gray-400">-</span>
                  )}
                </div>
              </div>

              <div className="bg-white p-5 mb-6 shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold text-gray-900 text-sm">Estimated Timeline:</span>
                  <span className="text-sm text-gray-700 font-medium">3-5 weeks</span>
                </div>
                
                <div className="w-full flex h-3 rounded-full overflow-hidden mb-3">
                  <div className="bg-[#4fa3b9] w-1/4"></div>
                  <div className="bg-[#0082A4] w-1/4"></div>
                  <div className="bg-[#006a86] w-1/4"></div>
                  <div className="bg-[#1dd3b0] w-1/4"></div>
                </div>
                
                <div className="flex justify-between text-[10px] text-gray-500 font-medium">
                  <span>Design</span>
                  <span>Crafting</span>
                  <span>Finishing</span>
                  <span>Delivery</span>
                </div>
              </div>

              <button 
                onClick={handleSubmit} 
                disabled={loading}
                className="w-full bg-[#0082A4] text-white py-4 text-sm font-bold transition-colors hover:bg-[#006a86] disabled:opacity-50 shadow-md mb-4"
              >
                {loading ? "Submitting..." : "Submit Request \u2192"}
              </button>
              
              <p className="text-xs text-center font-normal text-gray-600">Please ensure all required fields are completed before submission.</p>

            </div>
          </div>
          
        </div>
      </section>
      
    </main>
  );
}