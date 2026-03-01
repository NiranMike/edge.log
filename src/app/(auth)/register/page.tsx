// app/(auth)/register/page.tsx
import type { Metadata } from "next";
import { AuthShell }     from "@/components/auth/auth-shell";
import { RegisterForm }  from "@/components/auth/register-form";


export const metadata: Metadata = {
  title:       "Create Account · EdgeLog",
  description: "Create your free EdgeLog trading journal account.",
};

interface Props {
  searchParams: { email?: string };
}

export default async function RegisterPage({ searchParams }: Props) {
  // ?email= comes from the landing page CTA — pre-fills the email field
  const { email } = await searchParams;

  const defaultEmail = email
    ? decodeURIComponent(email)
    : undefined;

  return (
    <AuthShell
      badge="Free · No credit card required"
      title="Start journaling."
      description="Create your account and start finding your edge in under 60 seconds."
    >
      <RegisterForm defaultEmail={defaultEmail} />
    </AuthShell>
  );
}