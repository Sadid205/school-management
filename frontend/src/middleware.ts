import { isTokenValid } from "@/lib/jwt";
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("access_token")?.value;
  const isUserValid = accessToken ? isTokenValid(accessToken) : false;

  // ── Public routes (/login, /register) - LOGIN PAGE এ যেতে দাও
  if (pathname === "/login" || pathname === "/register") {
    if (isUserValid)
      return NextResponse.redirect(new URL("/dashboard", request.url));
    return NextResponse.next(); // ✅ Login page access allow
  }

  // ── Root "/" ──
  if (pathname === "/") {
    if (isUserValid)
      return NextResponse.redirect(new URL("/dashboard", request.url));
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // ── Protected routes (/dashboard, /profile, etc) ──
  if (!isUserValid)
    return NextResponse.redirect(new URL("/login", request.url));

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
