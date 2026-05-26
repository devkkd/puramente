"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getBlogs } from "@/lib/api";

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await getBlogs();
        if (res.success) setBlogs(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <main className="w-full bg-white font-mona pb-12 lg:pb-24 pt-8 lg:pt-16">
      
      {/* HEADER */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 lg:pb-16 flex flex-col items-center text-center">
        <div className="flex items-center gap-3 lg:gap-4 text-[#00a3c4] text-xs font-semibold tracking-widest uppercase mb-3 lg:mb-4">
          <span className="w-10 sm:w-12 md:w-16 h-px bg-[#00a3c4]/50"></span>
          <span>Blogs</span>
          <span className="w-10 sm:w-12 md:w-16 h-px bg-[#00a3c4]/50"></span>
        </div>

        <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight mb-4 lg:mb-6 leading-tight lg:leading-snug">
          <span className="italic text-[#00a3c4] font-medium pr-1.5">Timeless</span> Jewelry Trends & Style Inspiration
        </h1>

        <p className="text-sm font-normal text-gray-600 lg:text-gray-700 max-w-2xl leading-relaxed">
          Explore expert tips, latest jewelry trends, care guides, and styling ideas to help you choose pieces that reflect your elegance and personality.
        </p>
      </section>

      {/* BLOG GRID */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="text-center py-10 lg:py-20 text-gray-400 text-sm tracking-widest uppercase animate-pulse">Loading blogs...</div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-10 lg:py-20 text-gray-400 text-sm">No blogs published yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {blogs.map(blog => (
              <div key={blog._id} className="flex flex-col group">
                
                {/* Image */}
                {/* FIX: Added "relative block" here so the absolute overlay stays contained */}
                <Link 
                  href={`/blog/${blog.slug}`} 
                  className="relative block w-full aspect-[4/3] overflow-hidden mb-4 lg:mb-6 bg-gray-100 rounded-xl lg:rounded-none shadow-sm lg:shadow-none"
                >
                  <img 
                    src={blog.imageUrl} 
                    alt={blog.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  {/* Subtle Dark Overlay on Hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500 z-10 pointer-events-none"></div>
                </Link>

                {/* Content */}
                <Link href={`/blog/${blog.slug}`}>
                  <h3 className="font-bold text-gray-900 text-lg md:text-xl mb-2 lg:mb-4 leading-snug group-hover:text-[#00a3c4] transition-colors">
                    {blog.title}
                  </h3>
                </Link>

                <p className="text-[13px] sm:text-sm text-gray-600 lg:text-gray-700 leading-relaxed mb-4 lg:mb-6 flex-1">
                  {blog.excerpt}
                </p>

                <Link 
                  href={`/blog/${blog.slug}`} 
                  className="text-[#00a3c4] text-xs sm:text-sm font-medium hover:text-[#0082a4] flex items-center gap-1 w-fit pb-0.5 lg:pb-1 border-b border-[#00a3c4]/30 hover:border-[#0082a4] transition-colors uppercase tracking-widest lg:tracking-normal lg:capitalize"
                >
                  Read Full Blog →
                </Link>
                
              </div>
            ))}
          </div>
        )}
      </section>

    </main>
  );
}