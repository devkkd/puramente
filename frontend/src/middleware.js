import { NextResponse } from "next/server";

// ─── Supported locales ────────────────────────────────────────────────────────
export const LOCALES = [
  "en-in",  // India (default)
  "en-gb",  // United Kingdom
  "en-fr",  // France
  "en-de",  // Germany
  "en-es",  // Spain
  "en-it",  // Italy
  "en-pt",  // Portugal
  "en-se",  // Sweden
  "en-dk",  // Denmark
  "en-no",  // Norway
  "en-fi",  // Finland
  "en-nl",  // Netherlands
];

export const DEFAULT_LOCALE = "en-in";

// ─── ISO country code → locale ────────────────────────────────────────────────
const COUNTRY_TO_LOCALE = {
  // India
  IN: "en-in",
  // Europe — each country gets its own slug for SEO
  GB: "en-gb", IE: "en-gb",
  FR: "en-fr",
  DE: "en-de", AT: "en-de", CH: "en-de",
  ES: "en-es",
  IT: "en-it",
  PT: "en-pt",
  SE: "en-se",
  DK: "en-dk",
  NO: "en-no",
  FI: "en-fi",
  NL: "en-nl", BE: "en-nl", LU: "en-nl",
};

function countryToLocale(code) {
  if (!code) return DEFAULT_LOCALE;
  return COUNTRY_TO_LOCALE[code.toUpperCase()] || DEFAULT_LOCALE;
}

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Only run on exact homepage
  if (pathname !== "/") {
    return NextResponse.next();
  }

  // ── Detect country ────────────────────────────────────────────────────────
  // Always detect from IP first (Nginx geoip2 header)
  // Cookie only used if user manually switched locale via LocaleSwitcher
  const manualLocale = request.cookies.get("NEXT_LOCALE_MANUAL")?.value;

  let locale;

  if (manualLocale && LOCALES.includes(manualLocale)) {
    // User manually selected a locale — respect it
    locale = manualLocale;
  } else {
    // Auto-detect from IP via Nginx geoip2
    const countryCode =
      request.headers.get("x-country-code") ||     // Nginx geoip2 (VPS)
      request.headers.get("cf-ipcountry") ||        // Cloudflare
      request.headers.get("x-vercel-ip-country");   // Vercel

    locale = countryToLocale(countryCode);
  }

  // ── Redirect / → /{locale} ───────────────────────────────────────────────
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}`;

  const response = NextResponse.redirect(url, { status: 302 });
  // Don't set auto cookie — only manual switches set NEXT_LOCALE_MANUAL
  return response;
}

export const config = {
  matcher: ["/"],
};
