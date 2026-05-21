"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { X, Check } from "lucide-react";

export default function AddToCartButton({ productId, variant = "card", metalType, customFinish }) {
  const { cart, addToCart, showToast } = useCart();
  const router = useRouter();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [modalMetal, setModalMetal] = useState("");
  const [modalFinish, setModalFinish] = useState("");

  const isAlreadyAdded = cart?.items?.some((item) => {
    const itemId = typeof item.product === 'object' ? item.product?._id : item.product;
    return itemId === productId;
  });

  const getStoredOptions = () => {
    if (typeof window !== "undefined") {
      const metal = localStorage.getItem("puramente_metal");
      const finish = localStorage.getItem("puramente_finish");
      return { metal, finish };
    }
    return { metal: null, finish: null };
  };

  const handleRequest = (e) => {
    e.preventDefault(); 
    e.stopPropagation();

    // NEW: Capture exact mouse click position
    const coords = { x: e.clientX, y: e.clientY };

    const userToken = typeof window !== "undefined" ? localStorage.getItem("userToken") : null;
    if (!userToken) {
      router.push("/account");
      return; 
    }

    if (variant === "detail") {
      if (!metalType || !customFinish) {
        showToast("Please select both a Metal Type and Custom Finish.", "error");
        return;
      }
      // Pass coordinates
      addToCart(productId, metalType, customFinish, coords);
    } else {
      const stored = getStoredOptions();
      if (stored.metal && stored.finish) {
        // Pass coordinates
        addToCart(productId, stored.metal, stored.finish, coords);
      } else {
        setIsModalOpen(true);
      }
    }
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    if (!modalMetal || !modalFinish) return; 
    
    // NEW: Capture exact mouse click position from the Modal Button
    const coords = { x: e.clientX, y: e.clientY };

    if (typeof window !== "undefined") {
      localStorage.setItem("puramente_metal", modalMetal);
      localStorage.setItem("puramente_finish", modalFinish);
    }
    // Pass coordinates
    addToCart(productId, modalMetal, modalFinish, coords);
    setIsModalOpen(false);
  };

  let buttonStyle = "";
  let buttonText = "";

  if (variant === "detail") {
    buttonStyle = isAlreadyAdded
      ? "w-full max-w-lg bg-[#006a86] text-white py-4 text-sm font-bold hover:bg-[#0082a4] transition-colors shadow-inner flex items-center justify-center gap-2"
      : "w-full max-w-lg bg-[#00a3c4] text-white py-4 text-sm font-bold hover:bg-[#0082a4] transition-colors shadow-md flex items-center justify-center gap-2";
    
    buttonText = isAlreadyAdded ? "Added - Request Another Variant" : "Add to Price Request";
  } else {
    buttonStyle = isAlreadyAdded
      ? "w-full py-3 px-4 border border-[#00a3c4]/50 bg-[#E6FDF9] text-[#0082a4] text-xs sm:text-sm font-medium hover:bg-[#00a3c4] hover:text-white transition-all duration-300 z-10 relative flex items-center justify-center gap-1.5"
      : "w-full py-3 px-4 border border-gray-100 bg-white text-[#00a3c4] text-xs sm:text-sm font-medium hover:bg-[#00a3c4] hover:text-white hover:border-[#00a3c4] transition-all duration-300 z-10 relative flex items-center justify-center gap-1.5";
    
    buttonText = isAlreadyAdded ? "Added (Add More)" : "Add to Price Request";
  }

  const isModalReady = modalMetal !== "" && modalFinish !== "";

  return (
    <>
      <button onClick={handleRequest} className={buttonStyle}>
        {isAlreadyAdded ? <Check size={16} strokeWidth={2.5} /> : (variant !== "detail" && "+ ")}
        {buttonText}
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden p-6 relative animate-in zoom-in-95 duration-200">
            
            <button 
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsModalOpen(false);
              }} 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 transition-colors"
            >
              <X size={20} />
            </button>

            <h3 className="font-playfair text-xl font-bold text-gray-900 mb-1">
              Select Specifications
            </h3>
            <p className="text-xs text-gray-500 mb-6">
              Choose variations for this piece. Your choices will remain saved for future items during this session.
            </p>

            <form onSubmit={handleModalSubmit} className="space-y-6">
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-gray-700 tracking-wider uppercase">Metal Type</span>
                <div className="flex gap-3">
                  {["925 SILVER", "BRASS"].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setModalMetal(opt); }}
                      className={`flex-1 py-2.5 text-xs font-semibold tracking-wide border transition-all rounded-md ${
                        modalMetal === opt 
                          ? "border-[#00a3c4] text-[#00a3c4] bg-[#00a3c4]/5" 
                          : "border-gray-200 text-gray-600 bg-white hover:border-gray-300"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-gray-700 tracking-wider uppercase">Custom Finish</span>
                <div className="flex gap-3">
                  {["GOLD PLATED", "SILVER PLATED"].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setModalFinish(opt); }}
                      className={`flex-1 py-2.5 text-xs font-semibold tracking-wide border transition-all rounded-md ${
                        modalFinish === opt 
                          ? "border-[#00a3c4] text-[#00a3c4] bg-[#00a3c4]/5" 
                          : "border-gray-200 text-gray-600 bg-white hover:border-gray-300"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={!isModalReady}
                className={`w-full py-3 text-sm font-bold transition-colors rounded-lg shadow-md mt-2 ${
                  isModalReady 
                    ? "bg-[#00a3c4] text-white hover:bg-[#0082a4]" 
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                {isModalReady ? "Confirm & Add to Request \u2192" : "Please Select Options"}
              </button>
            </form>

          </div>
        </div>
      )}
    </>
  );
}