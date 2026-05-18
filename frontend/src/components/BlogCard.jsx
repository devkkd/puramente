"use client";

import React from "react";
import Link from "next/link";

export default function BlogCard({ post }) {
  return (
    <div className="flex flex-col group cursor-pointer w-full h-full">
      
      {/* Image Container */}
      {/* Added rounded-xl on mobile for a softer UI, preserved rounded-sm on desktop */}
      <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden mb-4 lg:mb-6 rounded-xl lg:rounded-sm shadow-sm">
        <img 
          src={post.image} 
          alt={post.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Subtle Dark Overlay on Hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500"></div>
      </div>

      {/* Blog Details */}
      <div className="flex flex-col flex-grow px-1 sm:px-0">
        <h3 className="font-bold text-lg md:text-lg text-gray-900 mb-2 lg:mb-4 leading-snug line-clamp-2">
          {post.title}
        </h3>
        <p className="text-sm font-normal text-gray-600 lg:text-gray-700 leading-relaxed mb-4 lg:mb-6 line-clamp-3 lg:line-clamp-none">
          {post.excerpt}
        </p>
      </div>

      {/* Read More Link (Pushed to bottom) */}
      <div className="mt-auto px-1 sm:px-0">
        <Link 
          href={post.link} 
          className="inline-flex items-center text-[#00a3c4] text-xs sm:text-sm font-medium lg:font-normal uppercase tracking-widest lg:tracking-normal lg:capitalize pb-1 border-b border-[#00a3c4]/30 hover:border-[#00a3c4] transition-colors"
        >
          Read Full Blog <span className="ml-1.5 font-serif text-lg leading-none">&rarr;</span>
        </Link>
      </div>
      
    </div>
  );
}