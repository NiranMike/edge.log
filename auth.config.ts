// auth.config.ts  (project root — imported by middleware.ts, Edge-safe)
// ─────────────────────────────────────────────────────────────────────────────
// EDGE-SAFE: no Prisma, no bcrypt, no Node.js-only modules.
// We only declare provider shapes here so the Edge runtime knows about them.
// The real authorize / adapter logic lives in auth.ts (Node runtime only).
// ─────────────────────────────────────────────────────────────────────────────

import type { NextAuthConfig } from "next-auth";
import Credentials             from "next-auth/providers/credentials";
import Google                  from "next-auth/providers/google";

export default {
  providers: [
    Google,          // Edge-safe: no secrets needed here — v5 reads AUTH_GOOGLE_ID/SECRET automatically
    Credentials({
      credentials: {
        email:    { type: "email"    },
        password: { type: "password" },
      },
      // authorize omitted — handled in auth.ts (Node only)
      authorize: async () => null,
    }),
  ],

  pages: {
    signIn:  "/login",
    signOut: "/logout",
    error:   "/login",   // ?error= query param is handled in LoginForm
  },

  callbacks: {
    // Used by middleware to decide if a request is authenticated
    authorized({ auth }) {
      return !!auth?.user;
    },
  },
} satisfies NextAuthConfig;