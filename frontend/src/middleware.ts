import { isTokenValid } from "@/lib/jwt";
import { isUserPublicRoute } from "@/lib/routes";
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("access_token")?.value;

  const isUserValid = accessToken ? isTokenValid(accessToken) : false;

  // ── Root "/" ──
  if (pathname === "/") {
    if (!isUserValid)
      return NextResponse.redirect(new URL("/signin", request.url));
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // ── User public routes (/signin, /register ...) ──
  if (isUserPublicRoute(pathname)) {
    if (isUserValid)
      return NextResponse.redirect(new URL("/dashboard", request.url));
    return NextResponse.next();
  }

  if (!isUserValid)
    return NextResponse.redirect(new URL("/signin", request.url));

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
