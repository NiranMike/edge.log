import NextAuth        from "next-auth";
import authConfig      from "./auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const path        = nextUrl.pathname;

  const isLoggedIn = !!req.auth;

  // Never intercept API routes, Next.js internals, or public assets
  if (path.startsWith("/api") || path.startsWith("/_next")) {
    return NextResponse.next();
  }

  // Public paths — always accessible regardless of auth state
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

  // Unauthenticated user trying to access a protected page → send to login
  if (!isLoggedIn && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
