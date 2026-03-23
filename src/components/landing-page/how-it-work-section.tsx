"use client";

import { useState } from "react";
import { RevealOnScroll } from "./reveal-on-scroll";
import { cx, ds } from "@/style";
import { STEPS, TRADE_ROWS } from "@/const/landing-page-const";


export function HowItWorksSection() {
  const [active, setActive] = useState(0);

  return (
    <section id="howItWorks" className={cx("relative bg-black overflow-hidden", ds.sectionY)}>
      <div className="pointer-events-none absolute top-0 right-0 w-[500px] h-[500px] opacity-[0.035]"
        style={{ background: "radial-gradient(circle, #10b981 0%, transparent 65%)" }} />

      <div className={cx(ds.container, ds.pageX, "relative")}>
        <RevealOnScroll>
          <div className={ds.sectionLabel}>
            <div className={ds.sectionLabelLine} />
            <span className={ds.label}>Process</span>
          </div>
          <h2
            className={cx(ds.heading, "mb-16 sm:mb-20")}
            style={{ fontSize: "clamp(36px,6vw,80px)" }}
          >
            From trade to insight<br />
            <span className="text-white/25">in under a minute.</span>
          </h2>
        </RevealOnScroll>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          <div className="space-y-0">
            {STEPS.map((step, i) => (
              <RevealOnScroll key={step.num} delay={i * 75}>
                <button
                  onClick={() => setActive(i)}
                  className={cx(
                    "w-full text-left border-b py-7 px-2 group transition-all duration-300",
                    active === i ? "border-emerald-400/25" : "border-white/[0.05] hover:border-white/[0.08]"
                  )}
                >
                  <div className="flex items-start gap-5">
                    <span className={cx(
                      "font-mono text-[11px] font-bold pt-1 shrink-0 transition-colors duration-300 tabular-nums",
                      active === i ? "text-emerald-400" : "text-white/15"
                    )}>
                      {step.num}
                    </span>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <h3 className={cx(
                          "font-display font-black text-[18px] sm:text-[20px] tracking-[-0.02em] transition-colors duration-300",
                          active === i ? "text-white" : "text-white/40 group-hover:text-white/65"
                        )}>
                          {step.title}
                        </h3>
                        <span className={cx(
                          "font-mono text-[9px] uppercase tracking-[0.15em] border px-2 py-1 shrink-0 transition-colors duration-300",
                          active === i
                            ? "border-emerald-400/30 text-emerald-400/70 bg-emerald-400/[0.06]"
                            : "border-white/[0.07] text-white/20"
                        )}>
                          {step.time}
                        </span>
                      </div>

                      <p className={cx(
                        "font-mono text-[12px] sm:text-[13px] leading-relaxed transition-colors duration-300",
                        active === i ? "text-white/45" : "text-white/18"
                      )}>
                        {step.desc}
                      </p>

                      <div className={cx(
                        "overflow-hidden transition-all duration-400",
                        active === i ? "max-h-28 mt-3 opacity-100" : "max-h-0 opacity-0"
                      )}>
                        <p className="font-mono text-[11px] text-emerald-400/55 leading-relaxed border-l-2 border-emerald-400/20 pl-3">
                          {step.detail}
                        </p>
                      </div>
                    </div>
                  </div>
                </button>
              </RevealOnScroll>
            ))}
          </div>

          <RevealOnScroll delay={180}>
            <div className="lg:sticky lg:top-28">
              <div
                className="relative border border-white/[0.08] bg-[#080808] overflow-hidden"
                style={ds.clip20}
              >
                <div className="absolute inset-0 pointer-events-none opacity-25" style={ds.scanlines} />

                <div className="relative flex items-center justify-between px-5 py-3 border-b border-white/[0.05] bg-black/40">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                    <span className="font-mono text-[9px] text-white/20 ml-3 tracking-widest uppercase">
                      Trade History // Week 04
                    </span>
                  </div>
                  <span className="font-mono text-[9px] text-emerald-400/50">● LIVE</span>
                </div>

                <div className="hidden sm:grid grid-cols-6 gap-2 px-5 py-2 border-b border-white/[0.05]">
                  {["ASSET", "DIR", "SESSION", "STRATEGY", "P&L", "RESULT"].map(h => (
                    <span key={h} className="font-mono text-[8px] uppercase tracking-[0.12em] text-white/20">{h}</span>
                  ))}
                </div>

                {/* Trade rows */}
                <div className="relative p-3 space-y-1">
                  {TRADE_ROWS.map((t, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-3 sm:grid-cols-6 gap-2 px-2 py-2.5 sm:py-3 items-center hover:bg-white/[0.025] transition-colors rounded-sm"
                    >
                      <span className="font-mono text-[11px] sm:text-[12px] font-bold text-white/80">{t.asset}</span>
                      <span className={cx("font-mono text-[10px] font-bold", t.dir === "Buy" ? "text-emerald-400" : "text-rose-400")}>
                        {t.dir === "Buy" ? "▲" : "▼"} {t.dir}
                      </span>
                      <span className="font-mono text-[9px] text-teal-400/70 hidden sm:block">{t.sess}</span>
                      <span className="font-mono text-[9px] text-violet-400/70 hidden sm:block">{t.strat}</span>
                      <span
                        className={cx("font-mono text-[11px] sm:text-[12px] font-black", t.win ? "text-emerald-400" : "text-rose-400")}
                        style={{ textShadow: t.win ? "0 0 14px rgba(16,185,129,0.5)" : "0 0 14px rgba(239,68,68,0.5)" }}
                      >
                        {t.pnl}
                      </span>
                      <span className={cx(
                        "font-mono text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 border text-center",
                        t.win
                          ? "border-emerald-400/20 text-emerald-400 bg-emerald-400/[0.06]"
                          : "border-rose-400/20   text-rose-400   bg-rose-400/[0.06]"
                      )}>
                        {t.win ? "WIN" : "LOSS"}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="relative mx-3 mb-3 px-4 py-3 bg-emerald-400/[0.05] border border-emerald-400/10 flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono text-[10px] text-white/30">4 trades · 75% WR · PF 3.12</span>
                  <span
                    className="font-mono text-[13px] sm:text-[14px] font-black text-emerald-400"
                    style={{ textShadow: "0 0 18px rgba(16,185,129,0.55)" }}
                  >
                    +$2,600 net
                  </span>
                </div>

                <div className="relative mx-3 mb-3 px-4 py-3 bg-black border border-white/[0.05] font-mono text-[10px] text-white/30 leading-relaxed">
                  <span className="text-emerald-400/80 font-bold">🧠 </span>
                  London session: 100% WR this week. FOMO trades: 0% WR. Eliminate FOMO — keep London.
                </div>

                <div className="relative mx-3 mb-4 flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[8px] text-white/15 uppercase tracking-wider">Confidence</span>
                  {[4, 1, 5, 4].map((c, i) => (
                    <div key={i} className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map(n => (
                        <span key={n} className={cx("text-[10px]", n <= c ? "text-teal-400" : "text-white/10")}>★</span>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-3 border border-white/[0.05] bg-[#050505] p-4">
                <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-white/20 mb-2">
                  Weekly Reflection Prompt #3
                </p>
                <p className="font-mono text-[12px] text-white/45 italic">
                  &ldquo;Were there any trades taken out of boredom or FOMO this week?&rdquo;
                </p>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}