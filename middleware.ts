// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value;
  const { pathname } = req.nextUrl;

  // Publicly accessible routes
  const PUBLIC_PATHS = [
    "/",
    "/login",
    "/signup",
    "http://localhost:8000/auth/send-otp",
    "http://localhost:8000/auth/verify-otp",
    "/favicon.ico",
    "/_next",   // Next.js internals
    "/public",  // static assets
  ];

  // Allow public paths without token
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // If trying to access private page without token → redirect
  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("next", pathname); // so user is redirected back
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Define which routes this applies to
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
