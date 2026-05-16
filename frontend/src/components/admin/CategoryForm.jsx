"use client";
import React, { useState } from "react";
import { UploadCloud, CheckCircle2 } from "lucide-react";

export default function CategoryForm({ initialData = {}, onSubmit, isLoading }) {
  const [imagePreview, setImagePreview] = useState(initialData.imageUrl || null);
  const [homeImagePreview, setHomeImagePreview] = useState(initialData.homeImageUrl || null);
  const [storeBannerPreview, setStoreBannerPreview] = useState(initialData.storeBannerUrl || null);

  const handleImageChange = (e, setPreviewFunc) => {
    const file = e.target.files[0];
    if (file) setPreviewFunc(URL.createObjectURL(file));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6 font-mona">
      
      {/* --- BASIC INFO --- */}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">Text Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Category Name <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              name="name" 
              defaultValue={initialData.name || ""}
              required 
              placeholder="e.g., Necklaces"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0082A4]/20 focus:border-[#0082A4] transition-all" 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Home Name (Display Name) <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              name="homeName" 
              defaultValue={initialData.homeName || ""}
              required 
              placeholder="e.g., Graceful Necklaces"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0082A4]/20 focus:border-[#0082A4] transition-all" 
            />
          </div>
        </div>
      </div>

      {/* --- IMAGES --- */}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">Media Uploads</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Main Category Image */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Main Category Image {!initialData._id && <span className="text-red-500">*</span>}</label>
            <p className="text-xs text-gray-500 mb-3">Shown on category listing blocks.</p>
            <div className="relative group cursor-pointer">
              <input 
                type="file" 
                name="image" 
                accept="image/*" 
                required={!initialData._id}
                onChange={(e) => handleImageChange(e, setImagePreview)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
              />
              <div className="w-full h-48 bg-[#F4f9fa] border-2 border-dashed border-[#0082A4]/30 rounded-xl p-6 flex flex-col items-center justify-center text-center group-hover:bg-[#E2FCFF] group-hover:border-[#0082A4]/50 transition-colors">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="h-full w-full object-contain rounded-lg" />
                ) : (
                  <>
                    <UploadCloud size={32} className="text-[#0082A4] mb-3" />
                    <span className="text-sm font-semibold text-[#0082A4]">Main Image</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Home Banner Image */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Home Banner {!initialData._id && <span className="text-red-500">*</span>}</label>
            <p className="text-xs text-gray-500 mb-3">Shown on homepage carousel.</p>
            <div className="relative group cursor-pointer">
              <input 
                type="file" 
                name="homeImage" 
                accept="image/*" 
                required={!initialData._id}
                onChange={(e) => handleImageChange(e, setHomeImagePreview)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
              />
              <div className="w-full h-48 bg-[#F4f9fa] border-2 border-dashed border-[#0082A4]/30 rounded-xl p-6 flex flex-col items-center justify-center text-center group-hover:bg-[#E2FCFF] group-hover:border-[#0082A4]/50 transition-colors">
                {homeImagePreview ? (
                  <img src={homeImagePreview} alt="Preview" className="h-full w-full object-contain rounded-lg" />
                ) : (
                  <>
                    <UploadCloud size={32} className="text-[#0082A4] mb-3" />
                    <span className="text-sm font-semibold text-[#0082A4]">Home Banner</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Store Banner Image */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Store Banner {!initialData._id && <span className="text-red-500">*</span>}</label>
            <p className="text-xs text-gray-500 mb-3">Shown on specific Store page.</p>
            <div className="relative group cursor-pointer">
              <input 
                type="file" 
                name="storeBannerImage" 
                accept="image/*" 
                required={!initialData._id}
                onChange={(e) => handleImageChange(e, setStoreBannerPreview)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
              />
              <div className="w-full h-48 bg-[#F4f9fa] border-2 border-dashed border-[#0082A4]/30 rounded-xl p-6 flex flex-col items-center justify-center text-center group-hover:bg-[#E2FCFF] group-hover:border-[#0082A4]/50 transition-colors">
                {storeBannerPreview ? (
                  <img src={storeBannerPreview} alt="Preview" className="h-full w-full object-contain rounded-lg" />
                ) : (
                  <>
                    <UploadCloud size={32} className="text-[#0082A4] mb-3" />
                    <span className="text-sm font-semibold text-[#0082A4]">Store Banner</span>
                  </>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* --- SUBMIT BUTTON --- */}
      <div className="flex justify-end pt-4">
        <button 
          type="submit" 
          disabled={isLoading}
          className="flex items-center gap-2 bg-[#0082A4] text-white px-8 py-4 rounded-xl font-bold tracking-widest uppercase hover:bg-[#006a86] disabled:opacity-50 transition-colors shadow-md"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
              Saving...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <CheckCircle2 size={20} />
              {initialData._id ? "Update Category" : "Create Category"}
            </span>
          )}
        </button>
      </div>
    </form>
  );
}