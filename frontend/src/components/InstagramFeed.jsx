"use client";

import React, { useEffect, useRef, useState } from "react";
import { getInstaPosts } from "@/lib/api";

export default function InstagramFeed() {
  const [instaPosts, setInstaPosts] = useState([]);
  const INSTA_PROFILE_URL = "https://instagram.com/puramenteinternational";

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await getInstaPosts();
        if (res.success) setInstaPosts(res.data);
      } catch (error) {
        console.error("Failed to fetch Instagram posts:", error);
      }
    };
    fetchPosts();
  }, []);
  
  return (
    <section className="w-full py-10 lg:py-24 bg-white font-mona overflow-hidden">
      <div className="flex flex-col items-center mb-8 lg:mb-12 px-4 text-center">
        
        {/* Top Subheading */}
        <div className="flex items-center gap-3 lg:gap-4 text-[#00a3c4] text-xs sm:text-sm lg:text-base font-normal tracking-widest uppercase mb-4 lg:mb-6">
          <span className="w-12 sm:w-16 lg:w-24 h-px bg-[#00a3c4]"></span>
          <span>Follow The Story</span>
          <span className="w-12 sm:w-16 lg:w-24 h-px bg-[#00a3c4]"></span>
        </div>

        {/* Main Heading */}
        <h2 className="font-playfair text-3xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 lg:mb-3 leading-tight">
          <span className="italic text-[#00a3c4] font-medium pr-1.5 lg:pr-2">As Worn</span> 
          on Instagram
        </h2>

        {/* Subtext */}
        <a 
          href={INSTA_PROFILE_URL}
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs sm:text-sm font-normal text-gray-600 lg:text-gray-800 hover:text-[#00a3c4] transition-colors"
        >
          @puramentejewel
        </a>

      </div>

      {/* --- INSTAGRAM GRID (Desktop) / SWIPEABLE CAROUSEL (Mobile) --- */}
      <div 
        className="w-full flex md:grid md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-[2px] overflow-x-auto snap-x snap-mandatory px-4 md:px-0 pb-6 md:pb-0 hide-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {instaPosts.map((post) => (
          <InstaItem 
            key={post._id} // Using _id from MongoDB
            post={post} 
            profileUrl={INSTA_PROFILE_URL}
            className="snap-center shrink-0 w-[70vw] sm:w-[45vw] md:w-full rounded-2xl md:rounded-none shadow-md md:shadow-none" 
          />
        ))}
      </div>

      {/* Global style to hide default scrollbar for the mobile carousel */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </section>
  );
}

/** * Extracted into a separate component so we can manage individual Video DOM Refs easily 
 */
function InstaItem({ post, className = "", profileUrl }) {
  const videoRef = useRef(null);

  const handleMouseEnter = () => {
    if (post.type === "video" && videoRef.current) {
      videoRef.current.play().catch(err => console.log("Autoplay prevented", err));
    }
  };

  const handleMouseLeave = () => {
    if (post.type === "video" && videoRef.current) {
      videoRef.current.pause();
    }
  };

  return (
    <a 
      href={profileUrl} 
      target="_blank" 
      rel="noopener noreferrer"
      className={`relative aspect-[4/5] bg-gray-100 group overflow-hidden block ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Conditional Render: Video or Image */}
      {post.type === "video" ? (
        <video 
          ref={videoRef}
          src={post.mediaUrl}
          loop 
          muted 
          playsInline
          className="w-full h-full object-cover transition-all duration-700 blur-0 lg:blur-[2px] lg:group-hover:blur-0 group-hover:scale-105"
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img 
          src={post.mediaUrl} 
          alt="Instagram post from @puramentejewel" 
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      )}

      {/* Hover Dark Overlay (Mimics Instagram interaction) */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>

      {/* Instagram Top Right Icon (Reel or Carousel) */}
      <div className="absolute top-3 right-3 lg:top-3 lg:right-3 opacity-90 drop-shadow-md">
        {post.icon === "reel" ? (
          <svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
            <path d="M8 5V19L19 12L8 5Z" fill="white"/>
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
            <rect x="3" y="3" width="14" height="14" rx="2" stroke="white" strokeWidth="2"/>
            <path d="M7 21H19C20.1046 21 21 20.1046 21 19V7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
      
    </a>
  );
}