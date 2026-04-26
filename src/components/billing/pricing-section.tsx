"use client";

import Link from "next/link";
import { cx, ds, palette, accentMap } from "@/style";
import { createCheckoutAction } from "@/lib/actions/billing-actions";
import { useState } from "react";
import { RevealOnScroll } from "../landing-page/reveal-on-scroll";

const FREE_FEATURES = [
  { text: "Unlimited trade logging",      included: true  },
  { text: "Win rate & expectancy",        included: true  },
  { text: "R-multiple auto-calculation",  included: true  },
  { text: "Trade history & notes",        included: true  },
  { text: "Full analytics dashboard",     included: false },
  { text: "Equity curve & drawdown",      included: false },
  { text: "Session & pair breakdown",     included: false },
  { text: "Weekday heatmap",             included: false },
];

const PRO_FEATURES = [
  { text: "Everything in Free"           },
  { text: "Full analytics dashboard"     },
  { text: "Equity curve & drawdown"      },
  { text: "Pair-by-pair breakdown"       },
  { text: "Session performance analysis" },
  { text: "Weekday heatmap"             },
  { text: "R distribution chart"        },
  { text: "Direction bias analysis"     },
];

function Check({ on, teal }: { on: boolean; teal?: boolean }) {
  if (!on) {
    return (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0 opacity-15">
        <path d="M4 4l6 6M10 4l-6 6" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    );
  }
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
      <path d="M2.5 7l3.5 3.5 5.5-6" stroke={teal ? "#2dd4bf" : "#10b981"} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ProCta() {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  async function handle() {
    setLoading(true);
    setError(null);
    const result = await createCheckoutAction();
    if (result.ok) {
      window.location.href = result.data.url;
    } else {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <button
        type="button"
        onClick={handle}
        disabled={loading}
        className={cx(
          "group relative overflow-hidden w-full",
          ds.btnPrimary,
          "px-6 py-3.5 text-[11px] tracking-[0.16em]",
          "disabled:opacity-50 disabled:cursor-not-allowed",
        )}
        style={ds.clip12}
      >
        <span className={ds.btnShimmer} />
        <span className="relative z-10">
          {loading ? "Redirecting…" : "Start Pro →"}
        </span>
      </button>
      {error && (
        <p className="font-mono text-[10px] text-red-400/80 text-center">{error}</p>
      )}
    </div>
  );
}

export function PricingSection() {
  return (
    <section id="pricing" className={cx("relative bg-[#030303] overflow-hidden", ds.sectionY)}>

      {/* Background */}
      <div className="pointer-events-none absolute inset-0 opacity-50" style={ds.lineGrid} />
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full opacity-[0.06]"
        style={{ background: `radial-gradient(ellipse, ${palette.primaryGlow} 0%, transparent 65%)` }}
      />

      <div className={cx(ds.container, ds.pageX, "relative")}>

        {/* Header */}
        <RevealOnScroll>
          <div className={ds.sectionLabel}>
            <div className={ds.sectionLabelLine} />
            <span className={ds.label}>Pricing</span>
          </div>
          <h2
            className={cx(ds.heading, "mb-5")}
            style={{ fontSize: "clamp(36px,6vw,80px)" }}
          >
            Simple pricing.<br />
            <span className="text-white/25">No surprises.</span>
          </h2>
          <p className={cx(ds.body, "max-w-md mb-16 sm:mb-20")}>
            Start free. Upgrade when you're ready to see the full picture of your trading performance.
          </p>
        </RevealOnScroll>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">

          {/* ── Free ── */}
          <RevealOnScroll delay={0}>
            <div
              className="relative flex flex-col bg-[#060606] border border-white/[0.07] p-8 h-full"
              style={ds.clip16}
            >
              <span className="absolute top-0 left-0 w-3 h-3 border-t border-l border-white/[0.08]" />
              <span className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-white/[0.08]" />

              <div className="mb-7">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30 mb-3">Free</p>
                <div className="flex items-baseline gap-1.5 mb-1.5">
                  <span
                    className="font-display font-black text-white leading-none"
                    style={{ fontSize: "clamp(40px,5vw,54px)" }}
                  >
                    $0
                  </span>
                  <span className="font-mono text-[12px] text-white/25">forever</span>
                </div>
                <p className="font-mono text-[11px] text-white/25">
                  Everything you need to start journaling.
                </p>
              </div>

              <ul className="flex-1 space-y-3.5 mb-8">
                {FREE_FEATURES.map(({ text, included }) => (
                  <li key={text} className="flex items-center gap-3">
                    <Check on={included} />
                    <span className={cx(
                      "font-mono text-[12px]",
                      included ? "text-white/55" : "text-white/18 line-through decoration-white/10",
                    )}>
                      {text}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href="/register"
                className={cx(
                  "block text-center",
                  ds.btnSecondary,
                  "px-6 py-3.5 text-[11px] tracking-[0.14em]",
                )}
                style={ds.clip12}
              >
                Get started free
              </Link>
            </div>
          </RevealOnScroll>

          {/* ── Pro ── */}
          <RevealOnScroll delay={80}>
            <div
              className="relative flex flex-col p-8 h-full overflow-hidden"
              style={{
                ...ds.clip16,
                background: "linear-gradient(145deg, #0c1a1a 0%, #070d10 100%)",
                border:     "1px solid rgba(45,212,191,0.2)",
                boxShadow:  "0 0 80px rgba(45,212,191,0.05), 0 0 0 1px rgba(45,212,191,0.06)",
              }}
            >
              {/* Corner decorations */}
              <span className="absolute top-0 left-0 w-5 h-5 border-t border-l border-teal-400/40" />
              <span className="absolute top-0 right-0 w-5 h-5 border-t border-r border-teal-400/40" />
              <span className="absolute bottom-0 left-0 w-5 h-5 border-b border-l border-teal-400/20" />
              <span className="absolute bottom-0 right-0 w-5 h-5 border-b border-r border-teal-400/20" />

              {/* Top glow */}
              <div
                className="pointer-events-none absolute top-0 inset-x-0 h-40 opacity-40"
                style={{ background: "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(45,212,191,0.14), transparent)" }}
              />

              {/* Popular badge */}
              <div className="absolute top-5 right-5">
                <span className="font-mono text-[9px] uppercase tracking-[0.18em] px-2.5 py-1 bg-teal-400/[0.08] border border-teal-400/20 text-teal-400">
                  Most popular
                </span>
              </div>

              <div className="relative mb-7">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-teal-400/70 mb-3">Pro</p>
                <div className="flex items-baseline gap-1.5 mb-1.5">
                  <span
                    className="font-display font-black text-white leading-none"
                    style={{
                      fontSize:   "clamp(40px,5vw,54px)",
                      textShadow: "0 0 40px rgba(45,212,191,0.2)",
                    }}
                  >
                    $9
                  </span>
                  <span className="font-mono text-[12px] text-white/25">/ month</span>
                </div>
                <p className="font-mono text-[11px] text-white/25">
                  Billed monthly · Cancel anytime
                </p>
              </div>

              <ul className="relative flex-1 space-y-3.5 mb-8">
                {PRO_FEATURES.map(({ text }) => (
                  <li key={text} className="flex items-center gap-3">
                    <Check on teal />
                    <span className="font-mono text-[12px] text-white/60">{text}</span>
                  </li>
                ))}
              </ul>

              <div className="relative">
                <ProCta />
                <p className="font-mono text-[10px] text-white/18 text-center mt-3">
                  Instant access · Secure checkout via Lemon Squeezy
                </p>
              </div>
            </div>
          </RevealOnScroll>
        </div>

        {/* Trust badges */}
        <RevealOnScroll delay={160}>
          <div className="mt-10 flex flex-wrap items-center gap-6 sm:gap-10">
            {[
              { icon: "◈", text: "No credit card for free plan" },
              { icon: "◈", text: "Cancel anytime, instantly"    },
              { icon: "◈", text: "Upgrade or downgrade anytime" },
            ].map(({ icon, text }) => (
              <span key={text} className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white/18">
                <span className="text-emerald-400/30 text-[8px]">{icon}</span>
                {text}
              </span>
            ))}
          </div>
        </RevealOnScroll>

      </div>
    </section>
  );
}