"use client";

import { useEffect, useState } from "react";
import { cx } from "@/style";

const STORAGE_KEY = "r_explainer_dismissed_v1";

interface Example {
  r:     number;
  label: string;
  color: string;
}

const EXAMPLES: Example[] = [
  { r: 2.5,  label: "Made 2.5× your risk",      color: "text-[var(--win)]" },
  { r: 1,    label: "Made exactly what you risked", color: "text-[var(--win)] opacity-70" },
  { r: -1,   label: "Lost your full risk amount", color: "text-[var(--loss)]" },
];

export function RExplainerBanner() {
  const [visible,  setVisible]  = useState(false);
  const [leaving,  setLeaving]  = useState(false);

  useEffect(() => {
    try {
      const dismissed = localStorage.getItem(STORAGE_KEY);
      if (!dismissed) setVisible(true);
    } catch {
      // localStorage unavailable — just don't show
    }
  }, []);

  function dismiss() {
    setLeaving(true);
    setTimeout(() => {
      try { localStorage.setItem(STORAGE_KEY, "1"); } catch { /* noop */ }
      setVisible(false);
      setLeaving(false);
    }, 300);
  }

  if (!visible) return null;

  return (
    <div
      className={cx(
        "relative rounded-xl border border-[var(--ac-2-ring)] bg-[var(--ac-2-dim)] overflow-hidden",
        "transition-all duration-300",
        leaving ? "opacity-0 translate-y-1" : "opacity-100 translate-y-0",
      )}
    >
      {/* top shimmer */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-teal-400/20 to-transparent" />

      <div className="flex items-start gap-4 px-5 py-4">

        {/* icon */}
        <div className="shrink-0 mt-0.5 w-8 h-8 rounded-lg bg-[var(--ac-2-dim)] border border-[var(--ac-2-ring)] flex items-center justify-center">
          <span className="font-mono text-[13px] font-bold text-[var(--ac-2)]">R</span>
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--ac-2)] opacity-60 mb-1.5">
            Understanding R-multiples
          </p>
          <p className="font-mono text-[12px] text-[var(--tx-3)] leading-relaxed mb-3">
            Every result is shown as a multiple of your initial risk — so you can
            compare trades regardless of account size or position size.
          </p>

          {/* examples row */}
          <div className="flex flex-wrap gap-3">
            {EXAMPLES.map(ex => (
              <div
                key={ex.r}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--bg-overlay)] border border-[var(--bd)]"
              >
                <span className={cx("font-mono text-[13px] font-medium", ex.color)}>
                  {ex.r > 0 ? "+" : ""}{ex.r}R
                </span>
                <span className="font-mono text-[9px] text-[var(--tx-4)] uppercase tracking-[0.1em]">
                  =
                </span>
                <span className="font-mono text-[10px] text-[var(--tx-3)]">
                  {ex.label}
                </span>
                <span className="font-mono text-[9px] text-[var(--tx-4)] ml-1">
                  ({ex.r > 0 ? `1:${Math.abs(ex.r).toFixed(2)}` : `${Math.abs(ex.r).toFixed(2)}:1`} RR)
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* dismiss */}
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss"
          className="shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-[var(--tx-4)] hover:text-[var(--tx-2)] hover:bg-[var(--bg-overlay)] transition-colors duration-150"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M1.5 1.5l7 7M8.5 1.5l-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}