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
  // Priority 1: Cookie (user already visited — respect their locale)
  // Priority 2: Nginx geoip2 header (production VPS)
  // Priority 3: Cloudflare header
  // Priority 4: Default (India)

  let locale = request.cookies.get("NEXT_LOCALE")?.value;

  if (!locale || !LOCALES.includes(locale)) {
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
  response.cookies.set("NEXT_LOCALE", locale, {
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
    sameSite: "lax",
  });

  return response;
}

export const config = {
  matcher: ["/"],
};
