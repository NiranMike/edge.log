import type { Metadata } from "next";
import Link from "next/link";
import { cx, ds, palette } from "@/style";
import { LandingNav }            from "@/components/landing-page/landing-nav";
import { LandingFooter }         from "@/components/landing-page/landing-footer";
import { PricingFAQ }            from "@/components/billing/pricing-faq";
import { PricingCheckoutButton } from "@/components/billing/pricing-checkout-button";

export const metadata: Metadata = {
  title: "Pricing — EDGE.LOG",
  description:
    "Free forever for core trade journaling. Upgrade to Pro for the full analytics suite — equity curve, session breakdown, pair analysis, and more. $19/month, cancel anytime.",
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const FREE_FEATURES = [
  "Unlimited trade entries",
  "P&L auto-calculation",
  "R-multiple & expectancy",
  "Win rate tracking",
  "Trade notes & tagging",
  "Session & strategy labels",
  "CSV import",
];

const PRO_FEATURES = [
  "Everything in Free",
  "Full analytics dashboard",
  "Equity curve & drawdown",
  "Pair-by-pair breakdown",
  "Session performance analysis",
  "Weekday performance heatmap",
  "R distribution chart",
  "Direction bias analysis",
];

const COMPARISON: {
  category: string;
  rows: { label: string; free: boolean; pro: boolean }[];
}[] = [
  {
    category: "Trade Logging",
    rows: [
      { label: "Unlimited trade entries",      free: true,  pro: true  },
      { label: "P&L auto-calculation",         free: true,  pro: true  },
      { label: "R-multiple tracking",          free: true,  pro: true  },
      { label: "Win rate & expectancy",        free: true,  pro: true  },
      { label: "Trade notes & tagging",        free: true,  pro: true  },
      { label: "Session & strategy labels",    free: true,  pro: true  },
      { label: "CSV import",                   free: true,  pro: true  },
      { label: "Calendar P&L view",            free: true,  pro: true  },
    ],
  },
  {
    category: "Analytics Suite",
    rows: [
      { label: "Full analytics dashboard",     free: false, pro: true  },
      { label: "Equity curve & drawdown",      free: false, pro: true  },
      { label: "Pair-by-pair breakdown",       free: false, pro: true  },
      { label: "Session performance analysis", free: false, pro: true  },
      { label: "Weekday heatmap",              free: false, pro: true  },
      { label: "R distribution chart",         free: false, pro: true  },
      { label: "Direction bias analysis",      free: false, pro: true  },
    ],
  },
  {
    category: "Account",
    rows: [
      { label: "Early access to new features", free: true,  pro: true  },
      { label: "Priority support",             free: false, pro: true  },
    ],
  },
];

// ─── Sub-components ────────────────────────────────────────────────────────────

function CheckIcon({ on, teal }: { on: boolean; teal?: boolean }) {
  if (on) {
    const color = teal ? "#2dd4bf" : "#10b981";
    const bg    = teal ? "rgba(45,212,191,0.1)" : "rgba(16,185,129,0.1)";
    return (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="shrink-0">
        <circle cx="9" cy="9" r="8" fill={bg} />
        <path d="M5.5 9l2.5 2.5 4.5-5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="shrink-0 opacity-[0.18]">
      <path d="M5.5 5.5l7 7M12.5 5.5l-7 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function FeatureRow({ label, free, pro, shaded }: { label: string; free: boolean; pro: boolean; shaded: boolean }) {
  return (
    <div className={cx(
      "grid items-center gap-2 px-4 py-3.5 border-b border-white/[0.04]",
      "grid-cols-[1fr_52px_52px] sm:grid-cols-[1fr_80px_80px]",
      shaded ? "bg-white/[0.018]" : "bg-transparent",
    )}>
      <span className="font-mono text-[11px] sm:text-[12px] text-white/40">{label}</span>
      <div className="flex justify-center"><CheckIcon on={free} /></div>
      <div className="flex justify-center"><CheckIcon on={pro} teal /></div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PricingPage() {
  return (
    <div className="bg-[#07090d] text-white min-h-screen overflow-x-hidden selection:bg-emerald-400/20 selection:text-emerald-300">
      <LandingNav />

      {/* ─── Scan line animation ─────────────────────────────────────────── */}
      <style>{`
        @keyframes pricingScan {
          0%, 100% { opacity: 0; left: -60%; }
          40%, 60% { opacity: 1; }
          100%      { opacity: 0; left: 120%; }
        }
        .pro-scan::after {
          content: '';
          position: absolute;
          top: 38%;
          left: -60%;
          width: 55%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(45,212,191,0.45), transparent);
          animation: pricingScan 7s ease-in-out infinite;
          pointer-events: none;
          z-index: 5;
        }
      `}</style>

      {/* ─── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative pt-20 sm:pt-28 pb-4 overflow-hidden">
        {/* Backgrounds */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 opacity-[0.1]" style={ds.dotGrid} />
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px]"
            style={{ background: `radial-gradient(ellipse at 50% 0%, ${palette.primaryGlow} 0%, transparent 60%)`, opacity: 0.07 }}
          />
        </div>

        <div className={cx(ds.container, ds.pageX, "relative text-center")}>
          {/* Label */}
          <div className="inline-flex items-center gap-3 mb-7">
            <div className="w-6 h-px bg-emerald-400/50" />
            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-emerald-400/80">Pricing</span>
            <div className="w-6 h-px bg-emerald-400/50" />
          </div>

          <h1
            className="font-display font-extrabold text-white leading-[1.04] tracking-tight mb-6"
            style={{ fontSize: "clamp(44px, 8vw, 96px)" }}
          >
            Simple pricing.<br />
            <span className="text-white/18">No surprises.</span>
          </h1>

          <p className="font-mono text-[13px] sm:text-[14px] text-white/35 max-w-sm mx-auto leading-relaxed mb-3">
            Start free. Upgrade when you&apos;re ready to see the full picture.
          </p>
        </div>

        {/* Separator */}
        <div className="relative mt-14 mb-0 mx-auto max-w-3xl px-5 sm:px-8 lg:px-14">
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/[0.07]" />
            <span className="text-white/10 text-[8px]">◈</span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/[0.07]" />
          </div>
        </div>
      </section>

      {/* ─── Pricing Cards ────────────────────────────────────────────────── */}
      <section className={cx(ds.pageX, "pt-10 pb-0")}>
        <div className={cx(ds.container)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">

            {/* Free */}
            <div
              className="relative flex flex-col bg-[#05080a] p-8 sm:p-10"
              style={{
                ...ds.clip16,
                border: "1px solid rgba(255,255,255,0.065)",
              }}
            >
              <span className="absolute top-0 left-0 w-4 h-4 border-t border-l border-white/[0.07]" />
              <span className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-white/[0.07]" />

              <header className="mb-8">
                <p className="font-mono text-[9px] uppercase tracking-[0.26em] text-white/25 mb-5">Free</p>
                <div className="flex items-end gap-2 mb-2">
                  <span
                    className="font-display font-black text-white leading-none"
                    style={{ fontSize: "clamp(48px, 5.5vw, 60px)" }}
                  >
                    $0
                  </span>
                  <span className="font-mono text-[12px] text-white/22 mb-2">/ forever</span>
                </div>
                <p className="font-mono text-[11px] text-white/22 leading-snug">
                  Everything you need to start journaling your trades.
                </p>
              </header>

              <ul className="flex-1 space-y-3.5 mb-9">
                {FREE_FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-3">
                    <CheckIcon on />
                    <span className="font-mono text-[12px] text-white/50">{f}</span>
                  </li>
                ))}
                {["Full analytics dashboard", "Equity curve & more"].map((f) => (
                  <li key={f} className="flex items-center gap-3 opacity-40">
                    <CheckIcon on={false} />
                    <span className="font-mono text-[12px] text-white/30 line-through decoration-white/15">{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/register"
                className={cx(
                  "block text-center",
                  ds.btnSecondary,
                  "px-6 py-3.5 text-[11px] tracking-[0.16em]",
                )}
                style={ds.clip12}
              >
                Get started free
              </Link>
            </div>

            {/* Pro */}
            <div
              className="pro-scan relative flex flex-col p-8 sm:p-10 overflow-hidden"
              style={{
                ...ds.clip16,
                background: "linear-gradient(155deg, #091716 0%, #060d0e 60%, #050b0d 100%)",
                border: "1px solid rgba(45,212,191,0.22)",
                boxShadow: "0 0 120px rgba(45,212,191,0.055), inset 0 1px 0 rgba(45,212,191,0.1)",
              }}
            >
              {/* Corner cuts */}
              <span className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-teal-400/40" />
              <span className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-teal-400/40" />
              <span className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-teal-400/15" />
              <span className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-teal-400/15" />

              {/* Top radial glow */}
              <div
                className="pointer-events-none absolute top-0 inset-x-0 h-56 opacity-25"
                style={{ background: "radial-gradient(ellipse 80% 70% at 50% -10%, rgba(45,212,191,0.3), transparent)" }}
              />
              {/* Side glow */}
              <div
                className="pointer-events-none absolute -right-16 top-1/4 w-40 h-56 opacity-20"
                style={{ background: "radial-gradient(ellipse, rgba(45,212,191,0.4), transparent 70%)" }}
              />

              {/* Badge */}
              <div className="absolute top-5 right-5 z-10">
                <span
                  className="font-mono text-[8px] uppercase tracking-[0.22em] px-2.5 py-1 text-teal-400"
                  style={{
                    background: "rgba(45,212,191,0.07)",
                    border: "1px solid rgba(45,212,191,0.2)",
                  }}
                >
                  Most popular
                </span>
              </div>

              <header className="relative mb-8">
                <p className="font-mono text-[9px] uppercase tracking-[0.26em] text-teal-400/65 mb-5">Pro</p>
                <div className="flex items-end gap-2 mb-2">
                  <span
                    className="font-display font-black text-white leading-none"
                    style={{
                      fontSize: "clamp(48px, 5.5vw, 60px)",
                      textShadow: "0 0 50px rgba(45,212,191,0.3)",
                    }}
                  >
                    $19
                  </span>
                  <span className="font-mono text-[12px] text-white/25 mb-2">/ month</span>
                </div>
                <p className="font-mono text-[11px] text-white/22 leading-snug">
                  Billed monthly · Cancel anytime
                </p>
              </header>

              <ul className="relative flex-1 space-y-3.5 mb-9">
                {PRO_FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-3">
                    <CheckIcon on teal />
                    <span className={cx(
                      "font-mono text-[12px]",
                      f === "Everything in Free" ? "text-teal-400/60" : "text-white/60",
                    )}>
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="relative space-y-3">
                <PricingCheckoutButton />
                <p className="font-mono text-[10px] text-white/18 text-center">
                  Instant access · Secure checkout via Lemon Squeezy
                </p>
              </div>
            </div>
          </div>

          {/* Trust row */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mt-8 max-w-3xl mx-auto">
            {[
              { icon: "◈", text: "No credit card for free plan" },
              { icon: "◈", text: "Cancel Pro anytime"           },
              { icon: "◈", text: "Instant Pro access"           },
            ].map(({ icon, text }) => (
              <span key={text} className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-white/18">
                <span className="text-emerald-400/30 text-[7px]">{icon}</span>
                {text}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Analytics preview callout ────────────────────────────────────── */}
      <section className={cx(ds.pageX, "pt-20 sm:pt-28")}>
        <div className={cx(ds.container)}>
          <div
            className="max-w-3xl mx-auto px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-4"
            style={{
              background: "rgba(45,212,191,0.03)",
              border: "1px solid rgba(45,212,191,0.1)",
              ...ds.clip16,
            }}
          >
            <div
              className="shrink-0 w-9 h-9 flex items-center justify-center"
              style={{ background: "rgba(45,212,191,0.08)", border: "1px solid rgba(45,212,191,0.15)", ...ds.clip12 }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 10.5l3-4 2.5 2L11 2.5" stroke="#2dd4bf" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-mono text-[12px] text-teal-400/80 mb-0.5 font-medium">Analytics run on your existing history</p>
              <p className="font-mono text-[11px] text-white/30 leading-relaxed">
                Upgrade at any time — the full analytics suite instantly processes every trade you&apos;ve already logged.
              </p>
            </div>
            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-teal-400/30 shrink-0 hidden sm:block">Instant</span>
          </div>
        </div>
      </section>

      {/* ─── Comparison Table ─────────────────────────────────────────────── */}
      <section className={cx(ds.pageX, "pt-20 sm:pt-28 pb-0")}>
        <div className={cx(ds.container)}>
          <div className="max-w-3xl mx-auto">

            {/* Section label */}
            <div className={cx(ds.sectionLabel, "mb-3")}>
              <div className={ds.sectionLabelLine} />
              <span className={ds.label}>Full comparison</span>
            </div>
            <h2
              className={cx(ds.heading, "mb-12")}
              style={{ fontSize: "clamp(30px, 4.5vw, 52px)" }}
            >
              Everything,<br />
              <span className="text-white/20">compared.</span>
            </h2>

            {/* Column headers */}
            <div className="grid gap-2 mb-2 px-4 grid-cols-[1fr_52px_52px] sm:grid-cols-[1fr_80px_80px]">
              <span />
              <div className="flex flex-col items-center gap-0.5">
                <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/25">Free</span>
                <span className="font-mono text-[11px] font-bold text-white/30">$0</span>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-teal-400/60">Pro</span>
                <span className="font-mono text-[11px] font-bold text-teal-400">$19</span>
              </div>
            </div>

            {/* Table body */}
            <div
              className="border border-white/[0.06] overflow-hidden"
              style={ds.clip16}
            >
              {COMPARISON.map(({ category, rows }) => (
                <div key={category}>
                  {/* Category header */}
                  <div className="flex items-center gap-3 px-4 py-3 bg-[#0a0f12] border-b border-white/[0.04]">
                    <div className="w-1 h-3 bg-emerald-400/40 rounded-full shrink-0" />
                    <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-emerald-400/55">
                      {category}
                    </span>
                  </div>
                  {rows.map((row, i) => (
                    <FeatureRow
                      key={row.label}
                      label={row.label}
                      free={row.free}
                      pro={row.pro}
                      shaded={i % 2 !== 0}
                    />
                  ))}
                </div>
              ))}

              {/* Footer CTA row */}
              <div className="grid gap-2 px-4 py-5 bg-[#060b0c] grid-cols-[1fr_52px_52px] sm:grid-cols-[1fr_80px_80px] items-center border-t border-white/[0.06]">
                <span className="font-mono text-[11px] text-white/25 italic">Ready to upgrade?</span>
                <div className="flex justify-center">
                  <Link
                    href="/register"
                    className="font-mono text-[10px] text-white/40 hover:text-white/70 transition-colors duration-150 whitespace-nowrap"
                  >
                    Free →
                  </Link>
                </div>
                <div className="flex justify-center">
                  <PricingCheckoutButton />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQ ──────────────────────────────────────────────────────────── */}
      <section className={cx(ds.pageX, "py-20 sm:py-28")}>
        <div className={cx(ds.container)}>
          <div className="max-w-2xl mx-auto">

            <div className={cx(ds.sectionLabel, "mb-3")}>
              <div className={ds.sectionLabelLine} />
              <span className={ds.label}>Questions</span>
            </div>
            <h2
              className={cx(ds.heading, "mb-12")}
              style={{ fontSize: "clamp(30px, 4.5vw, 52px)" }}
            >
              Common questions.<br />
              <span className="text-white/20">Straight answers.</span>
            </h2>

            <PricingFAQ />
          </div>
        </div>
      </section>

      {/* ─── Bottom CTA ───────────────────────────────────────────────────── */}
      <section className={cx("relative overflow-hidden border-t border-white/[0.04]", ds.pageX, "py-20 sm:py-28")}>
        {/* Background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 opacity-[0.08]" style={ds.lineGrid} />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px]"
            style={{ background: `radial-gradient(ellipse, ${palette.primaryGlow} 0%, transparent 65%)`, opacity: 0.07 }}
          />
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-400/15 to-transparent" />
          <div className="absolute top-8 left-8 w-8 h-8 border-l border-t border-emerald-400/12" />
          <div className="absolute top-8 right-8 w-8 h-8 border-r border-t border-emerald-400/12" />
          <div className="absolute bottom-8 left-8 w-8 h-8 border-l border-b border-white/[0.04]" />
          <div className="absolute bottom-8 right-8 w-8 h-8 border-r border-b border-white/[0.04]" />
        </div>

        <div className={cx(ds.container, "relative flex flex-col items-center text-center")}>
          <div className="inline-flex items-center gap-2 mb-7 px-3.5 py-1.5"
            style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.15)" }}>
            <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-emerald-400/70">
              Start for free
            </span>
          </div>

          <h2
            className="font-display font-extrabold text-white leading-[1.06] tracking-tight mb-5"
            style={{
              fontSize: "clamp(36px, 6vw, 72px)",
              textShadow: `0 0 80px ${palette.primaryGlow}`,
            }}
          >
            Your edge is in the data.
          </h2>
          <p className="font-mono text-[13px] sm:text-[14px] text-white/30 max-w-sm mb-10 leading-relaxed">
            Log trades. See patterns. Upgrade when the data shows you why.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Link
              href="/register"
              className={cx(
                "group relative overflow-hidden",
                ds.btnPrimary,
                "px-9 py-3.5 text-[11px] tracking-[0.18em]",
              )}
              style={ds.clip12}
            >
              <span className={ds.btnShimmer} />
              <span className="relative z-10">Start Free →</span>
            </Link>
            <Link
              href="/login"
              className={cx(
                ds.btnSecondary,
                "px-9 py-3.5 text-[11px] tracking-[0.14em]",
              )}
              style={ds.clip12}
            >
              Sign in
            </Link>
          </div>

          <p className="font-mono text-[10px] text-white/18 mt-5">
            No credit card required · Free plan never expires
          </p>

          {/* Divider with stat chips */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-12 pt-8 border-t border-white/[0.04] w-full max-w-xs">
            {[
              { val: "Free",  sub: "forever"        },
              { val: "30s",   sub: "to log a trade" },
              { val: "$19",   sub: "/ mo for Pro"   },
            ].map(({ val, sub }) => (
              <div key={sub} className="text-center">
                <p className="font-display font-black text-white leading-none mb-1"
                  style={{ fontSize: "clamp(20px, 2.5vw, 26px)", textShadow: "0 0 20px rgba(16,185,129,0.2)" }}>
                  {val}
                </p>
                <p className="font-mono text-[9px] uppercase tracking-widest text-white/20">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
