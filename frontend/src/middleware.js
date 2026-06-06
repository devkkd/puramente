import { NextResponse } from "next/server";

// ─── Supported locales ───────────────────────────────────────────────────────
export const LOCALES = ["en-in", "en-us", "en-gb", "en-ae", "en-de", "en-au", "en-ca", "en-sg", "en-fr", "en-it"];
export const DEFAULT_LOCALE = "en-in";

// Map ISO country code → locale slug
const COUNTRY_TO_LOCALE = {
  IN: "en-in",
  US: "en-us",
  GB: "en-gb",
  AE: "en-ae",
  DE: "en-de",
  AU: "en-au",
  CA: "en-ca",
  SG: "en-sg",
  FR: "en-fr",
  IT: "en-it",
  // Add more as needed
};

/**
 * Extract country code from request.
 * On self-hosted VPS: uses ip-api.com (free, no key needed, 45 req/min).
 * Falls back to DEFAULT_LOCALE on any error.
 */
async function getCountryCode(ip) {
  // Skip private/local IPs
  if (!ip || ip === "127.0.0.1" || ip === "::1" || ip.startsWith("192.168") || ip.startsWith("10.")) {
    return "IN"; // Default to India for local dev
  }

  try {
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=countryCode`, {
      next: { revalidate: 86400 }, // cache 24h per IP (Next.js fetch cache)
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.countryCode || null;
  } catch {
    return null;
  }
}

/**
 * Get the locale prefix already in the pathname, if any.
 * e.g. "/en-us/store/rings" → "en-us"
 */
function getLocaleFromPath(pathname) {
  const segment = pathname.split("/")[1]?.toLowerCase();
  return LOCALES.includes(segment) ? segment : null;
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // ── 1. Never touch admin, auth, API, or Next.js internals ──────────────────
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/adminlogin") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password") ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/_vercel/") ||
    pathname.includes(".") // static files: .png, .ico, .svg etc.
  ) {
    return NextResponse.next();
  }

  const pathnameLocale = getLocaleFromPath(pathname);

  // ── 2. Path already has a valid locale — just pass through ─────────────────
  if (pathnameLocale) {
    const response = NextResponse.next();
    // Keep the cookie fresh
    response.cookies.set("NEXT_LOCALE", pathnameLocale, {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: "/",
      sameSite: "lax",
    });
    return response;
  }

  // ── 3. No locale in path — detect from cookie first, then IP ───────────────
  let locale = request.cookies.get("NEXT_LOCALE")?.value;

  if (!locale || !LOCALES.includes(locale)) {
    // Get real IP — Nginx sets X-Real-IP, fallback to X-Forwarded-For
    const ip =
      request.headers.get("x-real-ip") ||
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "127.0.0.1";

    const countryCode = await getCountryCode(ip);
    locale = COUNTRY_TO_LOCALE[countryCode] || DEFAULT_LOCALE;
  }

  // ── 4. Redirect to locale-prefixed URL ─────────────────────────────────────
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;

  const response = NextResponse.redirect(url);
  response.cookies.set("NEXT_LOCALE", locale, {
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
    sameSite: "lax",
  });

  return response;
}

export const config = {
  // Run on all paths except static files and Next.js internals
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
