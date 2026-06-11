

import type { NextAuthConfig } from "next-auth";
import Credentials             from "next-auth/providers/credentials";
import Google                  from "next-auth/providers/google";

export default {
  trustHost: true,
  providers: [
    Google,    
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