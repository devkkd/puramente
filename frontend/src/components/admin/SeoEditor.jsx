"use client";

import React, { useState, useEffect } from "react";
import { Search, X, AlertCircle, CheckCircle2, Info } from "lucide-react";

export default function SeoEditor({ 
  type = "product", 
  entityId, 
  initialData = {}, 
  onUpdate,
  isLoading = false 
}) {
  const [seoData, setSeoData] = useState({
    metaTitle: initialData?.seo?.metaTitle || "",
    metaDescription: initialData?.seo?.metaDescription || "",
    metaKeywords: initialData?.seo?.metaKeywords || []
  });
  
  const [newKeyword, setNewKeyword] = useState("");
  const [errors, setErrors] = useState({});
  const [showValidation, setShowValidation] = useState(false);

  // Auto-fill defaults from entity data if SEO fields are empty
  const defaultTitle = type === "product" 
    ? (initialData?.productName ? `${initialData.productName} | Puramente Jewel` : "")
    : (initialData?.name ? `${initialData.name} Jewelry Wholesale India | Puramente Jewel` : "");

  const defaultDescription = type === "product"
    ? (initialData?.description ? initialData.description.slice(0, 160) : "")
    : (initialData?.name ? `Discover wholesale ${initialData.name?.toLowerCase()} manufactured in India for retailers and international brands.` : "");

  useEffect(() => {
    if (initialData?.seo) {
      setSeoData({
        metaTitle: initialData.seo.metaTitle || "",
        metaDescription: initialData.seo.metaDescription || "",
        metaKeywords: initialData.seo.metaKeywords || []
      });
    }
  }, [initialData]);

  const validateSeo = () => {
    const newErrors = {};
    if (seoData.metaTitle && seoData.metaTitle.length > 60) {
      newErrors.metaTitle = "Meta title should be 60 characters or less";
    }
    if (seoData.metaDescription && seoData.metaDescription.length > 160) {
      newErrors.metaDescription = "Meta description should be 160 characters or less";
    }
    if (seoData.metaKeywords.length > 10) {
      newErrors.metaKeywords = "Maximum 10 keywords allowed";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleTitleChange = (e) => {
    const value = e.target.value;
    setSeoData(prev => ({ ...prev, metaTitle: value }));
    if (showValidation && value.length > 60) {
      setErrors(prev => ({ ...prev, metaTitle: "Meta title should be 60 characters or less" }));
    } else {
      setErrors(prev => ({ ...prev, metaTitle: undefined }));
    }
  };

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    setSeoData(prev => ({ ...prev, metaDescription: value }));
    if (showValidation && value.length > 160) {
      setErrors(prev => ({ ...prev, metaDescription: "Meta description should be 160 characters or less" }));
    } else {
      setErrors(prev => ({ ...prev, metaDescription: undefined }));
    }
  };

  const addKeyword = () => {
    if (newKeyword.trim() && seoData.metaKeywords.length < 10) {
      setSeoData(prev => ({
        ...prev,
        metaKeywords: [...prev.metaKeywords, newKeyword.trim().toLowerCase()]
      }));
      setNewKeyword("");
      if (errors.metaKeywords) setErrors(prev => ({ ...prev, metaKeywords: undefined }));
    }
  };

  const removeKeyword = (index) => {
    setSeoData(prev => ({
      ...prev,
      metaKeywords: prev.metaKeywords.filter((_, i) => i !== index)
    }));
  };

  const handleKeywordKeyPress = (e) => {
    if (e.key === "Enter") { e.preventDefault(); addKeyword(); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowValidation(true);
    if (!validateSeo()) return;
    if (onUpdate) await onUpdate(seoData);
  };

  const handleAutoFill = () => {
    setSeoData(prev => ({
      metaTitle: prev.metaTitle || defaultTitle.slice(0, 60),
      metaDescription: prev.metaDescription || defaultDescription.slice(0, 160),
      metaKeywords: prev.metaKeywords.length > 0 ? prev.metaKeywords : []
    }));
  };

  const titleCharsRemaining = 60 - seoData.metaTitle.length;
  const descCharsRemaining = 160 - seoData.metaDescription.length;
  const hasEmptyFields = !seoData.metaTitle || !seoData.metaDescription;

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 font-mona">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">
            SEO Settings — {type === "product" ? "Product" : "Category"}
          </h3>
          <p className="text-xs text-gray-500">Manage meta title, description, keywords and schema for search engines.</p>
        </div>
        {hasEmptyFields && (
          <button
            type="button"
            onClick={handleAutoFill}
            className="flex items-center gap-1.5 text-xs font-bold text-[#0082A4] border border-[#0082A4]/30 px-3 py-1.5 rounded-lg hover:bg-[#E2FCFF] transition-colors whitespace-nowrap"
          >
            <Info size={13} /> Auto-fill Defaults
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Meta Title */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-bold text-gray-700">
              Meta Title <span className="text-gray-400 text-xs font-normal">(Page Title in Google)</span>
            </label>
            <span className={`text-xs font-semibold ${titleCharsRemaining < 10 ? "text-orange-500" : "text-gray-500"}`}>
              {seoData.metaTitle.length}/60
            </span>
          </div>
          <input
            type="text"
            value={seoData.metaTitle}
            onChange={handleTitleChange}
            placeholder={defaultTitle || "Enter meta title (max 60 characters)"}
            className={`w-full bg-gray-50 border rounded-xl p-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:border-[#0082A4] transition-all ${
              errors.metaTitle ? "border-red-300 focus:ring-red-200" : "border-gray-200 focus:ring-[#0082A4]/20"
            }`}
          />
          {errors.metaTitle && (
            <div className="flex items-center gap-2 mt-1 text-red-600 text-xs">
              <AlertCircle size={12} /> {errors.metaTitle}
            </div>
          )}
          <p className="text-xs text-gray-400 mt-1.5">
            Google Preview: <span className="text-blue-600 underline">{seoData.metaTitle || defaultTitle || "Your page title here"}</span>
          </p>
        </div>

        {/* Meta Description */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-bold text-gray-700">
              Meta Description <span className="text-gray-400 text-xs font-normal">(Search Snippet)</span>
            </label>
            <span className={`text-xs font-semibold ${descCharsRemaining < 20 ? "text-orange-500" : "text-gray-500"}`}>
              {seoData.metaDescription.length}/160
            </span>
          </div>
          <textarea
            value={seoData.metaDescription}
            onChange={handleDescriptionChange}
            placeholder={defaultDescription || "Enter meta description (max 160 characters)"}
            rows="3"
            className={`w-full bg-gray-50 border rounded-xl p-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:border-[#0082A4] transition-all resize-none ${
              errors.metaDescription ? "border-red-300 focus:ring-red-200" : "border-gray-200 focus:ring-[#0082A4]/20"
            }`}
          />
          {errors.metaDescription && (
            <div className="flex items-center gap-2 mt-1 text-red-600 text-xs">
              <AlertCircle size={12} /> {errors.metaDescription}
            </div>
          )}
          <p className="text-xs text-gray-400 mt-1.5">
            Preview: <span className="text-gray-700">{seoData.metaDescription || defaultDescription || "Description shown in search results"}</span>
          </p>
        </div>

        {/* Meta Keywords */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-bold text-gray-700">
              Keywords <span className="text-gray-400 text-xs font-normal">({seoData.metaKeywords.length}/10)</span>
            </label>
          </div>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              onKeyPress={handleKeywordKeyPress}
              placeholder="Type keyword and press Enter"
              disabled={seoData.metaKeywords.length >= 10}
              className={`flex-1 bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0082A4]/20 focus:border-[#0082A4] transition-all ${
                seoData.metaKeywords.length >= 10 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            />
            <button
              type="button"
              onClick={addKeyword}
              disabled={!newKeyword.trim() || seoData.metaKeywords.length >= 10}
              className="bg-[#0082A4] text-white px-4 py-3 rounded-xl font-bold text-sm hover:bg-[#006a86] disabled:opacity-50 transition-colors"
            >
              Add
            </button>
          </div>
          {errors.metaKeywords && (
            <div className="flex items-center gap-2 mb-2 text-red-600 text-xs">
              <AlertCircle size={12} /> {errors.metaKeywords}
            </div>
          )}
          {seoData.metaKeywords.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-1">
              {seoData.metaKeywords.map((keyword, index) => (
                <div key={index} className="inline-flex items-center gap-2 bg-[#E2FCFF] text-[#0082A4] px-3 py-1.5 rounded-full text-xs font-medium border border-[#0082A4]/20">
                  {keyword}
                  <button type="button" onClick={() => removeKeyword(index)} className="hover:bg-[#0082A4]/20 rounded-full p-0.5 transition-colors">
                    <X size={11} />
                  </button>
                </div>
              ))}
            </div>
          )}
          <p className="text-xs text-gray-400 mt-2">Add 5-10 relevant keywords. These improve search visibility.</p>
        </div>

        {/* Schema Preview */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Schema (JSON-LD)</p>
          <p className="text-xs text-gray-500">
            Structured data schema is automatically generated and saved when you save SEO settings. 
            It helps Google display rich results for this {type}.
          </p>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2 border-t border-gray-100">
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 bg-[#0082A4] text-white px-8 py-3 rounded-xl font-bold text-sm tracking-widest uppercase hover:bg-[#006a86] disabled:opacity-50 transition-colors shadow-md"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                Saving...
              </>
            ) : (
              <>
                <CheckCircle2 size={18} />
                Save SEO Settings
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
