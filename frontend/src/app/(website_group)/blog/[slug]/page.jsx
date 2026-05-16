"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getBlogBySlug } from "@/lib/api";
import { Share2 } from "lucide-react";

export default function BlogDetailPage() {
  const { slug } = useParams();
  const [data, setData] = useState({ blog: null, recentBlogs: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await getBlogBySlug(slug);
        if (res.success) setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchBlog();
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading blog...</div>;
  if (!data.blog) return <div className="min-h-screen flex items-center justify-center text-red-500">Blog not found.</div>;

  const { blog, recentBlogs } = data;

  return (
    <main className="w-full bg-white font-mona pb-24">
      
      {/* HERO IMAGE */}
      <div className="w-full h-[40vh] md:h-[60vh] lg:h-[70vh] bg-gray-100 mb-12">
        <img src={blog.imageUrl} alt={blog.title} className="w-full h-full object-cover" />
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* MAIN CONTENT (Left side) */}
          <div className="lg:col-span-8">
            
            {/* Meta & Share */}
            <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-6">
              <span className="text-gray-500 text-sm">
                {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
              <button className="flex items-center gap-2 text-gray-600 hover:text-[#00a3c4] text-sm font-medium transition-colors">
                <Share2 size={16} /> SHARE
              </button>
            </div>

            {/* Title */}
            <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-10 leading-snug">
              {blog.title}
            </h1>

            {/* Content - Using whitespace-pre-wrap to respect newlines from textarea */}
            <div className="text-gray-700 text-sm md:text-base leading-relaxed whitespace-pre-wrap">
              {blog.content}
            </div>
          </div>

          {/* SIDEBAR: RECENT BLOGS (Right side) */}
          <div className="lg:col-span-4">
            <h3 className="font-playfair text-2xl font-bold text-gray-900 mb-8 pb-4 border-b border-gray-100">
              Recent
            </h3>
            
            <div className="space-y-12">
              {recentBlogs.length > 0 ? recentBlogs.map(recent => (
                <div key={recent._id} className="flex flex-col group">
                  <Link href={`/blogs/${recent.slug}`} className="w-full aspect-[4/3] bg-gray-100 mb-4 overflow-hidden">
                    <img src={recent.imageUrl} alt={recent.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </Link>
                  <Link href={`/blogs/${recent.slug}`}>
                    <h4 className="font-bold text-gray-900 text-lg mb-2 leading-snug group-hover:text-[#00a3c4] transition-colors">
                      {recent.title}
                    </h4>
                  </Link>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                    {recent.excerpt}
                  </p>
                  <Link href={`/blogs/${recent.slug}`} className="text-[#00a3c4] text-sm font-medium hover:underline border-b border-[#00a3c4]/30 pb-0.5 w-fit">
                    Read Full Blog →
                  </Link>
                </div>
              )) : (
                <p className="text-sm text-gray-500">No other recent blogs.</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}