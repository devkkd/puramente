'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';

export default function ExhibitionPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if popup has been shown in this session
    const hasShownPopup = sessionStorage.getItem('exhibitionPopupShown');
    
    if (!hasShownPopup) {
      // Show popup after a small delay for better UX
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem('exhibitionPopupShown', 'true');
      }, 500);

      return () => clearTimeout(timer);
    }
  }, []);

  const closePopup = () => {
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop - Transparent with Blur */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-md z-40 transition-all"
        onClick={closePopup}
        aria-hidden="true"
      />

      {/* Popup Container - With Gap from Header */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0 pt-24 sm:pt-32">
        <div className="relative w-full max-w-sm md:max-w-md lg:max-w-lg">
          {/* Responsive Container - maintains 520x680 ratio */}
          <div className="relative bg-white rounded-lg overflow-hidden shadow-2xl"
            style={{
              aspectRatio: '520 / 680',
              maxWidth: '520px',
              width: '100%',
              margin: '0 auto'
            }}>
            
            {/* Banner Image */}
            <Image
              src="/images/expo.png"
              alt="IHGF Delhi Fair - Autumn 2026"
              fill
              className="object-cover"
              priority
            />

            {/* Close Button */}
            <button
              onClick={closePopup}
              className="absolute top-3 right-3 z-10 bg-white rounded-full p-1 hover:bg-gray-100 transition-colors shadow-md"
              aria-label="Close popup"
            >
              <X size={24} className="text-gray-700" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
