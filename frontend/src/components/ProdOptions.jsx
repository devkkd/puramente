"use client";

import React, { useState, useEffect } from "react";

export default function ProdOptions({ onOptionsChange }) {
  const [metal, setMetal] = useState("925 SILVER");
  const [finish, setFinish] = useState("GOLD PLATED");

  // Load saved preferences from localStorage on mount
  useEffect(() => {
    const savedMetal = localStorage.getItem("puramente_metal") || "925 SILVER";
    const savedFinish = localStorage.getItem("puramente_finish") || "GOLD PLATED";
    setMetal(savedMetal);
    setFinish(savedFinish);
    // Send initial values to parent
    onOptionsChange({ metal: savedMetal, finish: savedFinish });
  }, []);

  // Handlers to update state, save to local storage, and notify parent
  const handleMetalChange = (val) => {
    setMetal(val);
    localStorage.setItem("puramente_metal", val);
    onOptionsChange({ metal: val, finish });
  };

  const handleFinishChange = (val) => {
    setFinish(val);
    localStorage.setItem("puramente_finish", val);
    onOptionsChange({ metal, finish: val });
  };

  return (
    <div className="flex flex-col gap-5 w-full max-w-lg mb-10">
      
      {/* Metal Type */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
        <span className="text-sm font-normal text-gray-800 w-28 shrink-0">Metal Type</span>
        <div className="flex gap-4 w-full">
          {["925 SILVER", "BRASS"].map((opt) => (
            <button
              key={opt}
              onClick={() => handleMetalChange(opt)}
              className={`flex-1 py-3 text-xs md:text-sm font-semibold tracking-wide transition-colors border ${
                metal === opt 
                  ? "border-[#00a3c4] text-[#00a3c4]" 
                  : "border-gray-200 text-gray-600 hover:border-gray-400"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Finish */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
        <span className="text-sm font-normal text-gray-800 w-28 shrink-0">Custom Finish</span>
        <div className="flex gap-4 w-full">
          {["GOLD PLATED", "SILVER PLATED"].map((opt) => (
            <button
              key={opt}
              onClick={() => handleFinishChange(opt)}
              className={`flex-1 py-3 text-xs md:text-sm font-semibold tracking-wide transition-colors border ${
                finish === opt 
                  ? "border-[#00a3c4] text-[#00a3c4]" 
                  : "border-gray-200 text-gray-600 hover:border-gray-400"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}