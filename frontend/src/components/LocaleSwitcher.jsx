"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useLocale, LOCALE_CONFIG } from "@/context/LocaleContext";
import { LOCALES } from "@/middleware";

export default function LocaleSwitcher() {
  const { locale, config } = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const switchLocale = (newLocale) => {
    // Replace current locale segment in path with new locale
    // e.g. /en-in/store/rings → /en-us/store/rings
    const segments = pathname.split("/");
    if (LOCALES.includes(segments[1])) {
      segments[1] = newLocale;
    } else {
      segments.splice(1, 0, newLocale);
    }
    const newPath = segments.join("/") || "/";

    // Set manual cookie so user's choice persists across visits
    document.cookie = `NEXT_LOCALE_MANUAL=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;

    router.push(newPath);
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-sm font-medium text-white hover:text-white/80 transition-colors px-2 py-1 rounded-md"
        aria-label="Switch country/region"
        aria-expanded={open}
      >
        <span className="text-base leading-none">{config.flag}</span>
        <svg
          className={`w-3 h-3 text-white/70 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-[200] overflow-hidden">
          <p className="px-3 py-1.5 text-[10px] font-semibold tracking-widest text-gray-400 uppercase">
            Select Region
          </p>
          {LOCALES.map((loc) => {
            const cfg = LOCALE_CONFIG[loc];
            const isActive = loc === locale;
            return (
              <button
                key={loc}
                onClick={() => switchLocale(loc)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors
                  ${isActive
                    ? "bg-[#f0fafe] text-[#00a3c4] font-semibold"
                    : "text-gray-700 hover:bg-gray-50"
                  }`}
              >
                <span className="text-base">{cfg.flag}</span>
                <span className="flex-1 text-left">{cfg.label}</span>
                <span className="text-xs text-gray-400">{cfg.currency}</span>
                {isActive && (
                  <svg className="w-3.5 h-3.5 text-[#00a3c4]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
