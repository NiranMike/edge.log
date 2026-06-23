
import NextAuth,       { Account, JWT, NextAuthConfig, Profile, Session, User, type DefaultSession } from "next-auth";
import Credentials                             from "next-auth/providers/credentials";
import Google                                  from "next-auth/providers/google";
import { PrismaAdapter }                       from "@auth/prisma-adapter";
import bcrypt                                  from "bcryptjs";

import { db }          from "@/lib/db";
import { loginSchema } from "@/lib/validations/auth";
import authConfig      from "./auth.config";

// ─── Type augmentation ────────────────────────────────────────────────────────
// In the latest next-auth v5 beta, JWT fields are extended inside "next-auth"
// directly — the "next-auth/jwt" subpath no longer exists as a module.

declare module "next-auth" {
  interface Session {
    user: {
      id:       string;
      picture?: string | null;
      // EMAIL_VERIFY: isEmailVerified: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    id?: string;
  }

  interface JWT {
    id:      string;
    picture?: string | null;
    // EMAIL_VERIFY: isEmailVerified: boolean;
  }
}

// ─── Google account helper ───────

async function findOrCreateGoogleUser(profile: {
  email:    string;
  name?:    string | null;
  image?:   string | null;
  googleId: string;
}): Promise<{ id: string; name: string | null; email: string; image: string | null }> {
  const { email, name, image, googleId } = profile;

  // 1. Existing Google account row?
  const existingAccount = await db.account.findUnique({
    where: {
      provider_providerAccountId: { provider: "google", providerAccountId: googleId },
    },
    include: { user: true },
  });
  if (existingAccount) return existingAccount.user;

  // 2. Existing credentials user with same email? → link account
  const existingUser = await db.user.findUnique({ where: { email } });
  if (existingUser) {
    // upsert avoids a unique-constraint race with PrismaAdapter's linkAccount
    await db.account.upsert({
      where:  { provider_providerAccountId: { provider: "google", providerAccountId: googleId } },
      create: { userId: existingUser.id, type: "oauth", provider: "google", providerAccountId: googleId },
      update: {},
    });
    if (!existingUser.image && image) {
      await db.user.update({ where: { id: existingUser.id }, data: { image } });
    }
    return existingUser;
  }

  // 3. Brand new user → create atomically
  return db.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: { email, name, image, emailVerified: new Date() },
    });
    // upsert avoids a unique-constraint race with PrismaAdapter's linkAccount
    await tx.account.upsert({
      where:  { provider_providerAccountId: { provider: "google", providerAccountId: googleId } },
      create: {
        userId:            user.id,
        type:              "oauth" as const,
        provider:          "google" as const,
        providerAccountId: googleId,
      },
      update: {},
    });
    return user;
  });
}

// ─── NextAuth config ───


export const authOptions:NextAuthConfig = {
  ...authConfig,

  adapter: PrismaAdapter(db),

  session: {
    strategy: "jwt",
    maxAge:   30 * 24 * 60 * 60,
  },

  providers: [
    Google({
      authorization: {
        params: { prompt: "select_account" },
      },
      allowDangerousEmailAccountLinking: true,
    }),

    Credentials({
      credentials: {
        email:    { type: "email"    },
        password: { type: "password" },
      },

      async authorize(rawCredentials) {
        const parsed = loginSchema.safeParse(rawCredentials);
        if (!parsed.success) throw new Error("Invalid credentials.");

        const { email, password } = parsed.data;
        const user = await db.user.findUnique({ where: { email } });

        if (!user || !user.passwordHash) throw new Error("Invalid credentials.");

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) throw new Error("Invalid credentials.");

        return { id: user.id, name: user.name, email: user.email, image: user.image };
      },
    }),
  ],

  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        if (!profile?.email) return false;
        await findOrCreateGoogleUser({
          email:    profile.email,
          name:     profile.name    ?? null,
          image:    (profile.picture as string | undefined) ?? null,
          googleId: account.providerAccountId,
        });
        return true;
      }

      return true;
    },

    async jwt({ token, user, account, profile }) {
      // Credentials first sign-in
      if (user?.id) {
        token.id      = user.id;
        token.picture = user.image ?? null;
        // EMAIL_VERIFY: const dbUser = await db.user.findUnique({ where: { id: user.id }, select: { emailVerified: true } });
        // EMAIL_VERIFY: token.isEmailVerified = !!dbUser?.emailVerified;
      }

      // Google first sign-in — look up by email since adapter may not populate user
      if (account?.provider === "google" && profile?.email && !token.id) {
        const dbUser = await db.user.findUnique({ where: { email: profile.email } });
        if (dbUser) {
          token.id      = dbUser.id;
          token.picture = dbUser.image ?? null;
          // EMAIL_VERIFY: token.isEmailVerified = !!dbUser.emailVerified;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (token.id && typeof token.id === "string") session.user.id = token.id;
      if (token.picture && typeof token.picture === "string") session.user.image = token.picture;
      // EMAIL_VERIFY: session.user.isEmailVerified = Boolean(token.isEmailVerified);
      return session;
    },
  },
}

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
