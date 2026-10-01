"use client";

import React, { useState } from "react";
import { UploadCloud, CheckCircle2, X, Info, Code, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";

// Generate product schema from current form/data
function buildProductSchema(data) {
  const base = "https://puramentejewel.com";
  const slug = data.slug || data._id || "";
  const url = `${base}/product/${slug}`;
  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": data.productName || "",
    "description": data.description || "",
    "image": data.imageUrl || "",
    "url": url,
    "sku": data.designCode || "",
    "brand": { "@type": "Brand", "name": "Puramente" },
    "category": data.category?.name || "Jewelry",
    "offers": {
      "@type": "Offer",
      "url": url,
      "priceCurrency": "INR",
      "availability": "https://schema.org/InStock",
      "seller": { "@type": "Organization", "name": "Puramente" }
    }
  };
}

export default function ProductForm({ initialData = {}, categories = [], onSubmit, isLoading }) {
  const [imagePreview, setImagePreview] = useState(initialData.imageUrl || null);
  const [seoSaveLoading, setSeoSaveLoading] = useState(false);
  const [schemaOpen, setSchemaOpen] = useState(false);
  const [schemaError, setSchemaError] = useState("");

  // SEO state
  const [seoData, setSeoData] = useState({
    metaTitle: initialData?.seo?.metaTitle || "",
    metaDescription: initialData?.seo?.metaDescription || "",
    metaKeywords: initialData?.seo?.metaKeywords || [],
    schema: initialData?.seo?.schema
      ? JSON.stringify(initialData.seo.schema, null, 2)
      : ""
  });
  const [newKeyword, setNewKeyword] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  const addKeyword = () => {
    if (newKeyword.trim() && seoData.metaKeywords.length < 10) {
      setSeoData(p => ({ ...p, metaKeywords: [...p.metaKeywords, newKeyword.trim().toLowerCase()] }));
      setNewKeyword("");
    }
  };

  const removeKeyword = (i) => setSeoData(p => ({ ...p, metaKeywords: p.metaKeywords.filter((_, idx) => idx !== i) }));

  const autoGenerateSchema = () => {
    const schema = buildProductSchema(initialData);
    setSeoData(p => ({ ...p, schema: JSON.stringify(schema, null, 2) }));
    setSchemaOpen(true);
    setSchemaError("");
  };

  const validateSchema = (val) => {
    try { JSON.parse(val); setSchemaError(""); return true; }
    catch (e) { setSchemaError("Invalid JSON: " + e.message); return false; }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (seoData.schema && !validateSchema(seoData.schema)) return;
    const formData = new FormData(e.target);
    formData.append("seo[metaTitle]", seoData.metaTitle);
    formData.append("seo[metaDescription]", seoData.metaDescription);
    seoData.metaKeywords.forEach(k => formData.append("seo[metaKeywords][]", k));
    if (seoData.schema) formData.append("seo[schema]", seoData.schema);
    onSubmit(formData);
  };

  const handleSeoSave = async () => {
    if (!initialData._id) return;
    if (seoData.schema && !validateSchema(seoData.schema)) return;
    setSeoSaveLoading(true);
    try {
      const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
      const payload = {
        metaTitle: seoData.metaTitle,
        metaDescription: seoData.metaDescription,
        metaKeywords: seoData.metaKeywords,
        schema: seoData.schema ? JSON.parse(seoData.schema) : null
      };
      const baseUrl = process.env.NEXT_PUBLIC_PROD_API_URL || process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${baseUrl}/products/${initialData._id}/seo`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      if (res.ok) alert("SEO & Schema saved!");
      else alert("Failed to save SEO");
    } catch (err) { alert("Error saving SEO"); }
    finally { setSeoSaveLoading(false); }
  };

  const titleLen = seoData.metaTitle.length;
  const descLen = seoData.metaDescription.length;

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6 font-mona">

      {/* BASIC INFO */}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Product Name <span className="text-red-500">*</span></label>
            <input type="text" name="productName" defaultValue={initialData.productName || ""} required placeholder="e.g., Myra Bracelet"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0082A4]/20 focus:border-[#0082A4] transition-all" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Design Code (SKU) <span className="text-red-500">*</span></label>
            <input type="text" name="designCode" defaultValue={initialData.designCode || ""} required placeholder="e.g., BS0145"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-900 font-mono focus:outline-none focus:ring-2 focus:ring-[#0082A4]/20 focus:border-[#0082A4] transition-all" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Description <span className="text-red-500">*</span></label>
          <textarea name="description" defaultValue={initialData.description || ""} required rows="4" placeholder="Detailed description of the jewelry..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0082A4]/20 focus:border-[#0082A4] transition-all resize-none" />
        </div>
      </div>

      {/* CATEGORIZATION */}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">Categorization & Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Category <span className="text-red-500">*</span></label>
            <select name="category" defaultValue={initialData.category?._id || initialData.category || ""} required
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0082A4]/20 focus:border-[#0082A4] transition-all cursor-pointer">
              <option value="" disabled>Select Category</option>
              {categories.map((cat) => (<option key={cat._id} value={cat._id}>{cat.name}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Gemstone Option <span className="text-red-500">*</span></label>
            <select name="option" defaultValue={initialData.option || "with gem"} required
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0082A4]/20 focus:border-[#0082A4] transition-all cursor-pointer">
              <option value="with gem">With Gemstone</option>
              <option value="without gem">Without Gemstone</option>
            </select>
          </div>
        </div>
      </div>

      {/* MEDIA & STATUS */}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">Media & Status</h3>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <label className="block text-sm font-bold text-gray-700 mb-2">Product Image {!initialData._id && <span className="text-red-500">*</span>}</label>
            <div className="relative group cursor-pointer">
              <input type="file" name="image" accept="image/*" onChange={handleImageChange} required={!initialData._id}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
              <div className="w-full bg-[#F4f9fa] border-2 border-dashed border-[#0082A4]/30 rounded-xl p-6 flex flex-col items-center justify-center text-center group-hover:bg-[#E2FCFF] group-hover:border-[#0082A4]/50 transition-colors">
                {imagePreview
                  ? <img src={imagePreview} alt="Preview" className="h-32 object-contain rounded-lg shadow-sm" />
                  : <><UploadCloud size={32} className="text-[#0082A4] mb-3" /><span className="text-sm font-semibold text-[#0082A4]">Click or drag to upload</span><span className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</span></>}
              </div>
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-center space-y-4">
            {[["newArrival", "Mark as New Arrival", "Highlight in New Arrivals section."], ["bestSeller", "Mark as Best Seller", "Feature in Best Sellers section."]].map(([name, label, desc]) => (
              <label key={name} className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-100 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                <input type="checkbox" name={name} value="true" defaultChecked={initialData[name]}
                  className="w-5 h-5 rounded border-gray-300 text-[#0082A4] focus:ring-[#0082A4]" />
                <div><span className="block text-sm font-bold text-gray-900">{label}</span><span className="block text-xs text-gray-500">{desc}</span></div>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* SEO + SCHEMA SECTION */}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">SEO & Schema</h3>
            <p className="text-xs text-gray-500">Meta tags + JSON-LD structured data for Google rich results.</p>
          </div>
        </div>

        <div className="space-y-5">
          {/* Meta Title */}
          <div>
            <div className="flex justify-between mb-1.5">
              <label className="text-sm font-bold text-gray-700">Meta Title <span className="text-gray-400 text-xs font-normal">(Google page title)</span></label>
              <span className={`text-xs font-semibold ${titleLen > 50 ? "text-orange-500" : "text-gray-400"}`}>{titleLen}/60</span>
            </div>
            <input type="text" value={seoData.metaTitle} maxLength={60}
              onChange={e => setSeoData(p => ({ ...p, metaTitle: e.target.value }))}
              placeholder="e.g., Myra Bracelet — Sterling Silver Jewelry | Puramente"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0082A4]/20 focus:border-[#0082A4] transition-all" />
            {seoData.metaTitle && <p className="text-xs text-gray-400 mt-1">Preview: <span className="text-blue-600 underline">{seoData.metaTitle}</span></p>}
          </div>

          {/* Meta Description */}
          <div>
            <div className="flex justify-between mb-1.5">
              <label className="text-sm font-bold text-gray-700">Meta Description <span className="text-gray-400 text-xs font-normal">(search snippet)</span></label>
              <span className={`text-xs font-semibold ${descLen > 140 ? "text-orange-500" : "text-gray-400"}`}>{descLen}/160</span>
            </div>
            <textarea value={seoData.metaDescription} maxLength={160} rows="3"
              onChange={e => setSeoData(p => ({ ...p, metaDescription: e.target.value }))}
              placeholder="Brief description shown in Google search results..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0082A4]/20 focus:border-[#0082A4] transition-all resize-none" />
          </div>

          {/* Keywords */}
          <div>
            <label className="text-sm font-bold text-gray-700 mb-1.5 block">Keywords <span className="text-gray-400 text-xs font-normal">({seoData.metaKeywords.length}/10)</span></label>
            <div className="flex gap-2 mb-2">
              <input type="text" value={newKeyword} placeholder="Add keyword, press Enter"
                onChange={e => setNewKeyword(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addKeyword(); }}}
                disabled={seoData.metaKeywords.length >= 10}
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0082A4]/20 focus:border-[#0082A4] transition-all disabled:opacity-50" />
              <button type="button" onClick={addKeyword} disabled={!newKeyword.trim() || seoData.metaKeywords.length >= 10}
                className="bg-[#0082A4] text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-[#006a86] disabled:opacity-50 transition-colors">Add</button>
            </div>
            {seoData.metaKeywords.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {seoData.metaKeywords.map((kw, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 bg-[#E2FCFF] text-[#0082A4] px-3 py-1 rounded-full text-xs font-medium border border-[#0082A4]/20">
                    {kw}<button type="button" onClick={() => removeKeyword(i)} className="hover:bg-[#0082A4]/20 rounded-full p-0.5"><X size={11} /></button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* SCHEMA (JSON-LD) */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <button type="button" onClick={() => setSchemaOpen(p => !p)}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-2">
                <Code size={16} className="text-[#0082A4]" />
                <span className="text-sm font-bold text-gray-700">Schema Markup (JSON-LD)</span>
                {seoData.schema && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Set</span>}
              </div>
              {schemaOpen ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
            </button>

            {schemaOpen && (
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <button type="button" onClick={autoGenerateSchema}
                    className="flex items-center gap-1.5 text-xs font-bold text-[#0082A4] border border-[#0082A4]/30 px-3 py-1.5 rounded-lg hover:bg-[#E2FCFF] transition-colors">
                    <RefreshCw size={12} /> Auto-generate Product Schema
                  </button>
                  {seoData.schema && (
                    <button type="button" onClick={() => { setSeoData(p => ({ ...p, schema: "" })); setSchemaError(""); }}
                      className="text-xs text-red-500 hover:text-red-700 font-medium">Clear</button>
                  )}
                </div>
                <textarea
                  value={seoData.schema}
                  onChange={e => { setSeoData(p => ({ ...p, schema: e.target.value })); if (e.target.value) validateSchema(e.target.value); else setSchemaError(""); }}
                  rows="12"
                  placeholder={`{\n  "@context": "https://schema.org/",\n  "@type": "Product",\n  "name": "Product Name",\n  ...\n}`}
                  className={`w-full font-mono text-xs bg-gray-900 text-green-400 rounded-xl p-4 resize-y focus:outline-none focus:ring-2 border ${schemaError ? "border-red-400 focus:ring-red-300" : "border-gray-700 focus:ring-[#0082A4]/30"}`}
                />
                {schemaError && <p className="text-xs text-red-500 font-medium">{schemaError}</p>}
                <p className="text-xs text-gray-400">Paste custom JSON-LD or use Auto-generate. This renders as <code className="bg-gray-100 px-1 rounded">{"<script type='application/ld+json'>"}</code> on the product page.</p>
              </div>
            )}
          </div>

          {/* Save SEO separately on edit */}
          {initialData._id && (
            <div className="flex justify-end pt-2 border-t border-gray-100">
              <button type="button" onClick={handleSeoSave} disabled={seoSaveLoading}
                className="flex items-center gap-2 bg-gray-800 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-700 disabled:opacity-50 transition-colors">
                {seoSaveLoading ? <><span className="w-3.5 h-3.5 border-2 border-t-transparent border-white rounded-full animate-spin"></span> Saving...</> : <><CheckCircle2 size={15} /> Save SEO & Schema</>}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* SUBMIT */}
      <div className="flex justify-end pt-4">
        <button type="submit" disabled={isLoading}
          className="flex items-center gap-2 bg-[#0082A4] text-white px-8 py-4 rounded-xl font-bold tracking-widest uppercase hover:bg-[#006a86] disabled:opacity-50 transition-colors shadow-md">
          {isLoading
            ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></span>Saving...</span>
            : <span className="flex items-center gap-2"><CheckCircle2 size={20} />{initialData._id ? "Update Product" : "Publish Product"}</span>}
        </button>
      </div>
    </form>
  );
}
