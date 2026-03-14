import { AccentKey, accentMap, cx, ds } from "@/style";
import { RevealOnScroll } from "./reveal-on-scroll";

// ─── Data ────────────────────────────────────────────────────────────────────
const FEATURES: {
  icon: string;
  num: string;
  title: string;
  desc: string;
  tag: string;
  accent: AccentKey;
}[] = [
  { icon: "⚡", num: "01", title: "30-Second Logging",  desc: "Quick mode: asset, direction, entry, stop, exit, size. P&L, R-multiple, win/loss — all instant.",                   tag: "< 30s to log",   accent: "emerald" },
  { icon: "🧠", num: "02", title: "Behavioral Engine",  desc: "Discover your best session, worst emotion, and which setups print vs which ones bleed you dry.",                     tag: "AI Patterns",    accent: "violet"     },
  { icon: "📈", num: "03", title: "Equity Curve",       desc: "Every trade plotted. Watch your account compound — or see exactly where discipline broke down.",                      tag: "Real-time",      accent: "teal"   },
  { icon: "⚖️", num: "04", title: "R Calculations",     desc: "Risk-to-reward, R-multiple, profit factor, expectancy — auto-calculated on every entry.",                            tag: "Automatic",      accent: "emerald" },
  { icon: "🎯", num: "05", title: "Strategy Tracker",   desc: "Tag every trade. Your Breakout vs Reversal edge surfaces after 10 trades, not 10 months.",                           tag: "Per-setup stats", accent: "violet"    },
  { icon: "🪞", num: "06", title: "Weekly Review",      desc: "Auto-generated summaries. Guided prompts. Revenge trading warnings before they destroy a week.",                     tag: "Behavioral",     accent: "teal"   },
];

// ─── Component ───────────────────────────────────────────────────────────────
export function FeaturesSection() {
  return (
    <section id="features" className={cx("relative bg-black overflow-hidden", ds.sectionY)}>
      {/* Watermark */}
      <div className="pointer-events-none select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display font-black text-white/[0.015] whitespace-nowrap tracking-tighter"
        style={{ fontSize: "clamp(80px,18vw,220px)" }}>
        FEATURES
      </div>

      <div className={cx(ds.container, ds.pageX, "relative")}>
        {/* ── Header ── */}
        <RevealOnScroll>
          <div className={cx(ds.sectionLabel)}>
            <div className={ds.sectionLabelLine} />
            <span className={ds.label}>Core Features</span>
          </div>
          <h2
            className={cx(ds.heading, "mb-16 sm:mb-20")}
            style={{ fontSize: "clamp(36px,6vw,80px)" }}
          >
            Everything serious<br />
            <span className="text-white/25">traders need.</span>
          </h2>
        </RevealOnScroll>

        {/* ── Grid — 1 col mobile → 2 col sm → 3 col lg ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.05]">
          {FEATURES.map((f, i) => {
            const a = accentMap[f.accent];
            return (
              <RevealOnScroll key={f.num} delay={i * 55}>
                <div
                  className={cx(
                    "group relative bg-black p-7 sm:p-9 lg:p-10 overflow-hidden cursor-default",
                    "hover:bg-white/[0.025] transition-colors duration-300"
                  )}
                >
                  {/* Corner bracket — top-right */}
                  <div className={cx("absolute top-4 right-4 w-5 h-5 border-t border-r opacity-0 group-hover:opacity-100 transition-opacity duration-300", a.border)} />
                  {/* Corner bracket — bottom-left */}
                  <div className={cx("absolute bottom-4 left-4 w-5 h-5 border-b border-l opacity-0 group-hover:opacity-100 transition-opacity duration-300", a.border)} />

                  {/* Header row */}
                  <div className="flex items-start justify-between mb-6">
                    <span className="text-2xl sm:text-3xl">{f.icon}</span>
                    <span className={cx("font-mono text-[11px] font-bold", "text-white/15")}>{f.num}</span>
                  </div>

                  {/* Title */}
                  <h3
                    className={cx(
                      "font-display font-black text-[19px] sm:text-[22px] leading-tight tracking-[-0.03em] text-white mb-3",
                      `group-hover:${a.text}`,
                      "transition-colors duration-300"
                    )}
                  >
                    {f.title}
                  </h3>

                  {/* Description */}
                  <p className={cx(ds.body, "mb-5 text-[12px] sm:text-[13px]")}>{f.desc}</p>

                  {/* Tag */}
                  <div className={cx("inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.15em] opacity-50 group-hover:opacity-100 transition-opacity duration-300", a.text)}>
                    <span className="w-3 h-px bg-current" />
                    {f.tag}
                  </div>
                </div>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}