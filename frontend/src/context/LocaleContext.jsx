"use client";

import React, { createContext, useContext, useMemo } from "react";
import { LOCALES, DEFAULT_LOCALE } from "@/middleware";

// ─── Currency & label config per locale ──────────────────────────────────────
const LOCALE_CONFIG = {
  "en-in": { currency: "INR", symbol: "₹", label: "India", flag: "🇮🇳", countryCode: "IN" },
  "en-us": { currency: "USD", symbol: "$", label: "United States", flag: "🇺🇸", countryCode: "US" },
  "en-gb": { currency: "GBP", symbol: "£", label: "United Kingdom", flag: "🇬🇧", countryCode: "GB" },
  "en-ae": { currency: "AED", symbol: "د.إ", label: "UAE", flag: "🇦🇪", countryCode: "AE" },
  "en-de": { currency: "EUR", symbol: "€", label: "Germany", flag: "🇩🇪", countryCode: "DE" },
  "en-au": { currency: "AUD", symbol: "A$", label: "Australia", flag: "🇦🇺", countryCode: "AU" },
  "en-ca": { currency: "CAD", symbol: "C$", label: "Canada", flag: "🇨🇦", countryCode: "CA" },
  "en-sg": { currency: "SGD", symbol: "S$", label: "Singapore", flag: "🇸🇬", countryCode: "SG" },
  "en-fr": { currency: "EUR", symbol: "€", label: "France", flag: "🇫🇷", countryCode: "FR" },
  "en-it": { currency: "EUR", symbol: "€", label: "Italy", flag: "🇮🇹", countryCode: "IT" },
};

const LocaleContext = createContext({
  locale: DEFAULT_LOCALE,
  config: LOCALE_CONFIG[DEFAULT_LOCALE],
  allLocales: LOCALES,
  allConfigs: LOCALE_CONFIG,
});

export function LocaleProvider({ children, locale }) {
  const validLocale = LOCALES.includes(locale) ? locale : DEFAULT_LOCALE;

  const value = useMemo(() => ({
    locale: validLocale,
    config: LOCALE_CONFIG[validLocale] || LOCALE_CONFIG[DEFAULT_LOCALE],
    allLocales: LOCALES,
    allConfigs: LOCALE_CONFIG,
  }), [validLocale]);

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  );
}

export const useLocale = () => useContext(LocaleContext);
export { LOCALE_CONFIG };
