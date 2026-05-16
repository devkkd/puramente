"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import { usePathname, useRouter } from "next/navigation"; 
import { 
  Search, 
  ChevronDown, 
  Heart, 
  User, 
  ShoppingBag,
  LogOut,
  Globe 
} from "lucide-react";
import { getCategories } from "@/lib/api"; 
import { useCart } from "@/context/CartContext"; 

// Supported Languages List
const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "hi", name: "Hindi" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  
  const [jewelryDropdownLinks, setJewelryDropdownLinks] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  
  // --- TRANSLATION STATE ---
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("English");

  // Include clearCart from context
  const { cart, refreshCart, clearCart } = useCart();
  const cartCount = cart?.items?.length || 0;

  // Initialize Google Translate
  useEffect(() => {
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        { pageLanguage: "en", autoDisplay: false },
        "google_translate_element"
      );
    };

    const match = document.cookie.match(/googtrans=\/en\/(.*?)(;|$)/);
    if (match && match[1]) {
      const selected = LANGUAGES.find((l) => l.code === match[1]);
      if (selected) setCurrentLang(selected.name);
    }
  }, []);

  const handleLanguageChange = (langCode, langName) => {
    setCurrentLang(langName);
    setIsLangOpen(false);

    const selectField = document.querySelector(".goog-te-combo");
    if (selectField) {
      selectField.value = langCode;
      selectField.dispatchEvent(new Event("change"));
    }
  };

  useEffect(() => {
    const checkAuth = () => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("userToken");
        setIsLoggedIn(!!token); 
      }
    };
    checkAuth();
  }, [pathname]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("userToken");
      localStorage.removeItem("userId");
    }
    setIsLoggedIn(false);
    
    // Wipe the cart explicitly
    if (clearCart) {
      clearCart();
    } else {
      refreshCart();
    }

    router.push("/"); 
  };

  useEffect(() => {
    const fetchDropdownCategories = async () => {
      try {
        const response = await getCategories();
        if (response.success && response.data) {
          const formattedLinks = response.data.map((cat) => ({
            name: cat.name,
            href: `/store/${cat.name.toLowerCase()}`, 
          }));
          setJewelryDropdownLinks(formattedLinks);
        }
      } catch (error) {
        console.error("Failed to load header categories:", error);
      }
    };
    fetchDropdownCategories();
  }, []);

  const mainNavLinks = [
    { name: "Home", href: "/", isBold: true },
    { name: "Our Story", href: "/ourStory" },
    { name: "✦ New In", href: "/new-in" },
  ];

  const rightNavLinks = [
    { name: "Custom", href: "/custom" },
    { name: "Exhibitions", href: "/exhibitions" },
    { name: "Fair Trade Practicing", href: "/fair-trade" },
    { name: "Contact Us", href: "/contact" },
  ];

  return (
    <>
      {/* GOOGLE TRANSLATE SCRIPT & HIDDEN DIV */}
      <div id="google_translate_element" style={{ display: "none" }}></div>
      <Script 
        src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" 
        strategy="afterInteractive" 
      />

      <header className="w-full bg-[linear-gradient(0deg,#0082A4_0%,#00CEF3_100%)] text-white">
        
        {/* Top Row: Logo, Search, and Actions */}
        <div className="max-w-[1400px] mx-auto px-6 py-4 grid grid-cols-3 items-center gap-4">
          
          {/* 1. Logo (Left) */}
          <div className="flex justify-start">
            <Link href="/" className="notranslate"> 
              <Image 
                src="/images/logo/PuramenteLogo.png" 
                alt="Puramente International" 
                width={220} 
                height={50} 
                className="h-8 w-auto md:h-10 object-contain"
                priority
              />
            </Link>
          </div>

          {/* 2. Search Bar (Center) */}
          <div className="flex justify-center w-full">
            <div className="relative w-full max-w-[450px]">
              <input
                type="text"
                placeholder="Search for find jewellery..."
                className="w-full bg-white text-gray-800 placeholder-gray-400 rounded-2xl py-2 pl-6 pr-12 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-sm"
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2 text-black hover:text-[#0082A4] transition-colors flex items-center justify-center">
                <Search size={20} strokeWidth={1.5} />
              </button>
            </div>
          </div>

          {/* 3. Actions (Right Side) */}
          <div className="flex items-center justify-end space-x-6 shrink-0">
            
            <div className="relative hidden lg:block notranslate">
              <button 
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center space-x-1.5 hover:text-white/80 transition-colors py-2"
              >
                <Globe size={16} />
                <span className="text-sm font-medium">{currentLang}</span>
                <ChevronDown size={14} className={`transition-transform ${isLangOpen ? "rotate-180" : ""}`} />
              </button>

              {isLangOpen && (
                <div className="absolute right-0 top-full mt-2 w-36 bg-white rounded-xl shadow-xl py-2 z-50 border border-gray-100 overflow-hidden">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code, lang.name)}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        currentLang === lang.name 
                        ? "bg-[#E2FCFF] text-[#0082A4] font-bold" 
                        : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {isLoggedIn ? (
              <button 
                onClick={handleLogout} 
                className="hidden sm:flex items-center space-x-2 bg-white text-black px-5 py-2.5 rounded-2xl text-sm font-medium hover:bg-red-50 hover:text-red-600 transition-colors shadow-sm notranslate"
              >
                <LogOut size={18} strokeWidth={1.5} />
                <span>Logout</span>
              </button>
            ) : (
              <Link href="/account" className="hidden sm:flex items-center space-x-2 bg-white text-black px-5 py-2.5 rounded-2xl text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm notranslate">
                <User size={18} strokeWidth={1.5} />
                <span>Account</span>
              </Link>
            )}

            <Link href="/cart" className="flex items-center space-x-2 bg-white text-black px-5 py-2.5 rounded-2xl text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm notranslate">
              <ShoppingBag size={18} strokeWidth={1.5} />
              <span>Cart ({cartCount})</span>
            </Link>
            
          </div>
        </div>

        <div className="border-t border-white/20 w-full"></div>

        {/* Bottom Row: Navigation Links */}
        <div className=" mx-auto px-6 py-3 overflow-visible">
          <nav className="flex items-center justify-center space-x-8 min-w-max relative z-40">
            
            {mainNavLinks.map((link, index) => (
              <Link 
                key={index} 
                href={link.href} 
                className={`text-sm tracking-wide hover:text-white/80 transition-colors ${
                  link.isBold ? "font-bold" : "font-medium"
                }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="relative group cursor-pointer">
              <div className="flex items-center space-x-1 text-sm font-medium tracking-wide hover:text-white/80 transition-colors py-2">
                <span>Jewelry Design</span>
                <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-200" />
              </div>
              
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-0 hidden group-hover:block w-48 bg-white rounded-lg shadow-xl py-2 z-50 overflow-hidden">
                {jewelryDropdownLinks.length > 0 ? (
                  jewelryDropdownLinks.map((link, index) => (
                    <Link
                      key={index}
                      href={link.href}
                      className="block px-4 py-2.5 text-sm text-gray-800 hover:bg-[#E2FCFF] hover:text-[#0082A4] transition-colors"
                    >
                      {link.name}
                    </Link>
                  ))
                ) : (
                  <div className="px-4 py-2.5 text-sm text-gray-400">Loading...</div>
                )}
              </div>
            </div>

            {rightNavLinks.map((link, index) => (
              <Link 
                key={index} 
                href={link.href} 
                className="text-sm font-medium tracking-wide hover:text-white/80 transition-colors"
              >
                {link.name}
              </Link>
            ))}
            
          </nav>
        </div>

      </header>
    </>
  );
}