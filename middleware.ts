import { auth }         from "./auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const path        = nextUrl.pathname;

  const isLoggedIn      = !!req.auth;
  const emailVerified   = req.auth?.user?.isEmailVerified ?? false;

  // Never intercept API routes, Next.js internals, or public assets
  if (path.startsWith("/api") || path.startsWith("/_next")) {
    return NextResponse.next();
  }

  // Public paths — always accessible regardless of auth/verification state
  const isPublicPath =
    path === "/" ||
    path.startsWith("/login") ||
    path.startsWith("/register") ||
    path.startsWith("/verify-email") ||
    path.startsWith("/forgot-password") ||
    path.startsWith("/reset-password") ||
    path.startsWith("/pricing") ||
    path.startsWith("/terms") ||
    path.startsWith("/privacy");

  // Authenticated + unverified → force to pending page (except public paths)
  if (isLoggedIn && !emailVerified && !isPublicPath) {
    return NextResponse.redirect(new URL("/verify-email", nextUrl));
  }

  // Authenticated + verified + on the pending page → send to dashboard
  if (isLoggedIn && emailVerified && path === "/verify-email") {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
