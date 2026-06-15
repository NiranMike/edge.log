import type { Metadata }        from "next";
import Link                     from "next/link";
import { AuthShell }            from "@/components/auth/auth-shell";
import { ResetPasswordForm }    from "@/components/auth/reset-password-form";
import { passwordResetService } from "@/services/password-reset-service";

export const metadata: Metadata = {
  title:       "Reset Password · EdgeLog",
  description: "Choose a new password for your EdgeLog account.",
};

interface Props {
  params: Promise<{ token: string }>;
}

export default async function ResetPasswordPage({ params }: Props) {
  const { token } = await params;

  const result = await passwordResetService.verify(token);

  if (!result.ok) {
    return (
      <div className="min-h-screen bg-[#07090d] flex items-center justify-center px-4">
        <div className="w-full max-w-[400px]">

          <div className="w-14 h-14 rounded-full bg-red-400/10 border border-red-400/20 flex items-center justify-center mx-auto mb-6">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" className="text-red-400">
              <circle cx="11" cy="11" r="9" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M11 7v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="11" cy="15.5" r="0.75" fill="currentColor"/>
            </svg>
          </div>

          <h1 className="font-mono font-medium text-[20px] text-white text-center tracking-[-0.02em] mb-2">
            Link expired
          </h1>
          <p className="font-mono text-[12px] text-white/40 text-center leading-relaxed mb-8">
            {result.error}
          </p>

          <Link
            href="/forgot-password"
            className="block w-full py-3 rounded-lg border border-teal-400/25 bg-teal-400/[0.06] font-mono text-[12px] text-teal-400 text-center hover:bg-teal-400/[0.12] hover:border-teal-400/40 transition-all duration-150 mb-3"
          >
            Request a new link
          </Link>

          <Link
            href="/login"
            className="block w-full py-3 rounded-lg border border-white/[0.07] font-mono text-[12px] text-white/35 text-center hover:text-white/55 hover:border-white/12 transition-all duration-150"
          >
            Back to sign in
          </Link>

        </div>
      </div>
    );
  }

  return (
    <AuthShell
      title="Set a new password."
      description="Choose a strong password for your account."
    >
      <ResetPasswordForm token={token} />
    </AuthShell>
  );
}
