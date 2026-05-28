"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { getBlogById, updateBlog } from "@/lib/api";
import { FileEdit, UploadCloud, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function AdminEditBlogPage() {
  const router = useRouter();
  const { id } = useParams();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [blogData, setBlogData] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Fetch existing blog data
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await getBlogById(id);
        if (res.success) {
          setBlogData(res.data);
          setImagePreview(res.data.imageUrl); // Show existing image
        }
      } catch (err) {
        console.error("Failed to load blog", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchBlog();
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    const formData = new FormData(e.target);
    const imageFile = formData.get("image");
    if (imageFile && imageFile.size === 0) {
      formData.delete("image");
    }
    
    try {
      const res = await updateBlog(id, formData);
      if (res.success) {
        router.push("/admin/blogs");
      } else {
        alert(res.error || "Failed to update blog.");
      }
    } catch (err) {
      alert("Error updating blog.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-[#E2FCFF] border-t-[#0082A4] rounded-full animate-spin mb-4"></div>
        <p className="text-[#0082A4] font-medium tracking-widest animate-pulse text-sm uppercase">Loading Post...</p>
      </div>
    );
  }

  if (!blogData) return <div className="p-8 text-red-500 font-bold">Blog not found.</div>;

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
            <FileEdit size={28} strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Edit Blog Post</h1>
            <p className="text-sm text-gray-500">Update content or change the cover image.</p>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Blog Title <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              name="title" 
              defaultValue={blogData.title}
              required 
              className="w-full bg-gray-50 border border-gray-200 p-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0082A4]/20 focus:border-[#0082A4] transition-all text-sm text-gray-900" 
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Short Excerpt <span className="text-red-500">*</span></label>
            <p className="text-xs text-gray-500 mb-2">This is the short description shown on the blog listing cards.</p>
            <textarea 
              name="excerpt" 
              defaultValue={blogData.excerpt}
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
              defaultValue={blogData.content}
              required 
              rows="15" 
              className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0082A4]/20 focus:border-[#0082A4] transition-all text-sm text-gray-900 whitespace-pre-wrap leading-relaxed font-mono"
            ></textarea>
          </div>

          {/* SEO Meta Fields */}
          <div className="border border-gray-100 rounded-xl p-5 bg-gray-50/50 space-y-4">
            <p className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0082A4] inline-block"></span>
              SEO Meta (Optional)
            </p>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Meta Title
                <span className="ml-2 text-xs font-normal text-gray-400">max 60 characters</span>
              </label>
              <input
                type="text"
                name="metaTitle"
                maxLength={60}
                defaultValue={blogData.metaTitle || ""}
                placeholder="Leave blank to use blog title"
                className="w-full bg-white border border-gray-200 p-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0082A4]/20 focus:border-[#0082A4] transition-all text-sm text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Meta Description
                <span className="ml-2 text-xs font-normal text-gray-400">max 160 characters</span>
              </label>
              <textarea
                name="metaDescription"
                maxLength={160}
                rows="3"
                defaultValue={blogData.metaDescription || ""}
                placeholder="Leave blank to use excerpt"
                className="w-full bg-white border border-gray-200 p-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0082A4]/20 focus:border-[#0082A4] transition-all text-sm text-gray-900 resize-none"
              ></textarea>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Cover Image</label>
            <p className="text-xs text-gray-500 mb-2">Leave this blank to keep the current image.</p>
            
            <div className="relative group cursor-pointer">
              <input 
                type="file" 
                name="image" 
                accept="image/*" 
                onChange={handleImageChange} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
              />
              <div className="w-full bg-[#F4f9fa] border-2 border-dashed border-[#0082A4]/30 rounded-xl p-6 flex flex-col items-center justify-center text-center group-hover:bg-[#E2FCFF] group-hover:border-[#0082A4]/50 transition-colors">
                {imagePreview ? (
                  <img src={imagePreview} className="h-48 object-cover rounded-lg shadow-sm border border-gray-200" alt="Preview"/>
                ) : (
                  <>
                    <UploadCloud className="text-[#0082A4] mb-3" size={32}/> 
                    <span className="text-sm font-semibold text-[#0082A4]">Upload New Image</span>
                    <span className="text-xs text-gray-500 mt-1">PNG, JPG, WebP up to 5MB</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button 
              type="submit" 
              disabled={saving} 
              className="w-full flex justify-center items-center gap-2 bg-[#0082A4] text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-[#006a86] disabled:opacity-50 transition-colors shadow-md"
            >
              {saving ? (
                <>
                  <span className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                  Saving Changes...
                </>
              ) : (
                <>
                  <CheckCircle2 size={20} />
                  Update Post
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}