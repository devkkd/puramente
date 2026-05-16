"use client";

import React, { useState } from "react";
import { UploadCloud, Image as ImageIcon, CheckCircle2 } from "lucide-react";

export default function ProductForm({ initialData = {}, categories = [], onSubmit, isLoading }) {
  const [imagePreview, setImagePreview] = useState(initialData.imageUrl || null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6 font-mona">
      
      {/* --- BASIC INFORMATION --- */}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Product Name <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              name="productName" 
              defaultValue={initialData.productName || ""}
              required 
              placeholder="e.g., Myra Bracelet"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0082A4]/20 focus:border-[#0082A4] transition-all" 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Design Code (SKU) <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              name="designCode" 
              defaultValue={initialData.designCode || ""}
              required 
              placeholder="e.g., BS0145"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-900 font-mono focus:outline-none focus:ring-2 focus:ring-[#0082A4]/20 focus:border-[#0082A4] transition-all" 
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Description <span className="text-red-500">*</span></label>
          <textarea 
            name="description" 
            defaultValue={initialData.description || ""}
            required 
            rows="4" 
            placeholder="Detailed description of the jewelry..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0082A4]/20 focus:border-[#0082A4] transition-all resize-none"
          ></textarea>
        </div>
      </div>

      {/* --- CATEGORIZATION --- */}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">Categorization & Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Category <span className="text-red-500">*</span></label>
            <select 
              name="category" 
              defaultValue={initialData.category?._id || initialData.category || ""}
              required 
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0082A4]/20 focus:border-[#0082A4] transition-all cursor-pointer"
            >
              <option value="" disabled>Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Gemstone Option <span className="text-red-500">*</span></label>
            <select 
              name="option" 
              defaultValue={initialData.option || "with gem"}
              required 
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0082A4]/20 focus:border-[#0082A4] transition-all cursor-pointer"
            >
              <option value="with gem">With Gemstone</option>
              <option value="without gem">Without Gemstone</option>
            </select>
          </div>
        </div>
      </div>

      {/* --- MEDIA & STATUS --- */}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">Media & Status</h3>
        
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          {/* Image Upload */}
          <div className="flex-1">
            <label className="block text-sm font-bold text-gray-700 mb-2">Product Image {!initialData._id && <span className="text-red-500">*</span>}</label>
            <div className="relative group cursor-pointer">
              <input 
                type="file" 
                name="image" 
                accept="image/*" 
                onChange={handleImageChange}
                required={!initialData._id} // Only required if creating new
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
              />
              <div className="w-full bg-[#F4f9fa] border-2 border-dashed border-[#0082A4]/30 rounded-xl p-6 flex flex-col items-center justify-center text-center group-hover:bg-[#E2FCFF] group-hover:border-[#0082A4]/50 transition-colors">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="h-32 object-contain rounded-lg shadow-sm" />
                ) : (
                  <>
                    <UploadCloud size={32} className="text-[#0082A4] mb-3" />
                    <span className="text-sm font-semibold text-[#0082A4]">Click or drag image to upload</span>
                    <span className="text-xs text-gray-500 mt-1">PNG, JPG, JPEG up to 5MB</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Status Toggles */}
          <div className="flex-1 flex flex-col justify-center space-y-4">
            <label className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-100 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
              <input 
                type="checkbox" 
                name="newArrival" 
                value="true" 
                defaultChecked={initialData.newArrival}
                className="w-5 h-5 rounded border-gray-300 text-[#0082A4] focus:ring-[#0082A4]" 
              />
              <div>
                <span className="block text-sm font-bold text-gray-900">Mark as New Arrival</span>
                <span className="block text-xs text-gray-500">Highlight this product in the New Arrivals section.</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-100 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
              <input 
                type="checkbox" 
                name="bestSeller" 
                value="true" 
                defaultChecked={initialData.bestSeller}
                className="w-5 h-5 rounded border-gray-300 text-[#0082A4] focus:ring-[#0082A4]" 
              />
              <div>
                <span className="block text-sm font-bold text-gray-900">Mark as Best Seller</span>
                <span className="block text-xs text-gray-500">Feature this product in the Best Sellers section.</span>
              </div>
            </label>
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
              {initialData._id ? "Update Product" : "Publish Product"}
            </span>
          )}
        </button>
      </div>

    </form>
  );
}