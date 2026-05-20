"use server";

import { redirect }  from "next/navigation";
import { AuthError } from "next-auth";
import bcrypt        from "bcryptjs";

import { db }                                  from "@/lib/db";
import {
  loginSchema,
  registerSchema,
  type LoginInput,
  type RegisterInput,
} from "@/lib/validations/auth";
import { signIn, signOut } from "#/auth";
import type { Result }     from "@/types";

// ─── Map AuthError → user string ──────────────────────────────────────────────

function mapAuthError(err: unknown): string {
  if (!(err instanceof AuthError)) return "Something went wrong. Please try again.";
  switch (err.type) {
    case "CredentialsSignin":     return "Invalid email or password.";
    case "OAuthAccountNotLinked": return "This email is already registered. Sign in with your password.";
    case "AccessDenied":          return "Access denied.";
    case "CallbackRouteError":    return "Authentication failed. Please try again.";
    default:                      return "Something went wrong. Please try again.";
  }
}

// ─── loginAction (credentials) ────────────────────────────────────────────────

export async function loginAction(data: LoginInput): Promise<Result> {
  const parsed = loginSchema.safeParse(data);
  if (!parsed.success) {
    return {
      ok:          false,
      error:       "Please fix the errors below.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    await signIn("credentials", {
      email:    parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    });
    return { ok: true, data: undefined };
  } catch (err) {
    return { ok: false, error: mapAuthError(err) };
  }
}

// ─── registerAction ───────────────────────────────────────────────────────────

export async function registerAction(
  data: RegisterInput,
): Promise<Result<{ userId: string }>> {
  const parsed = registerSchema.safeParse(data);
  if (!parsed.success) {
    return {
      ok:          false,
      error:       "Please fix the errors below.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const { name, email, password } = parsed.data;

  // Uniqueness check (cheap read before expensive hash)
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return {
      ok:          false,
      error:       "An account with this email already exists.",
      fieldErrors: { email: ["This email is already registered."] },
    };
  }

  // bcrypt cost 12 ≈ 250 ms — good balance of security vs latency
  const passwordHash = await bcrypt.hash(password, 12);

  const user = await db.user.create({ data: { name, email, passwordHash } });

  // Auto sign-in after registration
  try {
    await signIn("credentials", { email, password, redirect: false });
  } catch (err) {
    console.error("[registerAction] auto sign-in failed after registration:", err);
    // User was created but not signed in — client will refresh to /login
  }

  return { ok: true, data: { userId: user.id } };
}

// ─── googleSignInAction ───────────────────────────────────────────────────────
// Called from the "Continue with Google" button.
// signIn("google") from a Server Action triggers a redirect to Google's
// OAuth consent screen — it never "returns" normally.

export async function googleSignInAction(callbackUrl = "/dashboard"): Promise<void> {
  await signIn("google", { redirectTo: callbackUrl });
}

// ─── logoutAction ─────────────────────────────────────────────────────────────

export async function logoutAction(): Promise<void> {
  await signOut({ redirect: false });
  redirect("/login");
}
