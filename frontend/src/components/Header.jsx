"use client";

import React, { useState, useEffect, useRef } from "react";
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
  Globe,
  Package,
  Tags,
  Menu,
  X
} from "lucide-react";
import { getCategories, getProducts } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import LocaleSwitcher from "@/components/LocaleSwitcher";

const LANGUAGES = [
  { code: "hi", name: "Hindi" },
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "ru", name: "Russian" },
  { code: "zh-CN", name: "Chinese (Simplified)" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "bn", name: "Bengali" },
  { code: "vi", name: "Vietnamese" },
  { code: "th", name: "Thai" },
  { code: "id", name: "Indonesian" },
  { code: "ar", name: "Arabic" },
  { code: "tr", name: "Turkish" },
  { code: "fa", name: "Persian" },
  { code: "sw", name: "Swahili" },
  { code: "he", name: "Hebrew" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const [jewelryDropdownLinks, setJewelryDropdownLinks] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileJewelryOpen, setIsMobileJewelryOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("English");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [filteredResults, setFilteredResults] = useState({ categories: [], products: [] });
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchRefDesktop = useRef(null);
  const searchRefMobile = useRef(null);

  const trustIcons = [
    "/images/logo/icon1.svg",
    "/images/logo/icon2.svg",
    "/images/logo/icon3.svg",
  ];

  const { cart, refreshCart, clearCart } = useCart();
  const cartCount = cart?.items?.length || 0;

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

  useEffect(() => { setIsMobileMenuOpen(false); }, [pathname]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => { document.body.style.overflow = "auto"; };
  }, [isMobileMenuOpen]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("userToken");
      localStorage.removeItem("userId");
      localStorage.removeItem("puramente_metal");
      localStorage.removeItem("puramente_finish");
    }
    setIsLoggedIn(false);
    setIsMobileMenuOpen(false);
    if (clearCart) { clearCart(); } else { refreshCart(); }
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
          setAllCategories(response.data);
        }
      } catch (error) {
        console.error("Failed to load header categories:", error);
      }
    };
    fetchDropdownCategories();
  }, []);

  const handleSearchFocus = async () => {
    if (!isLoggedIn) {
      router.push("/account");
      return;
    }
    setIsSearchOpen(true);
    if (!isDataLoaded) {
      setIsSearching(true);
      try {
        const res = await getProducts();
        if (res.success && res.data) {
          setAllProducts(res.data);
          setIsDataLoaded(true);
        }
      } catch (error) {
        console.error("Failed to load products for search", error);
      } finally {
        setIsSearching(false);
      }
    }
  };

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredResults({ categories: [], products: [] });
      return;
    }
    const q = searchQuery.toLowerCase();
    const matchedCategories = allCategories
      .filter((c) => c.name.toLowerCase().includes(q))
      .slice(0, 3);
    const matchedProducts = allProducts
      .filter((p) =>
        p.productName.toLowerCase().includes(q) ||
        p.designCode.toLowerCase().includes(q)
      )
      .slice(0, 5);
    setFilteredResults({ categories: matchedCategories, products: matchedProducts });
  }, [searchQuery, allCategories, allProducts]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        (searchRefDesktop.current && !searchRefDesktop.current.contains(event.target)) &&
        (searchRefMobile.current && !searchRefMobile.current.contains(event.target))
      ) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  const mainNavLinks = [
    { name: "Home", href: "/", isBold: true },
    { name: "Our Story", href: "/ourStory" },
    { name: "✦ New In", href: "/new-in" },
  ];

  const rightNavLinks = [
    { name: "Make your Design", href: "/custom" },
    { name: "Exhibitions", href: "/exhibitions" },
    { name: "Fair Trade Practicing", href: "/fair-trade" },
    { name: "Contact Us", href: "/contact" },
  ];

  const SearchDropdown = () => (
    <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 flex flex-col text-left text-gray-900 max-h-[60vh] overflow-y-auto">
      {isSearching ? (
        <div className="p-4 text-center text-sm text-gray-500 animate-pulse">Loading catalog...</div>
      ) : searchQuery.trim() !== "" ? (
        <>
          {filteredResults.categories.length > 0 && (
            <div className="p-2 border-b border-gray-100">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 py-2">Categories</h4>
              {filteredResults.categories.map((cat) => (
                <Link
                  key={cat._id}
                  href={`/store/${cat.name.toLowerCase()}`}
                  onClick={closeSearch}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-[#E2FCFF] hover:text-[#0082A4] rounded-lg transition-colors"
                >
                  <Tags size={16} className="text-gray-400 shrink-0" />
                  <span className="text-sm font-medium">{cat.name}</span>
                </Link>
              ))}
            </div>
          )}
          {filteredResults.products.length > 0 && (
            <div className="p-2">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 py-2">Products</h4>
              {filteredResults.products.map((prod) => (
                <Link
                  key={prod._id}
                  href={`/product/${prod._id}`}
                  onClick={closeSearch}
                  className="flex items-center gap-4 px-3 py-2 hover:bg-[#E2FCFF] rounded-lg transition-colors group"
                >
                  <div className="w-12 h-12 bg-gray-50 rounded-md overflow-hidden shrink-0 border border-gray-100">
                    {prod.imageUrl ? (
                      <img src={prod.imageUrl} alt={prod.productName} className="w-full h-full object-cover" />
                    ) : (
                      <Package className="w-full h-full p-2 text-gray-300" />
                    )}
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-sm font-bold text-gray-900 truncate group-hover:text-[#0082A4] transition-colors">{prod.productName}</span>
                    <span className="text-xs text-gray-500 font-mono mt-0.5">{prod.designCode}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
          {filteredResults.categories.length === 0 && filteredResults.products.length === 0 && (
            <div className="p-6 text-center text-sm text-gray-500">
              No results found for <span className="font-bold text-gray-800">"{searchQuery}"</span>
            </div>
          )}
        </>
      ) : (
        <div className="p-6 text-center text-sm text-gray-400">Type a product name, design code, or category...</div>
      )}
    </div>
  );

  return (
    <>
      <div id="google_translate_element" style={{ display: "none" }}></div>
      <Script src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" strategy="afterInteractive" />

      {/* --- MOBILE SIDEBAR DRAWER --- */}
      <div className={`fixed inset-0 z-[100] transition-opacity duration-300 ${isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
        <div className={`absolute top-0 left-0 h-full w-[80%] max-w-sm bg-white text-gray-900 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <span className="font-playfair font-bold text-xl text-[#0082A4]">Menu</span>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"><X size={24} /></button>
          </div>
          <div className="flex-1 overflow-y-auto py-4 px-4 space-y-1">
            {mainNavLinks.map((link, i) => (
              <Link key={i} href={link.href} className="block px-4 py-3 rounded-xl hover:bg-gray-50 font-medium text-gray-800">{link.name}</Link>
            ))}
            <div className="px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-800">
              <button onClick={() => setIsMobileJewelryOpen(!isMobileJewelryOpen)} className="flex items-center justify-between w-full font-medium">
                <span>Jewelry Design</span>
                <ChevronDown size={16} className={`transition-transform duration-200 ${isMobileJewelryOpen ? "rotate-180" : ""}`} />
              </button>
              {isMobileJewelryOpen && (
                <div className="mt-3 pl-4 space-y-2 border-l-2 border-gray-100">
                  {jewelryDropdownLinks.map((link, idx) => (
                    <Link key={idx} href={link.href} className="block py-2 text-sm text-gray-600 hover:text-[#0082A4]">{link.name}</Link>
                  ))}
                </div>
              )}
            </div>
            {rightNavLinks.map((link, i) => (
              <Link key={i} href={link.href} className="block px-4 py-3 rounded-xl hover:bg-gray-50 font-medium text-gray-800">{link.name}</Link>
            ))}
            <div className="border-t border-gray-100 my-4"></div>
            <div className="px-4 py-3">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-3">Language</span>
              <div className="grid grid-cols-2 gap-2">
                {LANGUAGES.map((lang) => (
                  <button key={lang.code} onClick={() => handleLanguageChange(lang.code, lang.name)}
                    className={`px-3 py-2 text-sm rounded-lg border text-left ${currentLang === lang.name ? "bg-[#E2FCFF] border-[#0082A4]/30 text-[#0082A4] font-bold" : "border-gray-200 text-gray-600"}`}
                  >{lang.name}</button>
                ))}
              </div>
            </div>
          </div>
          <div className="p-4 border-t border-gray-100 bg-gray-50">
            {isLoggedIn ? (
              <button onClick={handleLogout} className="flex items-center justify-center w-full gap-2 bg-white text-red-600 border border-red-100 px-4 py-3 rounded-xl font-medium shadow-sm"><LogOut size={18} /> Logout</button>
            ) : (
              <Link href="/account" className="flex items-center justify-center w-full gap-2 bg-[#0082A4] text-white px-4 py-3 rounded-xl font-medium shadow-sm"><User size={18} /> Login / Register</Link>
            )}
          </div>
        </div>
      </div>

      {/* --- MAIN HEADER --- */}
      <header className="w-full bg-[linear-gradient(0deg,#0082A4_0%,#00CEF3_100%)] text-white relative z-50 sticky top-0 shadow-md">
        
        {/* TOP ROW: Logo, Slider, Search, Actions */}
        <div className="max-w-[1400px] mx-auto px-4 lg:px-6 py-3 flex items-center justify-between lg:grid lg:grid-cols-3 gap-4">
          
          <button className="lg:hidden p-1 -ml-1 text-white hover:text-white/80" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu size={28} />
          </button>

          {/* 1. Logo + Slider (Upper position) */}
          <div className="flex items-center gap-4 lg:gap-8 lg:justify-start flex-1 lg:flex-none">
            <Link href="/" className="notranslate shrink-0">
              <Image src="/images/logo/PuramenteLogo.png" alt="Puramente International" width={220} height={50} className="h-7 sm:h-8 md:h-10 w-auto object-contain" priority />
            </Link>
            
            {/* Trust Slider moved here */}
            <div className="hidden xl:block w-52 overflow-hidden relative group shrink-0 border-l border-r border-white/20 pl-4">
              <div className="flex items-center gap-3 animate-infinite-scroll w-max">
                {[...trustIcons, ...trustIcons].map((src, i) => (
                  <img key={i} src={src} alt="Certification" className="h-12 w-auto opacity-90 hover:opacity-100 transition-opacity" />
                ))}
              </div>
            </div>
          </div>

          {/* 2. Shrunk Search Bar (Desktop) */}
          <div className="hidden lg:flex justify-center w-full" ref={searchRefDesktop}>
            <div className="relative w-full max-w-[340px]"> {/* Shrunk from 450px to 340px */}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={handleSearchFocus}
                readOnly={!isLoggedIn}
                placeholder={isLoggedIn ? "Search designs..." : "Log in to search..."}
                className={`w-full text-gray-800 rounded-2xl py-2 pl-5 pr-10 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-sm transition-colors text-sm ${isLoggedIn ? "bg-white placeholder-gray-400" : "bg-gray-100 placeholder-gray-500 cursor-pointer"}`}
                onClick={() => { if (!isLoggedIn) router.push("/account"); }}
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#0082A4] transition-colors">
                <Search size={18} strokeWidth={1.5} />
              </button>
              {isSearchOpen && isLoggedIn && <SearchDropdown />}
            </div>
          </div>

          {/* 3. Actions */}
          <div className="flex items-center justify-end space-x-4 lg:space-x-6 shrink-0">
            <div className="relative hidden lg:block notranslate">
              <button onClick={() => setIsLangOpen(!isLangOpen)} className="flex items-center space-x-1.5 hover:text-white/80 transition-colors py-2">
                <Globe size={16} />
                <span className="text-sm font-medium">{currentLang}</span>
                <ChevronDown size={14} className={`transition-transform ${isLangOpen ? "rotate-180" : ""}`} />
              </button>
              {isLangOpen && (
                <div className="absolute right-0 top-full mt-2 w-36 bg-white rounded-xl shadow-xl py-1.5 z-50 border border-gray-100 max-h-56 overflow-y-auto">
                  {LANGUAGES.map((lang) => (
                    <button key={lang.code} onClick={() => handleLanguageChange(lang.code, lang.name)}
                      className={`w-full text-left px-4 py-1.5 text-sm transition-colors ${currentLang === lang.name ? "bg-[#E2FCFF] text-[#0082A4] font-bold" : "text-gray-700 hover:bg-gray-50"}`}
                    >{lang.name}</button>
                  ))}
                </div>
              )}
            </div>

            {isLoggedIn ? (
              <button onClick={handleLogout} className="hidden lg:flex items-center space-x-2 bg-white text-black px-5 py-2.5 rounded-2xl text-sm font-medium hover:bg-red-50 hover:text-red-600 transition-colors shadow-sm notranslate">
                <LogOut size={18} strokeWidth={1.5} />
                <span>Logout</span>
              </button>
            ) : (
              <Link href="/account" className="hidden lg:flex items-center space-x-2 bg-white text-black px-5 py-2.5 rounded-2xl text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm notranslate">
                <User size={18} strokeWidth={1.5} />
                <span>Account</span>
              </Link>
            )}

            {!isLoggedIn && <Link href="/account" className="lg:hidden hover:text-white/80 transition-colors notranslate"><User size={24} strokeWidth={1.5} /></Link>}

            <Link href="/cart" className="flex items-center space-x-2 bg-white text-black px-3 py-2 lg:px-5 lg:py-2.5 rounded-xl lg:rounded-2xl text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm notranslate">
              <ShoppingBag size={18} strokeWidth={1.5} />
              <span className="hidden sm:inline">Cart ({cartCount})</span>
              <span className="sm:hidden font-bold">{cartCount}</span>
            </Link>
            <LocaleSwitcher />
          </div>
        </div>

        {/* MOBILE SEARCH ROW */}
        <div className="lg:hidden px-4 pb-4 w-full" ref={searchRefMobile}>
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={handleSearchFocus}
              readOnly={!isLoggedIn}
              placeholder={isLoggedIn ? "Search designs..." : "Log in to search..."}
              className={`w-full text-gray-800 rounded-xl py-2.5 pl-5 pr-10 text-sm focus:outline-none shadow-sm transition-colors ${isLoggedIn ? "bg-white placeholder-gray-400" : "bg-white/90 placeholder-gray-500 cursor-pointer"}`}
              onClick={() => { if (!isLoggedIn) router.push("/account"); }}
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#0082A4]"><Search size={18} strokeWidth={1.5} /></button>
            {isSearchOpen && isLoggedIn && <SearchDropdown />}
          </div>
        </div>

        {/* BOTTOM ROW: Desktop Nav + Socials */}
        <div className="hidden lg:block border-t border-white/20 w-full">
          <div className="max-w-[1400px] mx-auto px-6 py-1 flex items-center justify-between">
            
            {/* Empty space for alignment since slider moved up */}
            <div className="w-48 hidden lg:block"></div>

            <nav className="flex items-center justify-center space-x-8">
              {mainNavLinks.map((link, index) => (
                <Link key={index} href={link.href} className={`text-sm tracking-wide hover:text-white/80 transition-colors ${link.isBold ? "font-bold" : "font-medium"}`}>{link.name}</Link>
              ))}
              <div className="relative group cursor-pointer">
                <div className="flex items-center space-x-1 text-sm font-medium tracking-wide hover:text-white/80 transition-colors py-2">
                  <span>Jewelry Design</span>
                  <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-200" />
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-0 hidden group-hover:block w-48 bg-white rounded-lg shadow-xl py-2 z-50 overflow-hidden">
                  {jewelryDropdownLinks.length > 0 ? (
                    jewelryDropdownLinks.map((link, index) => (
                      <Link key={index} href={link.href} className="block px-4 py-2.5 text-sm text-gray-800 hover:bg-[#E2FCFF] hover:text-[#0082A4] transition-colors">{link.name}</Link>
                    ))
                  ) : (<div className="px-4 py-2.5 text-sm text-gray-400">Loading...</div>)}
                </div>
              </div>
              {rightNavLinks.map((link, index) => (
                <Link key={index} href={link.href} className="text-sm font-medium tracking-wide hover:text-white/80 transition-colors">{link.name}</Link>
              ))}
            </nav>

            <div className="w-48 flex items-center justify-end space-x-4 shrink-0">
              <Link href="https://facebook.com/puramenteinternational1" target="_blank" className="hover:text-white/70 transition-colors">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" /></svg>
              </Link>
              <Link href="https://instagram.com/puramenteinternational" target="_blank" className="hover:text-white/70 transition-colors">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.332 3.608 1.308.975.975 1.245 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.063 1.366-.333 2.633-1.308 3.608-.975.975-2.242 1.245-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.063-2.633-.333-3.608-1.308-.975-.975-1.245-2.242-1.308-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.332-2.633 1.308-3.608.975-.975 2.242-1.245 3.608-1.308 1.266-.058 1.646-.07 4.85-.07zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
              </Link>
              <Link href="https://www.linkedin.com/company/puramente-international" target="_blank" className="hover:text-white/70 transition-colors">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
              </Link>
              <Link href="https://www.youtube.com/@PuramenteInternational" target="_blank" className="hover:text-white/70 transition-colors">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

// "use client";

// import React, { useState, useEffect, useRef } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import Script from "next/script";
// import { usePathname, useRouter } from "next/navigation";
// import {
//   Search,
//   ChevronDown,
//   Heart,
//   User,
//   ShoppingBag,
//   LogOut,
//   Globe,
//   Package,
//   Tags,
//   Menu,
//   X
// } from "lucide-react";
// import { getCategories, getProducts } from "@/lib/api";
// import { useCart } from "@/context/CartContext";

// const LANGUAGES = [
//   // Global / European
//   { code: "hi", name: "Hindi" },
//   { code: "en", name: "English" },
//   { code: "es", name: "Spanish" },
//   { code: "fr", name: "French" },
//   { code: "de", name: "German" },
//   { code: "it", name: "Italian" },
//   { code: "pt", name: "Portuguese" },
//   { code: "ru", name: "Russian" },

//   // Asian
//   { code: "zh-CN", name: "Chinese (Simplified)" },
//   { code: "ja", name: "Japanese" },
//   { code: "ko", name: "Korean" },
//   { code: "bn", name: "Bengali" },
//   { code: "vi", name: "Vietnamese" },
//   { code: "th", name: "Thai" },
//   { code: "id", name: "Indonesian" },

//   // Middle Eastern / African
//   { code: "ar", name: "Arabic" },
//   { code: "tr", name: "Turkish" },
//   { code: "fa", name: "Persian" },
//   { code: "sw", name: "Swahili" },
//   { code: "he", name: "Hebrew" },
// ];

// export default function Header() {
//   const pathname = usePathname();
//   const router = useRouter();

//   const [jewelryDropdownLinks, setJewelryDropdownLinks] = useState([]);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   // --- UI STATE ---
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [isMobileJewelryOpen, setIsMobileJewelryOpen] = useState(false);

//   // --- TRANSLATION STATE ---
//   const [isLangOpen, setIsLangOpen] = useState(false);
//   const [currentLang, setCurrentLang] = useState("English");

//   // --- SEARCH STATE ---
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isSearchOpen, setIsSearchOpen] = useState(false);
//   const [allProducts, setAllProducts] = useState([]);
//   const [allCategories, setAllCategories] = useState([]);
//   const [filteredResults, setFilteredResults] = useState({ categories: [], products: [] });
//   const [isDataLoaded, setIsDataLoaded] = useState(false);
//   const [isSearching, setIsSearching] = useState(false);
//   const searchRefDesktop = useRef(null);
//   const searchRefMobile = useRef(null);

//   // Trust Slider Icons
//   const trustIcons = [
//     "/images/logo/icon1.svg",
//     "/images/logo/icon2.svg",
//     "/images/logo/icon3.svg",
//   ];

//   // Include clearCart from context
//   const { cart, refreshCart, clearCart } = useCart();
//   const cartCount = cart?.items?.length || 0;

//   // Initialize Google Translate
//   useEffect(() => {
//     window.googleTranslateElementInit = () => {
//       new window.google.translate.TranslateElement(
//         { pageLanguage: "en", autoDisplay: false },
//         "google_translate_element"
//       );
//     };

//     const match = document.cookie.match(/googtrans=\/en\/(.*?)(;|$)/);
//     if (match && match[1]) {
//       const selected = LANGUAGES.find((l) => l.code === match[1]);
//       if (selected) setCurrentLang(selected.name);
//     }
//   }, []);

//   const handleLanguageChange = (langCode, langName) => {
//     setCurrentLang(langName);
//     setIsLangOpen(false);

//     const selectField = document.querySelector(".goog-te-combo");
//     if (selectField) {
//       selectField.value = langCode;
//       selectField.dispatchEvent(new Event("change"));
//     }
//   };

//   useEffect(() => {
//     const checkAuth = () => {
//       if (typeof window !== "undefined") {
//         const token = localStorage.getItem("userToken");
//         setIsLoggedIn(!!token);
//       }
//     };
//     checkAuth();
//   }, [pathname]);

//   // Close mobile menu on route change
//   useEffect(() => {
//     setIsMobileMenuOpen(false);
//   }, [pathname]);

//   // Lock body scroll when mobile menu is open
//   useEffect(() => {
//     if (isMobileMenuOpen) {
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "auto";
//     }
//     return () => { document.body.style.overflow = "auto"; };
//   }, [isMobileMenuOpen]);

//   const handleLogout = () => {
//     if (typeof window !== "undefined") {
//       localStorage.removeItem("userToken");
//       localStorage.removeItem("userId");
//       localStorage.removeItem("puramente_metal");
//       localStorage.removeItem("puramente_finish");
//     }
//     setIsLoggedIn(false);
//     setIsMobileMenuOpen(false);

//     if (clearCart) {
//       clearCart();
//     } else {
//       refreshCart();
//     }

//     router.push("/");
//   };

//   // Fetch Categories for the Dropdown
//   useEffect(() => {
//     const fetchDropdownCategories = async () => {
//       try {
//         const response = await getCategories();
//         if (response.success && response.data) {
//           const formattedLinks = response.data.map((cat) => ({
//             name: cat.name,
//             href: `/store/${cat.name.toLowerCase()}`,
//           }));
//           setJewelryDropdownLinks(formattedLinks);
//           setAllCategories(response.data);
//         }
//       } catch (error) {
//         console.error("Failed to load header categories:", error);
//       }
//     };
//     fetchDropdownCategories();
//   }, []);

//   // --- LIVE SEARCH LOGIC ---
//   const handleSearchFocus = async () => {
//     if (!isLoggedIn) {
//       router.push("/account");
//       return;
//     }

//     setIsSearchOpen(true);

//     if (!isDataLoaded) {
//       setIsSearching(true);
//       try {
//         const res = await getProducts();
//         if (res.success && res.data) {
//           setAllProducts(res.data);
//           setIsDataLoaded(true);
//         }
//       } catch (error) {
//         console.error("Failed to load products for search", error);
//       } finally {
//         setIsSearching(false);
//       }
//     }
//   };

//   useEffect(() => {
//     if (searchQuery.trim() === "") {
//       setFilteredResults({ categories: [], products: [] });
//       return;
//     }

//     const q = searchQuery.toLowerCase();
//     const matchedCategories = allCategories
//       .filter((c) => c.name.toLowerCase().includes(q))
//       .slice(0, 3);

//     const matchedProducts = allProducts
//       .filter((p) =>
//         p.productName.toLowerCase().includes(q) ||
//         p.designCode.toLowerCase().includes(q)
//       )
//       .slice(0, 5);

//     setFilteredResults({ categories: matchedCategories, products: matchedProducts });
//   }, [searchQuery, allCategories, allProducts]);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         (searchRefDesktop.current && !searchRefDesktop.current.contains(event.target)) &&
//         (searchRefMobile.current && !searchRefMobile.current.contains(event.target))
//       ) {
//         setIsSearchOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const closeSearch = () => {
//     setIsSearchOpen(false);
//     setSearchQuery("");
//   };

//   // Nav Data
//   const mainNavLinks = [
//     { name: "Home", href: "/", isBold: true },
//     { name: "Our Story", href: "/ourStory" },
//     { name: "✦ New In", href: "/new-in" },
//   ];

//   const rightNavLinks = [
//     { name: "Make your Design", href: "/custom" },
//     { name: "Exhibitions", href: "/exhibitions" },
//     { name: "Fair Trade Practicing", href: "/fair-trade" },
//     { name: "Contact Us", href: "/contact" },
//   ];

//   // Reusable Search Dropdown Component
//   const SearchDropdown = () => (
//     <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 flex flex-col text-left text-gray-900 max-h-[60vh] overflow-y-auto">
//       {isSearching ? (
//         <div className="p-4 text-center text-sm text-gray-500 animate-pulse">Loading catalog...</div>
//       ) : searchQuery.trim() !== "" ? (
//         <>
//           {filteredResults.categories.length > 0 && (
//             <div className="p-2 border-b border-gray-100">
//               <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 py-2">Categories</h4>
//               {filteredResults.categories.map((cat) => (
//                 <Link
//                   key={cat._id}
//                   href={`/store/${cat.name.toLowerCase()}`}
//                   onClick={closeSearch}
//                   className="flex items-center gap-3 px-3 py-2 hover:bg-[#E2FCFF] hover:text-[#0082A4] rounded-lg transition-colors"
//                 >
//                   <Tags size={16} className="text-gray-400 shrink-0" />
//                   <span className="text-sm font-medium">{cat.name}</span>
//                 </Link>
//               ))}
//             </div>
//           )}
//           {filteredResults.products.length > 0 && (
//             <div className="p-2">
//               <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 py-2">Products</h4>
//               {filteredResults.products.map((prod) => (
//                 <Link
//                   key={prod._id}
//                   href={`/product/${prod._id}`}
//                   onClick={closeSearch}
//                   className="flex items-center gap-4 px-3 py-2 hover:bg-[#E2FCFF] rounded-lg transition-colors group"
//                 >
//                   <div className="w-12 h-12 bg-gray-50 rounded-md overflow-hidden shrink-0 border border-gray-100">
//                     {prod.imageUrl ? (
//                       <img src={prod.imageUrl} alt={prod.productName} className="w-full h-full object-cover" />
//                     ) : (
//                       <Package className="w-full h-full p-2 text-gray-300" />
//                     )}
//                   </div>
//                   <div className="flex flex-col overflow-hidden">
//                     <span className="text-sm font-bold text-gray-900 truncate group-hover:text-[#0082A4] transition-colors">{prod.productName}</span>
//                     <span className="text-xs text-gray-500 font-mono mt-0.5">{prod.designCode}</span>
//                   </div>
//                 </Link>
//               ))}
//             </div>
//           )}
//           {filteredResults.categories.length === 0 && filteredResults.products.length === 0 && (
//             <div className="p-6 text-center text-sm text-gray-500">
//               No results found for <span className="font-bold text-gray-800">"{searchQuery}"</span>
//             </div>
//           )}
//         </>
//       ) : (
//         <div className="p-6 text-center text-sm text-gray-400">Type a product name, design code, or category...</div>
//       )}
//     </div>
//   );

//   return (
//     <>
//       <div id="google_translate_element" style={{ display: "none" }}></div>
//       <Script src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" strategy="afterInteractive" />

//       {/* --- MOBILE SIDEBAR DRAWER --- */}
//       <div className={`fixed inset-0 z-[100] transition-opacity duration-300 ${isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
//         <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>

//         <div className={`absolute top-0 left-0 h-full w-[80%] max-w-sm bg-white text-gray-900 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
//           <div className="flex items-center justify-between p-4 border-b border-gray-100">
//             <span className="font-playfair font-bold text-xl text-[#0082A4]">Menu</span>
//             <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
//               <X size={24} />
//             </button>
//           </div>

//           <div className="flex-1 overflow-y-auto py-4 px-4 space-y-1">
//             {mainNavLinks.map((link, i) => (
//               <Link key={i} href={link.href} className="block px-4 py-3 rounded-xl hover:bg-gray-50 font-medium text-gray-800">
//                 {link.name}
//               </Link>
//             ))}

//             {/* Mobile Jewelry Dropdown Accordion */}
//             <div className="px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-800">
//               <button onClick={() => setIsMobileJewelryOpen(!isMobileJewelryOpen)} className="flex items-center justify-between w-full font-medium">
//                 <span>Jewelry Design</span>
//                 <ChevronDown size={16} className={`transition-transform duration-200 ${isMobileJewelryOpen ? "rotate-180" : ""}`} />
//               </button>

//               {isMobileJewelryOpen && (
//                 <div className="mt-3 pl-4 space-y-2 border-l-2 border-gray-100">
//                   {jewelryDropdownLinks.map((link, idx) => (
//                     <Link key={idx} href={link.href} className="block py-2 text-sm text-gray-600 hover:text-[#0082A4]">
//                       {link.name}
//                     </Link>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {rightNavLinks.map((link, i) => (
//               <Link key={i} href={link.href} className="block px-4 py-3 rounded-xl hover:bg-gray-50 font-medium text-gray-800">
//                 {link.name}
//               </Link>
//             ))}

//             <div className="border-t border-gray-100 my-4"></div>

//             {/* Mobile Language Selector */}
//             <div className="px-4 py-3">
//               <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-3">Language</span>
//               <div className="grid grid-cols-2 gap-2">
//                 {LANGUAGES.map((lang) => (
//                   <button
//                     key={lang.code}
//                     onClick={() => handleLanguageChange(lang.code, lang.name)}
//                     className={`px-3 py-2 text-sm rounded-lg border text-left ${currentLang === lang.name ? "bg-[#E2FCFF] border-[#0082A4]/30 text-[#0082A4] font-bold" : "border-gray-200 text-gray-600"}`}
//                   >
//                     {lang.name}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>

//           <div className="p-4 border-t border-gray-100 bg-gray-50">
//             {isLoggedIn ? (
//               <button onClick={handleLogout} className="flex items-center justify-center w-full gap-2 bg-white text-red-600 border border-red-100 px-4 py-3 rounded-xl font-medium shadow-sm">
//                 <LogOut size={18} /> Logout
//               </button>
//             ) : (
//               <Link href="/account" className="flex items-center justify-center w-full gap-2 bg-[#0082A4] text-white px-4 py-3 rounded-xl font-medium shadow-sm">
//                 <User size={18} /> Login / Register
//               </Link>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* --- MAIN HEADER --- */}
//       <header className="w-full bg-[linear-gradient(0deg,#0082A4_0%,#00CEF3_100%)] text-white relative z-50 sticky top-0 shadow-md">

//         {/* TOP ROW: Logo, Search, Actions */}
//         <div className="max-w-[1400px] mx-auto px-4 lg:px-6 py-4 flex items-center justify-between lg:grid lg:grid-cols-3 gap-4">

//           {/* Mobile Menu Button */}
//           <button className="lg:hidden p-1 -ml-1 text-white hover:text-white/80" onClick={() => setIsMobileMenuOpen(true)}>
//             <Menu size={28} />
//           </button>

//           {/* 1. Logo */}
//           <div className="flex justify-center lg:justify-start flex-1 lg:flex-none">
//             <Link href="/" className="notranslate">
//               <Image
//                 src="/images/logo/PuramenteLogo.png"
//                 alt="Puramente International"
//                 width={220}
//                 height={50}
//                 className="h-7 sm:h-8 md:h-10 w-auto object-contain"
//                 priority
//               />
//             </Link>
//           </div>

//           {/* 2. Search Bar (Desktop) */}
//           <div className="hidden lg:flex justify-center w-full" ref={searchRefDesktop}>
//             <div className="relative w-full max-w-[450px]">
//               <input
//                 type="text"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 onFocus={handleSearchFocus}
//                 readOnly={!isLoggedIn}
//                 placeholder={isLoggedIn ? "Search designs, categories..." : "Log in to search..."}
//                 className={`w-full text-gray-800 rounded-2xl py-2 pl-6 pr-12 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-sm transition-colors ${isLoggedIn ? "bg-white placeholder-gray-400" : "bg-gray-100 placeholder-gray-500 cursor-pointer"}`}
//                 onClick={() => { if (!isLoggedIn) router.push("/account"); }}
//               />
//               <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#0082A4] transition-colors">
//                 <Search size={20} strokeWidth={1.5} />
//               </button>
//               {isSearchOpen && isLoggedIn && <SearchDropdown />}
//             </div>
//           </div>

//           {/* 3. Actions */}
//           <div className="flex items-center justify-end space-x-4 lg:space-x-6 shrink-0">
//             {/* Desktop Language */}
//             <div className="relative hidden lg:block notranslate">
//               <button
//                 onClick={() => setIsLangOpen(!isLangOpen)}
//                 className="flex items-center space-x-1.5 hover:text-white/80 transition-colors py-2"
//               >
//                 <Globe size={16} />
//                 <span className="text-sm font-medium">{currentLang}</span>
//                 <ChevronDown size={14} className={`transition-transform ${isLangOpen ? "rotate-180" : ""}`} />
//               </button>

//               {isLangOpen && (
//                 <div
//                   // Added max-h-56 (limits height) and overflow-y-auto (adds scrollbar)
//                   // Reduced top/bottom padding to py-1.5
//                   className="absolute right-0 top-full mt-2 w-36 bg-white rounded-xl shadow-xl py-1.5 z-50 border border-gray-100 max-h-56 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent"
//                 >
//                   {LANGUAGES.map((lang) => (
//                     <button
//                       key={lang.code}
//                       onClick={() => handleLanguageChange(lang.code, lang.name)}
//                       // Reduced padding from py-2.5 to py-1.5 for a tighter list
//                       className={`w-full text-left px-4 py-1.5 text-sm transition-colors ${currentLang === lang.name
//                           ? "bg-[#E2FCFF] text-[#0082A4] font-bold"
//                           : "text-gray-700 hover:bg-gray-50"
//                         }`}
//                     >
//                       {lang.name}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {isLoggedIn ? (
//               <button onClick={handleLogout} className="hidden lg:flex items-center space-x-2 bg-white text-black px-5 py-2.5 rounded-2xl text-sm font-medium hover:bg-red-50 hover:text-red-600 transition-colors shadow-sm notranslate">
//                 <LogOut size={18} strokeWidth={1.5} />
//                 <span>Logout</span>
//               </button>
//             ) : (
//               <Link href="/account" className="hidden lg:flex items-center space-x-2 bg-white text-black px-5 py-2.5 rounded-2xl text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm notranslate">
//                 <User size={18} strokeWidth={1.5} />
//                 <span>Account</span>
//               </Link>
//             )}

//             {!isLoggedIn && (
//               <Link href="/account" className="lg:hidden hover:text-white/80 transition-colors notranslate">
//                 <User size={24} strokeWidth={1.5} />
//               </Link>
//             )}

//             <Link href="/cart" className="flex items-center space-x-2 bg-white text-black px-3 py-2 lg:px-5 lg:py-2.5 rounded-xl lg:rounded-2xl text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm notranslate">
//               <ShoppingBag size={18} strokeWidth={1.5} />
//               <span className="hidden sm:inline">Cart ({cartCount})</span>
//               <span className="sm:hidden font-bold">{cartCount}</span>
//             </Link>
//           </div>
//         </div>

//         {/* MOBILE SEARCH ROW */}
//         <div className="lg:hidden px-4 pb-4 w-full" ref={searchRefMobile}>
//           <div className="relative w-full">
//             <input
//               type="text"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               onFocus={handleSearchFocus}
//               readOnly={!isLoggedIn}
//               placeholder={isLoggedIn ? "Search designs..." : "Log in to search..."}
//               className={`w-full text-gray-800 rounded-xl py-2.5 pl-5 pr-10 text-sm focus:outline-none shadow-sm transition-colors ${isLoggedIn ? "bg-white placeholder-gray-400" : "bg-white/90 placeholder-gray-500 cursor-pointer"}`}
//               onClick={() => { if (!isLoggedIn) router.push("/account"); }}
//             />
//             <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#0082A4]">
//               <Search size={18} strokeWidth={1.5} />
//             </button>
//             {isSearchOpen && isLoggedIn && <SearchDropdown />}
//           </div>
//         </div>

//         <div className="hidden lg:block border-t border-white/20 w-full"></div>

//         {/* BOTTOM ROW: Slider + Desktop Nav + Socials */}
//         <div className="hidden lg:block border-t border-white/20 w-full">
//           <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between">

//             {/* 1. AUTOMATIC ICON SLIDER (LEFT) */}
//             <div className="w-48 overflow-hidden relative group shrink-0">
//               <div className="flex items-center gap-8 animate-infinite-scroll w-max">
//                 {[...trustIcons, ...trustIcons].map((src, i) => (
//                   <img
//                     key={i}
//                     src={src}
//                     alt="Certification"
//                     className="h-12 w-auto opacity-90 hover:opacity-100 transition-opacity"
//                   />
//                 ))}
//               </div>
//               {/* <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[#00CEF3] to-transparent pointer-events-none"></div>
//               <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[#00CEF3] to-transparent pointer-events-none"></div> */}
//             </div>

//             {/* 2. NAVIGATION MENU (CENTERED) */}
//             <nav className="flex items-center justify-center space-x-8">
//               {mainNavLinks.map((link, index) => (
//                 <Link key={index} href={link.href} className={`text-sm tracking-wide hover:text-white/80 transition-colors ${link.isBold ? "font-bold" : "font-medium"}`}>
//                   {link.name}
//                 </Link>
//               ))}

//               <div className="relative group cursor-pointer">
//                 <div className="flex items-center space-x-1 text-sm font-medium tracking-wide hover:text-white/80 transition-colors py-2">
//                   <span>Jewelry Design</span>
//                   <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-200" />
//                 </div>
//                 <div className="absolute left-1/2 -translate-x-1/2 top-full mt-0 hidden group-hover:block w-48 bg-white rounded-lg shadow-xl py-2 z-50 overflow-hidden">
//                   {jewelryDropdownLinks.length > 0 ? (
//                     jewelryDropdownLinks.map((link, index) => (
//                       <Link key={index} href={link.href} className="block px-4 py-2.5 text-sm text-gray-800 hover:bg-[#E2FCFF] hover:text-[#0082A4] transition-colors">
//                         {link.name}
//                       </Link>
//                     ))
//                   ) : (
//                     <div className="px-4 py-2.5 text-sm text-gray-400">Loading...</div>
//                   )}
//                 </div>
//               </div>

//               {rightNavLinks.map((link, index) => (
//                 <Link key={index} href={link.href} className="text-sm font-medium tracking-wide hover:text-white/80 transition-colors">
//                   {link.name}
//                 </Link>
//               ))}
//             </nav>

//             {/* 3. SOCIAL LINKS (RIGHT - OPPOSITE SLIDER) */}
//             <div className="w-48 flex items-center justify-end space-x-4 shrink-0">
//               <Link href="https://facebook.com/puramenteinternational1" target="_blank" className="hover:text-white/70 transition-colors">
//                 <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" /></svg>
//               </Link>
//               <Link href="https://instagram.com/puramenteinternational" target="_blank" className="hover:text-white/70 transition-colors">
//                 <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.332 3.608 1.308.975.975 1.245 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.063 1.366-.333 2.633-1.308 3.608-.975.975-2.242 1.245-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.063-2.633-.333-3.608-1.308-.975-.975-1.245-2.242-1.308-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.332-2.633 1.308-3.608.975-.975 2.242-1.245 3.608-1.308 1.266-.058 1.646-.07 4.85-.07zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
//               </Link>
//               <Link href="https://www.linkedin.com/company/puramente-international" target="_blank" className="hover:text-white/70 transition-colors">
//                 <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
//               </Link>
//               <Link href="https://www.youtube.com/@PuramenteInternational" target="_blank" className="hover:text-white/70 transition-colors">
//                 <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
//               </Link>
//             </div>

//           </div>
//         </div>

//       </header>
//     </>
//   );
// }
