"use client";

import React from "react";

export default function ProdOptions({ metal, finish, onMetalChange, onFinishChange }) {
  const metalOptions = ["925 SILVER", "BRASS"];
  const finishOptions = ["GOLD PLATED", "SILVER PLATED"];

  return (
    <div className="flex flex-col gap-5 w-full max-w-lg mb-10">
      
      {/* Metal Type */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
        <span className="text-sm font-normal text-gray-800 w-28 shrink-0">Metal Type</span>
        <div className="flex gap-4 w-full">
          {metalOptions.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => onMetalChange(opt)}
              className={`flex-1 py-3 text-xs md:text-sm font-semibold tracking-wide transition-all border ${
                metal === opt 
                  ? "border-[#00a3c4] text-[#00a3c4] bg-[#00a3c4]/5 animate-in fade-in duration-200" 
                  : "border-gray-200 text-gray-600 hover:border-gray-400 bg-white"
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
          {finishOptions.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => onFinishChange(opt)}
              className={`flex-1 py-3 text-xs md:text-sm font-semibold tracking-wide transition-all border ${
                finish === opt 
                  ? "border-[#00a3c4] text-[#00a3c4] bg-[#00a3c4]/5 animate-in fade-in duration-200" 
                  : "border-gray-200 text-gray-600 hover:border-gray-400 bg-white"
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