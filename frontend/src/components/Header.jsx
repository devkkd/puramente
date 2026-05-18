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
  
  // --- UI STATE ---
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileJewelryOpen, setIsMobileJewelryOpen] = useState(false);

  // --- TRANSLATION STATE ---
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("English");

  // --- SEARCH STATE ---
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [filteredResults, setFilteredResults] = useState({ categories: [], products: [] });
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchRefDesktop = useRef(null);
  const searchRefMobile = useRef(null);

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

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
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
    }
    setIsLoggedIn(false);
    setIsMobileMenuOpen(false);
    
    if (clearCart) {
      clearCart();
    } else {
      refreshCart();
    }

    router.push("/"); 
  };

  // Fetch Categories for the Dropdown
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

  // --- LIVE SEARCH LOGIC ---
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

  // Nav Data
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

  // Reusable Search Dropdown Component
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
                  href={`/product/${prod.slug}`}
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
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-4 px-4 space-y-1">
            {mainNavLinks.map((link, i) => (
              <Link key={i} href={link.href} className="block px-4 py-3 rounded-xl hover:bg-gray-50 font-medium text-gray-800">
                {link.name}
              </Link>
            ))}

            {/* Mobile Jewelry Dropdown Accordion */}
            <div className="px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-800">
              <button onClick={() => setIsMobileJewelryOpen(!isMobileJewelryOpen)} className="flex items-center justify-between w-full font-medium">
                <span>Jewelry Design</span>
                <ChevronDown size={16} className={`transition-transform duration-200 ${isMobileJewelryOpen ? "rotate-180" : ""}`} />
              </button>
              
              {isMobileJewelryOpen && (
                <div className="mt-3 pl-4 space-y-2 border-l-2 border-gray-100">
                  {jewelryDropdownLinks.map((link, idx) => (
                    <Link key={idx} href={link.href} className="block py-2 text-sm text-gray-600 hover:text-[#0082A4]">
                      {link.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {rightNavLinks.map((link, i) => (
              <Link key={i} href={link.href} className="block px-4 py-3 rounded-xl hover:bg-gray-50 font-medium text-gray-800">
                {link.name}
              </Link>
            ))}

            <div className="border-t border-gray-100 my-4"></div>

            {/* Mobile Language Selector */}
            <div className="px-4 py-3">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-3">Language</span>
              <div className="grid grid-cols-2 gap-2">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code, lang.name)}
                    className={`px-3 py-2 text-sm rounded-lg border text-left ${currentLang === lang.name ? "bg-[#E2FCFF] border-[#0082A4]/30 text-[#0082A4] font-bold" : "border-gray-200 text-gray-600"}`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-gray-100 bg-gray-50">
            {isLoggedIn ? (
              <button onClick={handleLogout} className="flex items-center justify-center w-full gap-2 bg-white text-red-600 border border-red-100 px-4 py-3 rounded-xl font-medium shadow-sm">
                <LogOut size={18} /> Logout
              </button>
            ) : (
              <Link href="/account" className="flex items-center justify-center w-full gap-2 bg-[#0082A4] text-white px-4 py-3 rounded-xl font-medium shadow-sm">
                <User size={18} /> Login / Register
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* --- MAIN HEADER --- */}
      <header className="w-full bg-[linear-gradient(0deg,#0082A4_0%,#00CEF3_100%)] text-white relative z-40">
        
        {/* TOP ROW: Logo, Search, Actions */}
        <div className="max-w-[1400px] mx-auto px-4 lg:px-6 py-4 flex items-center justify-between lg:grid lg:grid-cols-3 gap-4">
          
          {/* Mobile Menu Button (Left on Mobile) */}
          <button className="lg:hidden p-1 -ml-1 text-white hover:text-white/80" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu size={28} />
          </button>

          {/* 1. Logo (Center on Mobile, Left on Desktop) */}
          <div className="flex justify-center lg:justify-start flex-1 lg:flex-none">
            <Link href="/" className="notranslate"> 
              <Image 
                src="/images/logo/PuramenteLogo.png" 
                alt="Puramente International" 
                width={220} 
                height={50} 
                className="h-7 sm:h-8 md:h-10 w-auto object-contain"
                priority
              />
            </Link>
          </div>

          {/* 2. Search Bar (Hidden on Mobile, Center on Desktop) */}
          <div className="hidden lg:flex justify-center w-full" ref={searchRefDesktop}>
            <div className="relative w-full max-w-[450px]">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={handleSearchFocus}
                readOnly={!isLoggedIn}
                placeholder={isLoggedIn ? "Search designs, categories..." : "Log in to search..."}
                className={`w-full text-gray-800 rounded-2xl py-2 pl-6 pr-12 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-sm transition-colors ${
                  isLoggedIn ? "bg-white placeholder-gray-400" : "bg-gray-100 placeholder-gray-500 cursor-pointer"
                }`}
                onClick={() => { if (!isLoggedIn) router.push("/account"); }}
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#0082A4] transition-colors">
                <Search size={20} strokeWidth={1.5} />
              </button>
              {isSearchOpen && isLoggedIn && <SearchDropdown />}
            </div>
          </div>

          {/* 3. Actions (Right Side) */}
          <div className="flex items-center justify-end space-x-4 lg:space-x-6 shrink-0">
            
            {/* Desktop Language */}
            <div className="relative hidden lg:block notranslate">
              <button onClick={() => setIsLangOpen(!isLangOpen)} className="flex items-center space-x-1.5 hover:text-white/80 transition-colors py-2">
                <Globe size={16} />
                <span className="text-sm font-medium">{currentLang}</span>
                <ChevronDown size={14} className={`transition-transform ${isLangOpen ? "rotate-180" : ""}`} />
              </button>
              {isLangOpen && (
                <div className="absolute right-0 top-full mt-2 w-36 bg-white rounded-xl shadow-xl py-2 z-50 border border-gray-100 overflow-hidden">
                  {LANGUAGES.map((lang) => (
                    <button key={lang.code} onClick={() => handleLanguageChange(lang.code, lang.name)} className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${currentLang === lang.name ? "bg-[#E2FCFF] text-[#0082A4] font-bold" : "text-gray-700 hover:bg-gray-50"}`}>
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link href="/wishlist" className="hover:text-white/80 transition-colors hidden sm:block">
              <Heart size={24} strokeWidth={1.5} />
            </Link>

            {/* Desktop Auth */}
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

            {/* Mobile Auth Icon */}
            {!isLoggedIn && (
              <Link href="/account" className="lg:hidden hover:text-white/80 transition-colors notranslate">
                <User size={24} strokeWidth={1.5} />
              </Link>
            )}

            {/* Cart Button (Always visible) */}
            <Link href="/cart" className="flex items-center space-x-2 bg-white text-black px-3 py-2 lg:px-5 lg:py-2.5 rounded-xl lg:rounded-2xl text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm notranslate">
              <ShoppingBag size={18} strokeWidth={1.5} />
              <span className="hidden sm:inline">Cart ({cartCount})</span>
              <span className="sm:hidden font-bold">{cartCount}</span>
            </Link>
          </div>
        </div>

        {/* MOBILE SEARCH ROW (Shown below top row on small screens) */}
        <div className="lg:hidden px-4 pb-4 w-full" ref={searchRefMobile}>
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={handleSearchFocus}
              readOnly={!isLoggedIn}
              placeholder={isLoggedIn ? "Search designs, categories..." : "Log in to search..."}
              className={`w-full text-gray-800 rounded-xl py-2.5 pl-5 pr-10 text-sm focus:outline-none shadow-sm transition-colors ${
                isLoggedIn ? "bg-white placeholder-gray-400" : "bg-white/90 placeholder-gray-500 cursor-pointer"
              }`}
              onClick={() => { if (!isLoggedIn) router.push("/account"); }}
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#0082A4]">
              <Search size={18} strokeWidth={1.5} />
            </button>
            {isSearchOpen && isLoggedIn && <SearchDropdown />}
          </div>
        </div>

        <div className="hidden lg:block border-t border-white/20 w-full"></div>

        {/* Desktop Nav Bottom Row (Hidden on Mobile) */}
        <div className="hidden lg:block mx-auto px-6 py-3 overflow-visible">
          <nav className="flex items-center justify-center space-x-8 min-w-max relative z-40">
            {mainNavLinks.map((link, index) => (
              <Link key={index} href={link.href} className={`text-sm tracking-wide hover:text-white/80 transition-colors ${link.isBold ? "font-bold" : "font-medium"}`}>
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
                    <Link key={index} href={link.href} className="block px-4 py-2.5 text-sm text-gray-800 hover:bg-[#E2FCFF] hover:text-[#0082A4] transition-colors">
                      {link.name}
                    </Link>
                  ))
                ) : (
                  <div className="px-4 py-2.5 text-sm text-gray-400">Loading...</div>
                )}
              </div>
            </div>

            {rightNavLinks.map((link, index) => (
              <Link key={index} href={link.href} className="text-sm font-medium tracking-wide hover:text-white/80 transition-colors">
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

      </header>
    </>
  );
}