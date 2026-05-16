"use client";

import React, { useState, useEffect, useRef } from "react";
import BlogCard from "./BlogCard";
import { getBlogs } from "@/lib/api"; 

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  // Fetch blogs from API and take the 3 most recent
  useEffect(() => {
    const fetchRecentBlogs = async () => {
      try {
        const res = await getBlogs();
        if (res.success && res.data) {
          // Slice the first 3 items (assuming backend sorts by newest first)
          setBlogs(res.data.slice(0, 3));
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentBlogs();
  }, []);

  // Intersection Observer to trigger the pop-up animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 } // Triggers when 10% of the section is visible
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  return (
    <section className="w-full py-16 bg-white font-mona overflow-hidden" ref={sectionRef}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        
        {/* --- HEADER SECTION --- */}
        <div className={`flex flex-col items-center transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {/* Top Subheading */}
          <div className="flex items-center gap-4 text-[#00a3c4] text-base font-normal tracking-widest uppercase mb-6">
            <span className="w-16 md:w-24 h-px bg-[#00a3c4]"></span>
            <span>Blogs</span>
            <span className="w-16 md:w-24 h-px bg-[#00a3c4]"></span>
          </div>

          {/* Main Heading */}
          <h2 className="font-playfair text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-5 text-center">
            <span className="italic text-[#00a3c4] font-medium pr-1.5">Timeless</span> 
            Jewelry Trends & Style Inspiration
          </h2>

          {/* Content Text */}
          <p className="text-sm font-normal text-gray-800 mb-16 max-w-3xl text-center leading-relaxed">
            Explore expert tips, latest jewelry trends, care guides, and styling ideas to help you choose pieces that reflect your elegance and personality.
          </p>
        </div>

        {/* --- GRID SECTION --- */}
        {loading ? (
          <div className="w-full py-10 flex justify-center text-gray-400">Loading recent blogs...</div>
        ) : blogs.length > 0 ? (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 items-stretch">
            {blogs.map((blog, index) => {
              // Map backend data format to the format BlogCard expects
              const mappedPost = {
                id: blog._id,
                title: blog.title,
                excerpt: blog.excerpt,
                image: blog.imageUrl,
                link: `/blogs/${blog.slug}`,
              };

              // Calculate staggered animation delay
              const animationDelay = `${index * 150}ms`;

              return (
                <div 
                  key={blog._id}
                  className={`transform transition-all duration-1000 ease-out flex
                    ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}
                  `}
                  style={{ transitionDelay: isVisible ? animationDelay : '0ms' }}
                >
                  <BlogCard post={mappedPost} />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="w-full py-10 flex justify-center text-gray-400 text-sm">
            No blogs published yet.
          </div>
        )}

      </div>
    </section>
  );
}