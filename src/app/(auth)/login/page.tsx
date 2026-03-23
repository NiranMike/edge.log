import type { Metadata } from "next";
import { AuthShell }     from "@/components/auth/auth-shell";
import { LoginForm }     from "@/components/auth/login-form";

export const metadata: Metadata = {
  title:       "Sign In · EdgeLog",
  description: "Sign in to your EdgeLog trading journal.",
};

interface Props {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}

export default async function LoginPage({ searchParams }: Props) {
  const { callbackUrl, error } = await searchParams;

  const resolvedCallbackUrl = callbackUrl
    ? decodeURIComponent(callbackUrl)
    : "/dashboard";

  return (
    <AuthShell
      badge="Secure login"
      title="Welcome back."
      description="Sign in to your account to continue journaling."
    >
      <LoginForm callbackUrl={resolvedCallbackUrl} urlError={error} />
    </AuthShell>
  );
}