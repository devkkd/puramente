import { NextResponse } from "next/server";

// ─── Supported locales ────────────────────────────────────────────────────────
export const LOCALES = [
  "en-in", "en-us", "en-gb", "en-ae", "en-de",
  "en-es", "en-it", "en-pt", "en-se", "en-dk",
  "en-no", "en-fi", "en-nl", "en-au", "en-ca", "en-sg", "en-fr",
];
export const DEFAULT_LOCALE = "en-in";

// ISO 3166-1 alpha-2 → locale slug
const COUNTRY_TO_LOCALE = {
  IN: "en-in", US: "en-us", GB: "en-gb", IE: "en-gb",
  AE: "en-ae", SA: "en-ae", QA: "en-ae", KW: "en-ae", BH: "en-ae", OM: "en-ae",
  DE: "en-de", AT: "en-de", CH: "en-de",
  ES: "en-es", IT: "en-it", PT: "en-pt",
  SE: "en-se", DK: "en-dk", NO: "en-no", FI: "en-fi",
  NL: "en-nl", BE: "en-nl", LU: "en-nl",
  AU: "en-au", NZ: "en-au",
  CA: "en-ca", MX: "en-us",
  SG: "en-sg", MY: "en-sg", PH: "en-sg",
  FR: "en-fr",
};

function getLocaleFromPath(pathname) {
  const segment = pathname.split("/")[1]?.toLowerCase();
  return LOCALES.includes(segment) ? segment : null;
}

function countryToLocale(code) {
  if (!code) return DEFAULT_LOCALE;
  return COUNTRY_TO_LOCALE[code.toUpperCase()] || DEFAULT_LOCALE;
}

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Skip internals
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/adminlogin") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Already has locale
  const pathnameLocale = getLocaleFromPath(pathname);
  if (pathnameLocale) {
    const res = NextResponse.next();
    res.cookies.set("NEXT_LOCALE", pathnameLocale, {
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
      sameSite: "lax",
    });
    return res;
  }

  // Detect locale
  // Priority 1: saved cookie
  let locale = request.cookies.get("NEXT_LOCALE")?.value;

  if (!locale || !LOCALES.includes(locale)) {
    // Priority 2: Nginx geoip2 header (set via nginx module — zero latency, most reliable)
    // Priority 3: Cloudflare header (if behind CF)
    // Priority 4: Default
    const countryCode =
      request.headers.get("x-country-code") ||      // Nginx geoip2
      request.headers.get("cf-ipcountry") ||         // Cloudflare
      request.headers.get("x-vercel-ip-country");    // Vercel

    locale = countryToLocale(countryCode);
  }

  // Redirect
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;

  const res = NextResponse.redirect(url, { status: 302 });
  res.cookies.set("NEXT_LOCALE", locale, {
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
    sameSite: "lax",
  });

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
