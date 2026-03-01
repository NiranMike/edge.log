export { auth as proxy } from "#/auth"

// middleware.ts  (project root — runs on Edge runtime)
// Imports auth.config (Edge-safe, no Prisma/bcrypt) NOT auth.ts (Node-only).

import NextAuth         from "next-auth";
import authConfig       from "./auth.config";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const { auth } = NextAuth(authConfig);

const PROTECTED = ["/dashboard", "/settings", "/journal", "/profile"];
const AUTH_ONLY = ["/login", "/register", "/forgot-password", "/reset-password"];

export default auth(function middleware(
  req: NextRequest & { auth: { user?: unknown } | null }
) {
  const isAuthenticated = !!req.auth?.user;
  const path = req.nextUrl.pathname;

  if (isAuthenticated && AUTH_ONLY.some((r) => path.startsWith(r))) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  if (!isAuthenticated && PROTECTED.some((p) => path.startsWith(p))) {
    const url = new URL("/login", req.nextUrl);
    url.searchParams.set("callbackUrl", encodeURIComponent(path));
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};