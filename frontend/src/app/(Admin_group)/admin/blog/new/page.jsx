"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createBlog } from "@/lib/api";
import { FileText, UploadCloud, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function AdminNewBlogPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    
    try {
      const res = await createBlog(formData);
      if (res.success) {
        router.push("/admin/blogs"); 
      } else {
        alert(res.error || "Failed to create blog.");
      }
    } catch (err) {
      alert("Error submitting blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto font-mona pb-12">
      
      {/* Top Navigation */}
      <Link href="/admin/blog" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#0082A4] mb-6 text-sm font-medium transition-colors">
        <ArrowLeft size={16} /> Back to Blogs
      </Link>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-6">
          <div className="w-14 h-14 bg-[#E2FCFF] text-[#0082A4] rounded-full flex items-center justify-center shrink-0">
            <FileText size={28} strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Post New Blog</h1>
            <p className="text-sm text-gray-500">Create a new article. Raw HTML is supported.</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Blog Title <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              name="title" 
              required 
              className="w-full bg-gray-50 border border-gray-200 p-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0082A4]/20 focus:border-[#0082A4] transition-all text-sm text-gray-900" 
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Short Excerpt <span className="text-red-500">*</span></label>
            <p className="text-xs text-gray-500 mb-2">This is the short description shown on the blog listing cards.</p>
            <textarea 
              name="excerpt" 
              required 
              rows="2" 
              className="w-full bg-gray-50 border border-gray-200 p-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0082A4]/20 focus:border-[#0082A4] transition-all text-sm text-gray-900 resize-none"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Full Content (HTML Supported) <span className="text-red-500">*</span></label>
            <p className="text-xs text-gray-500 mb-2">You can paste raw HTML here (e.g. &lt;h1&gt;, &lt;p&gt;, &lt;ul&gt;). It will be rendered beautifully on the site.</p>
            <textarea 
              name="content" 
              required 
              rows="15" 
              className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0082A4]/20 focus:border-[#0082A4] transition-all text-sm text-gray-900 whitespace-pre-wrap leading-relaxed font-mono"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Cover Image <span className="text-red-500">*</span></label>
            
            <div className="relative group cursor-pointer">
              <input 
                type="file" 
                name="image" 
                accept="image/*" 
                required 
                onChange={handleImageChange} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
              />
              <div className="w-full bg-[#F4f9fa] border-2 border-dashed border-[#0082A4]/30 rounded-xl p-6 flex flex-col items-center justify-center text-center group-hover:bg-[#E2FCFF] group-hover:border-[#0082A4]/50 transition-colors">
                {imagePreview ? (
                  <img src={imagePreview} className="h-48 object-cover rounded-lg shadow-sm border border-gray-200" alt="Preview"/>
                ) : (
                  <>
                    <UploadCloud className="text-[#0082A4] mb-3" size={32}/> 
                    <span className="text-sm font-semibold text-[#0082A4]">Upload Cover Image</span>
                    <span className="text-xs text-gray-500 mt-1">PNG, JPG, WebP up to 5MB</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full flex justify-center items-center gap-2 bg-[#0082A4] text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-[#006a86] disabled:opacity-50 transition-colors shadow-md"
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                  Publishing...
                </>
              ) : (
                <>
                  <CheckCircle2 size={20} />
                  Publish Blog
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}