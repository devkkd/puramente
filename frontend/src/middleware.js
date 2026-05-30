import { NextResponse } from "next/server";

export function middleware(request) {
  const pathname = request.nextUrl.pathname;

  // Match:
  // /en-in
  // /en-in/in
  // /en-us
  // /ar-sa
  const localeRegex = /^\/[a-z]{2}-[a-z]{2}(\/[a-z]{2})?\/?$/i;

  if (localeRegex.test(pathname)) {
    return NextResponse.rewrite(
      new URL("/", request.url)
    );
  }

  return NextResponse.next();
}