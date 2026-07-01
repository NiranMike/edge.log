"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app error boundary]", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#07090d] flex items-center justify-center px-4">
      <div className="w-full max-w-[400px] text-center">

        <div className="w-14 h-14 rounded-full bg-red-400/10 border border-red-400/20 flex items-center justify-center mx-auto mb-6">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-red-400">
            <path d="M12 9v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M12 17h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M10.29 3.86l-8.18 14.18A1.5 1.5 0 0 0 3.42 20.5h17.16a1.5 1.5 0 0 0 1.3-2.46L13.71 3.86a1.5 1.5 0 0 0-2.6 0z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
        </div>

        <h1 className="font-mono font-medium text-[20px] text-white tracking-[-0.02em] mb-2">
          Something went wrong
        </h1>
        <p className="font-mono text-[12px] text-white/40 leading-relaxed mb-8">
          We couldn&apos;t load this page. Try again, or head back to your dashboard.
        </p>

        {error.digest && (
          <p className="font-mono text-[10px] text-white/18 mb-6">
            Error ref: {error.digest}
          </p>
        )}

        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full py-3 rounded-lg bg-emerald-400 text-[#07090d] font-mono text-[12px] font-medium hover:brightness-110 active:scale-[0.98] transition-all duration-150"
          >
            Try again
          </button>
          <Link
            href="/dashboard"
            className="w-full py-3 rounded-lg border border-white/[0.08] font-mono text-[12px] text-white/50 no-underline hover:text-white/80 hover:border-white/15 transition-all duration-150"
          >
            Go to dashboard
          </Link>
        </div>

      </div>
    </div>
  );
}
