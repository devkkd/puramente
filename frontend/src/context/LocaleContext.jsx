"use client";

import React, { createContext, useContext, useMemo } from "react";
import { LOCALES, DEFAULT_LOCALE } from "@/middleware";

// ─── Config per locale ────────────────────────────────────────────────────────
export const LOCALE_CONFIG = {
  "en-in": { currency: "INR", symbol: "₹",    label: "India",           flag: "🇮🇳", countryCode: "IN" },
  "en-us": { currency: "USD", symbol: "$",    label: "United States",   flag: "🇺🇸", countryCode: "US" },
  "en-gb": { currency: "GBP", symbol: "£",    label: "United Kingdom",  flag: "🇬🇧", countryCode: "GB" },
  "en-ae": { currency: "AED", symbol: "د.إ",  label: "UAE",             flag: "🇦🇪", countryCode: "AE" },
  "en-au": { currency: "AUD", symbol: "A$",   label: "Australia",       flag: "🇦🇺", countryCode: "AU" },
  "en-ca": { currency: "CAD", symbol: "C$",   label: "Canada",          flag: "🇨🇦", countryCode: "CA" },
  "en-sg": { currency: "SGD", symbol: "S$",   label: "Singapore",       flag: "🇸🇬", countryCode: "SG" },
  "en-fr": { currency: "EUR", symbol: "€",    label: "France",          flag: "🇫🇷", countryCode: "FR" },
  "en-de": { currency: "EUR", symbol: "€",    label: "Germany",         flag: "🇩🇪", countryCode: "DE" },
  "en-es": { currency: "EUR", symbol: "€",    label: "Spain",           flag: "🇪🇸", countryCode: "ES" },
  "en-it": { currency: "EUR", symbol: "€",    label: "Italy",           flag: "🇮🇹", countryCode: "IT" },
  "en-pt": { currency: "EUR", symbol: "€",    label: "Portugal",        flag: "🇵🇹", countryCode: "PT" },
  "en-se": { currency: "SEK", symbol: "kr",   label: "Sweden",          flag: "🇸🇪", countryCode: "SE" },
  "en-dk": { currency: "DKK", symbol: "kr",   label: "Denmark",         flag: "🇩🇰", countryCode: "DK" },
  "en-no": { currency: "NOK", symbol: "kr",   label: "Norway",          flag: "🇳🇴", countryCode: "NO" },
  "en-fi": { currency: "EUR", symbol: "€",    label: "Finland",         flag: "🇫🇮", countryCode: "FI" },
  "en-nl": { currency: "EUR", symbol: "€",    label: "Netherlands",     flag: "🇳🇱", countryCode: "NL" },
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
