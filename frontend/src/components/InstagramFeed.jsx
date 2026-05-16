"use client";

import React from "react";

// The data array where you will map your local images/videos and external Insta links
const instaPosts = [
  {
    id: 1,
    type: "image", // can be 'image' or 'video'
    mediaUrl: "/images/home/insta1.jpg", 
    instaLink: "https://instagram.com/puramentejewel",
    icon: "carousel", // usually top right icon on insta
  },
  {
    id: 2,
    type: "video",
    mediaUrl: "/images/home/reel1.mp4", // Put your downloaded reel .mp4 here!
    instaLink: "https://instagram.com/puramentejewel",
    icon: "reel",
  },
  {
    id: 3,
    type: "video",
    mediaUrl: "/images/home/reel2.mp4",
    instaLink: "https://instagram.com/puramentejewel",
    icon: "reel",
  },
  {
    id: 4,
    type: "image",
    mediaUrl: "/images/home/insta2.jpg",
    instaLink: "https://instagram.com/puramentejewel",
    icon: "carousel",
  },
  {
    id: 5,
    type: "video",
    mediaUrl: "/images/home/reel3.mp4",
    instaLink: "https://instagram.com/puramentejewel",
    icon: "reel",
  },
];

export default function InstagramFeed() {
  return (
    <section className="w-full py-24 bg-white font-mona">
      <div className="flex flex-col items-center mb-12">
        
        {/* Top Subheading */}
        <div className="flex items-center gap-4 text-[#00a3c4] text-base font-normal tracking-widest uppercase mb-6">
          <span className="w-12 md:w-24 h-px bg-[#00a3c4]"></span>
          <span>Follow The Story</span>
          <span className="w-12 md:w-24 h-px bg-[#00a3c4]"></span>
        </div>

        {/* Main Heading */}
        <h2 className="font-playfair text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
          <span className="italic text-[#00a3c4] font-medium pr-2">As Worn</span> 
          on Instagram
        </h2>

        {/* Subtext */}
        <a 
          href="https://instagram.com/puramentejewel" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sm font-normal text-gray-800 hover:text-[#00a3c4] transition-colors"
        >
          @puramentejewel
        </a>

      </div>

      {/* --- INSTAGRAM GRID --- */}
      {/* gap-[2px] gives that ultra-thin authentic Instagram profile grid look */}
      <div className="w-full grid grid-cols-2 md:grid-cols-5 gap-[2px]">
        {instaPosts.map((post) => (
          <a 
            key={post.id} 
            href={post.instaLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="relative w-full aspect-[4/5] bg-gray-100 group overflow-hidden block"
          >
            {/* Conditional Render: Video or Image */}
            {post.type === "video" ? (
              <video 
                src={post.mediaUrl}
                autoPlay 
                loop 
                muted 
                playsInline
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <img 
                src={post.mediaUrl} 
                alt="Instagram post from @puramentejewel" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            )}

            {/* Hover Dark Overlay (Mimics Instagram interaction) */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>

            {/* Instagram Top Right Icon (Reel or Carousel) */}
            <div className="absolute top-3 right-3 opacity-90 drop-shadow-md">
              {post.icon === "reel" ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 5V19L19 12L8 5Z" fill="white"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="14" height="14" rx="2" stroke="white" strokeWidth="2"/>
                  <path d="M7 21H19C20.1046 21 21 20.1046 21 19V7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
            
          </a>
        ))}
      </div>
    </section>
  );
}