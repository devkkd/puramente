"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { getCategories, getProducts } from "@/lib/api"; 
import ProductCard from "@/components/ProductCard"; 
import { ArrowUp } from "lucide-react"; 

function StoreContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const categorySlug = params.category; 

  const [categoryData, setCategoryData] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  
  // --- AUTH & PAGINATION STATE ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [visibleCount, setVisibleCount] = useState(25); // Start with 25 products

  // Check login status on mount (to avoid Next.js hydration mismatch)
  useEffect(() => {
    // Adjust this check based on how you store your auth state (token, user object, cookies, etc.)
    const token =  localStorage.getItem("userToken") || localStorage.getItem("adminToken") || localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const tabParam = searchParams.get("tab");
  let initialTab = "ALL COLLECTION";
  if (tabParam === "plain") initialTab = "PLAIN WITHOUT GEMSTONE";
  if (tabParam === "gemstone") initialTab = "ADORNED WITH GEMSTONE";
    
  const [activeTab, setActiveTab] = useState(initialTab);
  const [loading, setLoading] = useState(true);

  const TABS = [
    "ALL COLLECTION",
    "ADORNED WITH GEMSTONE",
    "PLAIN WITHOUT GEMSTONE",
  ];

  // Sync the active tab whenever the URL parameters change
  useEffect(() => {
    const currentTabParam = searchParams.get("tab");
    if (currentTabParam === "plain") {
      setActiveTab("PLAIN WITHOUT GEMSTONE");
    } else if (currentTabParam === "gemstone") {
      setActiveTab("ADORNED WITH GEMSTONE");
    } else {
      setActiveTab("ALL COLLECTION");
    }
    // Reset pagination when tab changes
    setVisibleCount(25);
  }, [searchParams]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, productsRes] = await Promise.all([
          getCategories(),
          getProducts(),
        ]);

        if (categoriesRes?.success && categoriesRes?.data) {
          const matchedCategory = categoriesRes.data.find(
            (c) => c.name.toLowerCase() === categorySlug.toLowerCase()
          );
          setCategoryData(matchedCategory || null);
        }

        if (productsRes?.success && productsRes?.data) {
          const categoryProducts = productsRes.data.filter(
            (product) => product.category?.name.toLowerCase() === categorySlug.toLowerCase()
          );
          setAllProducts(categoryProducts);
        }
      } catch (error) {
        console.error("Error fetching data for Store page:", error);
      } finally {
        setLoading(false);
      }
    };

    if (categorySlug) {
      fetchData();
    }
  }, [categorySlug]);

  // Filter products based on the currently selected tab
  const filteredProducts = allProducts.filter((product) => {
    if (activeTab === "ALL COLLECTION") return true;

    const option = product.option?.toLowerCase() || "";

    if (activeTab === "PLAIN WITHOUT GEMSTONE") {
      return option.includes("without");
    }

    if (activeTab === "ADORNED WITH GEMSTONE") {
      return !option.includes("without") && option.includes("with");
    }

    return true;
  });

  // --- PAGINATION LOGIC ---
  const displayedProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = filteredProducts.length > visibleCount;

  const handleLoadMore = () => {
    if (!isLoggedIn) {
      // Direct redirect without alert
      router.push("/account"); 
      return;
    }
    // If logged in, load 25 more
    setVisibleCount((prev) => prev + 25);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center font-mona text-gray-500">
        <div className="w-10 h-10 border-4 border-[#E2FCFF] border-t-[#0082A4] rounded-full animate-spin mb-4"></div>
        <span className="uppercase tracking-widest text-xs font-bold text-[#00a3c4]">Loading collection...</span>
      </div>
    );
  }

  const displayTitle = categoryData?.name || categorySlug;

  return (
    <main className="w-full bg-white font-mona pb-24">
      
      {/* --- 1. HEADER SECTION --- */}
      <div className="flex flex-col items-center text-center w-full pt-16 mb-10 px-4">
        <div className="flex items-center gap-4 text-[#00a3c4] text-xs md:text-sm font-normal tracking-widest uppercase mb-4">
          <span className="w-12 md:w-20 h-px bg-[#00a3c4]/50"></span>
          <span>{displayTitle}</span>
          <span className="w-12 md:w-20 h-px bg-[#00a3c4]/50"></span>
        </div>

        <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 capitalize">
          {displayTitle}
        </h1>

        <p className="text-sm font-normal text-gray-700 max-w-2xl leading-relaxed">
          Crafted to define moments. {displayTitle} that blend enduring design with exceptional craftsmanship.
        </p>
      </div>

      {/* --- 2. CATEGORY BANNER (Using storeBannerUrl) --- */}
      {categoryData?.storeBannerUrl && (
        <div className="w-full h-[30vh] md:h-[40vh] lg:h-[50vh] relative mb-16 bg-gray-100">
          <img 
            src={categoryData.storeBannerUrl} 
            alt={`${displayTitle} Banner`} 
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* --- 3. SUB-CATEGORIES / TABS --- */}
        <div className="w-full flex justify-center mb-10 border-b border-gray-200">
          <div className="flex items-center space-x-6 md:space-x-12 overflow-x-auto hide-scrollbar">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative pb-4 text-[13px] md:text-sm uppercase tracking-wide transition-colors whitespace-nowrap ${
                  activeTab === tab
                    ? "text-black font-bold"
                    : "text-gray-400 font-medium hover:text-gray-600"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-black"></span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* --- 4. PRODUCTS GRID --- */}
        {displayedProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-10">
              {displayedProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {/* --- 5. PAGINATION & BACK TO TOP --- */}
            <div className="mt-20 flex flex-col items-center justify-center gap-6 border-t border-gray-100 pt-12">
              
              {hasMore && (
                <button 
                  onClick={handleLoadMore}
                  className="bg-[#0082A4] text-white px-10 py-3.5 text-sm font-bold uppercase tracking-widest hover:bg-[#006a85] transition-colors shadow-sm rounded-sm"
                >
                  {isLoggedIn ? "Load More Products" : "Log In to View More"}
                </button>
              )}

              {/* Show Back To Top if user has loaded past the first 25 items or reached the end */}
              {(visibleCount > 25 || !hasMore) && displayedProducts.length > 10 && (
                <button 
                  onClick={scrollToTop}
                  className="flex items-center gap-2 text-gray-500 hover:text-[#0082A4] text-sm font-medium transition-colors uppercase tracking-widest"
                >
                  <ArrowUp size={16} />
                  Back to Top
                </button>
              )}

              {!hasMore && displayedProducts.length > 25 && (
                <p className="text-gray-400 text-xs uppercase tracking-widest mt-2">
                  You've viewed all products in this collection
                </p>
              )}

            </div>
          </>
        ) : (
          <div className="w-full py-16 flex flex-col items-center text-center text-gray-400">
            <span className="text-4xl mb-4">✨</span>
            <p className="text-lg font-medium text-gray-900 mb-2">No products found</p>
            <p className="text-sm">We couldn't find any items matching this filter.</p>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </main>
  );
}

export default function StorePage() {
  return (
    <Suspense fallback={
      <div className="w-full min-h-[60vh] flex items-center justify-center text-gray-500 font-mona">
        <div className="w-10 h-10 border-4 border-[#E2FCFF] border-t-[#0082A4] rounded-full animate-spin"></div>
      </div>
    }>
      <StoreContent />
    </Suspense>
  );
}