"use client";

import { useState } from "react";
import Link from "next/link";
import { cx, ds, palette } from "@/style";
import { useRouter } from "next/navigation";


const TRUST_BADGES = [
  { icon: "◈", label: "No credit card"   },
  { icon: "◈", label: "Free forever plan"},
  { icon: "◈", label: "Cancel anytime"   },
];

export function CtaSection() {
  const router   = useRouter();
  const [email,  setEmail]  = useState("");
  const [error,  setError]  = useState("");
  const [done,   setDone]   = useState(false);

  function validateEmail(val: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Enter your email to get started.");
      return;
    }
    if (!validateEmail(email)) {
      setError("That doesn't look like a valid email.");
      return;
    }

    router.push(`/register?email=${encodeURIComponent(email.trim().toLowerCase())}`);
  }

  return (
    <section
      id="cta"
      className={cx("relative overflow-hidden", ds.sectionY, ds.pageX)}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.12]" style={ds.dotGrid} />

        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full"
          style={{ background: `radial-gradient(ellipse, ${palette.primaryGlow} 0%, transparent 65%)` }}
        />

        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />

        <div className="absolute top-8 left-8 w-10 h-10 border-l border-t border-emerald-400/15" />
        <div className="absolute top-8 right-8 w-10 h-10 border-r border-t border-emerald-400/15" />
        <div className="absolute bottom-8 left-8 w-10 h-10 border-l border-b border-white/[0.05]" />
        <div className="absolute bottom-8 right-8 w-10 h-10 border-r border-b border-white/[0.05]" />
      </div>

      <div className={cx(ds.container, "relative flex flex-col items-center text-center")}>

        <div className="inline-flex items-center gap-2 mb-6 px-3.5 py-1.5 border border-emerald-400/18 bg-emerald-400/[0.06]">
          <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-emerald-400/70">
            Start for free
          </span>
        </div>

        <h2
          className="font-display font-extrabold text-white tracking-tight leading-[1.06] mb-4"
          style={{
            fontSize:   "clamp(32px, 5vw, 58px)",
            textShadow: `0 0 80px ${palette.primaryGlow}`,
          }}
        >
          Your edge is in the data.
          <br />
          <span className="text-white/25">Start finding it today.</span>
        </h2>

        <p
          className={cx(ds.body, "max-w-lg mb-12")}
          style={{ fontSize: "clamp(13px, 1.5vw, 15px)" }}
        >
          Stop guessing. Start knowing exactly where your edge lives.
          Takes 30 seconds to log your first trade.
        </p>

        {!done ? (
          <div className="w-full max-w-md space-y-3">
            <form
              onSubmit={handleSubmit}
              noValidate
              className="flex flex-col sm:flex-row gap-2.5"
            >
              <div className="relative flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  placeholder="your@email.com"
                  autoComplete="email"
                  className={cx(
                    ds.input,
                    "w-full px-4 py-3.5 text-[13px]",
                    error
                      ? "border-red-500/45 focus:border-red-400/60"
                      : "focus:border-emerald-400/50",
                  )}
                />
              </div>

              <button
                type="submit"
                className={cx(
                  "group relative overflow-hidden shrink-0",
                  ds.btnPrimary,
                  "px-6 py-3.5 text-[11px] tracking-[0.16em]",
                  "sm:w-auto w-full",
                )}
                style={ds.clip12}
              >
                <span className={ds.btnShimmer} />
                <span className="relative z-10 whitespace-nowrap">
                  Start Free
                </span>
              </button>
            </form>

            {error && (
              <p className="font-mono text-[10px] text-red-400/80 flex items-center justify-center gap-1.5">
                <span className="text-[8px]">✕</span> {error}
              </p>
            )}

            <div className="flex items-center justify-center flex-wrap gap-x-5 gap-y-2 pt-1">
              {TRUST_BADGES.map(({ icon, label }) => (
                <span
                  key={label}
                  className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/22 flex items-center gap-1.5"
                >
                  <span className="text-emerald-400/40 text-[8px]">{icon}</span>
                  {label}
                </span>
              ))}
            </div>

            <p className="font-mono text-[10px] text-white/18 pt-1">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-emerald-400/60 hover:text-emerald-400 transition-colors duration-150 underline underline-offset-2"
              >
                Sign in
              </Link>
            </p>
          </div>
        ) : (
          <div
            className="w-full max-w-md p-8 border border-emerald-400/20 bg-emerald-400/[0.05] text-center space-y-3"
            style={ds.clip16}
          >
            <div className="w-10 h-10 mx-auto border border-emerald-400/30 bg-emerald-400/10 flex items-center justify-center"
              style={ds.clip12}>
              <span className="text-emerald-400 text-lg">✓</span>
            </div>
            <p className="font-display font-bold text-white text-[18px]">You're in.</p>
            <p className={cx(ds.body, "text-[12px]")}>Taking you to your account…</p>
          </div>
        )}

        <div className={cx("w-full max-w-lg mt-14 pt-8 flex items-center justify-center gap-8 flex-wrap", ds.divider)}>
          {[
            { value: "Free",  label: "to start" },
            { value: "30s",   label: "to log a trade" },
            { value: "$12",   label: "/ mo for Pro" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p
                className="font-display font-black text-white leading-none mb-1"
                style={{
                  fontSize:   "clamp(20px, 2.5vw, 26px)",
                  textShadow: "0 0 20px rgba(16,185,129,0.25)",
                }}
              >
                {value}
              </p>
              <p className="font-mono text-[9px] uppercase tracking-widest text-white/25">
                {label}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}