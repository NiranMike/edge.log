"use client";

import { useState } from "react";
import { cx } from "@/style";

const FAQS = [
  {
    q: "What's the difference between Free and Pro?",
    a: "Free covers everything you need to journal: unlimited trade entries, P&L, R-multiple, win rate, and trade history. Pro unlocks the full analytics suite built on top of your data: equity curve, session breakdown, pair analysis, weekday heatmap, R distribution, and direction bias.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes, instantly. Cancel from your account settings and you keep Pro access until the end of your billing period. No questions, no cancellation fees, no friction.",
  },
  {
    q: "What payment methods do you accept?",
    a: "All major credit and debit cards via Lemon Squeezy, our secure payment processor. Card details are never stored on our servers.",
  },
  {
    q: "Will I lose my trade data if I downgrade?",
    a: "Never. All your logged trades, notes, and history stay intact. You simply lose access to the Pro analytics views. Your data is always yours.",
  },
  {
    q: "Is there a free trial for Pro?",
    a: "The Free plan is the trial. Log your trades, build your history, then upgrade. The full analytics run instantly on every trade you've already logged.",
  },
  {
    q: "Can I upgrade mid-month?",
    a: "Yes. Upgrading takes effect immediately. You'll be billed a prorated amount for the remainder of the current month, then $12/month on your regular billing date.",
  },
];

export function PricingFAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div>
      {FAQS.map((faq, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className="border-b border-white/[0.05] last:border-b-0">
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full text-left flex items-start justify-between gap-6 py-6 px-0 group"
            >
              <span className={cx(
                "font-mono text-[13px] sm:text-[14px] leading-snug transition-colors duration-200",
                isOpen ? "text-white" : "text-white/40 group-hover:text-white/65",
              )}>
                {faq.q}
              </span>
              <span className={cx(
                "shrink-0 mt-0.5 w-5 h-5 flex items-center justify-center border rounded-full transition-all duration-300",
                isOpen
                  ? "border-emerald-400/40 text-emerald-400 rotate-45"
                  : "border-white/12 text-white/25 group-hover:border-white/25",
              )}>
                <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                  <path d="M4.5 1v7M1 4.5h7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
              </span>
            </button>
            <div className={cx(
              "overflow-hidden transition-all duration-300 ease-in-out",
              isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0",
            )}>
              <p className="font-mono text-[12px] sm:text-[13px] text-white/35 leading-relaxed pb-6 pl-4 border-l-2 border-emerald-400/20">
                {faq.a}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
