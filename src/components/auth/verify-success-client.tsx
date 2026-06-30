"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function VerifySuccessClient() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login?verified=1");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#07090d] flex items-center justify-center px-4">
      <div className="w-full max-w-[400px] text-center">
        <div className="w-14 h-14 rounded-full bg-teal-400/10 border border-teal-400/20 flex items-center justify-center mx-auto mb-6">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-teal-400 animate-spin">
            <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.2"/>
            <path d="M10 2a8 8 0 018 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <p className="font-mono text-[12px] text-white/40">Verifying your email…</p>
      </div>
    </div>
  );
}
