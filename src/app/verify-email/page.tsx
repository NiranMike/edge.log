"use client";

import { useState, useTransition } from "react";
import { useSession }              from "next-auth/react";
import Link                        from "next/link";
import { resendVerificationAction } from "@/lib/actions/email-verify.action";

export default function VerifyEmailPage() {
  const { data: session }          = useSession();
  const [isPending, start]         = useTransition();
  const [sent, setSent]            = useState(false);
  const [error, setError]          = useState<string | null>(null);

  const email = session?.user?.email ?? "";

  function handleResend() {
    if (!email) return;
    setError(null);
    start(async () => {
      const result = await resendVerificationAction(email);
      if (result.ok) setSent(true);
      else setError(result.error ?? "Something went wrong.");
    });
  }

  return (
    <div className="min-h-screen bg-[#07090d] flex items-center justify-center px-4">
      <div className="w-full max-w-[400px]">

        <div className="w-14 h-14 rounded-full bg-teal-400/10 border border-teal-400/20 flex items-center justify-center mx-auto mb-6">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-teal-400">
            <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M2 8l10 6 10-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>

        <h1 className="font-mono font-medium text-[20px] text-white text-center tracking-[-0.02em] mb-2">
          Check your email
        </h1>
        <p className="font-mono text-[12px] text-white/40 text-center leading-relaxed mb-8">
          We sent a verification link to{" "}
          {email
            ? <span className="text-white/65">{email}</span>
            : "your email address"
          }.{" "}
          Click the link to activate your account.
        </p>

        {sent && (
          <div className="mb-5 px-4 py-3 rounded-lg bg-teal-400/[0.08] border border-teal-400/20">
            <p className="font-mono text-[12px] text-teal-400 text-center">
              ✓ Verification email resent.
            </p>
          </div>
        )}

        {error && (
          <div className="mb-5 px-4 py-3 rounded-lg bg-red-400/[0.06] border border-red-400/20">
            <p className="font-mono text-[12px] text-red-400 text-center">{error}</p>
          </div>
        )}

        {!sent && (
          <button
            type="button"
            onClick={handleResend}
            disabled={isPending || !email}
            className="w-full py-3 rounded-lg border border-white/[0.08] font-mono text-[12px] text-white/50 hover:text-white/80 hover:border-white/15 transition-all duration-150 disabled:opacity-40 disabled:cursor-wait mb-3"
          >
            {isPending ? "Sending…" : "Resend verification email"}
          </button>
        )}

        <p className="font-mono text-[11px] text-white/20 text-center">
          Wrong account?{" "}
          <Link
            href="/login"
            className="text-white/40 hover:text-white/60 transition-colors duration-150"
          >
            Sign in with a different account
          </Link>
        </p>

      </div>
    </div>
  );
}
